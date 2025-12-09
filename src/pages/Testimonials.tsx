import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import { ChevronRight, ArrowLeft } from "lucide-react";
import SelectBox from "@/components/ui/select-box";
import ProjectBannerUpload from "../components/reusable/ProjectBannerUpload";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const Testimonials = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const navigate = useNavigate();
  const [companySetupOptions, setCompanySetupOptions] = useState([]);
  const [companySetupId, setCompanySetupId] = useState("");
  const [userName, setUserName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [userProfile, setUserProfile] = useState(""); // State for user profile
  const [userType, setUserType] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [buildingTypeOptions, setBuildingTypeOptions] = useState([]);
  const [buildingTypeId, setBuildingTypeId] = useState("");
  const [buildingType, setBuildingType] = useState({ id: "", name: "" });
  const [showTooltip, setShowTooltip] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [errors, setErrors] = useState({});
  const [showVideoTooltip, setShowVideoTooltip] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [image, setImage] = useState([]);
  const [croppedImage, setCroppedImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    testimonial_video: null,
    attachfile: null,
    preview_image_16_by_9: [],
    preview_image_3_by_2: [],
    preview_image_1_by_1: [],
    preview_image_9_by_16: [],
  });


  const TestimonialImageRatios = [
    { key: "preview_image_1_by_1", label: "1:1" },
    { key: "preview_image_16_by_9", label: "16:9" },
    { key: "preview_image_9_by_16", label: "9:16" },
    { key: "preview_image_3_by_2", label: "3:2" },
  ];



  const handleBannerVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          testimonial_video: "",
        }));
        toast.error("Video size must be less than 10MB.");
        return;
      }

      setErrors((prev) => ({ ...prev, testimonial_video: "" }));
      setPreviewVideo(URL.createObjectURL(file));

      setFormData((prev) => ({
        ...prev,
        testimonial_video: file,
      }));
    }
  };

  useEffect(() => {
    const fetchCompanySetups = async () => {
      try {
        const response = await axios.get(`${baseURL}company_setups.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Raw API Response:", response.data);

        if (response.data && Array.isArray(response.data.company_setups)) {
          setCompanySetupOptions(response.data.company_setups);
        } else {
          console.warn("Unexpected API response format:", response.data);
          setCompanySetupOptions([]);
        }
      } catch (error) {
        console.error("Error fetching company setup data:", error);

        if (error.response) {
          console.error("API Response Error:", error.response.data);
        }
        setCompanySetupOptions([]);
      }
    };

    fetchCompanySetups();
  }, []);

  useEffect(() => {
    const fetchBuildingTypes = async () => {
      try {
        const response = await axios.get(`${baseURL}building_types.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setBuildingTypeOptions(response.data);
        }
      } catch (error) {
        console.error("Error fetching building type data:", error);
      }
    };

    fetchBuildingTypes();
  }, []);

  const handleImageUpload = (newImageList) => {
    if (!newImageList || newImageList.length === 0) return;

    const file = newImageList[0].file;
    if (!file) return;

    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
      "image/tiff",
    ];

    const fileType = file.type;
    const sizeInMB = file.size / (1024 * 1024);

    if (!allowedImageTypes.includes(fileType)) {
      toast.error(" Please upload a valid image file.");
      return;
    }

    if (sizeInMB > 3) {
      toast.error(" Image size must be less than 3MB.");
      return;
    }

    setImage(newImageList);
    setDialogOpen(true); // Open cropper for images
  };

  const bannerUploadConfig = {
    "preview image": ["16:9", "1:1", "9:16", "3:2"],
  };

  const currentUploadType = "preview image"; // Can be dynamic
  const selectedRatios = bannerUploadConfig[currentUploadType] || [];
  const dynamicLabel = currentUploadType.replace(/(^\w|\s\w)/g, (m) =>
    m.toUpperCase()
  );
  const dynamicDescription = `Supports ${selectedRatios.join(
    ", "
  )} aspect ratios`;

const updateFormData = (key, files) => {
  setFormData((prev) => {
    const newData = {
      ...prev,
      [key]: [...(prev[key] || []), ...files],
    };
    console.log(`Updated formData for key ${key}:`, newData[key]); // Debugging
    return newData;
  });
};

const handleCropComplete = (validImages) => {
  if (!validImages || validImages.length === 0) {
    toast.error("No valid images selected.");
    setShowUploader(false);
    return;
  }

  const ratioKeyMap = {
    "1:1": "preview_image_1_by_1",
    "16:9": "preview_image_16_by_9",
    "9:16": "preview_image_9_by_16",
    "3:2": "preview_image_3_by_2",
  };

  validImages.forEach((img) => {
    const key = ratioKeyMap[img.ratio];
    if (key) {
      updateFormData(key, [img]); // Append new image to existing ones
    }
  });

  // Only update preview if needed (e.g., for UI display of the latest image)
  setPreviewImg(validImages[0].preview);
  setShowUploader(false);
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

  const isImageFile = (file) => {
    if (!file) return false;
    const imageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
      "image/tiff",
    ];
    if (typeof file === "string") {
      if (file.startsWith("data:image")) return true;
      const extension = file.split(".").pop().toLowerCase();
      return [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "svg",
        "bmp",
        "tiff",
      ].includes(extension);
    }

    return imageTypes.includes(file.type);
  };

  const validateForm = (formData) => {
    const errors = [];

    // if (!formData.testimonial_video) {
    //   errors.push("Testimonial video is required.");
    //   return errors; // Return the first error immediately
    // }
    // if (!formData?.attachfile) {
    //   errors.push("Preview image is required.");
    //   return errors; // Return the first error immediately
    // }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    setLoading(true);
    toast.dismiss();

    // const hasProjectBanner1by1 = formData.preview_image_16_by_9
    // && formData.preview_image_16_by_9.some(img => img.file instanceof File);

    // if (!hasProjectBanner1by1) {
    //   toast.error("Preview Image with 16:9 ratio is required.");
    //   setLoading(false);
    //   setIsSubmitting(false);
    //   return;
    // }

    // const validationErrors = validateForm();
    // if (validationErrors.length > 0) {
    //   validationErrors.forEach((error) => toast.error(error));
    //   setLoading(false);
    //   return;
    // }

    const form = new FormData();
    form.append("testimonial[user_name]", userName.trim());
    form.append("testimonial[content]", content.trim());
    form.append("testimonial[building_id]", buildingTypeId?.toString() || "");
    form.append(
      "testimonial[building_type]",
      buildingTypeOptions.find((option) => option.id === buildingTypeId)
        ?.building_type || ""
    );

    if (formData.testimonial_video) {
      form.append("testimonial[testimonial_video]", formData.testimonial_video);
    }

    // ✅ Only use File for preview_image
    // if (formData.attachfile instanceof File) {
    //   form.append("testimonial[preview_image]", formData.attachfile);
    // }

    // Object.entries(formData).forEach(([key, images]) => {
    //   if (key.startsWith("video_preview_image_url") && Array.isArray(images)) {
    //     images.forEach((img) => {
    //       const backendField =
    //         key.replace("video_preview_image_url", "testimonial[video_preview_image_url") + "]";
    //       // e.g., preview[preview_image_1by1]
    //       if (img.file instanceof File) {
    //         form.append(backendField, img.file);
    //       }
    //     });
    //   }
    // });

    TestimonialImageRatios.forEach(({ key }) => {
      const images = formData[key];
      if (Array.isArray(images) && images.length > 0) {
        const img = images[0];
        if (img?.file instanceof File) {
          form.append(`testimonial[${key}]`, img.file);
        }
      }
    });

    // ✅ Append video URL if provided
    if (videoUrl && videoUrl.trim()) {
      form.append("testimonial[video_url]", videoUrl.trim());
    }

    console.log("data to be sent:", Array.from(form.entries()));
    try {
      console.log("data to be sent:", Array.from(form.entries()));

      const response = await axios.post(`${baseURL}testimonials.json`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Data saved successfully!");
      // reset all
      setUserName("");
      setVideoUrl("");
      setImagePreview("");
      setUserProfile("");
      setUserType("");
      setContent("");
      setPreviewVideo(null);
      setPreviewImg(null);
      setFormData({
        testimonial_video: null,
        attachfile: null,
        video_preview_image_url: "",
      });
      navigate("/testimonial-list");
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      toast.error("Failed to submit. Please check your input.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // This navigates back one step in history
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
            <span className="text-gray-400">Setup Member</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Testimonial</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Create Testimonial</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CREATE TESTIMONIAL</h1>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Testimonial Information</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* User Name */}
              <div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-0">
                    User Name
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                    type="text"
                    name="userName"
                    placeholder="Enter user name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
              </div>

              {/* Building Type */}
              <div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-0">
                    Building Type
                  </label>
                  <SelectBox
                    options={buildingTypeOptions.map((option) => ({
                      label: option.building_type,
                      value: option.id,
                    }))}
                    value={buildingTypeId}
                    onChange={(value) => setBuildingTypeId(value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-0">
                    Description
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                    type="text"
                    name="content"
                    placeholder="Enter Description"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
              </div>

              {/* Video URL */}
              <div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-0">
                    Video URL
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                    type="text"
                    name="videoUrl"
                    placeholder="Enter video URL"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </div>
              </div>

              {/* Testimonial Video */}
              <div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-0">
                    Testimonial Video{" "}
                    <span
                      className="relative inline-block cursor-help"
                      onMouseEnter={() => setShowVideoTooltip(true)}
                      onMouseLeave={() => setShowVideoTooltip(false)}
                    >
                      <span className="text-blue-500">[i]</span>
                      {showVideoTooltip && (
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap z-10">
                          Max Upload Size 10 MB
                        </span>
                      )}
                    </span>
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#C72030] file:text-white hover:file:bg-[#B8252F] file:cursor-pointer"
                    type="file"
                    name="testimonial_video"
                    accept="video/*"
                    onChange={handleBannerVideoChange}
                  />
                  {errors.testimonial_video && (
                    <span className="text-red-500 text-sm">
                      {errors.testimonial_video}
                    </span>
                  )}

                  {previewVideo && (
                    <video
                      src={previewVideo}
                      controls
                      className="mt-3 rounded border border-gray-200"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "150px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Preview Image */}
              <div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-0">
                    Preview Image{" "}
                    <span
                      className="relative inline-block cursor-help"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      <span className="text-blue-500">[i]</span>
                      {showTooltip && (
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap z-10">
                          Max Upload Size 3 MB - Required ratio is 16:9
                        </span>
                      )}
                    </span>
                    <span className="text-red-500 ml-1">*</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowUploader(true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <span className="text-gray-500">Choose file</span>
                    <span className="text-sm text-gray-400">No file chosen</span>
                  </button>

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
                </div>
              </div>
            </div>

            {/* Media Table */}
            <div className="mt-6">
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table className="border-separate">
                  <TableHeader>
                    <TableRow
                      className="hover:bg-gray-50"
                      style={{ backgroundColor: "#e6e2d8" }}
                    >
                      <TableHead
                        className="font-semibold text-gray-900 py-3 px-4 border-r"
                        style={{ borderColor: "#fff" }}
                      >
                        File Name
                      </TableHead>
                      <TableHead
                        className="font-semibold text-gray-900 py-3 px-4 border-r"
                        style={{ borderColor: "#fff" }}
                      >
                        Preview
                      </TableHead>
                      <TableHead
                        className="font-semibold text-gray-900 py-3 px-4 border-r"
                        style={{ borderColor: "#fff" }}
                      >
                        Ratio
                      </TableHead>
                      <TableHead
                        className="font-semibold text-gray-900 py-3 px-4"
                        style={{ borderColor: "#fff" }}
                      >
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TestimonialImageRatios.flatMap(({ key, label }) => {
                      const value = formData[key];
                      if (!value || (Array.isArray(value) && value.length === 0))
                        return [];

                      const files = Array.isArray(value) ? value : [value];

                      return files.map((file, index) => (
                        <TableRow
                          key={`${key}-${index}`}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <TableCell className="py-3 px-4 font-medium">
                            {file.name ||
                              file.document_file_name ||
                              `Image ${index + 1}`}
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <img
                              src={file.preview || file.document_url}
                              alt={file.name || `Image ${index + 1}`}
                              className="rounded border border-gray-200"
                              style={{
                                maxWidth: 100,
                                maxHeight: 100,
                                objectFit: "cover",
                              }}
                            />
                          </TableCell>
                          <TableCell className="py-3 px-4">{label}</TableCell>
                          <TableCell className="py-3 px-4">
                            <button
                              type="button"
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              onClick={() => discardImage(key, file)}
                            >
                              ×
                            </button>
                          </TableCell>
                        </TableRow>
                      ));
                    })}
                    {TestimonialImageRatios.every(
                      ({ key }) =>
                        !formData[key] ||
                        (Array.isArray(formData[key]) && formData[key].length === 0)
                    ) && (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-12 text-gray-500"
                        >
                          No files uploaded yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end gap-4 px-6 py-4 bg-gray-50 border-t border-gray-200">
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
        </div>
      </div>
    </div>
  );
};

export default Testimonials;