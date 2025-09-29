import { Dialog, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/store/hooks';
import { toast } from 'sonner';

const ProjectGroupModal = ({ openDialog, handleCloseDialog, isEditing, record, fetchData }) => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');

    const [formData, setFormData] = useState({
        groupName: '',
        members: [],
    })

    const availableMembers = [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
        { id: '3', name: 'Alice Johnson' },
        { id: '4', name: 'Bob Williams' },
        { id: '5', name: 'Emily Brown' },
        { id: '6', name: 'Michael Davis' },
        { id: '7', name: 'Olivia Wilson' },
    ];

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
                                .map((id) => availableMembers.find((member) => member.id === id)?.name || '')
                                .join(', '),
                    }}
                    InputLabelProps={{ style: { color: '#000000' } }}
                    InputProps={{
                        style: { backgroundColor: '#fff', borderRadius: '4px' },
                    }}
                >
                    {availableMembers.map((member) => (
                        <MenuItem key={member.id} value={member.id}>
                            {member.name}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>

            <div className="flex justify-center gap-3 mb-4">
                <Button
                    variant="outline"
                    onClick={handleCloseDialog}
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