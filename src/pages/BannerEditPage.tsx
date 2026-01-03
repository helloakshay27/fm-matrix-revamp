import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { editBanner, fetchBannersById } from '@/store/slices/bannerSlice';
import { toast } from 'sonner';
import { TextField, MenuItem } from '@mui/material';
import { GalleryImageUpload } from '@/components/GalleryImageUpload';
import axios from 'axios';

interface UploadedImage {
    id: number;
    name: string;
    file: File;
    size: number;
    ratio: string;
    isValidRatio: boolean;
    uploadTime: string;
    preview: string;
    type: 'image';
    attachmentId?: number; // For existing images from API
    isExisting?: boolean; // Flag to identify existing vs new images
}

const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input": {
        padding: { xs: "8px", sm: "10px", md: "12px" },
    },
};

const BannerEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');

    const [formData, setFormData] = useState({
        title: '',
        bannerUrl: '',
        // projectId: '',
    });

    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [showGalleryUpload, setShowGalleryUpload] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    // const [projects, setProjects] = useState<any[]>([]);
    // const [loadingProjects, setLoadingProjects] = useState(false);

    useEffect(() => {
        // const fetchProjects = async () => {
        //     setLoadingProjects(true);
        //     try {
        //         const response = await axios.get(`https://${baseUrl}/projects.json`, {
        //             headers: {
        //                 Authorization: `Bearer ${token}`,
        //             },
        //         });
        //         setProjects(response.data.featured || []);
        //     } catch (error) {
        //         toast.error('Failed to fetch projects');
        //     } finally {
        //         setLoadingProjects(false);
        //     }
        // };

        const getBanner = async () => {
            setLoading(true);
            try {
                const response = await dispatch(fetchBannersById({ baseUrl, token, id: id as string })).unwrap();
                setFormData({
                    title: response.title || '',
                    bannerUrl: response.geo_link || '',
                    // projectId: response.project_id || '',
                });

                // Load existing images
                const existingImages: UploadedImage[] = [];
                const ratioMapping = [
                    { key: 'banner_video_1_by_1', label: '1:1' },
                    { key: 'banner_video_9_by_16', label: '9:16' },
                    { key: 'banner_video_16_by_9', label: '16:9' },
                    { key: 'banner_video_3_by_2', label: '3:2' }
                ];

                ratioMapping.forEach(({ key, label }) => {
                    if (response[key]?.document_url) {
                        existingImages.push({
                            id: Date.now() + Math.random(),
                            name: response[key].document_file_name || `Banner ${label}`,
                            file: new File([], ''),
                            size: 0,
                            ratio: label,
                            isValidRatio: true,
                            uploadTime: new Date().toLocaleTimeString(),
                            preview: response[key].document_url,
                            type: 'image',
                            attachmentId: response[key].id,
                            isExisting: true,
                        });
                    }
                });

                setUploadedImages(existingImages);
            } catch (error) {
                toast.error('Failed to load banner data');
                navigate('/pulse/community-modules/banner-list');
            } finally {
                setLoading(false);
            }
        };

        // fetchProjects();
        if (id) {
            getBanner();
        }
    }, [id, dispatch, baseUrl, token, navigate]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRemoveImage = async (imageId: number) => {
        const imageToRemove = uploadedImages.find(img => img.id === imageId);
        
        // If it's an existing image from the server, call the remove API
        if (imageToRemove?.isExisting && imageToRemove.attachmentId) {
            try {
                const apiUrl = `https://${baseUrl}/banners/${id}/remove_image/${imageToRemove.attachmentId}.json`;
                const response = await axios.delete(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                if (response.status === 200) {
                    toast.success('Image removed successfully');
                    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
                }
            } catch (error: any) {
                console.error('Error removing image:', error);
                toast.error(error?.response?.data?.message || 'Failed to remove image');
            }
        } else {
            // For newly uploaded images (not yet saved), just remove from state
            setUploadedImages(prev => prev.filter(img => img.id !== imageId));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }

        if (uploadedImages.length === 0) {
            toast.error('At least one banner image is required');
            return;
        }

        const payload = new FormData();
        const siteId = localStorage.getItem("selectedSiteId") || '';

        payload.append('banner[site_ids][]', siteId);
        payload.append('banner[title]', formData.title);
        payload.append('banner[geo_link]', formData.bannerUrl);
        // if (formData.projectId) {
        //     payload.append('banner[project_id]', formData.projectId);
        // }
        payload.append('banner[active]', String(1));

        // Append images by ratio (only new File objects)
        uploadedImages.forEach((image) => {
            if (image.file && image.file.name) {
                const ratioKey = `banner_video_${image.ratio.replace(':', '_by_')}`;
                payload.append(`banner[${ratioKey}]`, image.file);
            }
        });

        setSubmitting(true);
        try {
            await dispatch(editBanner({ baseUrl, token, data: payload, id: id as string })).unwrap();
            toast.success("Banner updated successfully");
            navigate('/pulse/community-modules/banner-list');
        } catch (error) {
            toast.error((error as Error)?.message || 'Failed to update banner');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C72030]"></div>
            </div>
        );
    }

    return (
        <div className="p-[30px]">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/pulse/community-modules/banner-list')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-semibold">Edit Banner</h1>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Basic Information Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextField
                                label="Title"
                                name="title"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.title}
                                onChange={handleFormChange}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: fieldStyles }}
                                required
                            />

                            {/* <TextField
                                label="Banner URL"
                                name="bannerUrl"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.bannerUrl}
                                onChange={handleFormChange}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: fieldStyles }}
                            /> */}

                            {/* <TextField
                                label="Project"
                                name="projectId"
                                select
                                fullWidth
                                variant="outlined"
                                value={formData.projectId}
                                onChange={handleFormChange}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: fieldStyles }}
                                disabled={loadingProjects}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {projects.map((project) => (
                                    <MenuItem key={project.id} value={project.id}>
                                        {project.project_name}
                                    </MenuItem>
                                ))}
                            </TextField> */}
                        </div>
                    </CardContent>
                </Card>

                {/* Banner Images Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Banner Images <span className="text-red-500">*</span></CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Upload Button */}
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={() => setShowGalleryUpload(true)}
                            >
                                <Upload className="mx-auto mb-2 text-gray-400 w-8 h-8" />
                                <p className="text-gray-600 text-sm">
                                    Click to upload banners (1:1, 9:16, 16:9, 3:2)
                                </p>
                            </div>

                            {/* Uploaded Images Preview */}
                            {uploadedImages.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-gray-700">Uploaded Images ({uploadedImages.length})</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {uploadedImages.map((image) => (
                                            <div
                                                key={image.id}
                                                className="relative group border border-gray-200 rounded-lg overflow-hidden"
                                            >
                                                <img
                                                    src={image.preview}
                                                    alt={image.name}
                                                    className="w-full h-32 object-cover"
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white px-2 py-1 text-xs text-center">
                                                    {image.ratio}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(image.id)}
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/pulse/community-modules/banner-list')}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-[#C72030] hover:bg-[#A01020]"
                        disabled={submitting}
                    >
                        {submitting ? 'Updating...' : 'Update Banner'}
                    </Button>
                </div>
            </form>

            {/* Gallery Upload Modal */}
            {showGalleryUpload && (
                <GalleryImageUpload
                    showAsModal={true}
                    onClose={() => setShowGalleryUpload(false)}
                    selectedRatioProp={['1:1', '9:16', '16:9', '3:2']}
                    initialImages={uploadedImages}
                    onContinue={(images) => {
                        setUploadedImages(images);
                        setShowGalleryUpload(false);
                    }}
                    label="Upload Banner Images"
                    description="Upload banners with different aspect ratios"
                />
            )}
        </div>
    );
};

export default BannerEditPage;
