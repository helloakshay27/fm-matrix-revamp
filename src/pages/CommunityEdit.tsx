import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { FileText, File, Info, XCircle, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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

const CommunityEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const coverImageInputRef = useRef<HTMLInputElement>(null);
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

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        if (coverImageInputRef.current) {
          coverImageInputRef.current.value = "";
        }
        return;
      }
      setFormData((prev) => ({ ...prev, coverImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => setCoverImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, coverImage: null }));
      setCoverImagePreview(null);
    }
  };

  const triggerCoverImageInput = () => {
    coverImageInputRef.current?.click();
  };

  const handleRemoveCoverImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData((prev) => ({ ...prev, coverImage: null }));
    setCoverImagePreview(null);
    if (coverImageInputRef.current) coverImageInputRef.current.value = "";
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
    <div className="p-6 mx-auto bg-white min-h-screen">
      <Button variant="ghost" onClick={() => navigate(-1)} className="p-0 mb-4 hover:bg-transparent">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="space-y-6">
        {/* Details Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between gap-3 px-6 pt-6 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-gray-100 text-gray-500 shrink-0">
                <FileText className="w-[18px] h-[18px]" />
              </div>
              <h3 className="text-sm font-semibold uppercase text-[#1A1A1A]">Details</h3>
            </div>
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
          </div>

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
          <div className="flex items-center gap-3 px-6 pt-6 pb-3">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-gray-100 text-gray-500 shrink-0">
              <File className="w-[18px] h-[18px]" />
            </div>
            <h3 className="text-sm font-semibold uppercase text-[#1A1A1A]">Attachment</h3>
          </div>

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
            disabled={isSubmitting || isLoading}
            className="fm-action-primary"
          >
            {isSubmitting ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityEdit;
