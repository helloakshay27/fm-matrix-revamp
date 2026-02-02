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
  Switch as MuiSwitch,
} from "@mui/material";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar, Share2, File, Info, XCircle, ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAppDispatch } from "@/store/hooks";
import { fetchEventById, updateEvent } from "@/store/slices/eventSlice";
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
import axios from "axios";

export const EditEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "",
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
    approvalRequired: "no",
    eventDescription: "",
    shareWith: "all",
    shareWithCommunities: "no",
    attachment: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [existingAttachments, setExistingAttachments] = useState<any[]>([]);

  // Tech Park Modal State
  const [isTechParkModalOpen, setIsTechParkModalOpen] = useState(false);
  const [techParks, setTechParks] = useState<any[]>([]);
  const [selectedTechParks, setSelectedTechParks] = useState<number[]>([]);
  const [isLoadingTechParks, setIsLoadingTechParks] = useState(false);

  // Community Selection State
  const [selectedCommunities, setSelectedCommunities] = useState<number[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) return;

      // Check if we have restored data first
      const savedEventName = localStorage.getItem('eventName');

      if (savedEventName) {
        // Restore from localStorage
        setFormData(prev => ({
          ...prev,
          eventName: savedEventName,
          eventType: localStorage.getItem('eventType') || prev.eventType,
          amountPerPerson: localStorage.getItem('amountPerPerson') || prev.amountPerPerson,
          fromDate: localStorage.getItem('fromDate') || prev.fromDate,
          toDate: localStorage.getItem('toDate') || prev.toDate,
          eventTime: localStorage.getItem('eventTime') || prev.eventTime,
          eventLocation: localStorage.getItem('eventLocation') || prev.eventLocation,
          memberCapacity: localStorage.getItem('memberCapacity') || prev.memberCapacity,
          perMemberLimit: localStorage.getItem('perMemberLimit') || prev.perMemberLimit,
          pulseCategory: localStorage.getItem('pulseCategory') || prev.pulseCategory,
          rsvp: localStorage.getItem('rsvp') || prev.rsvp,
          showOnHomeScreen: localStorage.getItem('showOnHomeScreen') || prev.showOnHomeScreen,
          approvalRequired: localStorage.getItem('approvalRequired') || prev.approvalRequired,
          eventDescription: localStorage.getItem('eventDescription') || prev.eventDescription,
          shareWith: localStorage.getItem('shareWith') || prev.shareWith,
        }));

        // Restore selected tech parks
        const savedSelectedTechParks = localStorage.getItem('selectedTechParks');
        if (savedSelectedTechParks) {
          try {
            setSelectedTechParks(JSON.parse(savedSelectedTechParks));
          } catch (error) {
            console.error('Error parsing saved tech parks:', error);
          }
        }

        // Cleanup localStorage
        [
          'eventName', 'eventType', 'amountPerPerson', 'fromDate', 'toDate',
          'eventTime', 'eventLocation', 'memberCapacity', 'perMemberLimit',
          'pulseCategory', 'rsvp', 'showOnHomeScreen', 'approvalRequired', 'eventDescription', 'shareWith',
          'selectedTechParks'
        ].forEach(key => localStorage.removeItem(key));

        // Also check for saved communities
        const savedCommunities = localStorage.getItem('selectedCommunityIds');
        if (savedCommunities) {
          const communityIds = JSON.parse(savedCommunities).map((id: any) => typeof id === 'string' ? parseInt(id, 10) : id);
          setSelectedCommunities(communityIds);
          if (communityIds.length > 0) {
            setFormData(prev => ({ ...prev, shareWithCommunities: 'yes' }));
          }
          localStorage.removeItem('selectedCommunityIds');
        }

        // We still need to fetch some details like isActive and existingAttachments that aren't in localStorage
        try {
          const event = await dispatch(fetchEventById({ id, baseUrl, token })).unwrap();
          setIsActive(event.active);
          if (event.documents && event.documents.length > 0) {
            setExistingAttachments([event.documents[event.documents.length - 1]]);
          } else {
            setExistingAttachments([]);
          }
        } catch (e) {
          console.error("Failed to fetch auxiliary details", e);
        }

      } else {
        // Normal fetch
        try {
          const event = await dispatch(fetchEventById({ id, baseUrl, token })).unwrap();

          const fromTime = event.from_time ? new Date(event.from_time) : null;
          const toTime = event.to_time ? new Date(event.to_time) : null;

          setFormData(prev => ({
            ...prev,
            eventName: event.event_name || "",
            eventLocation: event.event_at || "",
            eventDescription: event.description || "",
            fromDate: fromTime ? format(fromTime, "yyyy-MM-dd") : "",
            toDate: toTime ? format(toTime, "yyyy-MM-dd") : "",
            eventTime: fromTime ? format(fromTime, "HH:mm") : "",
            memberCapacity: event.capacity?.toString() || "",
            rsvp: event.rsvp_action === "1" ? "yes" : "no",
            amountPerPerson: event.amount_per_member || "",
            perMemberLimit: event.per_member_limit || "",
            pulseCategory: event.event_category || "play",
            eventType: event.is_paid ? "1" : "0",
            showOnHomeScreen: event.show_on_home === true ? "yes" : "no",
            approvalRequired: event.approval_required === true ? "yes" : "no",
            shareWith: event.share_with || "all",
            shareWithCommunities: (event.community_events && event.community_events.length > 0) ? "yes" : "no",
          }));

          if (event.shared_sites) {
            setSelectedTechParks(event.shared_sites.map((site: any) => site.id));
          }

          setIsActive(event.active);

          if (event.community_events) {
            setSelectedCommunities(event.community_events.map((ce: any) => ce.community_id));
          }

          if (event.documents && event.documents.length > 0) {
            setExistingAttachments([event.documents[event.documents.length - 1]]);
          } else {
            setExistingAttachments([]);
          }
        } catch (error) {
          console.error("Failed to fetch event details", error);
          toast.error("Failed to fetch event details");
        }
      }
    };

    fetchEventDetails();
    fetchCommunities();
    fetchTechParks();
  }, [id, dispatch, baseUrl, token]);

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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = async (checked: boolean) => {
    const newStatus = checked ? 1 : 0;

    // Store previous state for rollback
    const previousStatus = isActive;

    // Optimistic update
    setUpdatingStatus(true);
    setIsActive(checked);

    try {
      await dispatch(
        updateEvent({
          id,
          data: { event: { active: newStatus } },
          baseUrl,
          token,
        })
      ).unwrap();

      toast.success("Event status updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update event status");

      // Revert optimistic update on error
      setIsActive(previousStatus);
    } finally {
      setUpdatingStatus(false);
    }
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
      // Save form data to localStorage before navigation
      localStorage.setItem('eventName', formData.eventName);
      localStorage.setItem('eventType', formData.eventType);
      localStorage.setItem('amountPerPerson', formData.amountPerPerson);
      localStorage.setItem('fromDate', formData.fromDate);
      localStorage.setItem('toDate', formData.toDate);
      localStorage.setItem('eventTime', formData.eventTime);
      localStorage.setItem('eventLocation', formData.eventLocation);
      localStorage.setItem('memberCapacity', formData.memberCapacity);
      localStorage.setItem('perMemberLimit', formData.perMemberLimit);
      localStorage.setItem('pulseCategory', formData.pulseCategory);
      localStorage.setItem('rsvp', formData.rsvp);
      localStorage.setItem('showOnHomeScreen', formData.showOnHomeScreen);
      localStorage.setItem('approvalRequired', formData.approvalRequired);
      localStorage.setItem('eventDescription', formData.eventDescription);
      localStorage.setItem('shareWith', formData.shareWith);
      localStorage.setItem('selectedTechParks', JSON.stringify(selectedTechParks));
      navigate(`/pulse/community?mode=selection&from=edit-event&id=${id}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        attachment: file,
      }));
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

  const handleRemoveExistingAttachment = async (attachmentId: number) => {
    try {
      await axios.delete(`https://${baseUrl}/pms/admin/events/remove_attachment.json?attachment_id=${attachmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setExistingAttachments(prev => prev.filter(att => att.id !== attachmentId));
      toast.success("Attachment removed");
    } catch (error) {
      console.error("Failed to remove attachment", error);
      toast.error("Failed to remove attachment");
    }
  };

  const validateForm = () => {
    if (!formData.eventName.trim()) {
      toast.error("Event Name is required");
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

      formDataToSend.append('event[event_name]', formData.eventName);
      formDataToSend.append("event[amount_per_member]", formData.amountPerPerson);
      formDataToSend.append("event[from_time]", `${formData.fromDate}T${formData.eventTime}`);
      formDataToSend.append("event[to_time]", `${formData.toDate}T${formData.eventTime}`);
      formDataToSend.append("event[event_at]", formData.eventLocation);
      formDataToSend.append("event[capacity]", formData.memberCapacity);
      formDataToSend.append("event[per_member_limit]", formData.perMemberLimit);
      formDataToSend.append("event[event_category]", formData.pulseCategory);
      formDataToSend.append("event[is_paid]", formData.eventType);
      formDataToSend.append("event[rsvp_action]", formData.rsvp === "yes" ? "1" : "0");
      formDataToSend.append("event[show_on_home]", formData.showOnHomeScreen === "yes" ? "1" : "0");
      formDataToSend.append("event[approval_required]", formData.approvalRequired === "yes" ? "1" : "0");
      formDataToSend.append("event[description]", formData.eventDescription);
      formDataToSend.append('event[of_phase]', 'pms');
      formDataToSend.append('event[of_atype]', 'Pms::Site');
      formDataToSend.append('event[of_atype_id]', localStorage.getItem("selectedSiteId") || "");
      formDataToSend.append("event[share_with]", formData.shareWith);

      if (formData.shareWith === 'individual') {
        selectedTechParks.forEach(id => {
          formDataToSend.append("event[pms_site_ids][]", id.toString());
        });
      }

      if (formData.shareWithCommunities === 'yes' && selectedCommunities.length > 0) {
        selectedCommunities.forEach(id => {
          formDataToSend.append("event[community_ids][]", id.toString());
        });
      }

      if (formData.attachment) {
        formDataToSend.append("event[documents][]", formData.attachment);
      }

      await dispatch(updateEvent({ id: id!, baseUrl, token, data: formDataToSend })).unwrap();

      // Clean up localStorage after successful submission
      [
        'eventName', 'eventType', 'amountPerPerson', 'fromDate', 'toDate',
        'eventTime', 'eventLocation', 'memberCapacity', 'perMemberLimit',
        'pulseCategory', 'rsvp', 'showOnHomeScreen', 'approvalRequired', 'eventDescription', 'shareWith',
        'selectedTechParks', 'selectedCommunityIds'
      ].forEach(key => localStorage.removeItem(key));

      toast.success("Event updated successfully");
      navigate("/pulse/events");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Failed to update event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:px-8 py-6 bg-white min-h-screen">
      <Button
        variant="ghost"
        onClick={() => navigate("/pulse/events")}
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
              <span className="text-sm font-medium text-gray-700">{isActive ? 'Active' : 'Inactive'}</span>
              <MuiSwitch
                checked={isActive}
                onChange={(e) => handleStatusChange(e.target.checked)}
                disabled={updatingStatus}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase': {
                    color: '#ef4444',
                    '&.Mui-checked': {
                      color: '#22c55e',
                    },
                    '&.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#22c55e',
                    },
                  },
                  '& .MuiSwitch-track': {
                    backgroundColor: '#ef4444',
                  },
                }}
              />
            </div>
          </div>

          <div className="p-6 bg-white">
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
                  <InputLabel shrink>Event Type<span className="text-[#C72030]">*</span></InputLabel>
                  <MuiSelect
                    name="eventType"
                    value={formData.eventType}
                    onChange={(e) => handleSelectChange("eventType", e.target.value)}
                    label="Event Type*"
                    displayEmpty
                    sx={{
                      backgroundColor: '#FAFAFA',
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#C72030',
                      },
                    }}
                  >
                    <MenuItem value="" disabled>Select event type...</MenuItem>
                    <MenuItem value="1">Paid</MenuItem>
                    <MenuItem value="0">Complimentary</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>

              <div className="flex flex-col gap-1.5">
                <TextField
                  label={<>Event Amount Per Person</>}
                  id="amountPerPerson"
                  name="amountPerPerson"
                  type="number"
                  value={formData.amountPerPerson}
                  onChange={handleInputChange}
                  placeholder="Enter Amount"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  inputProps={{ min: 0 }}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === '+') {
                      e.preventDefault();
                    }
                  }}
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
                  inputProps={{
                    min: new Date().toISOString().split('T')[0],
                  }}
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
                  inputProps={{
                    min: formData.fromDate || new Date().toISOString().split('T')[0],
                  }}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
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
                  inputProps={{ min: 0 }}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === '+') {
                      e.preventDefault();
                    }
                  }}
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
                  inputProps={{ min: 0 }}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === '+') {
                      e.preventDefault();
                    }
                  }}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 mb-4">
              <div className="flex items-center gap-2">
                <Label className="text-[12px] text-gray-700 whitespace-nowrap">
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
                    label={<span className="text-[12px] text-gray-600">Play</span>}
                  />
                  <FormControlLabel
                    value="panasche"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' }, '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                    label={<span className="text-[12px] text-gray-600">Panasche</span>}
                  />
                  <FormControlLabel
                    value="persuit"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' }, '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                    label={<span className="text-[12px] text-gray-600">Persuit</span>}
                  />
                </RadioGroup>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-[12px] text-gray-700 whitespace-nowrap">
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
                    label={<span className="text-[12px] text-gray-600">Yes</span>}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' }, '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                    label={<span className="text-[12px] text-gray-600">No</span>}
                  />
                </RadioGroup>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-[12px] text-gray-700 whitespace-nowrap">
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
                    label={<span className="text-[12px] text-gray-600">Yes</span>}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' }, '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                    label={<span className="text-[12px] text-gray-600">No</span>}
                  />
                </RadioGroup>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-[12px] text-gray-700 whitespace-nowrap">
                  Approval Required:
                </Label>
                <RadioGroup
                  row
                  name="approvalRequired"
                  value={formData.approvalRequired}
                  onChange={(e) => handleRadioChange("approvalRequired", e.target.value)}
                  sx={{ gap: 0 }}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' }, '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                    label={<span className="text-[12px] text-gray-600">Yes</span>}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' }, '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                    label={<span className="text-[12px] text-gray-600">No</span>}
                  />
                </RadioGroup>
              </div>
            </div>

            <div>
              <div className="relative w-full mt-6">
                <label className="absolute -top-2 left-3 bg-white px-1 text-[12.5px] text-black pointer-events-none">
                  Event Description<span className="text-[#C72030]">*</span>
                </label>
                <textarea
                  name="eventDescription"
                  value={formData.eventDescription}
                  onChange={handleInputChange}
                  placeholder="Enter Description"
                  rows={8}
                  className="w-full rounded-[5px] border border-gray-300 p-4 text-sm outline-none resize-none"
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
            <div className="flex flex-col md:flex-row md:items-center gap-8 mb-3">
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

            {selectedTechParks.length > 0 && (
              <div className="mt-4 flex items-center gap-2 text-[#C72030] text-sm font-medium">
                <span>
                  {techParks
                    .filter(park => selectedTechParks.includes(park.id))
                    .map(park => park.name)
                    .join(", ")}
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
                </span>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('eventName', formData.eventName);
                    localStorage.setItem('eventType', formData.eventType);
                    localStorage.setItem('amountPerPerson', formData.amountPerPerson);
                    localStorage.setItem('fromDate', formData.fromDate);
                    localStorage.setItem('toDate', formData.toDate);
                    localStorage.setItem('eventTime', formData.eventTime);
                    localStorage.setItem('eventLocation', formData.eventLocation);
                    localStorage.setItem('memberCapacity', formData.memberCapacity);
                    localStorage.setItem('perMemberLimit', formData.perMemberLimit);
                    localStorage.setItem('pulseCategory', formData.pulseCategory);
                    localStorage.setItem('rsvp', formData.rsvp);
                    localStorage.setItem('showOnHomeScreen', formData.showOnHomeScreen);
                    localStorage.setItem('approvalRequired', formData.approvalRequired);
                    localStorage.setItem('eventDescription', formData.eventDescription);
                    localStorage.setItem('shareWith', formData.shareWith);
                    localStorage.setItem('shareWithCommunities', formData.shareWithCommunities);
                    navigate(`/pulse/community?mode=selection&from=edit-event&id=${id}`)
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
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label className="text-sm font-bold text-gray-700 mb-4 block">
                  Upload Document
                </Label>

                <div className="flex flex-wrap gap-4">
                  {/* Existing Attachments */}
                  {existingAttachments.map((att) => (
                    <div key={att.id} className="relative border-2 border-gray-200 rounded-lg w-full max-w-[200px] h-40 flex items-center justify-center bg-gray-50">
                      <span className="absolute top-2 left-3 text-sm font-medium text-gray-700 truncate max-w-[80%]">
                        Existing File
                      </span>
                      <button
                        onClick={() => handleRemoveExistingAttachment(att.id)}
                        className="absolute top-2 right-2 text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <XCircle size={20} />
                      </button>
                      <img
                        src={att.document}
                        alt="Existing"
                        className="w-20 h-20 object-contain mt-6"
                      />
                    </div>
                  ))}

                  {/* New Attachment Preview */}
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
                        accept="image/*"
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
        </div>

        <div className="flex justify-center gap-4 mt-8 pb-8">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="disabled:!bg-[#DF808B] !bg-[#C72030] hover:bg-[#d0606e] !text-white min-w-[150px] h-10"
          >
            {isSubmitting ? "Updating..." : "Update Event"}
          </Button>
          <Button
            onClick={() => navigate(`/pulse/events`)}
            variant="outline"
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white min-w-[150px] h-10"
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Tech Park Selection Modal */}
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

