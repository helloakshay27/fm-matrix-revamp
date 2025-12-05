import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, TextField } from '@mui/material';

interface InvestigatorBlockProps {
    index: number;
    isLast: boolean;
    canRemove: boolean;
    onAddBlock: () => void;
    onSubmit: (data: InvestigatorData) => void;
    onRemove?: () => void;
    internalUsers: any[];
}

export interface InvestigatorData {
    type: 'internal' | 'external';
    internal?: {
        userId: string;
        name: string;
        email: string;
        role: string;
        contactNo: string;
        employeeType?: string;
    };
    external?: {
        name: string;
        email: string;
        role: string;
        contactNo: string;
        company?: string;
    };
}

interface ValidationErrors {
    name?: string;
    email?: string;
    contactNo?: string;
}

export const InvestigatorBlock: React.FC<InvestigatorBlockProps> = ({
    index,
    isLast,
    canRemove,
    onAddBlock,
    onSubmit,
    onRemove,
    internalUsers
}) => {
    const [activeTab, setActiveTab] = useState<'internal' | 'external'>('internal');
    const [selectedInternalUser, setSelectedInternalUser] = useState('');
    const [externalForm, setExternalForm] = useState({
        name: '',
        email: '',
        role: '',
        contactNo: '',
        company: ''
    });
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const validateExternalForm = (): boolean => {
        const errors: ValidationErrors = {};

        // Validate name - only alphabets
        if (!externalForm.name.trim()) {
            errors.name = 'Name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(externalForm.name)) {
            errors.name = 'Name should contain only alphabets';
        }

        // Validate email
        if (!externalForm.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(externalForm.email)) {
            errors.email = 'Please enter a valid email address';
        }

        // Validate contact number - only 10 digits
        if (!externalForm.contactNo.trim()) {
            errors.contactNo = 'Contact number is required';
        } else if (!/^\d{10}$/.test(externalForm.contactNo)) {
            errors.contactNo = 'Contact number must be exactly 10 digits';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = () => {
        if (activeTab === 'internal') {
            if (!selectedInternalUser) {
                alert('Please select an internal user');
                return;
            }

            const selectedUser = internalUsers.find(u => u.id?.toString() === selectedInternalUser);
            if (selectedUser) {
                const data: InvestigatorData = {
                    type: 'internal',
                    internal: {
                        userId: selectedUser.id?.toString() || '',
                        name: selectedUser.full_name || '',
                        email: selectedUser.email || '',
                        role: selectedUser.role || 'Investigator',
                        contactNo: selectedUser.mobile || '',
                        employeeType: selectedUser.employee_type || ''
                    }
                };
                onSubmit(data);
                setSelectedInternalUser('');
            }
        } else {
            if (validateExternalForm()) {
                const data: InvestigatorData = {
                    type: 'external',
                    external: {
                        ...externalForm
                    }
                };
                onSubmit(data);
                setExternalForm({ name: '', email: '', role: '', contactNo: '', company: '' });
                setValidationErrors({});
            }
        }
    };

    return (
        <div className="bg-white border border-gray-300 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold">Investigator #{index + 1}</h4>
                {canRemove && onRemove && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRemove}
                        className="h-6 text-red-500 hover:text-red-700"
                    >
                        Remove
                    </Button>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'internal' | 'external')}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="internal">Internal</TabsTrigger>
                    <TabsTrigger value="external">External</TabsTrigger>
                </TabsList>

                <TabsContent value="internal" className="space-y-3 mt-4">
                    <FormControl fullWidth size="small">
                        <InputLabel>Select Person</InputLabel>
                        <MuiSelect
                            value={selectedInternalUser}
                            onChange={(e) => setSelectedInternalUser(e.target.value)}
                            label="Select Person"
                            sx={{ backgroundColor: 'white' }}
                        >
                            {Array.isArray(internalUsers) && internalUsers.length > 0 ? (
                                internalUsers.map((user) => (
                                    <MenuItem key={user.id} value={user.id?.toString() || ''}>
                                        {user.full_name} {user.employee_type ? `(${user.employee_type})` : ''}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="no-users" disabled>
                                    No users available
                                </MenuItem>
                            )}
                        </MuiSelect>
                    </FormControl>
                    {!Array.isArray(internalUsers) || internalUsers.length === 0 ? (
                        <div className="text-sm text-gray-500">Loading users...</div>
                    ) : null}
                </TabsContent>

                <TabsContent value="external" className="space-y-3 mt-4">
                    <div>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Name (alphabets only)"
                            value={externalForm.name}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                setExternalForm({ ...externalForm, name: value });
                            }}
                            error={!!validationErrors.name}
                            helperText={validationErrors.name}
                            sx={{ backgroundColor: 'white' }}
                        />
                    </div>
                    <div>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Mail ID"
                            type="email"
                            value={externalForm.email}
                            onChange={(e) => setExternalForm({ ...externalForm, email: e.target.value })}
                            error={!!validationErrors.email}
                            helperText={validationErrors.email}
                            sx={{ backgroundColor: 'white' }}
                        />
                    </div>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Role"
                        value={externalForm.role}
                        onChange={(e) => setExternalForm({ ...externalForm, role: e.target.value })}
                        sx={{ backgroundColor: 'white' }}
                    />
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Company"
                        value={externalForm.company}
                        onChange={(e) => setExternalForm({ ...externalForm, company: e.target.value })}
                        sx={{ backgroundColor: 'white' }}
                    />
                    <div>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Contact No. (10 digits)"
                            value={externalForm.contactNo}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setExternalForm({ ...externalForm, contactNo: value });
                            }}
                            inputProps={{ maxLength: 10 }}
                            error={!!validationErrors.contactNo}
                            helperText={validationErrors.contactNo}
                            sx={{ backgroundColor: 'white' }}
                        />
                    </div>
                </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-2">
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
                {isLast && (
                    <Button
                        className="flex-1 bg-[#BF213E] text-white hover:bg-[#9d1a32]"
                        onClick={onAddBlock}
                    >
                        Add Investigator
                    </Button>
                )}
            </div>
        </div>
    );
};
