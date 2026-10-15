import { useState, useEffect } from 'react';
import { FormSection, FormActionBar, assetFieldStyles } from '@/components/common/FormSection';
import { AttachmentUpload } from '@/components/common/AttachmentUpload';
import { ArrowLeft, Trash2, FileText, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { createBanner } from '@/store/slices/bannerSlice';
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
}


const BannerAddPage = () => {
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
    const [loading, setLoading] = useState(false);
    // const [projects, setProjects] = useState<any[]>([]);
    // const [loadingProjects, setLoadingProjects] = useState(false);

    // useEffect(() => {
    //     const fetchProjects = async () => {
    //         setLoadingProjects(true);
    //         try {
    //             const response = await axios.get(`https://${baseUrl}/projects.json`, {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             });
    //             setProjects(response.data.featured || []);
    //         } catch (error) {
    //             toast.error('Failed to fetch projects');
    //         } finally {
    //             setLoadingProjects(false);
    //         }
    //     };

    //     fetchProjects();
    // }, [baseUrl, token]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRemoveImage = (imageId: number) => {
        setUploadedImages(prev => prev.filter(img => img.id !== imageId));
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

        // Append images by ratio
        uploadedImages.forEach((image) => {
            if (image.file) {
                const ratioKey = `banner_video_${image.ratio.replace(':', '_by_')}`;
                payload.append(`banner[${ratioKey}]`, image.file);
            }
        });

        setLoading(true);
        try {
            const response = await dispatch(createBanner({ baseUrl, token, data: payload })).unwrap();
            toast.success(response.message || "Banner created successfully");
            navigate('/pulse/community-modules/banner-list');
        } catch (error) {
            toast.error((error as Error)?.message || 'Failed to create banner');
        } finally {
            setLoading(false);
        }
    };

    const project_banner = [
        { key: "banner_video_1_by_1", label: "1:1" },
        { key: "banner_video_16_by_9", label: "16:9" },
        { key: "banner_video_9_by_16", label: "9:16" },
        { key: "banner_video_3_by_2", label: "3:2" },
    ];

    return (
        <div className="p-[30px]">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
                <button
                  type="button"
                  onClick={() => navigate('/pulse/community-modules/banner-list')}
                  className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-600" />
                </button>
                <span>Banner List</span>
                <span>{">"}</span>
                <span className="text-gray-900 font-medium">Create New Banner</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">NEW BANNER</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Basic Information */}
                <FormSection title="BASIC INFORMATION" icon={FileText}>
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
                                InputProps={{ sx: assetFieldStyles }}
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
                                InputProps={{ sx: assetFieldStyles }}
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
                                InputProps={{ sx: assetFieldStyles }}
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
                </FormSection>

                {/* Banner Images */}
                <FormSection title="BANNER IMAGES *" icon={ImageIcon}>
                        <div className="space-y-4">
                            {/* Upload — shared attachment input; click par ratio/crop modal khulta hai */}
                            <AttachmentUpload
                                chooseText="Choose Banner"
                                uploadText="Upload Banner"
                                emptyText="No banner chosen (1:1, 9:16, 16:9, 3:2)"
                                accept="image/*"
                                multiple
                                files={uploadedImages.map((image) => image.file ?? new File([], image.name))}
                                onFilesSelected={() => setShowGalleryUpload(true)}
                                onRemove={(index) => handleRemoveImage(uploadedImages[index].id)}
                                onBrowse={() => setShowGalleryUpload(true)}
                            />

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
                </FormSection>

                {/* Action Buttons */}
                <FormActionBar
                    onCancel={() => navigate('/pulse/community-modules/banner-list')}
                    submitLabel="Create Banner"
                    isSubmitting={loading}
                    submitAsFormSubmit
                />
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

export default BannerAddPage;
