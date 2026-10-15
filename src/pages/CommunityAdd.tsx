import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText, File, Info, XCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";
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

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
    <div className="flex items-center gap-3 px-6 pt-6 pb-3">
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-gray-100 text-gray-500 shrink-0">
            <Icon className="w-[18px] h-[18px]" />
        </div>
        <h3 className="text-sm font-semibold uppercase text-[#1A1A1A]">{title}</h3>
    </div>
);

const CommunityAdd = () => {
    const navigate = useNavigate();
    const { created } = useClubManagementEvents();
    const baseUrl = localStorage.getItem("baseUrl")
    const token = localStorage.getItem("token")
    const coverImageInputRef = useRef<HTMLInputElement>(null);

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

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file");
                if (coverImageInputRef.current) {
                    coverImageInputRef.current.value = "";
                }
                return;
            }

            setFormData((prev) => ({
                ...prev,
                coverImage: file,
            }));
            // Create preview for image files
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerCoverImageInput = () => {
        coverImageInputRef.current?.click();
    };

    const handleRemoveCoverImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFormData((prev) => ({
            ...prev,
            coverImage: null,
        }));
        setCoverImagePreview(null);
        if (coverImageInputRef.current) {
            coverImageInputRef.current.value = "";
        }
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
            toast.error(error.message || "Failed to create community");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 mx-auto bg-white min-h-screen">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="p-0 mb-4 hover:bg-transparent"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

            <div className="space-y-6">
                {/* Details Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                    <SectionHeader icon={FileText} title="Details" />

                    <div className="px-6 pb-6 pt-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Community Name */}
                            <div>
                                <label
                                    htmlFor="communityName"
                                    className="mb-1.5 block text-[12px] font-semibold text-gray-700"
                                >
                                    Community Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="communityName"
                                    name="communityName"
                                    value={formData.communityName}
                                    onChange={handleInputChange}
                                    placeholder="Enter Community Name"
                                    className="h-[42px] rounded-[8px] text-sm"
                                />
                            </div>

                            {/* Pulse Category */}
                            <div>
                                <span className="mb-1.5 block text-[12px] font-semibold text-gray-700">
                                    Pulse Category
                                </span>
                                <RadioGroup
                                    value={formData.category}
                                    onValueChange={handleRadioChange("category")}
                                    className="flex flex-wrap items-center gap-x-6 gap-y-2 min-h-[42px]"
                                >
                                    {PULSE_CATEGORY_OPTIONS.map((option) => (
                                        <div key={option.value} className="flex items-center gap-2">
                                            <RadioGroupItem value={option.value} id={`category-${option.value}`} />
                                            <Label
                                                htmlFor={`category-${option.value}`}
                                                className="text-sm font-normal text-gray-900 cursor-pointer"
                                            >
                                                {option.label}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* Community Category */}
                            <div>
                                <span className="mb-1.5 block text-[12px] font-semibold text-gray-700">
                                    Community Category
                                </span>
                                <RadioGroup
                                    value={formData.communityCategory}
                                    onValueChange={handleRadioChange("communityCategory")}
                                    className="flex flex-wrap items-center gap-x-6 gap-y-2 min-h-[42px]"
                                >
                                    {COMMUNITY_CATEGORY_OPTIONS.map((option) => (
                                        <div key={option.value} className="flex items-center gap-2">
                                            <RadioGroupItem value={option.value} id={`community-category-${option.value}`} />
                                            <Label
                                                htmlFor={`community-category-${option.value}`}
                                                className="text-sm font-normal text-gray-900 cursor-pointer"
                                            >
                                                {option.label}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className="mb-1.5 block text-[12px] font-semibold text-gray-700"
                            >
                                Description (Optional)
                            </label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter Description"
                                rows={6}
                                className="rounded-[8px] text-sm resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Attachment Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                    <SectionHeader icon={File} title="Attachment" />

                    <div className="px-6 pb-6 pt-2">
                        <span className="mb-3 block text-[12px] font-semibold text-gray-700">
                            Upload Cover Image <span className="text-red-500">*</span>
                        </span>

                        {formData.coverImage || coverImagePreview ? (
                            <div className="relative rounded-xl bg-[#F6F4EE] w-full max-w-[200px] h-40 flex items-center justify-center">
                                <span className="absolute top-2 left-3 text-xs font-medium text-gray-700 truncate max-w-[75%]">
                                    {formData.coverImage?.name || "Cover Image"}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleRemoveCoverImage}
                                    aria-label="Remove cover image"
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 transition-colors"
                                >
                                    <XCircle size={18} />
                                </button>
                                {coverImagePreview ? (
                                    <img
                                        src={coverImagePreview}
                                        alt="Cover Preview"
                                        className="w-24 h-24 object-cover rounded-lg mt-6"
                                    />
                                ) : (
                                    <File size={40} className="text-gray-400 mt-6" />
                                )}
                            </div>
                        ) : (
                            <div
                                onClick={triggerCoverImageInput}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-6 w-full max-w-[200px] h-40 relative flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-brand-selected transition-colors"
                            >
                                <div className="absolute top-2 right-2 text-gray-400">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info size={16} />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-white text-black border border-gray-200 shadow-md max-w-[200px] text-xs">
                                                <p>Upload a cover image for the community.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>

                                <input
                                    type="file"
                                    ref={coverImageInputRef}
                                    onChange={handleCoverImageChange}
                                    accept="image/*, .jpg, .jpeg, .png"
                                    className="hidden"
                                />

                                <div className="text-center text-gray-500 text-xs">
                                    Choose a file or<br />drag & drop it here
                                </div>
                                <Button type="button" variant="secondary" size="sm" className="rounded-[8px]">
                                    Browse
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="fm-action-bar pb-8">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="fm-action-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="fm-action-primary"
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommunityAdd;
