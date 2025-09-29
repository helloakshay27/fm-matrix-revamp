import { Dialog, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/store/hooks';
import { createProjectsTags, updateProjectsTags } from '@/store/slices/projectTagSlice';
import { toast } from 'sonner';

const ProjectTagModal = ({ openDialog, handleCloseDialog, isEditing, record, fetchData }) => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');

    const [formData, setFormData] = useState({
        tagName: '',
        tagType: ''
    })

    useEffect(() => {
        if (isEditing && record) {
            setFormData({
                tagName: record.name,
                tagType: record.tag_type
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
            tagName: '',
            tagType: ''
        })
    }

    const handleSubmit = async () => {
        if (isEditing) {
            const payload = {
                name: formData.tagName,
                tag_type: formData.tagType
            }
            try {
                await dispatch(updateProjectsTags({ baseUrl, token, data: payload, id: record.id })).unwrap();
                toast.success("Tag updated successfully");
                fetchData();
                handleClose();
            } catch (error) {
                console.log(error);
                toast.dismiss();
                toast.error(error);
            }
        } else {
            const payload = {
                name: formData.tagName,
                tag_type: formData.tagType,
                active: true
            }
            try {
                await dispatch(createProjectsTags({ baseUrl, token, data: payload })).unwrap();
                toast.success("Tag created successfully");
                fetchData();
                handleClose();
            } catch (error) {
                console.log(error);
                toast.dismiss();
                toast.error(error);
            }
        }
    }

    return (
        <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create Tag</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="tagName"
                    label="Tag Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.tagName}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ style: { color: '#000000' } }}
                    InputProps={{
                        style: { backgroundColor: '#fff', borderRadius: '4px' },
                    }}
                />
                <TextField
                    margin="dense"
                    name="tagType"
                    label="Tag Type"
                    select
                    fullWidth
                    variant="outlined"
                    value={formData.tagType}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ style: { color: '#000000' } }}
                    InputProps={{
                        style: { backgroundColor: '#fff', borderRadius: '4px' },
                    }}
                >
                    <MenuItem value="">Select...</MenuItem>
                    <MenuItem value="Client">Client Tag</MenuItem>
                    <MenuItem value="Product">Product Tag</MenuItem>
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

export default ProjectTagModal