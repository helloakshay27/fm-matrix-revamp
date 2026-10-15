import { useEffect, useRef, useState } from "react";
import { TextField } from "@mui/material";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Users, Paperclip, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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
    <span className="fm-required-mark">*</span>
  </span>
);

// Description textarea — assetFieldStyles ki fixed height multiline pe nahi lagani
const multilineFieldStyles = {
  "& .MuiOutlinedInput-root": { height: "auto" },
};

const CommunityEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { detailViewed, updated, statusChanged } = useClubManagementEvents();
  const viewedRef = useRef(false);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [isToggling, setIsToggling] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    communityName: "",
    description: "",
    category: "play",
    coverImage: null as File | null,
    communityCategory: "open",
  });
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunity = async () => {
      if (!id || !baseUrl || !token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await axios.get(`https://${baseUrl}/communities/${id}.json`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const community = res.data?.community || res.data;
        setFormData({
          communityName: community?.name || "",
          description: community?.description || "",
          category: community?.category || "play",
          coverImage: null,
          communityCategory: community?.community_type || "open",
        });
        setIsActive(Boolean(community?.active));
        setCoverImagePreview(community?.icon || community?.cover_image || null);
        if (isCMContextActive() && !viewedRef.current) {
          viewedRef.current = true;
          detailViewed("Community", id, "community_edit");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.error || error?.message || "Failed to load community");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCommunity();
  }, [id, baseUrl, token]);

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
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setFormData((prev) => ({ ...prev, coverImage: file }));
    const reader = new FileReader();
    reader.onloadend = () => setCoverImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveCoverImage = () => {
    setFormData((prev) => ({ ...prev, coverImage: null }));
    setCoverImagePreview(null);
  };

  const validateForm = () => {
    if (!formData.communityName.trim()) {
      toast.error("Community Name is required");
      return false;
    }
    if (!formData.coverImage && !coverImagePreview) {
      toast.error("Cover Image is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!id || !baseUrl || !token) {
      toast.error("Missing configuration");
      return;
    }
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("community[name]", formData.communityName);
      fd.append("community[description]", formData.description);
      fd.append("community[category]", formData.category);
      fd.append("community[community_type]", formData.communityCategory);
      if (formData.coverImage) {
        fd.append("community[attachment]", formData.coverImage);
      }

      await axios.put(`https://${baseUrl}/communities/${id}.json`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Community updated successfully");
      if (isCMContextActive()) {
        updated("Community", id, "community_edit", { name: formData.communityName });
      }
      navigate(-1);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || error?.message || "Failed to update community");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: number, currentActive: boolean) => {
    const newActive = !currentActive;
    setIsToggling(id);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('community[active]', newActive ? 'true' : 'false');

      await axios.put(
        `https://${baseUrl}/communities/${id}.json`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      setIsActive(newActive);
      toast.success(`Community ${newActive ? 'activated' : 'deactivated'} successfully`);
      if (isCMContextActive()) {
        statusChanged("Community", id, { active: newActive, screen: "community_edit" });
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to update community status");
    } finally {
      setIsToggling(null);
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
          <span className="text-gray-900 font-medium">Edit Community</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">EDIT COMMUNITY</h1>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Community Details */}
        <FormSection
          title="COMMUNITY DETAILS"
          icon={Users}
          headerActions={
            <div className="flex items-center gap-2">
              <Switch
                id="community-status"
                checked={isActive}
                onCheckedChange={() => handleStatusChange(Number(id), isActive)}
                disabled={isToggling === Number(id) || isLoading}
              />
              <Label htmlFor="community-status" className="text-sm font-medium text-gray-900 cursor-pointer">
                {isActive ? "Active" : "Inactive"}
              </Label>
            </div>
          }
        >
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
                disabled={isLoading}
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
              disabled={isLoading}
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
            uploadText={coverImagePreview ? "Change Image" : "Upload Image"}
            emptyText={coverImagePreview ? "Current image" : "No image chosen"}
            accept="image/*"
            files={formData.coverImage ? [formData.coverImage] : []}
            onFilesSelected={(files) => handleCoverImageSelect(files[0])}
            onRemove={handleRemoveCoverImage}
            disabled={isLoading}
          />
          {coverImagePreview && (
            <div className="relative inline-block mt-4">
              <img
                src={coverImagePreview}
                alt="Cover Preview"
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={handleRemoveCoverImage}
                aria-label="Remove cover image"
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </FormSection>

        <FormActionBar
          onCancel={() => navigate(-1)}
          onSubmit={handleSubmit}
          submitLabel="Update"
          isSubmitting={isSubmitting || isLoading}
        />
      </div>
    </div>
  );
};

export default CommunityEdit;
