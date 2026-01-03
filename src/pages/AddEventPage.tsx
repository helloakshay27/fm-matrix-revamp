import React, { useEffect, useState, useRef } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar, Share2, File, Info, XCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAppDispatch } from "@/store/hooks";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { fetchUserGroups } from "@/store/slices/userGroupSlice";
import { createEvent } from "@/store/slices/eventSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

export const AddEventPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    eventName: "",
    eventCategory: "",
    amountPerPerson: "",
    fromDate: "",
    toDate: "",
    eventTime: "",
    eventLocation: "",
    memberCapacity: "",
    perMemberLimit: "",
    pulseCategory: "play",
    rsvp: "yes",
    showOnHomeScreen: "no",
    eventDescription: "",
    shareWith: "all",
    shareWithCommunities: "no",
    attachment: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
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
        setImagePreview(null);
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

  const validateForm = () => {
    if (!formData.eventName.trim()) {
      toast.error("Event Name is required");
      return false;
    }
    if (!formData.eventCategory) {
      toast.error("Event Category is required");
      return false;
    }
    if (!formData.fromDate) {
      toast.error("From Date is required");
      return false;
    }
    if (!formData.toDate) {
      toast.error("To Date is required");
      return false;
    }
    if (!formData.eventTime) {
      toast.error("Event Time is required");
      return false;
    }
    if (!formData.eventLocation.trim()) {
      toast.error("Event Location is required");
      return false;
    }
    if (!formData.memberCapacity) {
      toast.error("Member Capacity is required");
      return false;
    }
    if (!formData.eventDescription.trim()) {
      toast.error("Event Description is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();

      formDataToSend.append('event[event_name]', formData.eventName);
      formDataToSend.append("event[event_at]", formData.eventLocation);
      formDataToSend.append("event[from_time]", `${formData.fromDate}T${formData.eventTime}`);
      formDataToSend.append("event[to_time]", `${formData.toDate}T${formData.eventTime}`);
      formDataToSend.append("event[description]", formData.eventDescription);
      formDataToSend.append("event[rsvp_action]", formData.rsvp === "yes" ? "1" : "0");
      formDataToSend.append("event[capacity]", formData.memberCapacity);
      formDataToSend.append('event[of_phase]', 'pms');
      formDataToSend.append('event[of_atype]', 'Pms::Site');
      formDataToSend.append('event[of_atype_id]', localStorage.getItem("selectedSiteId") || "");
      formDataToSend.append("event[is_important]", isActive ? "true" : "false");

      if (formData.attachment) {
        formDataToSend.append("event[documents][]", formData.attachment);
      }

      await dispatch(createEvent({ baseUrl, token, data: formDataToSend })).unwrap();

      toast.success("Event created successfully");
      navigate(-1);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:px-8 py-6 bg-white min-h-screen">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="p-0 mb-4 hover:bg-transparent"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="space-y-6">
        {/* Event Detail Section */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#F6F4EE] p-4 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                <Calendar size={16} />
              </div>
              <span className="font-semibold text-lg text-gray-800">Event Detail</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium text-gray-700">{isActive ? 'Active' : 'Inactive'}</span>
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </div>

          <div className="p-6 bg-white">
            {/* Row 1: Event Name, Event Category, Event Amount Per Person */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col gap-1.5">
                <TextField
                  label={<>Event Name<span className="text-[#C72030]">*</span></>}
                  id="eventName"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  placeholder="Enter Title"
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
                <FormControl fullWidth size="small">
                  <InputLabel shrink>Event Category<span className="text-[#C72030]">*</span></InputLabel>
                  <MuiSelect
                    name="eventCategory"
                    value={formData.eventCategory}
                    onChange={(e) => handleSelectChange("eventCategory", e.target.value)}
                    label="Event Category*"
                    displayEmpty
                    sx={{
                      backgroundColor: '#FAFAFA',
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#C72030',
                      },
                    }}
                  >
                    <MenuItem value="" disabled>Select event category...</MenuItem>
                    <MenuItem value="sports">Sports</MenuItem>
                    <MenuItem value="cultural">Cultural</MenuItem>
                    <MenuItem value="social">Social</MenuItem>
                    <MenuItem value="workshop">Workshop</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>

              <div className="flex flex-col gap-1.5">
                <TextField
                  label={<>Event Amount Per Person<span className="text-[#C72030]">*</span></>}
                  id="amountPerPerson"
                  name="amountPerPerson"
                  type="number"
                  value={formData.amountPerPerson}
                  onChange={handleInputChange}
                  placeholder="Enter Amount"
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

            {/* Row 2: From Date, To Date, Event Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col gap-1.5">
                <TextField
                  label={<>From Date<span className="text-[#C72030]">*</span></>}
                  id="fromDate"
                  name="fromDate"
                  type="date"
                  value={formData.fromDate}
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

              <div className="flex flex-col gap-1.5">
                <TextField
                  label={<>To Date<span className="text-[#C72030]">*</span></>}
                  id="toDate"
                  name="toDate"
                  type="date"
                  value={formData.toDate}
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

              <div className="flex flex-col gap-1.5">
                <TextField
                  label={<>Event Time<span className="text-[#C72030]">*</span></>}
                  id="eventTime"
                  name="eventTime"
                  type="time"
                  value={formData.eventTime}
                  onChange={handleInputChange}
                  placeholder="hh:mm"
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

            {/* Row 3: Event Location, Member Capacity, Per Member Limit */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col gap-1.5">
                <TextField
                  label={<>Event Location<span className="text-[#C72030]">*</span></>}
                  id="eventLocation"
                  name="eventLocation"
                  value={formData.eventLocation}
                  onChange={handleInputChange}
                  placeholder="Enter location..."
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
                  label={<>Member Capacity<span className="text-[#C72030]">*</span></>}
                  id="memberCapacity"
                  name="memberCapacity"
                  type="number"
                  value={formData.memberCapacity}
                  onChange={handleInputChange}
                  placeholder="Enter Capacity"
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
                  label={<>Per Member Limit<span className="text-[#C72030]">*</span></>}
                  id="perMemberLimit"
                  name="perMemberLimit"
                  type="number"
                  value={formData.perMemberLimit}
                  onChange={handleInputChange}
                  placeholder="Enter Limit"
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

            {/* Radio Groups Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-700 whitespace-nowrap">
                  Pulse Category:
                </Label>
                <RadioGroup
                  row
                  name="pulseCategory"
                  value={formData.pulseCategory}
                  onChange={(e) => handleRadioChange("pulseCategory", e.target.value)}
                  sx={{
                    gap: 0,
                    flexWrap: "nowrap"
                  }}
                >
                  <FormControlLabel
                    value="play"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' }, '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                    label={<span className="text-sm text-gray-600">Play</span>}
                  />
                  <FormControlLabel
                    value="panache"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' }, '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                    label={<span className="text-sm text-gray-600">Panache</span>}
                  />
                  <FormControlLabel
                    value="persuit"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' }, '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                    label={<span className="text-sm text-gray-600">Persuit</span>}
                  />
                </RadioGroup>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-700 whitespace-nowrap">
                  RSVP:
                </Label>
                <RadioGroup
                  row
                  name="rsvp"
                  value={formData.rsvp}
                  onChange={(e) => handleRadioChange("rsvp", e.target.value)}
                  sx={{ gap: 0 }}
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

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-700 whitespace-nowrap">
                  Show On Home Screen:
                </Label>
                <RadioGroup
                  row
                  name="showOnHomeScreen"
                  value={formData.showOnHomeScreen}
                  onChange={(e) => handleRadioChange("showOnHomeScreen", e.target.value)}
                  sx={{ gap: 0 }}
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

            {/* Event Description */}
            <div>
              <div className="relative w-full mt-4">
                {/* Label */}
                <label
                  className="
      absolute
      -top-2
      left-3
      bg-white
      px-1
      text-sm
      text-black
      pointer-events-none
    "
                >
                  Event Description<span className="text-[#C72030]">*</span>
                </label>

                {/* Textarea */}
                <textarea
                  name="eventDescription"
                  value={formData.eventDescription}
                  onChange={handleInputChange}
                  placeholder="Enter Description"
                  rows={8}
                  className="
      w-full
      rounded-[5px]
      border
      border-gray-300
      p-4
      text-sm
      outline-none
      resize-none
    "
                />
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
                  Share With:
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
                  Share With Communities:
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
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label className="text-sm font-bold text-gray-700 mb-4 block">
                  Upload Document
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
    </div>
  );
};