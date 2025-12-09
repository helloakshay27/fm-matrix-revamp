import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";
import MultiSelectBox from "../components/ui/multi-selector";
import { ImageUploadingButton } from "../components/reusable/ImageUploadingButton";
import { ImageCropper } from "../components/reusable/ImageCropper";
import ProjectBannerUpload from "../components/reusable/ProjectBannerUpload";
import ProjectImageVideoUpload from "../components/reusable/ProjectImageVideoUpload";

const EventEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [errors, setErrors] = useState({});

  console.log("id", id);

  const [formData, setFormData] = useState({
    project_id: "",
    event_type: "",
    event_name: "",
    event_at: "",
    from_time: "",
    to_time: "",
    rsvp_action: "",
    rsvp_name: "",
    rsvp_number: "",
    description: "",
    publish: "",
    user_id: [],
    comment: "",
    shared: "",
    group_id: [], // Changed to array
    attachfile: [],
    previewImage: [],
    is_important: "false",
    email_trigger_enabled: "false",
    set_reminders_attributes: [],
    existingImages: [],
    newImages: [],
    cover_image: null,
    existingCoverImage: null,
    existingImages: [], // for previously uploaded images
    newImages: [], // for newly selected images
    cover_image: null, // Changed from array to single value
    existingCoverImage: null, // Add this to track existing cover image
    cover_image_1_by_1: [],
    cover_image_9_by_16: [],
    cover_image_3_by_2: [],
    cover_image_16_by_9: [],
    event_images_1_by_1: [],
    event_images_9_by_16: [],
    event_images_3_by_2: [],
    event_images_16_by_9: [],
  });

  console.log("Data", formData);

  const [eventType, setEventType] = useState([]);
  const [eventUserID, setEventUserID] = useState([]);
  const [groups, setGroups] = useState([]); // State to store groups
  const [loading, setLoading] = useState(false);

  const [reminderValue, setReminderValue] = useState("");
  const [reminderUnit, setReminderUnit] = useState("");
  const [image, setImage] = useState([]);
  const [croppedImage, setCroppedImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  // const [showCoverUploader, setShowCoverUploader] = useState(false);
  const [showAttachmentTooltip, setShowAttachmentTooltip] = useState(false);
  const [showCoverUploader, setShowCoverUploader] = useState(false);
  const [showEventUploader, setShowEventUploader] = useState(false);

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

  // const updateFormData = (key, files) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [key]: [...(prev[key] || []), ...files],
  //   }));
  // };

  const updateFormData = (key, files) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [key]: files,
      };
      return newData;
    });
  };

  const updateEventFormData = (key, files) => {
    setFormData((prev) => {
      const existingFiles = prev[key] || [];

      const newData = {
        ...prev,
        [key]: [...existingFiles, ...files],
      };

      return newData;
    });
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

  const handleCoverImageCropComplete = (validImages) => {
    if (!validImages || validImages.length === 0) {
      toast.error("No valid images selected.");
      setShowCoverUploader(false);
      return;
    }

    validImages.forEach((img) => {
      if (!img.ratio) return;

      const formattedRatio = img.ratio.replace(":", "_by_");
      const key = `cover_image_${formattedRatio}`;

      updateFormData(key, [img]); // Replace or overwrite
    });

    // setPreviewImg(validImages[0].preview);
    setShowCoverUploader(false);
  };

  // const handleEventImageCropComplete = (validImages) => {
  //   if (!validImages || validImages.length === 0) {
  //     toast.error("No valid images selected.");
  //     setShowEventUploader(false);
  //     return;
  //   }

  //   validImages.forEach((img) => {
  //     if (!img.ratio) return;

  //     const formattedRatio = img.ratio.replace(":", "_by_");
  //     const key = `event_images_${formattedRatio}`;

  //     updateEventFormData(key, [img]); // Replace or overwrite
  //   });

  //   // setPreviewImg(validImages[0].preview);
  //   setShowEventUploader(false);
  // };

  const handleEventCroppedImages = (
    validImages,
    videoFiles = [],
    type = "event"
  ) => {
    // Handle video files first
    if (videoFiles && videoFiles.length > 0) {
      videoFiles.forEach((video) => {
        const formattedRatio = video.ratio.replace(":", "_by_");
        const prefix = type === "cover" ? "cover_image" : "event_images";
        const key = `${prefix}_${formattedRatio}`;

        setFormData((prev) => ({
          ...prev,
          [key]: [
            ...(prev[key] || []), // Keep existing files
            {
              file: video.file,
              name: video.file.name,
              preview: URL.createObjectURL(video.file),
              ratio: video.ratio,
              type: "video",
              id: `${key}-${Date.now()}-${Math.random()}`,
            },
          ],
        }));
      });

      setShowEventUploader(false);
      return;
    }

    // Handle images
    if (!validImages || validImages.length === 0) {
      toast.error(`No valid ${type} files selected.`);
      setShowEventUploader(false);
      return;
    }

    validImages.forEach((img) => {
      const formattedRatio = img.ratio.replace(":", "_by_");
      const prefix = type === "cover" ? "cover_image" : "event_images";
      const key = `${prefix}_${formattedRatio}`;

      setFormData((prev) => ({
        ...prev,
        [key]: [
          ...(prev[key] || []), // Keep existing files
          {
            file: img.file,
            name: img.file.name,
            preview: URL.createObjectURL(img.file),
            ratio: img.ratio,
            type: "image",
            id: `${key}-${Date.now()}-${Math.random()}`,
          },
        ],
      }));
    });

    setShowEventUploader(false);
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

  // const eventUploadConfig = {
  //   'cover image': ['16:9']
  // };

  // const currentUploadType = 'cover image';
  // const selectedRatios = eventUploadConfig[currentUploadType] || [];
  // const dynamicLabel = currentUploadType.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
  // const dynamicDescription = `Supports ${selectedRatios.join(', ')} aspect ratios`;

  // const updateFormData = (key, files) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [key]: files,
  //   }));
  // };

  // const handleCropComplete = (validImages) => {
  //   if (!validImages || validImages.length === 0) {
  //     toast.error("No valid images selected.");
  //     setShowUploader(false);
  //     return;
  //   }

  //   validImages.forEach((img) => {
  //     const formattedRatio = img.ratio.replace(':', 'by'); // e.g., "16:9" -> "16by9"
  //     const key = `${currentUploadType}_${formattedRatio}`.replace(/\s+/g, '_').toLowerCase(); // e.g., banner_image_16by9

  //     updateFormData(key, [img]); // send as array to preserve consistency
  //   });

  //   // setPreviewImg(validImages[0].preview); // preview first image only
  //   setShowUploader(false);
  // };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${baseURL}events/${id}.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        const data = response.data;

        // Format reminders
        const formattedReminders = (data.reminders || []).map((reminder) => {
          if (typeof reminder.days !== "undefined" && reminder.days !== null) {
            return {
              id: reminder.id,
              value: reminder.days,
              unit: "days",
              _destroy: false,
            };
          } else if (
            typeof reminder.hours !== "undefined" &&
            reminder.hours !== null
          ) {
            return {
              id: reminder.id,
              value: reminder.hours,
              unit: "hours",
              _destroy: false,
            };
          } else if (
            typeof reminder.minutes !== "undefined" &&
            reminder.minutes !== null
          ) {
            return {
              id: reminder.id,
              value: reminder.minutes,
              unit: "minutes",
              _destroy: false,
            };
          } else if (
            typeof reminder.weeks !== "undefined" &&
            reminder.weeks !== null
          ) {
            return {
              id: reminder.id,
              value: reminder.weeks,
              unit: "weeks",
              _destroy: false,
            };
          }
          return reminder;
        });

        // Normalize user_id
        const userIds = Array.isArray(data.user_id)
          ? data.user_id
          : data.user_id
          ? [data.user_id]
          : [];

        // Normalize group_id
        const groupIds = Array.isArray(data.group_id)
          ? data.group_id
          : data.group_id
          ? [data.group_id]
          : [];

        // Determine share type
        let shared = "";
        if (data.shared === 0) {
          shared = "all";
        } else if (data.shared === 1) {
          if (data.group_id && data.group_id.length > 0) {
            shared = "group";
          } else if (data.user_id && data.user_id.length > 0) {
            shared = "individual";
          }
        }

        // Prepare cover image preview
        const existingCoverImage =
          data.cover_image && data.cover_image.document_url
            ? {
                url: data.cover_image.document_url,
                id: data.cover_image.id,
                isExisting: true,
              }
            : null;

        // Prepare existing event image previews
        const existingImages =
          data.event_images?.map((img) => ({
            url: img.document_url,
            type: img.document_content_type,
            id: img.id,
            isExisting: true,
          })) || [];

        const attachfileData = data.attachfile
          ? Array.isArray(data.attachfile)
            ? data.attachfile
            : [data.attachfile]
          : [];

        const coverImageData = data.cover_image || null;

        setFormData((prev) => ({
          ...prev,
          ...data,
          user_id: userIds,
          group_id: groupIds, // Store as array
          shared: shared,
          // attachfile: data.attachfile || [],
          attachfile: attachfileData,
          newImages: [],
          existingImages: existingImages,
          previewImage: existingImages,
          existingCoverImage: existingCoverImage, // <-- use the correct object
          cover_image: coverImageData,
          set_reminders_attributes: formattedReminders,
          cover_image_1_by_1: data.cover_image_1_by_1 || [],
          cover_image_9_by_16: data.cover_image_9_by_16 || [],
          cover_image_3_by_2: data.cover_image_3_by_2 || [],
          cover_image_16_by_9: data.cover_image_16_by_9 || [],
          event_images_1_by_1: data.event_images_1_by_1 || [],
          event_images_9_by_16: data.event_images_9_by_16 || [],
          event_images_3_by_2: data.event_images_3_by_2 || [],
          event_images_16_by_9: data.event_images_16_by_9 || [],
        }));

        console.log("project_id: ", data.project_id);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  const [projects, setProjects] = useState([]); // State to store projects

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Size check: must be below 3MB
      if (file.size > 3 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          cover_image: "Image size must be less than 3MB",
        }));
        toast.error("Image size must be less than 3MB");
        e.target.value = ""; // Clear the input
        return;
      }

      // Clear previous error if size is valid
      setErrors((prev) => ({
        ...prev,
        cover_image: "",
      }));

      // Save the image
      setFormData((prev) => ({
        ...prev,
        cover_image: file,
        existingCoverImage: null,
      }));
    } else {
      // If no file is selected
      setFormData((prev) => ({
        ...prev,
        cover_image: null,
      }));
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${baseURL}get_all_projects.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Fetched Projects:", response.data);

        setProjects(response.data.projects || []); // Ensure data structure is correct
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseURL}users/get_users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
        setEventUserID(response.data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${baseURL}usergroups.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
        const groupsData = Array.isArray(response.data)
          ? response.data
          : response.data.usergroups || [];
        setGroups(groupsData);
      } catch (error) {
        console.error("Error fetching Groups:", error);
        setGroups([]);
      }
    };

    if (formData.shared === "group" && (!groups || groups.length === 0)) {
      fetchGroups();
    }
  }, [formData.shared]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      const allowedImages = [];
      const newPreviews = [];

      files.forEach((file) => {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        // Validate size based on type
        if (isImage && file.size > 3 * 1024 * 1024) {
          toast.error("Image size must be less than 3MB");
          return;
        }

        if (isVideo && file.size > 10 * 1024 * 1024) {
          toast.error("Video size must be less than 10MB");
          return;
        }

        if (!isImage && !isVideo) {
          toast.error(`${file.name} is not a supported file type`);
          return;
        }

        // If valid, add to list
        allowedImages.push(file);
        newPreviews.push({
          url: URL.createObjectURL(file),
          type: file.type,
          file: file,
          isExisting: false,
        });
      });

      if (allowedImages.length > 0) {
        setFormData((prev) => ({
          ...prev,
          attachfile: allowedImages,
          newImages: newPreviews,
          previewImage: [...prev.existingImages, ...newPreviews],
        }));
      }
    }
  };

  // Function to remove image from preview
  // const handleRemoveImage = async (index) => {
  //   toast.dismiss();
  //   setFormData((prev) => {
  //     const imageToRemove = prev.previewImage[index];

  //     if (imageToRemove.isExisting) {
  //       // Call backend API to remove the image
  //       axios
  //         .delete(`${baseURL}events/${id}/remove_image/${imageToRemove.id}`, {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //           },
  //         })
  //         .then(() => {
  //           toast.success("Image removed successfully!");
  //         })
  //         .catch(() => {
  //           toast.error("Failed to remove image from server.");
  //         });

  //       // Optimistically update UI
  //       const updatedExistingImages = prev.existingImages.filter(
  //         (img) => img.id !== imageToRemove.id
  //       );
  //       return {
  //         ...prev,
  //         existingImages: updatedExistingImages,
  //         previewImage: prev.previewImage.filter((_, i) => i !== index),
  //       };
  //     } else {
  //       // If it's a new image, remove from newImages and attachfile
  //       const newImageIndex = prev.newImages.findIndex(
  //         (img) => img.url === imageToRemove.url
  //       );

  //       if (newImageIndex !== -1) {
  //         const updatedNewImages = prev.newImages.filter(
  //           (_, i) => i !== newImageIndex
  //         );
  //         const updatedFiles = Array.from(prev.attachfile).filter(
  //           (_, i) => i !== newImageIndex
  //         );

  //         return {
  //           ...prev,
  //           newImages: updatedNewImages,
  //           attachfile: updatedFiles,
  //           previewImage: prev.previewImage.filter((_, i) => i !== index),
  //         };
  //       }
  //     }

  //     return prev;
  //   });
  // };

  const handleFetchedDiscardGallery = async (key, index, imageId) => {
    toast.dismiss();
    // If no imageId, it's a new image, just remove locally
    if (!imageId) {
      setFormData((prev) => {
        const updatedFiles = (prev[key] || []).filter((_, i) => i !== index);
        return { ...prev, [key]: updatedFiles };
      });
      toast.success("Image removed successfully!");
      return;
    }

    // Existing image: delete from server, then remove locally
    try {
      const response = await fetch(
        `${baseURL}events/${id}/remove_image/${imageId}.json`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        // Optionally, handle 404 as a successful local delete
        if (response.status === 404) {
          const updatedFiles = formData[key].filter((_, i) => i !== index);
          setFormData({ ...formData, [key]: updatedFiles });
          toast.success("Image removed from UI (already deleted on server).");
          return;
        }
        throw new Error("Failed to delete image");
      }

      // Remove from UI after successful delete
      setFormData((prev) => ({
        ...prev,
        [key]: null,
      }));

      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error.message);
      toast.error("Failed to delete image. Please try again.");
    }
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "true", // Convert string to boolean
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.event_name) {
      errors.event_name = "Event Name is required.";
    }
    setFormErrors(errors); // Update state with errors

    if (Object.keys(errors).length > 0) {
      toast.error(Object.values(errors)[0]);
      return false;
    }
    return true; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    // const cover16by9 = formData.cover_image_16_by_9;
    // const hasCover16by9 = Array.isArray(cover16by9)
    //   ? cover16by9.some(
    //       (img) =>
    //         img?.file instanceof File || img?.id || img?.document_file_name
    //     )
    //   : !!(
    //       cover16by9?.file instanceof File ||
    //       cover16by9?.id ||
    //       cover16by9?.document_file_name
    //     );

    // const event16by9 = formData.event_images_16_by_9;
    // const hasEvent16by9 = Array.isArray(event16by9)
    //   ? event16by9.some(
    //       (img) =>
    //         img?.file instanceof File || img?.id || img?.document_file_name
    //     )
    //   : !!(
    //       event16by9?.file instanceof File ||
    //       event16by9?.id ||
    //       event16by9?.document_file_name
    //     );

    // if (!hasCover16by9) {
    //   toast.error("Cover Image with 16:9 ratio is required.");
    //   setLoading(false);
    //   setIsSubmitting(false);
    //   return;
    // }

    // if (!hasEvent16by9) {
    //   toast.error("Event Image with 16:9 ratio is required.");
    //   setLoading(false);
    //   setIsSubmitting(false);
    //   return;
    // }

    const data = new FormData();

    const preparedReminders = prepareRemindersForSubmission();

    const backendSharedValue = formData.shared === "all" ? 0 : 1;
    data.append("event[shared]", backendSharedValue);

    // === COVER IMAGE ===
    if (formData.cover_image && formData.cover_image instanceof File) {
      data.append("event[cover_image]", formData.cover_image);
    } else if (!formData.cover_image && !formData.existingCoverImage) {
      data.append("event[remove_cover_image]", "1");
    }

    // === EVENT IMAGES (NEW ONLY) ===
    if (Array.isArray(formData.attachfile)) {
      formData.attachfile.forEach((file) => {
        if (file instanceof File) {
          data.append("event[event_images_16_by_9][]", file);
        }
      });
    }

    // Object.entries(formData).forEach(([key, images]) => {
    //   if (key.startsWith("cover_image") && Array.isArray(images)) {
    //     images.forEach((img) => {
    //       const backendField =
    //         key.replace("cover_image", "event[cover_image") + "]";
    //       if (img.file instanceof File) {
    //         data.append(backendField, img.file);
    //       }
    //     });
    //   }
    // });
    coverImageRatios.forEach(({ key }) => {
      const images = formData[key];
      if (Array.isArray(images) && images.length > 0) {
        const img = images[0];
        if (img?.file instanceof File) {
          data.append(`event[${key}]`, img.file);
        }
      }
    });

    // Handle 16:9 preview image from new structure
    if (Array.isArray(formData.cover_image_16_by_9)) {
      formData.cover_image_16_by_9.forEach((img) => {
        if (img.file instanceof File) {
          data.append("event[cover_image]", img.file);
        }
      });
    }

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

    // Handle 16:9 preview image from new structure
    if (Array.isArray(formData.event_images_16_by_9)) {
      formData.event_images_16_by_9.forEach((img) => {
        if (img.file instanceof File) {
          data.append("event[event_images]", img.file);
        }
      });
    }

    // === REMINDERS ===
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

    // === USERS ===
    if (Array.isArray(formData.user_id)) {
      if (formData.user_id.length > 0) {
        formData.user_id.forEach((id) => data.append("event[user_ids][]", id));
      } else {
        data.append("event[user_ids][]", "");
      }
    }

    // For groups
    // if (formData.group_id) {
    //   const groupIds = formData.group_id.split(",").filter(Boolean);
    //   if (groupIds.length > 0) {
    //     groupIds.forEach((id) => data.append("event[group_id][]", id));
    //   } else {
    //     data.append("event[group_id][]", ""); // to clear groups
    //   }
    // }

    // === RSVP FIELDS ===
    if (formData.rsvp_action === "yes") {
      data.append("event[rsvp_name]", formData.rsvp_name || "");
      data.append("event[rsvp_number]", formData.rsvp_number || "");
    }

    // === REMOVED EXISTING IMAGES ===
    const originalIds = formData.existingImages?.map((img) => img.id) || [];
    const currentIds =
      formData.previewImage
        ?.filter((img) => img.isExisting)
        .map((img) => img.id) || [];

    const removedIds = originalIds.filter((id) => !currentIds.includes(id));
    removedIds.forEach((id) => data.append("event[removed_image_ids][]", id));

    // === EVERYTHING ELSE (Primitive values only) ===
    Object.entries(formData).forEach(([key, value]) => {
      if (
        [
          "cover_image",
          "attachfile",
          "existingImages",
          "newImages",
          "previewImage",
          "shared",
          "set_reminders_attributes",
          "user_id",
          "group_id", // Add group_id to skipped keys
          "rsvp_name",
          "rsvp_number",
          "event_images",
        ].includes(key)
      ) {
        return; // Skip handled keys
      }

      if (value !== null && value !== undefined && typeof value !== "object") {
        data.append(`event[${key}]`, value);
      }
    });

    // === SEND REQUEST ===
    try {
      const response = await axios.put(`${baseURL}events/${id}.json`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Event updated successfully!");
      navigate("/event-list");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to update event.");
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    // Get local date and time in "YYYY-MM-DDTHH:MM" format
    const pad = (n) => n.toString().padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  const handleCancel = () => {
    navigate(-1);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

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

  return (
    <>
      <div className="main-content">
        <div className="">
          <div className="module-data-section container-fluid">
            <div className="module-data-section p-3">
              <div className="card mt-4 pb-4 mx-4">
                <div className="card-header">
                  <h3 className="card-title">Edit Event</h3>
                </div>

                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Project</label>
                        <SelectBox
                          options={projects.map((project) => ({
                            value: project.id, // Ensure this matches API response field
                            label: project.project_name, // Ensure correct field name
                          }))}
                          defaultValue={formData.project_id || ""}
                          onChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              project_id: value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Event Type</label>
                        <input
                          className="form-control"
                          type="text"
                          name="event_type"
                          placeholder="Enter Event Type"
                          value={formData.event_type || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Event Name
                          <span className="otp-asterisk"> *</span>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          name="event_name"
                          placeholder="Enter Event Name"
                          value={formData.event_name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Event At</label>
                        <input
                          className="form-control"
                          type="text"
                          name="event_at"
                          placeholder="Enter Event At"
                          value={formData.event_at}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Event From</label>
                        <input
                          className="form-control"
                          type="datetime-local"
                          name="from_time"
                          placeholder="Enter Event From"
                          value={formatDateForInput(formData.from_time) || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Event To</label>
                        <input
                          className="form-control"
                          type="datetime-local"
                          name="to_time"
                          placeholder="Enter Event To"
                          value={formatDateForInput(formData.to_time)}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Event Description</label>
                        <textarea
                          className="form-control"
                          rows={1}
                          name="description"
                          placeholder="Enter Project Description"
                          value={formData.description}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Attachment
                          <span
                            className="tooltip-container"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                          >
                            [i]
                            {showTooltip && (
                              <span className="tooltip-text">
                                Max Upload Size for video 10 MB and for image 3
                                MB
                              </span>
                            )}
                          </span>
                        </label>
                        <input
                          className="form-control"
                          type="file"
                          name="attachfile"
                          accept="image/*,video/*" 
                          multiple
                          onChange={handleFileChange} 
                        />
                      </div>

                    
                      {Array.isArray(formData.previewImage) &&
                        formData.previewImage.length > 0 && (
                          <div className="d-flex flex-wrap gap-2 mt-2">
                            {formData.previewImage.map((fileObj, index) => {
                              const { url, type, isExisting } = fileObj;
                              const isVideo = type.startsWith("video");

                              return (
                                <div key={index} className="position-relative">
                                  {isVideo ? (
                                    <video
                                      src={url}
                                      controls
                                      className="rounded"
                                      style={{
                                        maxWidth: "100px",
                                        maxHeight: "100px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  ) : (
                                    <img
                                      src={url}
                                      alt={`Preview ${index}`}
                                      className="img-fluid rounded"
                                      style={{
                                        maxWidth: "100px",
                                        maxHeight: "100px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  )}
                                
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm position-absolute"
                                    style={{
                                      top: "-5px",
                                      right: "-5px",
                                      fontSize: "10px",
                                      width: "20px",
                                      height: "20px",
                                      padding: "0",
                                      borderRadius: "50%",
                                    }}
                                    onClick={() => handleRemoveImage(index)}
                                    title={
                                      isExisting
                                        ? "Remove existing image"
                                        : "Remove new image"
                                    }
                                  >
                                    ×
                                  </button>
                                 
                                  <small
                                    className={`badge ${
                                      isExisting ? "bg-info" : "bg-success"
                                    } position-absolute`}
                                    style={{
                                      bottom: "-5px",
                                      left: "5px",
                                      fontSize: "8px",
                                    }}
                                  >
                                    {isExisting ? "" : ""}
                                  </small>
                                </div>
                              );
                            })}
                          </div>
                        )}
                    </div> */}
                    {/* <div className="col-md-3 col-sm-6 col-12">
                      <div className="form-group mt-3">
                  
                        <label className="d-flex align-items-center gap-1 mb-2">
                          <span>Cover Image</span>

                          <span
                            className="tooltip-container"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            style={{ cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            [i]
                            {showTooltip && (
                              <span
                                className="tooltip-text"
                              >
                                Max Upload Size 3 MB and Required ratio is 16:9
                              </span>
                            )}
                          </span>
                        </label>

                       
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={() => setShowUploader(true)}
                          className="custom-upload-button input-upload-button"
                        >
                          <span
                            className="upload-button-label"
                          >
                            Choose file
                          </span>
                          <span
                            className="upload-button-value"
                          >
                            No file chosen
                          </span>
                        </span>

                      
                        {showUploader && (
                          <ProjectBannerUpload
                            onClose={() => setShowUploader(false)}
                            includeInvalidRatios={false}
                            selectedRatioProp={selectedRatios}
                            showAsModal={true}
                            label={dynamicLabel}
                            description={dynamicDescription}
                            onContinue={handleCropComplete}
                          />
                        )}

                       
                        <div className="mt-2 d-flex flex-wrap">
                          {Array.isArray(formData.cover_image_16by9) && formData.cover_image_16by9.length > 0 ? (
                            formData.cover_image_16by9.map((file, index) => (
                              <div
                                key={index}
                                className="position-relative"
                                style={{ marginRight: "10px", marginBottom: "10px" }}
                              >
                                <img
                                  src={file.preview}
                                  alt={file.name}
                                  className="img-fluid rounded"
                                  style={{
                                    maxWidth: "100px",
                                    maxHeight: "100px",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                            ))
                          ) : croppedImage ? (
                            <div className="position-relative">
                              <img
                                src={croppedImage}
                                alt="Cover Preview"
                                className="img-fluid rounded"
                                style={{
                                  maxWidth: "100px",
                                  maxHeight: "100px",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          ) : formData.existingCoverImage ? (
                            <div className="position-relative">
                              <img
                                src={formData.existingCoverImage.url}
                                alt="Existing Cover"
                                className="img-fluid rounded"
                                style={{
                                  maxWidth: "100px",
                                  maxHeight: "100px",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          ) : (
                            <span>No image selected</span>
                          )}
                        </div>
                      </div>
                    </div> */}

                    <div className="col-md-3">
                      <div className="form-group mt-3">
                        <label>Mark Important</label>
                        <div className="d-flex">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="is_important"
                              value="true"
                              checked={formData.is_important === true}
                              onChange={handleRadioChange}
                            />
                            <label
                              className="form-check-label"
                              style={{ color: "black" }}
                            >
                              Yes
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="is_important"
                              value="false"
                              checked={formData.is_important === false}
                              onChange={handleRadioChange}
                            />
                            <label
                              className="form-check-label"
                              style={{ color: "black" }}
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Share With Radio Buttons */}

                    <div className="col-md-3">
                      <div className="form-group mt-3">
                        <label>Send Email</label>
                        <div className="d-flex">
                          {/* Yes Option */}
                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="email_trigger_enabled"
                              value="true"
                              checked={formData.email_trigger_enabled === true} // Compare as boolean
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  email_trigger_enabled:
                                    e.target.value === "true", // Convert to boolean
                                }))
                              }
                              required
                            />
                            <label
                              className="form-check-label"
                              style={{ color: "black" }}
                            >
                              Yes
                            </label>
                          </div>

                          {/* No Option */}
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="email_trigger_enabled"
                              value="false"
                              checked={formData.email_trigger_enabled === false} // Compare as boolean
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  email_trigger_enabled:
                                    e.target.value === "true", // Convert to boolean
                                }))
                              }
                              required
                            />
                            <label
                              className="form-check-label"
                              style={{ color: "black" }}
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3 mt-3">
                      <div className="form-group">
                        <label>RSVP Action</label>
                        <div className="d-flex">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="rsvp_action"
                              value="yes"
                              checked={formData.rsvp_action === "yes"}
                              onChange={handleChange}
                              required
                            />
                            <label
                              className="form-check-label"
                              style={{ color: "black" }}
                            >
                              Yes
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="rsvp_action"
                              value="no"
                              checked={formData.rsvp_action === "no"}
                              onChange={handleChange}
                              required
                            />
                            <label
                              className="form-check-label"
                              style={{ color: "black" }}
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Show RSVP Name and RSVP Number only if RSVP Action is "yes" */}
                    {formData.rsvp_action === "yes" && (
                      <>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>RSVP Name</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter RSVP Name"
                              name="rsvp_name"
                              value={formData.rsvp_name || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>RSVP Number</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter RSVP Number"
                              name="rsvp_number"
                              value={formData.rsvp_number || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* <div className="col-md-3">
                      <div className="form-group">
                        <label>Event Shared</label>
                        <input
                          className="form-control"
                          type="text"
                          name="shared"
                          placeholder="Enter Event Shared"
                          value={formData.shared}
                          onChange={handleChange}
                        />
                      </div>
                    </div> */}

                    <div className="col-md-6">
                      <label className="form-label">Set Reminders</label>

                      {/* Input fields for adding new reminders */}
                      <div className="row mb-2">
                        <div className="col-md-4">
                          <SelectBox
                            options={timeOptions}
                            value={reminderUnit || ""}
                            onChange={(value) => {
                              setReminderUnit(value);
                              setReminderValue("");
                            }}
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Value"
                            value={reminderValue}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              const unit = reminderUnit;
                              const constraints = timeConstraints[unit] || {
                                min: 0,
                                max: Infinity,
                              };
                              if (
                                val >= constraints.min &&
                                val <= constraints.max
                              ) {
                                setReminderValue(e.target.value);
                              }
                            }}
                            min={timeConstraints[reminderUnit]?.min || 0}
                            max={timeConstraints[reminderUnit]?.max || ""}
                            title={
                              reminderUnit
                                ? `Must be between ${timeConstraints[reminderUnit].min} to ${timeConstraints[reminderUnit].max} ${reminderUnit}`
                                : "Please select a time unit first"
                            }
                            disabled={!reminderUnit}
                          />
                        </div>

                        <div className="col-md-4">
                          <button
                            type="button"
                            className="btn btn-danger w-100"
                            onClick={handleAddReminder}
                            disabled={!reminderValue || !reminderUnit}
                            style={{
                              height: "35px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            + Add
                          </button>
                        </div>
                      </div>

                      {/* Display added reminders */}
                      {formData.set_reminders_attributes
                        .filter((reminder) => !reminder._destroy)
                        .map((reminder, index) => (
                          <div className="row mb-2" key={index}>
                            <div className="col-md-4">
                              <select
                                className="form-control"
                                value={reminder.unit}
                                disabled
                                style={{ backgroundColor: "#f8f9fa" }}
                              >
                                {timeOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <input
                                type="number"
                                className="form-control"
                                value={reminder.value}
                                readOnly
                                style={{ backgroundColor: "#f8f9fa" }}
                              />
                            </div>

                            <div className="col-md-4">
                              <button
                                type="button"
                                className="btn btn-danger w-100"
                                onClick={() => handleRemoveReminder(index)}
                                style={{
                                  height: "35px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="col-md-4">
                      <div className="form-group mt-3">
                        <label>Share With</label>
                        <div className="d-flex gap-3">
                          {/* All */}
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="shared"
                              value="all"
                              checked={formData.shared === "all"}
                              onChange={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  shared: "all",
                                  user_id: [],
                                  group_id: "",
                                }))
                              }
                            />
                            <label
                              className="form-check-label"
                              style={{ color: "black" }}
                            >
                              All
                            </label>
                          </div>
                          {/* Individuals */}
                          <div className="form-check">
                            <input
                              className="form-check-input"
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
                              disabled={
                                !eventUserID || eventUserID.length === 0
                              }
                            />
                            <label
                              className="form-check-label"
                              style={{
                                color:
                                  !eventUserID || eventUserID.length === 0
                                    ? "gray"
                                    : "black",
                              }}
                            >
                              Individuals
                            </label>
                          </div>
                          {/* Groups */}
                          {/* <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="shared"
                              value="group"
                              checked={formData.shared === "group"}
                              onChange={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  shared: "group",
                                  user_id: [],
                                  group_id: [], // Reset to empty array
                                }))
                              }
                            />
                            <label
                              className="form-check-label"
                              style={{
                                color:
                                  !groups || groups.length === 0
                                    ? "black"
                                    : "black",
                              }}
                            >
                              Groups
                            </label>
                          </div> */}
                        </div>
                      </div>

                      {/* Individuals MultiSelect */}
                      {formData.shared === "individual" && (
                        <div className="form-group">
                          <label>Event User ID</label>
                          <MultiSelectBox
                            options={eventUserID?.map((user) => ({
                              value: user.id,
                              label: `${user.firstname} ${user.lastname}`,
                            }))}
                            value={
                              Array.isArray(formData.user_id)
                                ? formData.user_id.map((userId) => {
                                    const user = eventUserID.find(
                                      (u) => u.id === userId
                                    );
                                    return user
                                      ? {
                                          value: userId,
                                          label: `${user.firstname} ${user.lastname}`,
                                        }
                                      : {
                                          value: userId,
                                          label: `User ${userId}`,
                                        };
                                  })
                                : []
                            }
                            onChange={(selectedOptions) =>
                              setFormData((prev) => ({
                                ...prev,
                                user_id: selectedOptions.map(
                                  (option) => option.value
                                ),
                              }))
                            }
                          />
                        </div>
                      )}

                      {/* Groups MultiSelect */}
                      {/* {formData.shared === "group" && (
                        <div className="form-group">
                          <label>Share with Groups</label>
                          <MultiSelectBox
                            options={groups?.map((group) => ({
                              value: group.id,
                              label: group.name,
                            }))}
                            value={
                              formData.group_id
                                ? formData.group_id.split(",").map((id) => ({
                                  value: id,
                                  label:
                                    groups.find(
                                      (group) => group.id.toString() === id
                                    )?.name || `Group ${id}`,
                                }))
                                : []
                            }
                            onChange={(selectedOptions) =>
                              setFormData((prev) => ({
                                ...prev,
                                group_id: selectedOptions.map(
                                  (option) => option.value
                                ),
                              }))
                            }
                          />
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card mt-3 pb-4 mx-4">
                <div className="card-header3">
                  <h3 className="card-title">File Upload</h3>
                </div>
                <div className="card-body mt-0 pb-0">
                  <div className="row"></div>

                  <div className="d-flex justify-content-between align-items-end mx-1">
                    <h5 className="mt-3">
                      Cover Image{" "}
                      <span
                        className="tooltip-container"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        [i]
                        {showTooltip && (
                          <span className="tooltip-text">
                            Max Upload Size 3 MB and Required ratio is 16:9
                          </span>
                        )}
                      </span>
                    </h5>

                    <button
                      className="purple-btn2 rounded-3"
                      type="button"
                      onClick={() => setShowCoverUploader(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span>Add</span>
                    </button>
                  </div>

                  {showCoverUploader && (
                    <ProjectBannerUpload
                      onClose={() => setShowCoverUploader(false)}
                      includeInvalidRatios={false}
                      selectedRatioProp={selectedCoverRatios}
                      showAsModal={true}
                      label={coverImageLabel}
                      description={dynamicCoverDescription}
                      onContinue={(validImages) =>
                        handleCoverImageCropComplete(validImages, "cover_image")
                      }
                    />
                  )}

                  <div className="col-md-12 mt-2">
                    <div className="mt-4 tbl-container">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>File Name</th>
                            <th>Preview</th>
                            <th>Ratio</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.cover_image?.document_url && (
                            <tr>
                              <td>
                                {formData.cover_image.document_file_name ||
                                  formData.cover_image.file_name ||
                                  formData.cover_image.document_url
                                    ?.split("/")
                                    ?.pop() ||
                                  "Cover Image"}
                              </td>
                              <td>
                                <img
                                  src={formData.cover_image.document_url}
                                  alt="Cover Preview"
                                  className="img-fluid rounded"
                                  style={{
                                    maxWidth: "100px",
                                    maxHeight: "100px",
                                    objectFit: "cover",
                                  }}
                                />
                              </td>
                              <td>N/A</td>
                              <td>
                                <button
                                  type="button"
                                  className="purple-btn2"
                                  onClick={() =>
                                    handleFetchedDiscardGallery("cover_image")
                                  }
                                >
                                  x
                                </button>
                              </td>
                            </tr>
                          )}

                          {coverImageRatios.flatMap(({ key, label }) => {
                            const files = Array.isArray(formData[key])
                              ? formData[key]
                              : formData[key]
                              ? [formData[key]]
                              : [];

                            if (files.length === 0) return [];

                            return files.map((file, index) => {
                              const preview =
                                file.preview || file.document_url || "";
                              const name =
                                file.name ||
                                file.document_file_name ||
                                `Image ${index + 1}`;
                              const ratio = file.ratio || label;

                              return (
                                <tr key={`${key}-${file.id || index}`}>
                                  <td>{name}</td>
                                  <td>
                                    {preview ? (
                                      <img
                                        style={{
                                          maxWidth: 100,
                                          maxHeight: 100,
                                          objectFit: "cover",
                                        }}
                                        className="img-fluid rounded"
                                        src={preview}
                                        alt={name}
                                        onError={(e) => {
                                          console.error(
                                            `Failed to load image: ${preview}`
                                          );
                                          e.target.src =
                                            "https://via.placeholder.com/100?text=Preview+Failed";
                                        }}
                                      />
                                    ) : (
                                      <span>No Preview Available</span>
                                    )}
                                  </td>
                                  <td>{ratio}</td>
                                  <td>
                                    <button
                                      type="button"
                                      className="purple-btn2"
                                      onClick={() =>
                                        handleFetchedDiscardGallery(
                                          key,
                                          index,
                                          file.id
                                        )
                                      }
                                    >
                                      x
                                    </button>
                                  </td>
                                </tr>
                              );
                            });
                          })}

                          {coverImageRatios.every(
                            ({ key }) =>
                              !(formData[key] && formData[key].length > 0)
                          ) && (
                            <tr>
                              {/* <td colSpan="4" className="text-center">No event images uploaded</td> */}
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* <div className="d-flex justify-content-between align-items-end mx-1">
                    <h5 className="mt-3">
                      Event Attachment{" "}
                      <span
                        className="tooltip-container"
                        onMouseEnter={() => setShowAttachmentTooltip(true)}
                        onMouseLeave={() => setShowAttachmentTooltip(false)}
                      >
                        [i]
                        {showAttachmentTooltip && (
                          <span className="tooltip-text">
                            Max Upload Size 3 MB and Required ratio is 16:9
                          </span>
                        )}
                      </span>
                    </h5>
                    <button
                      className="purple-btn2 rounded-3"
                      type="button"
                      onClick={() => setShowEventUploader(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span>Add</span>
                    </button>
                    {showEventUploader && (
                      <ProjectBannerUpload
                        onClose={() => setShowEventUploader(false)}
                        includeInvalidRatios={false}
                        selectedRatioProp={selectedEventRatios}
                        showAsModal={true}
                        label={eventImageLabel}
                        description={dynamicEventDescription}
                        onContinue={(validImages) =>
                          handleEventImageCropComplete(
                            validImages,
                            "event_images"
                          )
                        }
                      />
                    )}
                  </div>
                  <div className="col-md-12 mt-2">
                    <div
                      className="mt-4 tbl-container"
                      style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>File Name</th>
                            <th>Preview</th>
                            <th>Ratio</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {eventImageRatios.flatMap(({ key, label }) => {
                            const files = Array.isArray(formData[key])
                              ? formData[key]
                              : formData[key]
                              ? [formData[key]]
                              : [];

                            if (files.length === 0) return [];

                            return files.map((file, index) => {
                              const preview =
                                file.preview || file.document_url || "";
                              const name =
                                file.name ||
                                file.document_file_name ||
                                `Image ${index + 1}`;
                              const ratio = file.ratio || label;

                              return (
                                <tr key={`${key}-${file.id || index}`}>
                                  <td>{name}</td>
                                  <td>
                                    {preview ? (
                                      <img
                                        style={{
                                          maxWidth: 100,
                                          maxHeight: 100,
                                          objectFit: "cover",
                                        }}
                                        className="img-fluid rounded"
                                        src={preview}
                                        alt={name}
                                        onError={(e) => {
                                          console.error(
                                            `Failed to load image: ${preview}`
                                          );
                                          e.target.src =
                                            "https://via.placeholder.com/100?text=Preview+Failed";
                                        }}
                                      />
                                    ) : (
                                      <span>No Preview Available</span>
                                    )}
                                  </td>
                                  <td>{ratio}</td>
                                  <td>
                                    <button
                                      type="button"
                                      className="purple-btn2"
                                      onClick={() =>
                                        handleFetchedDiscardGallery(key, index, file.id)
                                      }
                                    >
                                      x
                                    </button>
                                  </td>
                                </tr>
                              );
                            });
                          })}

                          {eventImageRatios.every(
                            ({ key }) =>
                              !(formData[key] && formData[key].length > 0)
                          ) && (
                            <tr>
                            
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div> */}

                  <div className="d-flex justify-content-between align-items-end mx-1">
                    <h5 className="mt-3">
                      Event Attachment{" "}
                      <span
                        className="tooltip-container"
                        onMouseEnter={() => setShowAttachmentTooltip(true)}
                        onMouseLeave={() => setShowAttachmentTooltip(false)}
                      >
                        [i]
                        {showAttachmentTooltip && (
                          <span className="tooltip-text">
                            Max Upload Size for video 10 MB and for image 3 MB
                          </span>
                        )}
                      </span>
                    </h5>
                    <button
                      className="purple-btn2 rounded-3"
                      type="button"
                      onClick={() => setShowEventUploader(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span>Add</span>
                    </button>
                    {showEventUploader && (
                      <ProjectImageVideoUpload
                        onClose={() => setShowEventUploader(false)}
                        includeInvalidRatios={false}
                        selectedRatioProp={selectedEventRatios}
                        showAsModal={true}
                        label={eventImageLabel}
                        description={dynamicEventDescription}
                        onContinue={(validImages, videoFiles) =>
                          handleEventCroppedImages(
                            validImages,
                            videoFiles,
                            "event"
                          )
                        }
                        allowVideos={true}
                      />
                    )}
                  </div>

                  <div className="col-md-12 mt-2">
                    <div
                      className="mt-4 tbl-container"
                      style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>File Name</th>
                            <th>Preview</th>
                            <th>Ratio</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(formData.attachfile) &&
                            formData.attachfile.map((file) => (
                              <tr key={`attachfile-${file.id}`}>
                                <td>{file.document_file_name || "N/A"}</td>
                                <td>
                                  {file.document_url && (
                                    <img
                                      style={{
                                        maxWidth: "100px",
                                        maxHeight: "100px",
                                      }}
                                      className="img-fluid rounded"
                                      src={file.document_url}
                                      alt={
                                        file.document_file_name ||
                                        "Attached file"
                                      }
                                    />
                                  )}
                                </td>
                                <td>N/A</td>
                                <td>
                                  <button
                                    type="button"
                                    className="purple-btn2"
                                    onClick={() =>
                                      handleFetchedDiscardGallery(file.id)
                                    }
                                    title="Remove attached file"
                                  >
                                    ×
                                  </button>
                                </td>
                              </tr>
                            ))}
                          {eventImageRatios.flatMap(({ key, label }) => {
                            const files = Array.isArray(formData[key])
                              ? formData[key]
                              : formData[key]
                              ? [formData[key]]
                              : [];

                            if (files.length === 0) return [];

                            return files.map((file, index) => {
                              const preview =
                                file.preview || file.document_url || "";
                              const name =
                                file.name ||
                                file.document_file_name ||
                                `File ${index + 1}`;
                              const ratio = file.ratio || label;
                              const isVideo =
                                file.type === "video" ||
                                (file.file &&
                                  file.file.type.startsWith("video/")) ||
                                (preview &&
                                  [".mp4", ".webm", ".ogg"].some((ext) =>
                                    preview.toLowerCase().endsWith(ext)
                                  ));

                              return (
                                <tr key={`${key}-${file.id || index}`}>
                                  <td>{name}</td>
                                  <td>
                                    {isVideo ? (
                                      <video
                                        controls
                                        style={{
                                          maxWidth: 100,
                                          maxHeight: 100,
                                          objectFit: "cover",
                                        }}
                                        className="img-fluid rounded"
                                      >
                                        <source
                                          src={preview}
                                          type={file.file?.type || "video/mp4"}
                                        />
                                        Your browser does not support the video
                                        tag.
                                      </video>
                                    ) : (
                                      <img
                                        style={{
                                          maxWidth: 100,
                                          maxHeight: 100,
                                          objectFit: "cover",
                                        }}
                                        className="img-fluid rounded"
                                        src={preview}
                                        alt={name}
                                        onError={(e) => {
                                          console.error(
                                            `Failed to load image: ${preview}`
                                          );
                                          e.target.src =
                                            "https://via.placeholder.com/100?text=Preview+Failed";
                                        }}
                                      />
                                    )}
                                  </td>
                                  <td>{ratio}</td>
                                  <td>
                                    <button
                                      type="button"
                                      className="purple-btn2"
                                      onClick={() =>
                                        handleFetchedDiscardGallery(
                                          key,
                                          index,
                                          file.id
                                        )
                                      }
                                    >
                                      x
                                    </button>
                                  </td>
                                </tr>
                              );
                            });
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-2 justify-content-center">
                <div className="col-md-2">
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    className="purple-btn2 w-100"
                    disabled={loading}
                  >
                    Submit
                  </button>
                </div>

                <div className="col-md-2">
                  <button
                    type="button"
                    className="purple-btn2 w-100"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventEdit;
