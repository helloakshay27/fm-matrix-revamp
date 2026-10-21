import { useState } from "react";
import { TextField } from "@mui/material";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Users, Paperclip, } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { FormSection, FormActionBar, assetFieldStyles } from "@/components/common/FormSection";
import { AttachmentUpload } from "@/components/common/AttachmentUpload";
import { useClubManagementEvents } from "@/components/PostHogClubManagementEvents";
import { isCMContextActive } from "@/utils/posthogHelpers";

const PULSE_CATEGORY_OPTIONS = [
    { value: "play", label: "Play" },
    { value: "panasche", label: "Panache" },
    { value: "persuit", label: "Pursuit" },
];

const COMMUNITY_CATEGORY_OPTIONS = [
    { value: "open", label: "Open to all" },
    { value: "requestable", label: "Requestable" },
];

const requiredLabel = (text: string) => (
    <span>
        {text}
        <span className="ml-0.5">*</span>
    </span>
);

// Description textarea — assetFieldStyles ki fixed height multiline pe nahi lagani
const multilineFieldStyles = {
    "& .MuiOutlinedInput-root": { height: "auto" },
};

const CommunityAdd = () => {
    const navigate = useNavigate();
    const { created } = useClubManagementEvents();
    const baseUrl = localStorage.getItem("baseUrl")
    const token = localStorage.getItem("token")

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        communityName: "",
        description: "",
        coverImage: null as File | null,
        category: "play",
        communityCategory: "open",
    });

    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRadioChange = (name: "category" | "communityCategory") => (value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCoverImageSelect = (file?: File) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error("Please select an image file");
            return;
        }
        setFormData((prev) => ({
            ...prev,
            coverImage: file,
        }));
        const reader = new FileReader();
        reader.onloadend = () => {
            setCoverImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveCoverImage = () => {
        setFormData((prev) => ({
            ...prev,
            coverImage: null,
        }));
        setCoverImagePreview(null);
    };

    const validateForm = () => {
        if (!formData.communityName.trim()) {
            toast.error("Community Name is required");
            return false;
        }
        if (!formData.coverImage) {
            toast.error("Cover Image is required");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("community[name]", formData.communityName);
            formDataToSend.append("community[description]", formData.description);
            formDataToSend.append("community[status]", "true");
            formDataToSend.append("community[category]", formData.category);
            formDataToSend.append("community[community_type]", formData.communityCategory);

            if (formData.coverImage) {
                formDataToSend.append("community[attachment]", formData.coverImage);
            }

            await axios.post(`https://${baseUrl}/communities.json`, formDataToSend, {
                headers: { Authorization: `Bearer ${token}` },
            })
            toast.success("Community created successfully");
            if (isCMContextActive()) {
                created("Community", undefined, "community_add", { name: formData.communityName });
            }
            navigate(-1);
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data?.error || error.message || "Failed to create community");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                <span>Community List</span>
                <span>{">"}</span>
                <span className="text-gray-900 font-medium">Create New Community</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">NEW COMMUNITY</h1>
            </div>

            <div className="space-y-4 sm:space-y-6">
                {/* Community Details */}
                <FormSection title="COMMUNITY DETAILS" icon={Users}>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <TextField
                                label={requiredLabel("Community Name")}
                                placeholder="Enter Community Name"
                                name="communityName"
                                fullWidth
                                variant="outlined"
                                value={formData.communityName}
                                onChange={handleInputChange}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />

                            {/* Pulse Category */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Pulse Category
                                </label>
                                <RadioGroup
                                    value={formData.category}
                                    onValueChange={handleRadioChange("category")}
                                    className="flex flex-wrap items-center gap-x-8 gap-y-2"
                                >
                                    {PULSE_CATEGORY_OPTIONS.map((option) => (
                                        <div key={option.value} className="flex items-center space-x-2">
                                            <RadioGroupItem value={option.value} id={`category-${option.value}`} />
                                            <label htmlFor={`category-${option.value}`} className="text-sm cursor-pointer">
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* Community Category */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Community Category
                                </label>
                                <RadioGroup
                                    value={formData.communityCategory}
                                    onValueChange={handleRadioChange("communityCategory")}
                                    className="flex flex-wrap items-center gap-x-8 gap-y-2"
                                >
                                    {COMMUNITY_CATEGORY_OPTIONS.map((option) => (
                                        <div key={option.value} className="flex items-center space-x-2">
                                            <RadioGroupItem value={option.value} id={`community-category-${option.value}`} />
                                            <label htmlFor={`community-category-${option.value}`} className="text-sm cursor-pointer">
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>

                        <TextField
                            label="Description"
                            placeholder="Enter Description"
                            name="description"
                            fullWidth
                            multiline
                            rows={5}
                            variant="outlined"
                            value={formData.description}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                            sx={multilineFieldStyles}
                        />
                    </div>
                </FormSection>

                {/* Cover Image */}
                <FormSection title="COVER IMAGE" icon={Paperclip}>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                        {requiredLabel("Upload Cover Image")}
                    </h3>
                    <AttachmentUpload
                        chooseText="Choose Image"
                        uploadText="Upload Image"
                        emptyText="No image chosen"
                        accept="image/*"
                        files={formData.coverImage ? [formData.coverImage] : []}
                        onFilesSelected={(files) => handleCoverImageSelect(files[0])}
                        onRemove={handleRemoveCoverImage}
                    />
                    {coverImagePreview && (
                        <img
                            src={coverImagePreview}
                            alt="Cover Preview"
                            className="mt-4 w-32 h-32 object-cover rounded-lg border border-gray-200"
                        />
                    )}
                </FormSection>

                <FormActionBar
                    onCancel={() => navigate(-1)}
                    onSubmit={handleSubmit}
                    submitLabel="Submit"
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
};

export default CommunityAdd;
