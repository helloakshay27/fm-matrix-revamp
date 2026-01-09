import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Close } from '@mui/icons-material';
import { toast } from 'sonner';
import { Box, Dialog, DialogContent, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';

interface AmenityCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    fetchData: () => void;
    isEditing?: boolean;
    record?: any;
}

const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
        padding: { xs: "8px", sm: "10px", md: "12px" },
    },
};

export const AmenityCategoryModal = ({ isOpen, onClose, fetchData, isEditing, record }: AmenityCategoryModalProps) => {
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        fac_type: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEditing && record) {
            setFormData({
                name: record.name || '',
                description: record.description || '',
                fac_type: record.fac_type || '',
            });
        }
    }, [isEditing, record]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleClose = () => {
        setFormData({
            name: '',
            description: '',
            fac_type: '',
        });
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Please enter category name');
            return;
        }

        setIsSubmitting(true);
        const payload = new FormData();

        payload.append('facility_category[name]', formData.name);
        payload.append('facility_category[description]', formData.description);
        payload.append('facility_category[active]', "1");
        payload.append('facility_category[fac_type]', formData.fac_type);

        try {
            if (isEditing && record) {
                payload.append('facility_category[id]', record.id);
                await axios.put(
                    `https://${baseUrl}/pms/admin/facility_categories/${record.id}.json`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
                toast.success("Amenity Category updated successfully");
            } else {
                await axios.post(
                    `https://${baseUrl}/pms/admin/facility_categories.json`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
                toast.success("Amenity Category added successfully");
            }

            fetchData();
            handleClose();
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.error || error.message || 'Failed to save amenity category';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogContent>
                <div>
                    <h1 className='text-xl mb-6 mt-2 font-semibold'>
                        {isEditing ? 'Edit Amenity Category' : 'Add Amenity Category'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                        label="Name"
                        name="name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.name}
                        onChange={handleFormChange}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                        required
                    />

                    <TextField
                        label="Description"
                        name="description"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        value={formData.description}
                        onChange={handleFormChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                height: "auto !important",
                                padding: "2px !important",
                                display: "flex",
                            },
                            "& .MuiInputBase-input[aria-hidden='true']": {
                                flex: 0,
                                width: 0,
                                height: 0,
                                padding: "0 !important",
                                margin: 0,
                                display: "none",
                            },
                            "& .MuiInputBase-input": {
                                resize: "none !important",
                            },
                        }}
                    />

                    <FormControl fullWidth variant="outlined">
                        <InputLabel shrink>Facility Type</InputLabel>
                        <Select
                            label="Facility Type"
                            name="fac_type"
                            value={formData.fac_type}
                            onChange={handleFormChange}
                            displayEmpty
                            sx={fieldStyles}
                        >
                            <MenuItem value="">Select Type</MenuItem>
                            <MenuItem value="bookable">Bookable</MenuItem>
                            <MenuItem value="requestable">Requestable</MenuItem>
                        </Select>
                    </FormControl>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
