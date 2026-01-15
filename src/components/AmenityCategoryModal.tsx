import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Box, Dialog, DialogContent, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { CloudUpload, Delete } from '@mui/icons-material';

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
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [iconDark, setIconDark] = useState<File | null>(null);
    const [iconLight, setIconLight] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
    const [iconDarkPreview, setIconDarkPreview] = useState<string | null>(null);
    const [iconLightPreview, setIconLightPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEditing && record) {
            setFormData({
                name: record.name || '',
                description: record.description || '',
                fac_type: record.fac_type || '',
            });
            setCoverImagePreview(record.cover_image?.document || null);
            setIconDarkPreview(record.icon_dark?.document || null);
            setIconLightPreview(record.icon_light?.document || null);
        }
    }, [isEditing, record]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'icon' | 'icon_light') => {
        const file = e.target.files?.[0];
        if (file) {
            if (type === 'cover') {
                setCoverImage(file);
                setCoverImagePreview(URL.createObjectURL(file));
            } else if (type === 'icon') {
                setIconDark(file);
                setIconDarkPreview(URL.createObjectURL(file));
            } else {
                setIconLight(file);
                setIconLightPreview(URL.createObjectURL(file));
            }
        }
    };

    const removeFile = (type: 'cover' | 'icon' | 'icon_light') => {
        if (type === 'cover') {
            setCoverImage(null);
            setCoverImagePreview(null);
        } else if (type === 'icon') {
            setIconDark(null);
            setIconDarkPreview(null);
        } else {
            setIconLight(null);
            setIconLightPreview(null);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            description: '',
            fac_type: '',
        });
        setCoverImage(null);
        setIconDark(null);
        setIconLight(null);
        setCoverImagePreview(null);
        setIconDarkPreview(null);
        setIconLightPreview(null);
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
        payload.append('facility_category[active]', record?.active === false ? "0" : "1");
        payload.append('facility_category[fac_type]', formData.fac_type);

        if (coverImage) {
            payload.append('cover_image', coverImage);
        }
        if (iconDark) {
            payload.append('icon_dark', iconDark);
        }
        if (iconLight) {
            payload.append('icon_light', iconLight);
        }

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

                    <Box sx={{ mt: 3, p: 2, border: '1px dashed #ccc', borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold', color: '#666' }}>
                            Attachments
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* Cover Image Upload - Full Width */}
                            <Box>
                                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#888' }}>
                                    Cover Image
                                </Typography>
                                <Box sx={{
                                    position: 'relative',
                                    height: 120,
                                    bgcolor: '#f8f8f8',
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #eee',
                                    overflow: 'hidden'
                                }}>
                                    {coverImagePreview ? (
                                        <>
                                            <img src={coverImagePreview} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <IconButton
                                                size="small"
                                                onClick={() => removeFile('cover')}
                                                sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: '#fff' } }}
                                            >
                                                <Delete fontSize="small" color="error" />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <input type="file" accept="image/*" hidden onChange={(e) => handleFileChange(e, 'cover')} />
                                            <CloudUpload sx={{ color: '#aaa', fontSize: 32 }} />
                                            <Typography variant="caption" sx={{ color: '#aaa' }}>Upload Cover Image</Typography>
                                        </label>
                                    )}
                                </Box>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                {/* Icon Dark Upload */}
                                <Box>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#888' }}>
                                        Icon Dark
                                    </Typography>
                                    <Box sx={{
                                        position: 'relative',
                                        height: 100,
                                        bgcolor: '#f8f8f8',
                                        borderRadius: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid #eee',
                                        overflow: 'hidden'
                                    }}>
                                        {iconDarkPreview ? (
                                            <>
                                                <img src={iconDarkPreview} alt="Icon Dark" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} />
                                                <IconButton
                                                    size="small"
                                                    onClick={() => removeFile('icon')}
                                                    sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: '#fff' } }}
                                                >
                                                    <Delete fontSize="small" color="error" />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <input type="file" accept="image/*" hidden onChange={(e) => handleFileChange(e, 'icon')} />
                                                <CloudUpload sx={{ color: '#aaa', fontSize: 24 }} />
                                                <Typography variant="caption" sx={{ color: '#aaa', fontSize: '10px' }}>Upload Dark</Typography>
                                            </label>
                                        )}
                                    </Box>
                                </Box>

                                {/* Icon Light Upload */}
                                <Box>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#888' }}>
                                        Icon Light
                                    </Typography>
                                    <Box sx={{
                                        position: 'relative',
                                        height: 100,
                                        bgcolor: '#f8f8f8',
                                        borderRadius: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid #eee',
                                        overflow: 'hidden'
                                    }}>
                                        {iconLightPreview ? (
                                            <>
                                                <img src={iconLightPreview} alt="Icon Light" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} />
                                                <IconButton
                                                    size="small"
                                                    onClick={() => removeFile('icon_light')}
                                                    sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: '#fff' } }}
                                                >
                                                    <Delete fontSize="small" color="error" />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <input type="file" accept="image/*" hidden onChange={(e) => handleFileChange(e, 'icon_light')} />
                                                <CloudUpload sx={{ color: '#aaa', fontSize: 24 }} />
                                                <Typography variant="caption" sx={{ color: '#aaa', fontSize: '10px' }}>Upload Light</Typography>
                                            </label>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

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
