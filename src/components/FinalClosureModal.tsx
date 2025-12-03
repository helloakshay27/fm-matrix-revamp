import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Dialog,
    DialogContent,
    IconButton,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const fieldStyles = {
    '& .MuiInputBase-input, & .MuiSelect-select': {
        padding: '12px',
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: 'white',
        '& fieldset': {
            borderColor: '#e5e7eb',
        },
        '&:hover fieldset': {
            borderColor: '#9ca3af',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#C72030',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#6b7280',
        '&.Mui-focused': {
            color: '#C72030',
        },
    },
};

const menuProps = {
    PaperProps: {
        style: {
            maxHeight: 300,
            zIndex: 9999,
            backgroundColor: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
    },
    MenuListProps: {
        style: {
            padding: 0,
        },
    },
    anchorOrigin: {
        vertical: 'bottom' as const,
        horizontal: 'left' as const,
    },
    transformOrigin: {
        vertical: 'top' as const,
        horizontal: 'left' as const,
    },
};

interface FinalClosureModalProps {
    isOpen: boolean;
    onClose: () => void;
    incidentId: string;
    initialData?: {
        rca?: string;
        corrective_action?: string;
        preventive_action?: string;
    };
}

interface CorrectiveField {
    id?: number;
    tag_type_id: string;
    description: string;
    responsible_person_id: string;
    date: string;
}

interface PreventiveField {
    id?: number;
    tag_type_id: string;
    description: string;
    responsible_person_id: string;
    date: string;
}

interface User {
    id: number;
    name: string;
}

interface TagType {
    id: number;
    name: string;
}

const steps = ['RCA Details', 'Corrective Actions', 'Preventive Actions', 'Final Closure'];

export const FinalClosureModal: React.FC<FinalClosureModalProps> = ({
    isOpen,
    onClose,
    incidentId,
    initialData
}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [tagTypes, setTagTypes] = useState<TagType[]>([]);

    // Step 1: RCA Details
    const [rca, setRca] = useState('');
    const [correctiveAction, setCorrectiveAction] = useState('');
    const [preventiveAction, setPreventiveAction] = useState('');
    const [comment, setComment] = useState('');
    const [assignedTo, setAssignedTo] = useState('');

    // Step 2: Corrective Actions
    const [correctiveFields, setCorrectiveFields] = useState<CorrectiveField[]>([
        { tag_type_id: '', description: '', responsible_person_id: '', date: '' }
    ]);

    // Step 3: Preventive Actions
    const [preventiveFields, setPreventiveFields] = useState<PreventiveField[]>([
        { tag_type_id: '', description: '', responsible_person_id: '', date: '' }
    ]);

    const getApiConfig = () => {
        let baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';
        if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
            baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
        }
        return { baseUrl, token };
    };

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
            fetchTagTypes();
            if (initialData) {
                setRca(initialData.rca || '');
                setCorrectiveAction(initialData.corrective_action || '');
                setPreventiveAction(initialData.preventive_action || '');
            }
        }
    }, [isOpen, initialData]);

    const fetchUsers = async () => {
        try {
            const { baseUrl, token } = getApiConfig();
            const response = await fetch(`${baseUrl}/building_users.json`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                setUsers(result.data || []);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchTagTypes = async () => {
        try {
            const { baseUrl, token } = getApiConfig();
            const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                setTagTypes(result.data || []);
            }
        } catch (error) {
            console.error('Error fetching tag types:', error);
        }
    };

    const handleNext = () => {
        // Validation for Step 1
        if (activeStep === 0) {
            if (!rca.trim()) {
                toast.error('RCA is required');
                return;
            }
            if (!correctiveAction.trim()) {
                toast.error('Corrective Action is required');
                return;
            }
            if (!preventiveAction.trim()) {
                toast.error('Preventive Action is required');
                return;
            }
        }

        // Validation for Step 2
        if (activeStep === 1) {
            const hasEmptyFields = correctiveFields.some(
                field => !field.tag_type_id || !field.description || !field.responsible_person_id || !field.date
            );
            if (hasEmptyFields) {
                toast.error('Please fill all corrective action fields');
                return;
            }
        }

        // Validation for Step 3
        if (activeStep === 2) {
            const hasEmptyFields = preventiveFields.some(
                field => !field.tag_type_id || !field.description || !field.responsible_person_id || !field.date
            );
            if (hasEmptyFields) {
                toast.error('Please fill all preventive action fields');
                return;
            }
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const addCorrectiveField = () => {
        setCorrectiveFields([
            ...correctiveFields,
            { tag_type_id: '', description: '', responsible_person_id: '', date: '' }
        ]);
    };

    const removeCorrectiveField = (index: number) => {
        const newFields = correctiveFields.filter((_, i) => i !== index);
        setCorrectiveFields(newFields.length > 0 ? newFields : [{ tag_type_id: '', description: '', responsible_person_id: '', date: '' }]);
    };

    const updateCorrectiveField = (index: number, field: keyof CorrectiveField, value: string) => {
        const newFields = [...correctiveFields];
        newFields[index] = { ...newFields[index], [field]: value };
        setCorrectiveFields(newFields);
    };

    const addPreventiveField = () => {
        setPreventiveFields([
            ...preventiveFields,
            { tag_type_id: '', description: '', responsible_person_id: '', date: '' }
        ]);
    };

    const removePreventiveField = (index: number) => {
        const newFields = preventiveFields.filter((_, i) => i !== index);
        setPreventiveFields(newFields.length > 0 ? newFields : [{ tag_type_id: '', description: '', responsible_person_id: '', date: '' }]);
    };

    const updatePreventiveField = (index: number, field: keyof PreventiveField, value: string) => {
        const newFields = [...preventiveFields];
        newFields[index] = { ...newFields[index], [field]: value };
        setPreventiveFields(newFields);
    };

    const handleSubmit = async () => {
        if (!comment.trim()) {
            toast.error('Comment is required');
            return;
        }

        try {
            setLoading(true);
            const { baseUrl, token } = getApiConfig();

            const payload = {
                about: "Pms::Incident",
                about_id: parseInt(incidentId),
                current_status: "closed",
                comment: comment,
                incident: {
                    rca: rca,
                    corrective_action: correctiveAction,
                    preventive_action: preventiveAction
                },
                assigned_to: assignedTo ? parseInt(assignedTo) : undefined,
                corrective_fields: correctiveFields.map(field => ({
                    ...(field.id && { id: field.id }),
                    tag_type_id: parseInt(field.tag_type_id),
                    description: field.description,
                    responsible_person_id: parseInt(field.responsible_person_id),
                    date: field.date
                })),
                preventive_fields: preventiveFields.map(field => ({
                    ...(field.id && { id: field.id }),
                    tag_type_id: parseInt(field.tag_type_id),
                    description: field.description,
                    responsible_person_id: parseInt(field.responsible_person_id),
                    date: field.date
                }))
            };

            const response = await fetch(`${baseUrl}/pms/incidents/inc_clousure_details.json?access_token=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success('Incident closed successfully');
                onClose();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to close incident');
            }
        } catch (error) {
            console.error('Error closing incident:', error);
            toast.error('Error occurred while closing incident');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <div className="space-y-4">
                        <TextField
                            label="RCA *"
                            value={rca}
                            onChange={(e) => setRca(e.target.value)}
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={4}
                            placeholder="Enter root cause analysis"
                            InputLabelProps={{ shrink: true }}
                            sx={fieldStyles}
                        />
                        <TextField
                            label="Corrective Action *"
                            value={correctiveAction}
                            onChange={(e) => setCorrectiveAction(e.target.value)}
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={4}
                            placeholder="Enter corrective action"
                            InputLabelProps={{ shrink: true }}
                            sx={fieldStyles}
                        />
                        <TextField
                            label="Preventive Action *"
                            value={preventiveAction}
                            onChange={(e) => setPreventiveAction(e.target.value)}
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={4}
                            placeholder="Enter preventive action"
                            InputLabelProps={{ shrink: true }}
                            sx={fieldStyles}
                        />
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Corrective Actions</h3>
                            <Button
                                onClick={addCorrectiveField}
                                style={{ backgroundColor: '#C72030' }}
                                className="text-white"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add More
                            </Button>
                        </div>
                        {correctiveFields.map((field, index) => (
                            <div key={index} className="p-4 border rounded-lg space-y-3 relative">
                                {correctiveFields.length > 1 && (
                                    <IconButton
                                        onClick={() => removeCorrectiveField(index)}
                                        className="absolute top-2 right-2"
                                        size="small"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </IconButton>
                                )}
                                <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                                    <InputLabel shrink>Tag Type *</InputLabel>
                                    <Select
                                        label="Tag Type"
                                        value={field.tag_type_id}
                                        onChange={(e) => updateCorrectiveField(index, 'tag_type_id', e.target.value)}
                                        displayEmpty
                                        MenuProps={menuProps}
                                    >
                                        <MenuItem value="">
                                            <em>Select Tag Type</em>
                                        </MenuItem>
                                        {tagTypes.map((tag) => (
                                            <MenuItem key={tag.id} value={tag.id.toString()}>
                                                {tag.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Description *"
                                    value={field.description}
                                    onChange={(e) => updateCorrectiveField(index, 'description', e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                    placeholder="Enter description"
                                    InputLabelProps={{ shrink: true }}
                                    sx={fieldStyles}
                                />
                                <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                                    <InputLabel shrink>Responsible Person *</InputLabel>
                                    <Select
                                        label="Responsible Person"
                                        value={field.responsible_person_id}
                                        onChange={(e) => updateCorrectiveField(index, 'responsible_person_id', e.target.value)}
                                        displayEmpty
                                        MenuProps={menuProps}
                                    >
                                        <MenuItem value="">
                                            <em>Select Person</em>
                                        </MenuItem>
                                        {users.map((user) => (
                                            <MenuItem key={user.id} value={user.id.toString()}>
                                                {user.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Date *"
                                    type="date"
                                    value={field.date}
                                    onChange={(e) => updateCorrectiveField(index, 'date', e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    sx={fieldStyles}
                                />
                            </div>
                        ))}
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Preventive Actions</h3>
                            <Button
                                onClick={addPreventiveField}
                                style={{ backgroundColor: '#C72030' }}
                                className="text-white"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add More
                            </Button>
                        </div>
                        {preventiveFields.map((field, index) => (
                            <div key={index} className="p-4 border rounded-lg space-y-3 relative">
                                {preventiveFields.length > 1 && (
                                    <IconButton
                                        onClick={() => removePreventiveField(index)}
                                        className="absolute top-2 right-2"
                                        size="small"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </IconButton>
                                )}
                                <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                                    <InputLabel shrink>Tag Type *</InputLabel>
                                    <Select
                                        label="Tag Type"
                                        value={field.tag_type_id}
                                        onChange={(e) => updatePreventiveField(index, 'tag_type_id', e.target.value)}
                                        displayEmpty
                                        MenuProps={menuProps}
                                    >
                                        <MenuItem value="">
                                            <em>Select Tag Type</em>
                                        </MenuItem>
                                        {tagTypes.map((tag) => (
                                            <MenuItem key={tag.id} value={tag.id.toString()}>
                                                {tag.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Description *"
                                    value={field.description}
                                    onChange={(e) => updatePreventiveField(index, 'description', e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                    placeholder="Enter description"
                                    InputLabelProps={{ shrink: true }}
                                    sx={fieldStyles}
                                />
                                <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                                    <InputLabel shrink>Responsible Person *</InputLabel>
                                    <Select
                                        label="Responsible Person"
                                        value={field.responsible_person_id}
                                        onChange={(e) => updatePreventiveField(index, 'responsible_person_id', e.target.value)}
                                        displayEmpty
                                        MenuProps={menuProps}
                                    >
                                        <MenuItem value="">
                                            <em>Select Person</em>
                                        </MenuItem>
                                        {users.map((user) => (
                                            <MenuItem key={user.id} value={user.id.toString()}>
                                                {user.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Date *"
                                    type="date"
                                    value={field.date}
                                    onChange={(e) => updatePreventiveField(index, 'date', e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    sx={fieldStyles}
                                />
                            </div>
                        ))}
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold mb-4">Review and Submit</h3>

                        {/* RCA Details Section */}
                        <div className="p-4 border rounded-lg bg-gray-50">
                            <h4 className="font-semibold mb-3 text-[#C72030]">RCA Details</h4>
                            <div className="space-y-3">
                                <TextField
                                    label="RCA"
                                    value={rca}
                                    onChange={(e) => setRca(e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    InputLabelProps={{ shrink: true }}
                                    sx={fieldStyles}
                                />
                                <TextField
                                    label="Corrective Action"
                                    value={correctiveAction}
                                    onChange={(e) => setCorrectiveAction(e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    InputLabelProps={{ shrink: true }}
                                    sx={fieldStyles}
                                />
                                <TextField
                                    label="Preventive Action"
                                    value={preventiveAction}
                                    onChange={(e) => setPreventiveAction(e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    InputLabelProps={{ shrink: true }}
                                    sx={fieldStyles}
                                />
                            </div>
                        </div>

                        {/* Corrective Actions Section */}
                        <div className="p-4 border rounded-lg bg-gray-50">
                            <h4 className="font-semibold mb-3 text-[#C72030]">Corrective Actions ({correctiveFields.length})</h4>
                            <div className="space-y-3">
                                {correctiveFields.map((field, index) => (
                                    <div key={index} className="p-3 bg-white border rounded space-y-2">
                                        <p className="text-sm font-medium">Action {index + 1}</p>
                                        <FormControl fullWidth variant="outlined" sx={fieldStyles} size="small">
                                            <InputLabel shrink>Tag Type</InputLabel>
                                            <Select
                                                label="Tag Type"
                                                value={field.tag_type_id}
                                                onChange={(e) => updateCorrectiveField(index, 'tag_type_id', e.target.value)}
                                                MenuProps={menuProps}
                                            >
                                                {tagTypes.map((tag) => (
                                                    <MenuItem key={tag.id} value={tag.id.toString()}>
                                                        {tag.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            label="Description"
                                            value={field.description}
                                            onChange={(e) => updateCorrectiveField(index, 'description', e.target.value)}
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            multiline
                                            rows={2}
                                            InputLabelProps={{ shrink: true }}
                                            sx={fieldStyles}
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <FormControl fullWidth variant="outlined" sx={fieldStyles} size="small">
                                                <InputLabel shrink>Responsible Person</InputLabel>
                                                <Select
                                                    label="Responsible Person"
                                                    value={field.responsible_person_id}
                                                    onChange={(e) => updateCorrectiveField(index, 'responsible_person_id', e.target.value)}
                                                    MenuProps={menuProps}
                                                >
                                                    {users.map((user) => (
                                                        <MenuItem key={user.id} value={user.id.toString()}>
                                                            {user.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <TextField
                                                label="Date"
                                                type="date"
                                                value={field.date}
                                                onChange={(e) => updateCorrectiveField(index, 'date', e.target.value)}
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                InputLabelProps={{ shrink: true }}
                                                sx={fieldStyles}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Preventive Actions Section */}
                        <div className="p-4 border rounded-lg bg-gray-50">
                            <h4 className="font-semibold mb-3 text-[#C72030]">Preventive Actions ({preventiveFields.length})</h4>
                            <div className="space-y-3">
                                {preventiveFields.map((field, index) => (
                                    <div key={index} className="p-3 bg-white border rounded space-y-2">
                                        <p className="text-sm font-medium">Action {index + 1}</p>
                                        <FormControl fullWidth variant="outlined" sx={fieldStyles} size="small">
                                            <InputLabel shrink>Tag Type</InputLabel>
                                            <Select
                                                label="Tag Type"
                                                value={field.tag_type_id}
                                                onChange={(e) => updatePreventiveField(index, 'tag_type_id', e.target.value)}
                                                MenuProps={menuProps}
                                            >
                                                {tagTypes.map((tag) => (
                                                    <MenuItem key={tag.id} value={tag.id.toString()}>
                                                        {tag.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            label="Description"
                                            value={field.description}
                                            onChange={(e) => updatePreventiveField(index, 'description', e.target.value)}
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            multiline
                                            rows={2}
                                            InputLabelProps={{ shrink: true }}
                                            sx={fieldStyles}
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <FormControl fullWidth variant="outlined" sx={fieldStyles} size="small">
                                                <InputLabel shrink>Responsible Person</InputLabel>
                                                <Select
                                                    label="Responsible Person"
                                                    value={field.responsible_person_id}
                                                    onChange={(e) => updatePreventiveField(index, 'responsible_person_id', e.target.value)}
                                                    MenuProps={menuProps}
                                                >
                                                    {users.map((user) => (
                                                        <MenuItem key={user.id} value={user.id.toString()}>
                                                            {user.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <TextField
                                                label="Date"
                                                type="date"
                                                value={field.date}
                                                onChange={(e) => updatePreventiveField(index, 'date', e.target.value)}
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                InputLabelProps={{ shrink: true }}
                                                sx={fieldStyles}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Final fields */}
                        <TextField
                            label="Comment *"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={3}
                            placeholder="Enter comment"
                            InputLabelProps={{ shrink: true }}
                            sx={fieldStyles}
                        />

                        <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                            <InputLabel shrink>Assigned To</InputLabel>
                            <Select
                                label="Assigned To"
                                value={assignedTo}
                                onChange={(e) => setAssignedTo(e.target.value)}
                                displayEmpty
                                MenuProps={menuProps}
                            >
                                <MenuItem value="">
                                    <em>Select Person</em>
                                </MenuItem>
                                {users.map((user) => (
                                    <MenuItem key={user.id} value={user.id.toString()}>
                                        {user.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
            <DialogContent>
                <div className="flex flex-row items-center justify-between mb-4">
                    <h1 className="text-xl font-bold">Final Closure</h1>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-auto p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <Stepper activeStep={activeStep} alternativeLabel className="mb-6">
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <div className="min-h-[400px] max-h-[60vh] overflow-y-auto">
                    {renderStepContent()}
                </div>

                <div className="flex justify-between pt-6 mt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                    >
                        Back
                    </Button>
                    {activeStep === steps.length - 1 ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{ backgroundColor: '#C72030' }}
                            className="text-white hover:opacity-90"
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            style={{ backgroundColor: '#C72030' }}
                            className="text-white hover:opacity-90"
                        >
                            Next
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
