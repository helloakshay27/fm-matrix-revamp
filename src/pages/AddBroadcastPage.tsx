import { useState, useRef, useEffect } from "react";
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileText, Share2, File, Info, XCircle, Pencil, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { toast } from "sonner";
import { createBroadcast } from "@/store/slices/broadcastSlice";
import axios from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

export const AddBroadcastPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    expiryDate: "",
    description: "",
    markImportant: "no",
    showOnHomeScreen: "no",
    visibleAfterExpire: "no",
    shareWith: "all",
    shareWithCommunities: "no",
    attachment: null as File | null,
    coverImage: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  // Tech Park Modal State
  const [isTechParkModalOpen, setIsTechParkModalOpen] = useState(false);
  const [techParks, setTechParks] = useState<any[]>([]);
  const [selectedTechParks, setSelectedTechParks] = useState<number[]>([]);
  const [isLoadingTechParks, setIsLoadingTechParks] = useState(false);

  // Community Selection State
  const [selectedCommunities, setSelectedCommunities] = useState<number[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);

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

  useEffect(() => {
    fetchTechParks();

    // Restore form data from localStorage if exists
    const savedTitle = localStorage.getItem('title');
    const savedDescription = localStorage.getItem('description');
    const savedExpiryDate = localStorage.getItem('expiryDate');
    const savedMarkImportant = localStorage.getItem('markImportant');
    const savedShowOnHomeScreen = localStorage.getItem('showOnHomeScreen');
    const savedVisibleAfterExpire = localStorage.getItem('visibleAfterExpire');
    const savedShareWith = localStorage.getItem('shareWith');
    const savedSelectedTechParks = localStorage.getItem('selectedTechParks');

    // If any saved data exists, restore it
    if (savedTitle || savedDescription || savedExpiryDate) {
      setFormData(prev => ({
        ...prev,
        title: savedTitle || prev.title,
        description: savedDescription || prev.description,
        expiryDate: savedExpiryDate || prev.expiryDate,
        markImportant: savedMarkImportant || prev.markImportant,
        showOnHomeScreen: savedShowOnHomeScreen || prev.showOnHomeScreen,
        visibleAfterExpire: savedVisibleAfterExpire || prev.visibleAfterExpire,
        shareWith: savedShareWith || prev.shareWith,
      }));
    }

    // Restore selected tech parks
    if (savedSelectedTechParks) {
      try {
        const parsedTechParks = JSON.parse(savedSelectedTechParks);
        setSelectedTechParks(parsedTechParks);
      } catch (error) {
        console.error('Error parsing saved tech parks:', error);
      }
    }

    localStorage.removeItem('title');
    localStorage.removeItem('description');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('markImportant');
    localStorage.removeItem('showOnHomeScreen');
    localStorage.removeItem('visibleAfterExpire');
    localStorage.removeItem('shareWith');
    localStorage.removeItem('selectedTechParks');

    // Check if returning from community selection
    const savedCommunities = localStorage.getItem('selectedCommunityIds');
    if (savedCommunities) {
      const communityIds = JSON.parse(savedCommunities).map((id: any) => typeof id === 'string' ? parseInt(id, 10) : id);
      setSelectedCommunities(communityIds);

      if (communityIds.length > 0) {
        setFormData(prev => ({ ...prev, shareWithCommunities: 'yes' }));
      }

      localStorage.removeItem('selectedCommunityIds');
    }

    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const response = await axios.get(`https://${baseUrl}/communities.json`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCommunities(response.data.communities || []);
    } catch (error) {
      console.error("Failed to fetch communities", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "shareWith" && value === "individual") {
      setIsTechParkModalOpen(true);
    }
    if (name === "shareWithCommunities" && value === "yes") {
      localStorage.setItem('title', formData.title);
      localStorage.setItem('description', formData.description);
      localStorage.setItem('expiryDate', formData.expiryDate);
      localStorage.setItem('markImportant', formData.markImportant);
      localStorage.setItem('showOnHomeScreen', formData.showOnHomeScreen);
      localStorage.setItem('visibleAfterExpire', formData.visibleAfterExpire);
      localStorage.setItem('shareWith', formData.shareWith);
      localStorage.setItem('selectedTechParks', JSON.stringify(selectedTechParks));
      navigate('/pulse/community?mode=selection&from=add');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        attachment: file,
      }));
      // Create preview for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null); // Or set a generic file icon
      }
    }
  };

  const triggerFileInput = () => {
    attachmentInputRef.current?.click();
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      attachment: null,
    }));
    setImagePreview(null);
    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = "";
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        coverImage: file,
      }));
      // Create preview for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCoverImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setCoverImagePreview(null);
      }
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
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!formData.expiryDate) {
      toast.error("Expiry Date is required");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (formData.description.length > 200) {
      toast.error("Description cannot exceed 200 characters");
      return false;
    }
    if (formData.shareWith === 'individual' && selectedTechParks.length === 0) {
      toast.error("Please select at least one Tech Park");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("noticeboard[notice_heading]", formData.title);
      formDataToSend.append("noticeboard[expire_time]", `${formData.expiryDate}T23:59:59`);
      formDataToSend.append("noticeboard[notice_text]", formData.description);

      // Mapping new fields to probable backend keys
      formDataToSend.append("noticeboard[is_important]", formData.markImportant === "yes" ? "1" : "0");
      formDataToSend.append("noticeboard[show_on_home_screen]", formData.showOnHomeScreen === "yes" ? "1" : "0");
      formDataToSend.append("noticeboard[flag_expire]", formData.visibleAfterExpire === "yes" ? "1" : "0");

      formDataToSend.append("noticeboard[shared]", formData.shareWith === "all" ? "2" : "1"); // 2 for all, 1 for specific?
      formDataToSend.append("noticeboard[shared_community]", formData.shareWithCommunities === "yes" ? "1" : "0");

      formDataToSend.append("noticeboard[of_atype]", "Pms::Site");
      formDataToSend.append("noticeboard[of_atype_id]", localStorage.getItem("selectedSiteId") || "");
      formDataToSend.append("noticeboard[publish]", "1");
      formDataToSend.append("noticeboard[active]", "1");

      if (formData.shareWith === 'individual') {
        selectedTechParks.forEach(id => {
          formDataToSend.append("site_ids[]", id.toString());
        });
      } else {
        techParks.forEach(techPark => {
          formDataToSend.append("site_ids[]", techPark.id.toString());
        });
      }

      // Add selected community IDs if communities are selected
      if (formData.shareWithCommunities === 'yes' && selectedCommunities.length > 0) {
        selectedCommunities.forEach(id => {
          formDataToSend.append("noticeboard[community_ids][]", id.toString());
        });
      }

      if (formData.attachment) {
        formDataToSend.append("documents[]", formData.attachment);
      }

      if (formData.coverImage) {
        formDataToSend.append("cover_image", formData.coverImage);
      }

      await dispatch(createBroadcast({ data: formDataToSend, baseUrl, token })).unwrap();

      // Clean up localStorage after successful submission
      localStorage.removeItem('title');
      localStorage.removeItem('description');
      localStorage.removeItem('expiryDate');
      localStorage.removeItem('markImportant');
      localStorage.removeItem('showOnHomeScreen');
      localStorage.removeItem('visibleAfterExpire');
      localStorage.removeItem('shareWith');
      localStorage.removeItem('selectedTechParks');
      localStorage.removeItem('selectedCommunityIds');

      toast.success("Notice created successfully");
      navigate("/pulse/notices");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Failed to create notice");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:px-8 py-6 bg-white min-h-screen">
      <Button
        variant="ghost"
        onClick={() => navigate("/pulse/notices")}
        className="p-0 mb-4 hover:bg-transparent"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <div className="space-y-6">
        {/* Notice Details Section */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#F6F4EE] p-4 flex items-center gap-3 border-b border-gray-200">
            <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
              <FileText size={16} />
            </div>
            <span className="font-semibold text-lg text-gray-800">Notice Details</span>
          </div>
          <div className="p-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col gap-1.5">
                <TextField
                  label={<>Title<span className="text-[#C72030]">*</span></>}
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter Title (Max 25 Character)"
                  inputProps={{ maxLength: 25 }}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#FAFAFA',
                      '&.Mui-focused fieldset': {
                        borderColor: '#C72030',
                      },
                    },
                  }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <TextField
                  label={<>Expiry Date<span className="text-[#C72030]">*</span></>}
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="dd/mm/yyyy"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#FAFAFA',
                      '&.Mui-focused fieldset': {
                        borderColor: '#C72030',
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="mb-2">
              <TextField
                label={<>Notice Description<span className="text-[#C72030]">*</span></>}
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter Description (Max 200 Character)"
                multiline
                rows={4}
                inputProps={{ maxLength: 200 }}
                fullWidth
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
            </div>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-3">
                <Label className="text-sm text-gray-700 whitespace-nowrap">
                  Show as Pop<span className="text-red-500">*</span>:
                </Label>
                <RadioGroup
                  row
                  name="markImportant"
                  value={formData.markImportant}
                  onChange={(e) => handleRadioChange("markImportant", e.target.value)}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' }, '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                    label={<span className="text-sm text-gray-600">Yes</span>}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' }, '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                    label={<span className="text-sm text-gray-600">No</span>}
                  />
                </RadioGroup>
              </div>

              <div className="flex items-center gap-3">
                <Label className="text-sm text-gray-700 whitespace-nowrap">
                  Show On Home Screen<span className="text-red-500">*</span>:
                </Label>
                <RadioGroup
                  row
                  name="showOnHomeScreen"
                  value={formData.showOnHomeScreen}
                  onChange={(e) => handleRadioChange("showOnHomeScreen", e.target.value)}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' }, '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                    label={<span className="text-sm text-gray-600">Yes</span>}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' }, '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                    label={<span className="text-sm text-gray-600">No</span>}
                  />
                </RadioGroup>
              </div>

              <div className="flex items-center gap-3">
                <Label className="text-sm text-gray-700 whitespace-nowrap">
                  Visible After Expire<span className="text-red-500">*</span>:
                </Label>
                <RadioGroup
                  row
                  name="visibleAfterExpire"
                  value={formData.visibleAfterExpire}
                  onChange={(e) => handleRadioChange("visibleAfterExpire", e.target.value)}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' }, '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                    label={<span className="text-sm text-gray-600">Yes</span>}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' }, '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                    label={<span className="text-sm text-gray-600">No</span>}
                  />
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#F6F4EE] p-4 flex items-center gap-3 border-b border-gray-200">
            <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
              <Share2 size={16} />
            </div>
            <span className="font-semibold text-lg text-gray-800">Share</span>
          </div>
          <div className="p-6 bg-white">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex items-center gap-4">
                <Label className="text-sm text-gray-700 whitespace-nowrap">
                  Share With<span className="text-red-500">*</span>:
                </Label>
                <RadioGroup
                  row
                  name="shareWith"
                  value={formData.shareWith}
                  onChange={(e) => handleRadioChange("shareWith", e.target.value)}
                  className="gap-2"
                >
                  <FormControlLabel
                    value="all"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' }, '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                    label={<span className="text-sm text-gray-600">All Tech Park</span>}
                  />
                  <FormControlLabel
                    value="individual"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' }, '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                    label={<span className="text-sm text-gray-600">Individual Tech Park</span>}
                  />
                </RadioGroup>
              </div>

              <div className="flex items-center gap-4">
                <Label className="text-sm text-gray-700 whitespace-nowrap">
                  Share With Communities<span className="text-red-500">*</span>:
                </Label>
                <RadioGroup
                  row
                  name="shareWithCommunities"
                  value={formData.shareWithCommunities}
                  onChange={(e) => handleRadioChange("shareWithCommunities", e.target.value)}
                  className="gap-2"
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' }, '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                    label={<span className="text-sm text-gray-600">Yes</span>}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' }, '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                    label={<span className="text-sm text-gray-600">No</span>}
                  />
                </RadioGroup>
              </div>
            </div>

            {formData.shareWith === "individual" && selectedTechParks.length > 0 && (
              <div className="mt-4 flex items-center gap-2 text-[#C72030] text-sm font-medium">
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
                  className="hover:text-red-700 transition-colors"
                >
                  <Pencil size={14} />
                </button>
              </div>
            )}

            {formData.shareWithCommunities === "yes" && selectedCommunities.length > 0 && (
              <div className="mt-4 flex items-center gap-2 text-[#C72030] text-sm font-medium">
                <span>
                  {communities
                    .filter(community => selectedCommunities.includes(community.id))
                    .map(community => community.name)
                    .join(", ")}
                  .
                </span>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('title', formData.title);
                    localStorage.setItem('description', formData.description);
                    localStorage.setItem('expiryDate', formData.expiryDate);
                    localStorage.setItem('markImportant', formData.markImportant);
                    localStorage.setItem('showOnHomeScreen', formData.showOnHomeScreen);
                    localStorage.setItem('visibleAfterExpire', formData.visibleAfterExpire);
                    localStorage.setItem('shareWith', formData.shareWith);
                    localStorage.setItem('selectedTechParks', JSON.stringify(selectedTechParks));
                    navigate('/pulse/community?mode=selection&from=add')
                  }}
                  className="hover:text-red-700 transition-colors"
                >
                  <Pencil size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Attachment Section */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#F6F4EE] p-4 flex items-center gap-3 border-b border-gray-200">
            <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
              <File size={16} />
            </div>
            <span className="font-semibold text-lg text-gray-800">Attachment</span>
          </div>
          <div className="p-6 bg-white">
            <div className={`grid ${formData.showOnHomeScreen === "yes" ? "grid-cols-1 md:grid-cols-5" : "grid-cols-1"} gap-6`}>
              {/* Upload Document */}
              <div>
                <Label className="text-sm font-bold text-gray-700 mb-4 block">
                  Upload Document<span className="text-red-500">*</span>
                </Label>

                {formData.attachment ? (
                  <div className="relative border-2 border-dashed border-gray-400 rounded-lg w-full max-w-[200px] h-40 flex items-center justify-center bg-white">
                    <span className="absolute top-2 left-3 text-sm font-medium text-gray-700 truncate max-w-[80%]">
                      {formData.attachment.name}
                    </span>
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <XCircle size={20} />
                    </button>
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-contain mt-6"
                      />
                    ) : (
                      <File size={40} className="text-gray-400 mt-6" />
                    )}
                  </div>
                ) : (
                  <div
                    onClick={triggerFileInput}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 w-full max-w-[200px] h-40 relative flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="absolute top-2 right-2 text-gray-400">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info size={18} />
                          </TooltipTrigger>
                          <TooltipContent className="bg-white text-black border border-gray-200 shadow-md max-w-[200px] text-xs">
                            <p>Upload a document or image.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <input
                      type="file"
                      ref={attachmentInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div className="text-center text-gray-500 text-sm">
                      Choose a file or<br />drag & drop it here
                    </div>
                    <Button
                      type="button"
                      className="bg-[#EBEBEB] text-[#C72030] hover:bg-[#dcdcdc] border-none font-medium px-8"
                    >
                      Browse
                    </Button>
                  </div>
                )}
              </div>

              {/* Upload Cover Image - Only shown when showOnHomeScreen is "yes" */}
              {formData.showOnHomeScreen === "yes" && (
                <div>
                  <Label className="text-sm font-bold text-gray-700 mb-4 block">
                    Upload Cover Image<span className="text-red-500">*</span>
                  </Label>

                  {formData.coverImage ? (
                    <div className="relative border-2 border-dashed border-gray-400 rounded-lg w-full max-w-[200px] h-40 flex items-center justify-center bg-white">
                      <span className="absolute top-2 left-3 text-sm font-medium text-gray-700 truncate max-w-[80%]">
                        {formData.coverImage.name}
                      </span>
                      <button
                        onClick={handleRemoveCoverImage}
                        className="absolute top-2 right-2 text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <XCircle size={20} />
                      </button>
                      {coverImagePreview ? (
                        <img
                          src={coverImagePreview}
                          alt="Cover Preview"
                          className="w-20 h-20 object-contain mt-6"
                        />
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
                              <p>Upload a cover image for home screen display.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <input
                        type="file"
                        ref={coverImageInputRef}
                        onChange={handleCoverImageChange}
                        accept="image/*"
                        className="hidden"
                      />

                      <div className="text-center text-gray-500 text-sm">
                        Choose a file or<br />drag & drop it here
                      </div>
                      <Button
                        type="button"
                        className="bg-[#EBEBEB] text-[#C72030] hover:bg-[#dcdcdc] border-none font-medium px-8"
                      >
                        Browse
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8 pb-8">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="disabled:!bg-[#DF808B] !bg-[#C72030] hover:bg-[#d0606e] !text-white min-w-[150px] h-10"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
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
                    className="mt-1 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
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