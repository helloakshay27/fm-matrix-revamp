import { TextField, FormControl, Select as MuiSelect, MenuItem, InputLabel } from "@mui/material";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { ArrowLeft, FileText, Share2, Paperclip, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { FormSection, FormActionBar, assetFieldStyles } from "@/components/common/FormSection";
import { AttachmentUpload } from "@/components/common/AttachmentUpload";

const requiredLabel = (text: string) => (
    <span>
        {text}
        <span className="fm-required-mark">*</span>
    </span>
);

// AssetFilterDialog jaisa dropdown menu
const selectMenuProps = {
    PaperProps: {
        style: {
            maxHeight: 224,
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            zIndex: 9999,
        },
    },
    disablePortal: false,
    disableAutoFocus: true,
    disableEnforceFocus: true,
};

const AddSosDirectory = () => {
    const [formData, setFormData] = useState<{
        title: string;
        category: string;
        contact_number: string;
        shareWith: string;
        image: File | null;
        darkImage: File | null;
    }>({
        title: "",
        category: "",
        contact_number: "",
        shareWith: "all",
        image: null,
        darkImage: null,
    });

    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token')
    const navigate = useNavigate();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [darkImagePreview, setDarkImagePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Tech Park Modal State
    const [isTechParkModalOpen, setIsTechParkModalOpen] = useState(false);
    const [techParks, setTechParks] = useState<any[]>([]);
    const [selectedTechParks, setSelectedTechParks] = useState<number[]>([]);
    const [isLoadingTechParks, setIsLoadingTechParks] = useState(false);

    // Categories State
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);

    const fetchTechParks = async () => {
        if (techParks.length > 0) return;

        setIsLoadingTechParks(true);
        try {
            const response = await axios.get(`https://${baseUrl}/pms/sites/allowed_sites.json`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTechParks(response.data.sites || []);
        } catch (error) {
            console.error("Failed to fetch tech parks", error);
            toast.error("Failed to load tech parks");
        } finally {
            setIsLoadingTechParks(false);
        }
    };

    const fetchCategories = async () => {
        setIsLoadingCategories(true);
        try {
            const response = await axios.get(`https://${baseUrl}/sos_directories/get_sos_directory_category.json`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCategories(response.data.sos_directory_categories || []);
        } catch (error) {
            console.error("Failed to fetch categories", error);
            toast.error("Failed to load categories");
        } finally {
            setIsLoadingCategories(false);
        }
    };

    useEffect(() => {
        fetchTechParks();
        fetchCategories();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileSelect = (file?: File) => {
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: file,
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDarkImageSelect = (file?: File) => {
        if (file) {
            setFormData((prev) => ({
                ...prev,
                darkImage: file,
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setDarkImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({
            ...prev,
            image: null,
        }));
        setImagePreview(null);
    };

    const handleRemoveDarkImage = () => {
        setFormData((prev) => ({
            ...prev,
            darkImage: null,
        }));
        setDarkImagePreview(null);
    };

    const handleSubmit = async () => {
        // Validate
        if (!formData.title.trim()) {
            toast.error("Title is required");
            return;
        }
        if (!formData.category) {
            toast.error("Category is required");
            return;
        }
        if (!formData.contact_number.trim()) {
            toast.error("Contact Number is required");
            return;
        }

        if (formData.shareWith === 'individual' && selectedTechParks.length === 0) {
            toast.error("Please select at least one Tech Park");
            return;
        }

        if (!formData.image) {
            toast.error("Cover Image is required");
            return;
        }

        if (!formData.darkImage) {
            toast.error("Dark Image is required");
            return;
        }

        const payload = {
            sos_directory: {
                title: formData.title,
                sos_category_id: formData.category, // Assuming backend accepts this
                contact_number: formData.contact_number,
                status: "true",
                directory_type: type, // Or use formData.category if that's what it means? keeping type for now as in original code
                resource_id: localStorage.getItem('selectedSiteId'),
                resource_type: "Pms::Site",
                share_with: formData.shareWith // Assuming backend accepts this
            },
            site_ids: formData.shareWith === 'all'
                ? techParks.map(park => park.id)
                : selectedTechParks
        }

        setSubmitting(true)
        const submitData = new FormData();
        Object.keys(payload.sos_directory).forEach(key => {
            submitData.append(`sos_directory[${key}]`, payload.sos_directory[key]);
        });
        payload.site_ids.forEach(id => {
            submitData.append('site_ids[]', id);
        });
        if (formData.image) {
            submitData.append('sos_directory_lite', formData.image);
        }
        if (formData.darkImage) {
            submitData.append('sos_directory_dark', formData.darkImage);
        }

        try {
            await axios.post(`https://${baseUrl}/sos_directories.json`, submitData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": 'multipart/form-data'
                }
            })

            toast.success('Directory Added Successfully')
            navigate(-1)
        } catch (error: any) {
            console.log(error)
            toast.error(error?.response?.data?.error || error?.message || 'Failed to add directory')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="p-4 sm:p-6 max-w-full mx-auto min-h-screen bg-gray-50">
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-600" />
                </button>
                <span>SOS Directory List</span>
                <span>{">"}</span>
                <span className="text-gray-900 font-medium">Create New SOS Directory</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">NEW SOS DIRECTORY</h1>
            </div>

            <div className="space-y-4 sm:space-y-6">
                {/* Details Section */}
                <FormSection title="SOS DIRECTORY DETAILS" icon={FileText}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <TextField
                            label={requiredLabel("Title")}
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter Title (Max 25 Character)"
                            inputProps={{ maxLength: 25 }}
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: assetFieldStyles }}
                        />
                        <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': assetFieldStyles }}>
                            <InputLabel id="sos-category-label" shrink>
                                {requiredLabel("Category")}
                            </InputLabel>
                            <MuiSelect
                                labelId="sos-category-label"
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                label="Category*"
                                notched
                                displayEmpty
                                disabled={isLoadingCategories}
                                MenuProps={selectMenuProps}
                            >
                                <MenuItem value="" disabled>
                                    {isLoadingCategories ? "Loading categories..." : "Select Category"}
                                </MenuItem>
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </MuiSelect>
                        </FormControl>
                        <TextField
                            label={requiredLabel("Contact Number")}
                            id="contact_number"
                            name="contact_number"
                            value={formData.contact_number}
                            onChange={handleInputChange}
                            placeholder="Enter Number"
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: assetFieldStyles }}
                        />
                    </div>
                </FormSection>

                {/* Share Section */}
                <FormSection title="SHARE" icon={Share2}>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                            {requiredLabel("Share With")}
                        </label>
                        <RadioGroup
                            name="shareWith"
                            value={formData.shareWith}
                            onValueChange={(value) => {
                                setFormData(prev => ({ ...prev, shareWith: value }));
                                if (value === "individual") {
                                    setIsTechParkModalOpen(true);
                                }
                            }}
                            className="flex flex-wrap gap-6"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all" id="share-all" />
                                <Label htmlFor="share-all" className="text-sm font-normal text-gray-700 cursor-pointer">All Tech Park</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="individual" id="share-individual" />
                                <Label htmlFor="share-individual" className="text-sm font-normal text-gray-700 cursor-pointer">Individual Tech Parks</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    {formData.shareWith === "individual" && selectedTechParks.length > 0 && (
                        <div className="mt-2 flex items-center gap-2 text-brand text-sm font-medium">
                            <span>
                                {techParks
                                    .filter(park => selectedTechParks.includes(park.id))
                                    .map(park => park.name)
                                    .join(", ")}
                                .
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsTechParkModalOpen(true)}
                                className="hover:text-brand-hover transition-colors"
                                aria-label="Edit selected tech parks"
                            >
                                <Pencil size={14} />
                            </button>
                        </div>
                    )}
                </FormSection>

                {/* Attachment Section */}
                <FormSection title="ATTACHMENT" icon={Paperclip}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-1">
                                {requiredLabel("Upload Light Mode Image")}
                            </h3>
                            <p className="text-xs text-gray-500 mb-4">
                                Upload a clear, solid black image (JPG or PNG only, no colors or gradients) to ensure consistent visibility on a white background.
                            </p>
                            <AttachmentUpload
                                chooseText="Choose Image"
                                uploadText={"Upload Image"}
                                emptyText={"No image chosen"}
                                accept="image/jpeg,image/png"
                                files={formData.image ? [formData.image] : []}
                                onFilesSelected={(files) => handleFileSelect(files[0])}
                                onRemove={handleRemoveImage}
                            />
                            {imagePreview && (
                                <div className="relative inline-block mt-4">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-32 h-32 object-contain rounded-lg border border-gray-200 bg-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        aria-label="Remove light mode image"
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-1">
                                {requiredLabel("Upload Dark Mode Image")}
                            </h3>
                            <p className="text-xs text-gray-500 mb-4">
                                Upload a clear, solid white image (JPG or PNG only, no colors or gradients) to ensure consistent visibility on a dark background.
                            </p>
                            <AttachmentUpload
                                chooseText="Choose Image"
                                uploadText={"Upload Image"}
                                emptyText={"No image chosen"}
                                accept="image/jpeg,image/png"
                                files={formData.darkImage ? [formData.darkImage] : []}
                                onFilesSelected={(files) => handleDarkImageSelect(files[0])}
                                onRemove={handleRemoveDarkImage}
                            />
                            {darkImagePreview && (
                                <div className="relative inline-block mt-4">
                                    <img
                                        src={darkImagePreview}
                                        alt="Dark Preview"
                                        className="w-32 h-32 object-contain rounded-lg border border-gray-200 bg-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveDarkImage}
                                        aria-label="Remove dark mode image"
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </FormSection>

                <FormActionBar
                    onCancel={() => navigate('/pulse/sos-directory')}
                    onSubmit={handleSubmit}
                    submitLabel="Submit"
                    isSubmitting={submitting}
                />
            </div>

            <Dialog open={isTechParkModalOpen} onOpenChange={(open) => {
                setIsTechParkModalOpen(open);
                if (!open && selectedTechParks.length === 0) {
                    setFormData(prev => ({ ...prev, shareWith: "all" }));
                }
            }}>
                <DialogContent className="max-w-md bg-white">
                    <DialogHeader className="flex flex-row items-center justify-between">
                        <DialogTitle className="text-xl font-bold">Select Tech Park</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {isLoadingTechParks ? (
                            <div className="text-center py-4">Loading...</div>
                        ) : techParks.length > 0 ? (
                            techParks.map((park) => (
                                <div key={park.id} className="flex items-start space-x-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                    <Checkbox
                                        checked={selectedTechParks.includes(park.id)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedTechParks(prev => [...prev, park.id]);
                                            } else {
                                                setSelectedTechParks(prev => prev.filter(id => id !== park.id));
                                            }
                                        }}
                                        className="mt-1 data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                                    />
                                    <div className="flex gap-3">
                                        <img
                                            src={park.image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
                                            alt={park.name}
                                            className="w-16 h-16 rounded-md object-cover bg-gray-200"
                                        />
                                        <div>
                                            <h4 className="font-medium text-gray-900">{park.name}</h4>
                                            <p className="text-sm text-[#F47521]">{park.tower_name || "Tower Name"}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500">No Tech Parks found</div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddSosDirectory;
