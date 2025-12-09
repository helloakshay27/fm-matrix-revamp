import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import MultiSelectBox from "../components/ui/multi-selector";
import SelectBox from "@/components/ui/select-box";
import { API_CONFIG } from "@/config/apiConfig";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import ProjectBannerUpload from "../components/reusable/ProjectBannerUpload";
import ProjectImageVideoUpload from "../components/reusable/ProjectImageVideoUpload";

const EventCreate = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    event_type: "",
    event_name: "",
    event_at: "",
    from_time: "",
    to_time: "",
    rsvp_action: "",
    description: "",
    publish: "",
    user_id: "",
    comment: "",
    shared: 1,
    group_id: [],
    attachfile: [],
    cover_image: [],
    is_important: "",
    email_trigger_enabled: "",
    set_reminders_attributes: [],
    cover_image_1_by_1: [],
    cover_image_9_by_16: [],
    cover_image_3_by_2: [],
    cover_image_16_by_9: [],
    event_images_1_by_1: [],
    event_images_9_by_16: [],
    event_images_3_by_2: [],
    event_images_16_by_9: [],
  });

  console.log("formData", formData);
  const [eventType, setEventType] = useState([]);
  const [eventUserID, setEventUserID] = useState([]);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [groups, setGroups] = useState([]);

  // Enhanced reminder state
  const [reminderValue, setReminderValue] = useState("");
  const [reminderUnit, setReminderUnit] = useState("");
  const [image, setImage] = useState([]);
  const [croppedImage, setCroppedImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [showAttachmentTooltip, setShowAttachmentTooltip] = useState(false);
  const [showCoverUploader, setShowCoverUploader] = useState(false);
  const [showEventUploader, setShowEventUploader] = useState(false);
  const previewUrlsRef = useRef(new Map()); // Store preview URLs for cleanup

  const timeOptions = [
    // { value: "", label: "Select Unit" },
    { value: "minutes", label: "Minutes" },
    { value: "hours", label: "Hours" },
    { value: "days", label: "Days" },
    { value: "weeks", label: "Weeks" },
  ];

  const timeConstraints = {
    minutes: { min: 0, max: 40320 },
    hours: { min: 0, max: 672 },
    days: { min: 0, max: 28 },
    weeks: { min: 0, max: 4 },
  };

  const coverImageRatios = [
    { key: "cover_image_1_by_1", label: "1:1" },
    { key: "cover_image_16_by_9", label: "16:9" },
    { key: "cover_image_9_by_16", label: "9:16" },
    { key: "cover_image_3_by_2", label: "3:2" },
  ];

  const eventImageRatios = [
    { key: "event_images_1_by_1", label: "1:1" },
    { key: "event_images_16_by_9", label: "16:9" },
    { key: "event_images_9_by_16", label: "9:16" },
    { key: "event_images_3_by_2", label: "3:2" },
  ];

  const eventUploadConfig = {
    "cover image": ["16:9", "1:1", "9:16", "3:2"],
    "event images": ["16:9", "1:1", "9:16", "3:2"],
  };

  const coverImageType = "cover image";
  const selectedCoverRatios = eventUploadConfig[coverImageType] || [];
  const coverImageLabel = coverImageType.replace(/(^\w|\s\w)/g, (m) =>
    m.toUpperCase()
  );
  const dynamicCoverDescription = `Supports ${selectedCoverRatios.join(
    ", "
  )} aspect ratios`;

  const eventImageType = "event images";
  const selectedEventRatios = eventUploadConfig[eventImageType] || [];
  const eventImageLabel = eventImageType.replace(/(^\w|\s\w)/g, (m) =>
    m.toUpperCase()
  );
  const dynamicEventDescription = `Supports ${selectedEventRatios.join(
    ", "
  )} aspect ratios`;

  const updateFormData = (key, files) => {
    setFormData((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), ...files],
    }));
  };

  const handleCroppedImages = (validImages, type = "cover") => {
    if (!validImages || validImages.length === 0) {
      toast.error(
        `No valid ${type} image${
          ["cover", "event"].includes(type) ? "" : "s"
        } selected.`
      );
      return;
    }

    validImages.forEach((img) => {
      const formattedRatio = img.ratio.replace(":", "_by_");
      const prefix = type === "cover" ? "cover_image" : "event_images";
      const key = `${prefix}_${formattedRatio}`;
      updateFormData(key, [
        {
          file: img.file,
          name: img.file.name,
          preview: URL.createObjectURL(img.file),
          ratio: img.ratio,
          id: `${key}-${Date.now()}-${Math.random()}`, // Unique ID for each image
        },
      ]);
    });

    if (type === "cover") {
      setShowCoverUploader(false);
    } else {
      setShowEventUploader(false);
    }
  };

  const handleEventCroppedImages = (
    validImages,
    videoFiles = [],
    type = "cover"
  ) => {
    // Handle video files first
    if (videoFiles && videoFiles.length > 0) {
      videoFiles.forEach((video) => {
        const formattedRatio = video.ratio.replace(":", "_by_");
        const prefix = type === "cover" ? "cover_image" : "event_images";
        const key = `${prefix}_${formattedRatio}`;

        updateFormData(key, [
          {
            file: video.file,
            name: video.file.name,
            preview: URL.createObjectURL(video.file),
            ratio: video.ratio,
            type: "video",
            id: `${key}-${Date.now()}-${Math.random()}`,
          },
        ]);
      });

      if (type === "cover") {
        setShowCoverUploader(false);
      } else {
        setShowEventUploader(false);
      }
      return;
    }

    // Handle images
    if (!validImages || validImages.length === 0) {
      toast.error(`No valid ${type} files selected.`);
      return;
    }

    validImages.forEach((img) => {
      const formattedRatio = img.ratio.replace(":", "_by_");
      const prefix = type === "cover" ? "cover_image" : "event_images";
      const key = `${prefix}_${formattedRatio}`;
      updateFormData(key, [
        {
          file: img.file,
          name: img.file.name,
          preview: URL.createObjectURL(img.file),
          ratio: img.ratio,
          type: "image",
          id: `${key}-${Date.now()}-${Math.random()}`,
        },
      ]);
    });

    if (type === "cover") {
      setShowCoverUploader(false);
    } else {
      setShowEventUploader(false);
    }
  };

  const closeModal = (type) => {
    let prefix = "";
    switch (type) {
      case "cover":
        prefix = coverImageType; // "gallery image"
        break;
      case "event":
        prefix = eventImageType; // "floor plan"
        break;
    }
  };

  const handleImageRemoval = (key, index) => {
    setFormData((prev) => {
      const updatedArray = (prev[key] || []).filter((_, i) => i !== index);
      return {
        ...prev,
        [key]: updatedArray.length > 0 ? updatedArray : [],
      };
    });
  };

  const handleAttachmentRemoval = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachfile: prev.attachfile.filter((_, i) => i !== index),
    }));
  };

  console.log("formData", formData);

  const discardImage = (key, imageToRemove) => {
    setFormData((prev) => {
      const updatedArray = (prev[key] || []).filter(
        (img) => img.id !== imageToRemove.id
      );

      // Remove the key if the array becomes empty
      const newFormData = { ...prev };
      if (updatedArray.length === 0) {
        delete newFormData[key];
      } else {
        newFormData[key] = updatedArray;
      }

      return newFormData;
    });

    // If the removed image is being previewed, reset previewImg
    if (previewImg === imageToRemove.preview) {
      setPreviewImg(null);
    }
  };

  // Set Reminders
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("");
  const [reminders, setReminders] = useState([]);

  const handleAddReminder = () => {
    if (!reminderValue || !reminderUnit) return;

    const newReminder = {
      value: reminderValue,
      unit: reminderUnit,
    };

    setFormData((prevFormData) => ({
      ...prevFormData,
      set_reminders_attributes: [
        ...prevFormData.set_reminders_attributes,
        newReminder,
      ],
    }));

    setReminderValue("");
    setReminderUnit("");
  };

  const handleRemoveReminder = (index) => {
    setFormData((prevFormData) => {
      const reminders = [...prevFormData.set_reminders_attributes];

      // Check if the reminder has an ID (existing reminder)
      if (reminders[index]?.id) {
        // Mark the reminder for deletion by adding `_destroy: true`
        reminders[index]._destroy = true;
      } else {
        // Remove the reminder directly if it's a new one
        reminders.splice(index, 1);
      }

      return {
        ...prevFormData,
        set_reminders_attributes: reminders,
      };
    });
  };

  // Convert reminders to API format before submission
  const prepareRemindersForSubmission = () => {
    return formData.set_reminders_attributes
      .map((reminder) => {
        if (reminder._destroy) {
          return { id: reminder.id, _destroy: true };
        }
        const baseReminder = { id: reminder.id };
        if (reminder.unit === "days") {
          baseReminder.days = Number(reminder.value);
        } else if (reminder.unit === "hours") {
          baseReminder.hours = Number(reminder.value);
        } else if (reminder.unit === "minutes") {
          baseReminder.minutes = Number(reminder.value);
        } else if (reminder.unit === "weeks") {
          baseReminder.weeks = Number(reminder.value);
        }
        return baseReminder;
      })
      .filter((r) => !r._destroy || r.id);
  };

  console.log("bb", eventUserID);
  console.log("groups", groups);

  // Handle input change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //for files into array
  const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB
  const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg"];

    for (let file of selectedFiles) {
      const isImage = allowedImageTypes.includes(file.type);
      const isVideo = allowedVideoTypes.includes(file.type);

      // Type validation
      if (!isImage && !isVideo) {
        toast.error(
          `Invalid file type "${file.name}". Only JPG, PNG, GIF, WebP (images) or MP4, WebM, OGG (videos) allowed.`
        );
        e.target.value = "";
        return;
      }

      // Size validation
      if (isImage && file.size > MAX_IMAGE_SIZE) {
        toast.error("Image size must be less than 3MB");
        e.target.value = "";
        return;
      }

      if (isVideo && file.size > MAX_VIDEO_SIZE) {
        toast.error("Video size must be less than 10MB");
        e.target.value = "";
        return;
      }
    }

    // All files are valid ✅
    setFormData((prevFormData) => ({
      ...prevFormData,
      attachfile: [...prevFormData.attachfile, ...selectedFiles],
    }));
  };

  useEffect(() => {
    console.log("Updated attachfile:", formData.attachfile);
  }, [formData.attachfile]);

  const handleRadioChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the state with the radio button's value
    }));
  };

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const fileData = selectedFiles.map((file) => ({
      file: file,
      name: file.name,
      type: file.type,
      url: file.type.startsWith("image") ? URL.createObjectURL(file) : null,
    }));
    setFiles([...files, ...fileData]);
  };

  const validateForm = (formData) => {
    const errors = [];

    if (!formData.event_name) {
      errors.push("Event Name is required.");
      return errors; // Return the first error immediately
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    // const hasProjectBanner1by1 =
    //   formData.cover_image_16_by_9 &&
    //   formData.cover_image_16_by_9.some((img) => img.file instanceof File);

    // const hasEventBanner1by1 =
    //   formData.event_images_16_by_9 &&
    //   formData.event_images_16_by_9.some((img) => img.file instanceof File);

    // if (!hasProjectBanner1by1) {
    //   toast.error("Cover Image with 16:9 ratio is required.");
    //   setLoading(false);
    //   setIsSubmitting(false);
    //   return;
    // }

    // if (!hasEventBanner1by1) {
    //   toast.error("Event Image with 16:9 ratio is required.");
    //   setLoading(false);
    //   setIsSubmitting(false);
    //   return;
    // }

    const preparedReminders = prepareRemindersForSubmission();

    // Use backend value for shared
    const backendSharedValue = formData.shared === "all" ? 0 : 1;

    const validationErrors = validateForm(formData);
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("event[event_type]", formData.event_type);
    data.append("event[event_name]", formData.event_name);
    data.append("event[event_at]", formData.event_at);
    data.append("event[from_time]", formData.from_time);
    data.append("event[to_time]", formData.to_time);
    data.append("event[rsvp_action]", formData.rsvp_action);
    data.append("event[description]", formData.description);
    data.append("event[publish]", formData.publish);
    data.append("event[user_ids]", formData.user_id);
    data.append("event[comment]", formData.comment);
    data.append("event[shared]", backendSharedValue); // <-- use backend value here
    // data.append("event[group_id]", formData.group_id);
    data.append("event[is_important]", formData.is_important);
    data.append("event[email_trigger_enabled]", formData.email_trigger_enabled);
    data.append("event[project_id]", selectedProjectId);

    if (formData.cover_image && formData.cover_image.length > 0) {
      const file = formData.cover_image[0];
      if (file instanceof File) {
        data.append("event[cover_image]", file);
      }
    }

    if (formData.rsvp_action === "yes") {
      data.append("event[rsvp_name]", formData.rsvp_name);
      data.append("event[rsvp_number]", formData.rsvp_number);
    }

    // For coverImageRatios
    coverImageRatios.forEach(({ key }) => {
      const images = formData[key];
      if (Array.isArray(images) && images.length > 0) {
        const img = images[0]; // 👈 only the first image
        if (img?.file instanceof File) {
          data.append(`event[${key}]`, img.file); // 👈 flat key format
        }
      }
    });

    // For eventImageRatios
    eventImageRatios.forEach(({ key }) => {
      const images = formData[key];
      if (Array.isArray(images) && images.length > 0) {
        images.forEach((img) => {
          if (img?.file instanceof File) {
            data.append(`event[${key}][]`, img.file);
          }
        });
      }
    });

    // Updated reminder data appending
    preparedReminders.forEach((reminder, index) => {
      if (reminder.id)
        data.append(
          `event[set_reminders_attributes][${index}][id]`,
          reminder.id
        );
      if (reminder._destroy) {
        data.append(`event[set_reminders_attributes][${index}][_destroy]`, "1");
      } else {
        if (reminder.days)
          data.append(
            `event[set_reminders_attributes][${index}][days]`,
            reminder.days
          );
        if (reminder.hours)
          data.append(
            `event[set_reminders_attributes][${index}][hours]`,
            reminder.hours
          );
        if (reminder.minutes)
          data.append(
            `event[set_reminders_attributes][${index}][minutes]`,
            reminder.minutes
          );
        if (reminder.weeks)
          data.append(
            `event[set_reminders_attributes][${index}][weeks]`,
            reminder.weeks
          );
      }
    });

    // if (formData.attachfile && formData.attachfile.length > 0) {
    //   formData.attachfile.forEach((file) => {
    //     if (file instanceof File) {
    //       data.append("event[event_images][]", file);
    //     } else {
    //       console.warn("Invalid file detected:", file);
    //     }
    //   });
    // } else {
    //   // toast.error("Attachment is required.");
    //   setLoading(false);
    //   return;
    // }

    if (Array.isArray(formData.group_id)) {
      formData.group_id.forEach((id) => {
        data.append("event[group_id][]", id);
      });
    } else if (formData.group_id) {
      data.append("event[group_id][]", formData.group_id);
    }

    console.log("dta to be sent:", Array.from(data.entries()));

    try {
      console.log("dta to be sent:", Array.from(data.entries()));

      const response = await axios.post(`${baseURL}events.json`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Event created successfully!");
      setFormData({
        event_type: "",
        event_name: "",
        event_at: "",
        from_time: "",
        to_time: "",
        rsvp_action: "",
        description: "",
        publish: "",
        user_id: "",
        comment: "",
        shared: "",
        group_id: "",
        attachfile: [],
        cover_image: [],
        is_important: "",
        email_trigger_enabled: "",
        set_reminders_attributes: [],
        cover_image_1_by_1: [],
        cover_image_9_by_16: [],
        cover_image_3_by_2: [],
        cover_image_16_by_9: [],
        event_images_1_by_1: [],
        event_images_9_by_16: [],
        event_images_3_by_2: [],
        event_images_16_by_9: [],
      });

      navigate("/event-list");
    } catch (error) {
      console.error("Error submitting the form:", error);
      if (error.response && error.response.data) {
        toast.error(
          `Error: ${error.response.data.message || "Submission failed"}`
        );
      } else {
        toast.error("Failed to submit the form. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      const url = `${baseURL}events.json`;

      try {
        const response = await axios.get(
          `${baseURL}events.json`,

          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        setEventType(response?.data?.events);
        console.log("eventType", eventType);
      } catch (error) {
        console.error("Error fetching Event:", error);
      }
    };

    fetchEvent();
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${baseURL}users/get_users.json`,

          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        setEventUserID(response?.data.users || []);
        // console.log("User", response)
        console.log("eventUserID", eventUserID);
      } catch (error) {
        console.error("Error fetching Event:", error);
      }
    };
    fetchEvent();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${baseURL}projects.json`,

          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setProjects(response.data.projects || []);
      } catch (error) {
        console.error(
          "Error fetching projects:",
          error.response?.data || error.message
        );
      }
    };

    fetchProjects();
  }, []);

  const handleCancel = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${baseURL}usergroups.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        // If response.data is an array, use it directly
        const groupsData = Array.isArray(response.data)
          ? response.data
          : response.data.usergroups || [];
        setGroups(groupsData);
        console.log("Fetched Groups:", groupsData);
      } catch (error) {
        console.error("Error fetching Groups:", error);
      }
    };

    if (formData.shared === "group" && groups.length === 0) {
      fetchGroups();
    }
  }, [formData.shared]);

  const handleCoverImageUpload = (newImageList) => {
    if (!newImageList || newImageList.length === 0) return;

    const file = newImageList[0].file;
    if (!file) return;

    // Check if it's an image file
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast.error("Please upload a valid image file");
      return;
    }

    // Check file size (3MB limit)
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image size must be less than 3MB");
      return;
    }

    setImage(newImageList);
    setDialogOpen(true);
  };

  const handleAttachmentUpload = (e) => {
    const files = Array.from(e.target.files);

    const newAttachments = files.map((file) => {
      const isVideo = file.type.includes("video") || file.name.endsWith(".mp4");
      return {
        file,
        name: file.name,
        type: file.type || (isVideo ? "video/mp4" : "image/jpeg"),
        preview: URL.createObjectURL(file),
        size: file.size,
      };
    });

    setFormData((prev) => ({
      ...prev,
      attachfile: [...(prev.attachfile || []), ...newAttachments],
    }));
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="p-6 max-w-full h-[calc(100vh-50px)] overflow-y-auto">
        {/* Header with Back Button and Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-[#C72030] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Home</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Event</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Create Event</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CREATE EVENT</h1>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Event Information</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Project */}
              <div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-0">Project</label>
                  <SelectBox
                    options={projects.map((proj) => ({
                      value: proj.id,
                      label: proj.project_name,
                    }))}
                    value={selectedProjectId || ""}
                    onChange={(value) => setSelectedProjectId(value)}
                  />
                </div>
              </div>

              {/* Event Type */}
              <div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-0">Event Type</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                    type="text"
                    name="event_type"
                    placeholder="Enter Event Type"
                    value={formData.event_type}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Event Name */}
              <div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-0">
                    Event Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                    type="text"
                    name="event_name"
                    placeholder="Enter Event Name"
                    value={formData.event_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Event At */}
              <div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-0">Event At</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                    type="text"
                    name="event_at"
                    placeholder="Enter Event At"
                    value={formData.event_at}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Event From */}
              <div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-0">Event From</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                    type="datetime-local"
                    name="from_time"
                    value={formData.from_time}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Event To */}
              <div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-0">Event To</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                    type="datetime-local"
                    name="to_time"
                    value={formData.to_time}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Event Description */}
              <div className="md:col-span-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-0">Event Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent resize-y"
                    rows={3}
                    name="description"
                    placeholder="Enter Description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Mark Important */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mark Important</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="is_important"
                      checked={formData.is_important === true}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          is_important: true,
                        }))
                      }
                      className="w-4 h-4 text-[#C72030] focus:ring-[#C72030]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="is_important"
                      checked={formData.is_important === false}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          is_important: false,
                        }))
                      }
                      className="w-4 h-4 text-[#C72030] focus:ring-[#C72030]"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {/* Send Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Send Email</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="email_trigger_enabled"
                      value="true"
                      checked={formData.email_trigger_enabled === "true"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email_trigger_enabled: e.target.value,
                        }))
                      }
                      className="w-4 h-4 text-[#C72030] focus:ring-[#C72030]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="email_trigger_enabled"
                      value="false"
                      checked={formData.email_trigger_enabled === "false"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email_trigger_enabled: e.target.value,
                        }))
                      }
                      className="w-4 h-4 text-[#C72030] focus:ring-[#C72030]"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {/* RSVP Action */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">RSVP Action</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rsvp_action"
                      value="yes"
                      checked={formData.rsvp_action === "yes"}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#C72030] focus:ring-[#C72030]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rsvp_action"
                      value="no"
                      checked={formData.rsvp_action === "no"}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#C72030] focus:ring-[#C72030]"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {/* RSVP Fields */}
              {formData.rsvp_action === "yes" && (
                <>
                  <div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-0">RSVP Name</label>
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                        type="text"
                        name="rsvp_name"
                        placeholder="Enter RSVP Name"
                        value={formData.rsvp_name || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-0">RSVP Number</label>
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                        type="text"
                        name="rsvp_number"
                        placeholder="Enter RSVP Number"
                        value={formData.rsvp_number || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Set Reminders */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Set Reminders</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <SelectBox
                    options={timeOptions}
                    value={reminderUnit || ""}
                    onChange={(value) => {
                      setReminderUnit(value);
                      setReminderValue("");
                    }}
                  />
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                    placeholder="Value"
                    value={reminderValue}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const constraints = timeConstraints[reminderUnit] || { min: 0, max: Infinity };
                      if (val >= constraints.min && val <= constraints.max) {
                        setReminderValue(e.target.value);
                      }
                    }}
                    disabled={!reminderUnit}
                  />
                  <button
                    type="button"
                    className="px-6 py-2 bg-[#C72030] text-white rounded hover:bg-[#B8252F] transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddReminder}
                    disabled={!reminderValue || !reminderUnit}
                  >
                    + Add
                  </button>
                </div>

                {/* Display Reminders */}
                {formData.set_reminders_attributes
                  .filter((reminder) => !reminder._destroy)
                  .map((reminder, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        value={reminder.unit}
                        disabled
                      >
                        {timeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        value={reminder.value}
                        readOnly
                      />
                      <button
                        type="button"
                        className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium"
                        onClick={() => handleRemoveReminder(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>

              {/* Share With */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Share With</label>
                <div className="flex gap-6 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shared"
                      value="all"
                      checked={formData.shared === "all"}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          shared: "all",
                          user_id: "",
                          group_id: "",
                        }))
                      }
                      className="w-4 h-4 text-[#C72030] focus:ring-[#C72030]"
                    />
                    <span className="ml-2 text-sm text-gray-700">All</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shared"
                      value="individual"
                      checked={formData.shared === "individual"}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          shared: "individual",
                          group_id: "",
                        }))
                      }
                      className="w-4 h-4 text-[#C72030] focus:ring-[#C72030]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Individuals</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shared"
                      value="group"
                      checked={formData.shared === "group"}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          shared: "group",
                          user_id: "",
                        }))
                      }
                      className="w-4 h-4 text-[#C72030] focus:ring-[#C72030]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Groups</span>
                  </label>
                </div>

                {formData.shared === "individual" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">Event User ID</label>
                    <MultiSelectBox
                      options={eventUserID.map((user) => ({
                        value: user.id,
                        label: `${user.firstname} ${user.lastname}`,
                      }))}
                      value={
                        formData.user_id
                          ? formData.user_id.split(",").map((id) => {
                              const user = eventUserID.find((u) => u.id.toString() === id);
                              return {
                                value: id,
                                label: `${user?.firstname} ${user?.lastname}`,
                              };
                            })
                          : []
                      }
                      onChange={(selectedOptions) =>
                        setFormData((prev) => ({
                          ...prev,
                          user_id: selectedOptions.map((option) => option.value).join(","),
                        }))
                      }
                    />
                  </div>
                )}

                {formData.shared === "group" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">Share with Groups</label>
                    <MultiSelectBox
                      options={groups.map((group) => ({
                        value: group.id,
                        label: group.name,
                      }))}
                      value={
                        Array.isArray(formData.group_id)
                          ? formData.group_id
                              .map((id) => {
                                const group = groups.find((g) => g.id === id || g.id.toString() === id.toString());
                                return group ? { value: group.id, label: group.name } : null;
                              })
                              .filter(Boolean)
                          : []
                      }
                      onChange={(selectedOptions) =>
                        setFormData((prev) => ({
                          ...prev,
                          group_id: selectedOptions.map((option) => option.value),
                        }))
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">File Upload</h3>
          </div>
          
          <div className="p-6">
            {/* Event Cover Image */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-base font-semibold">
                  Event Cover Image{" "}
                  <span
                    className="relative inline-block cursor-help"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <span className="text-blue-500">[i]</span>
                    {showTooltip && (
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap z-10">
                        Max Upload Size 3 MB and Required ratio is 16:9
                      </span>
                    )}
                  </span>
                </h5>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors"
                  type="button"
                  onClick={() => setShowCoverUploader(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                  </svg>
                  <span>Add</span>
                </button>
              </div>

              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table className="border-separate">
                  <TableHeader>
                    <TableRow className="hover:bg-gray-50" style={{ backgroundColor: "#e6e2d8" }}>
                      <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff" }}>File Name</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff" }}>Preview</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff" }}>Ratio</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-3 px-4" style={{ borderColor: "#fff" }}>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coverImageRatios.flatMap(({ key, label }) => {
                      const files = Array.isArray(formData[key]) ? formData[key] : formData[key] ? [formData[key]] : [];
                      if (files.length === 0) return [];

                      return files.map((file, index) => (
                        <TableRow key={`${key}-${file.id || index}`} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="py-3 px-4 font-medium">{file.name || file.document_file_name || `Image ${index + 1}`}</TableCell>
                          <TableCell className="py-3 px-4">
                            <img
                              style={{ maxWidth: 100, maxHeight: 100, objectFit: "cover" }}
                              className="rounded border border-gray-200"
                              src={file.preview || file.document_url}
                              alt={file.name}
                            />
                          </TableCell>
                          <TableCell className="py-3 px-4">{file.ratio || label}</TableCell>
                          <TableCell className="py-3 px-4">
                            <button
                              type="button"
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              onClick={() => handleImageRemoval(key, index, file.id)}
                            >
                              ×
                            </button>
                          </TableCell>
                        </TableRow>
                      ));
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Event Attachment */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-base font-semibold">
                  Event Attachment{" "}
                  <span
                    className="relative inline-block cursor-help"
                    onMouseEnter={() => setShowAttachmentTooltip(true)}
                    onMouseLeave={() => setShowAttachmentTooltip(false)}
                  >
                    <span className="text-blue-500">[i]</span>
                    {showAttachmentTooltip && (
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap z-10">
                        Max Upload Size 3 MB (Images), 10 MB (Videos)
                      </span>
                    )}
                  </span>
                </h5>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors"
                  type="button"
                  onClick={() => setShowEventUploader(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                  </svg>
                  <span>Add</span>
                </button>
              </div>

              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table className="border-separate">
                  <TableHeader>
                    <TableRow className="hover:bg-gray-50" style={{ backgroundColor: "#e6e2d8" }}>
                      <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff" }}>File Name</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff" }}>Preview</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff" }}>Ratio</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-3 px-4" style={{ borderColor: "#fff" }}>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventImageRatios.map(({ key, label }) =>
                      (formData[key] || []).length > 0
                        ? formData[key].map((file, index) => {
                            const isVideo = file.type === "video" || (file.file && file.file.type.startsWith("video/"));
                            return (
                              <TableRow key={`${key}-${file.id}`} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="py-3 px-4 font-medium">{file.name || "Unnamed File"}</TableCell>
                                <TableCell className="py-3 px-4">
                                  {isVideo ? (
                                    <video controls style={{ maxWidth: 100, maxHeight: 100 }} className="rounded border border-gray-200">
                                      <source src={file.preview} type={file.file?.type || "video/mp4"} />
                                    </video>
                                  ) : (
                                    <img
                                      style={{ maxWidth: 100, maxHeight: 100, objectFit: "cover" }}
                                      className="rounded border border-gray-200"
                                      src={file.preview}
                                      alt={file.name}
                                    />
                                  )}
                                </TableCell>
                                <TableCell className="py-3 px-4">{file.ratio || label}</TableCell>
                                <TableCell className="py-3 px-4">
                                  <button
                                    type="button"
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    onClick={() => handleImageRemoval(key, index)}
                                  >
                                    ×
                                  </button>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        : null
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-4 mb-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 bg-[#f6f4ee] text-[#C72030] rounded hover:bg-[#f0ebe0] transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-[#C72030] text-white rounded hover:bg-[#B8252F] transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>

        {/* Modals */}
        {showCoverUploader && (
          <ProjectBannerUpload
            onClose={() => setShowCoverUploader(false)}
            includeInvalidRatios={false}
            selectedRatioProp={selectedCoverRatios}
            showAsModal={true}
            label={coverImageLabel}
            description={dynamicCoverDescription}
            onContinue={(validImages) => handleCroppedImages(validImages, "cover")}
          />
        )}

        {showEventUploader && (
          <ProjectImageVideoUpload
            onClose={() => setShowEventUploader(false)}
            includeInvalidRatios={false}
            selectedRatioProp={selectedEventRatios}
            showAsModal={true}
            label={eventImageLabel}
            description={dynamicEventDescription}
            onContinue={(validImages, videoFiles) =>
              handleEventCroppedImages(validImages, videoFiles, "event")
            }
            allowVideos={true}
          />
        )}
      </div>
    </div>
  );
};

export default EventCreate;
