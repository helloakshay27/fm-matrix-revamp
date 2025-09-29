import { Dialog, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/store/hooks';
import { toast } from 'sonner';
import { createProjectGroups, updateProjectGroups } from '@/store/slices/projectGroupSlice';

const ProjectGroupModal = ({ openDialog, handleCloseDialog, isEditing, record, fetchData, users }) => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');

    const [formData, setFormData] = useState({
        groupName: '',
        members: [],
    })

    useEffect(() => {
        if (isEditing && record) {
            setFormData({
                groupName: record.name,
                members: record?.project_group_members
            })
        }
    }, [isEditing, record])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleClose = () => {
        handleCloseDialog()
        setFormData({
            groupName: '',
            members: [],
        })
    }

    const handleSubmit = async () => {
        if (isEditing) {
            const payload = {
                name: formData.groupName,
                user_ids: formData.members,
            }
            try {
                await dispatch(updateProjectGroups({
                    baseUrl,
                    token,
                    id: record.id,
                    data: payload
                })).unwrap();

                toast.success("Group updated successfully")
                handleClose()
                fetchData()
            } catch (error) {
                console.log(error)
                toast.error(error)
            }
        } else {
            const payload = {
                name: formData.groupName,
                user_ids: formData.members,
                created_by_id: JSON.parse(localStorage.getItem("user")).id,
                active: true
            }
            try {
                await dispatch(createProjectGroups({
                    baseUrl,
                    token,
                    data: payload
                })).unwrap();

                toast.success("Group created successfully")
                handleClose()
                fetchData()
            } catch (error) {
                console.log(error)
                toast.error(error)
            }
        }
    }

    return (
        <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create Group</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="groupName"
                    label="Group Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.groupName}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ style: { color: '#000000' } }}
                    InputProps={{
                        style: { backgroundColor: '#fff', borderRadius: '4px' },
                    }}
                />
                <TextField
                    margin="dense"
                    name="members"
                    label="Members"
                    select
                    fullWidth
                    variant="outlined"
                    value={formData.members}
                    onChange={handleChange}
                    required
                    SelectProps={{
                        multiple: true,
                        renderValue: (selected) =>
                            Array.isArray(selected) && selected
                                .map((id) => users.find((member) => member.id === id)?.full_name || '')
                                .join(', '),
                    }}
                    InputLabelProps={{ style: { color: '#000000' } }}
                    InputProps={{
                        style: { backgroundColor: '#fff', borderRadius: '4px' },
                    }}
                >
                    {users.map((member) => (
                        <MenuItem key={member.id} value={member.id}>
                            {member.full_name}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>

            <div className="flex justify-center gap-3 mb-4">
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
                >
                    Submit
                </Button>
            </div>
        </Dialog>
    )
}

export default ProjectGroupModal