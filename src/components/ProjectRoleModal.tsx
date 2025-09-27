import { Dialog, DialogContent, TextField } from '@mui/material';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { createProjectRole, updateProjectRole } from '@/store/slices/projectRoleSlice';
import { toast } from 'sonner';

const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
        padding: { xs: "8px", sm: "10px", md: "12px" },
    },
};

const ProjectRoleModal = ({ showAddModal, handleClose, isEditing, record, getRoles }) => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');

    const [role, setRole] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isEditing) {
            setRole(record.name)
        }
    }, [isEditing, record])

    const handleSubmit = async () => {
        if (isEditing) {
            try {
                const payload = {
                    lock_role: {
                        name: role,
                        display_name: role,
                    },
                };
                await dispatch(updateProjectRole({ baseUrl, token, id: record.id, data: payload })).unwrap();
                toast.success("Role updated successfully");
                getRoles();
                handleClose();
            } catch (error) {
                console.log(error);
                toast.dismiss();
                toast.error(error);
            }
        } else {
            try {
                setLoading(true)
                const payload = {
                    lock_role: {
                        name: role,
                        display_name: role,
                        active: 1,
                    },
                };
                await dispatch(createProjectRole({ baseUrl, token, data: payload })).unwrap();
                toast.success("Role added successfully");
                getRoles();
                handleClose();
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <Dialog open={showAddModal} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogContent>
                <div className="flex flex-row items-center justify-between mb-6">
                    <h1 className="text-lg font-semibold">{isEditing ? 'Edit Role' : 'Add Role'}</h1>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClose}
                        className="h-6 w-6 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <TextField
                            label="Role Name"
                            placeholder="Enter Role Name"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            fullWidth
                            variant="outlined"
                            required
                            InputLabelProps={{ shrink: true }}
                            sx={fieldStyles}
                        />
                    </div>

                    <div className="flex justify-center gap-3">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            className="px-6"
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-green-500 hover:bg-green-600 text-white px-6"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProjectRoleModal