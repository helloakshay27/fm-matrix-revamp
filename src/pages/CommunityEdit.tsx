import { useEffect, useRef, useState } from "react";
import { TextField, RadioGroup, FormControlLabel, Radio, Switch } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

const CommunityEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const coverImageInputRef = useRef<HTMLInputElement>(null);

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
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to update community status");
    } finally {
      setIsToggling(null);
    }
  };

  return (
    <div className="p-4 md:px-8 py-6 bg-white min-h-screen">
      <Button variant="ghost" onClick={() => navigate(-1)} className="p-0 mb-4 hover:bg-transparent">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="space-y-6">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#F6F4EE] p-4 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                <FileText size={16} />
              </div>
              <span className="font-semibold text-lg text-gray-800">Details</span>
            </div>
            <div className="flex items-center">
              <Switch
                checked={isActive}
                onChange={() => handleStatusChange(Number(id), isActive)}
                disabled={isToggling === Number(id)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#04A231',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#04A231',
                  },
                  '& .MuiSwitch-switchBase:not(.Mui-checked)': {
                    color: '#C72030',
                  },
                  '& .MuiSwitch-switchBase:not(.Mui-checked) + .MuiSwitch-track': {
                    backgroundColor: 'rgba(199, 32, 48, 0.5)',
                  },
                }}
              />
              <span className="ml-2 text-sm font-semibold">{isActive ? 'Active' : 'Inactive'}</span>
            </div>
          </div>

          <div className="p-6 bg-white">
            {/* Community Name + Pulse Category */}
            <div className="mb-6 flex items-center justify-between gap-5">
              {/* Community Name */}
              <div className="w-[320px]">
                <TextField
                  label={
                    <>
                      Community Name<span className="text-[#C72030]">*</span>
                    </>
                  }
                  id="communityName"
                  name="communityName"
                  value={formData.communityName}
                  onChange={handleInputChange}
                  placeholder="Enter Community Name"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#FAFAFA",
                      "&.Mui-focused fieldset": {
                        borderColor: "#C72030",
                      },
                    },
                  }}
                />
              </div>

              {/* Pulse Category */}
              <div className="flex items-center gap-1">
                <span className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">
                  Pulse Category:
                </span>
                <RadioGroup
                  row
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="flex flex-wrap items-center gap-y-1 text-sm"
                >
                  <FormControlLabel
                    value="play"
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "#C72030",
                          "&.Mui-checked": { color: "#C72030" },
                        }}
                      />
                    }
                    label={<span className="text-[12px] text-gray-900">Play</span>}
                  />
                  <FormControlLabel
                    value="panasche"
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "#C72030",
                          "&.Mui-checked": { color: "#C72030" },
                        }}
                      />
                    }
                    label={<span className="text-[12px] text-gray-900">Panasche</span>}
                  />
                  <FormControlLabel
                    value="persuit"
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "#C72030",
                          "&.Mui-checked": { color: "#C72030" },
                        }}
                      />
                    }
                    label={<span className="text-[12px] text-gray-900">Persuit</span>}
                  />
                </RadioGroup>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">
                  Community Category:
                </span>
                <RadioGroup
                  row
                  name="communityCategory"
                  value={formData.communityCategory}
                  onChange={handleInputChange}
                  className="flex flex-wrap items-center gap-y-1 text-sm"
                >
                  <FormControlLabel
                    value="open"
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "#C72030",
                          "&.Mui-checked": { color: "#C72030" },
                        }}
                      />
                    }
                    label={<span className="text-[12px] text-gray-900">Open to all</span>}
                  />
                  <FormControlLabel
                    value="requestable"
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "#C72030",
                          "&.Mui-checked": { color: "#C72030" },
                        }}
                      />
                    }
                    label={<span className="text-[12px] text-gray-900">Requestable</span>}
                  />
                </RadioGroup>
              </div>
            </div>

            <div>
              <div className="relative w-full">
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-black pointer-events-none">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter Description"
                  rows={8}
                  className="w-full rounded-[5px] border border-gray-300 p-4 text-sm outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#F6F4EE] p-4 flex items-center gap-3 border-b border-gray-200">
            <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
              <File size={16} />
            </div>
            <span className="font-semibold text-lg text-gray-800">Attachment</span>
          </div>
          <div className="p-6 bg-white">
            <Label className="text-sm font-bold text-gray-700 mb-4 block">
              Upload Cover Image<span className="text-red-500">*</span>
            </Label>

            {formData.coverImage || coverImagePreview ? (
              <div className="relative border-2 border-dashed border-gray-400 rounded-lg w-full max-w-[200px] h-40 flex items-center justify-center bg-white">
                <span className="absolute top-2 left-3 text-sm font-medium text-gray-700 truncate max-w-[80%]">
                  {formData.coverImage?.name || "Cover Image"}
                </span>
                <button
                  onClick={handleRemoveCoverImage}
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <XCircle size={20} />
                </button>
                {coverImagePreview ? (
                  <img src={coverImagePreview} alt="Cover Preview" className="w-20 h-20 object-contain mt-6" />
                ) : (
                  <File size={40} className="text-gray-400 mt-6" />
                )}
              </div>
            ) : (
              <div
                onClick={triggerCoverImageInput}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 w-full max-w-[200px] h-40 relative flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="absolute top-2 right-2 text-gray-400">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={18} />
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

                <div className="text-center text-gray-500 text-sm">
                  Choose a file or<br />drag & drop it here
                </div>
                <Button type="button" className="bg-[#EBEBEB] text-[#C72030] hover:bg-[#dcdcdc] border-none font-medium px-8">
                  Browse
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8 pb-8">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading}
            className="disabled:!bg-[#DF808B] !bg-[#C72030] hover:bg-[#d0606e] !text-white min-w-[150px] h-10"
          >
            {isSubmitting ? "Submitting..." : "Update"}
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white min-w-[150px] h-10"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityEdit;
