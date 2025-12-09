import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import { ChevronRight, ArrowLeft } from "lucide-react";
import SelectBox from "../components/ui/select-box";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import ProjectImageVideoUpload from "../components/reusable/ProjectImageVideoUpload";

const BannerAdd = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [previewImg, setPreviewImg] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [showVideoTooltip, setShowVideoTooltip] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    project_id: "",
    banner_video: null,
    active: true,
    banner_video_1_by_1: null,
    banner_video_9_by_16: null,
    banner_video_16_by_9: null,
    banner_video_3_by_2: null,
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${baseURL}projects.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
        setProjects(response.data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    return () => {
      if (previewImg) URL.revokeObjectURL(previewImg);
      if (previewVideo) URL.revokeObjectURL(previewVideo);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is mandatory";
    if (!formData.project_id) newErrors.project_id = "Project is mandatory";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const project_banner = [
    { key: "banner_video_1_by_1", label: "1:1" },
    { key: "banner_video_16_by_9", label: "16:9" },
    { key: "banner_video_9_by_16", label: "9:16" },
    { key: "banner_video_3_by_2", label: "3:2" },
  ];

  const bannerUploadConfig = {
    "Banner Attachment": ["1:1", "9:16", "16:9", "3:2"],
  };

  const currentUploadType = "Banner Attachment";
  const selectedRatios = bannerUploadConfig[currentUploadType] || [];
  const dynamicLabel = currentUploadType.replace(/(^\w|\s\w)/g, (m) =>
    m.toUpperCase()
  );
  const dynamicDescription = `Supports ${selectedRatios.join(
    ", "
  )} aspect ratios`;

  const updateFormData = (key, files) => {
    setFormData((prev) => ({
      ...prev,
      [key]: files, // Replace existing files instead of appending
    }));
  };

  const handleCropComplete = (validImages, videoFiles = []) => {
    // Handle video files first
    if (videoFiles && videoFiles.length > 0) {
      videoFiles.forEach((video) => {
        const formattedRatio = video.ratio.replace(":", "_by_");
        const key = `banner_video_${formattedRatio}`;
        updateFormData(key, [video]);

        // Set preview for the first video
        if (videoFiles[0] === video) {
          setPreviewVideo(URL.createObjectURL(video.file));
        }
      });
      setShowUploader(false); // Close modal here
      return;
    }

    // Handle images
    if (!validImages || validImages.length === 0) {
      toast.error("No valid files selected.");
      setShowUploader(false);
      return;
    }

    validImages.forEach((img) => {
      const formattedRatio = img.ratio.replace(":", "_by_");
      const key = `banner_video_${formattedRatio}`;
      updateFormData(key, [img]);

      // Set preview for the first image
      if (validImages[0] === img) {
        setPreviewImg(img.preview);
      }
    });

    setShowUploader(false); // Ensure modal closes after image handling
  };

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

    // If the removed image is being previewed, reset preview
    if (previewImg === imageToRemove.preview) {
      setPreviewImg(null);
    }
    if (previewVideo === imageToRemove.preview) {
      setPreviewVideo(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const sendData = new FormData();
      sendData.append("banner[title]", formData.title);
      sendData.append("banner[project_id]", formData.project_id);

      // Handle banner video/image fields
      Object.entries(formData).forEach(([key, images]) => {
        if (
          (key.startsWith("banner_video_") ||
            key.startsWith("banner_image_")) &&
          Array.isArray(images)
        ) {
          images.forEach((img) => {
            if (img.file instanceof File) {
              sendData.append(`banner[${key}]`, img.file);
            }
          });
        }
      });

      console.log("data to be sent:", Array.from(sendData.entries()));

      await axios.post(`${baseURL}banners.json`, sendData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Banner created successfully");
      navigate("/banner-list");
    } catch (error) {
      console.error(error);
      toast.error(`Error creating banner: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
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
            <span className="text-gray-400">Banner</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Create Banner</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CREATE BANNER</h1>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Banner Information</h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Title Input */}
              <div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-0">
                    Title <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter title"
                  />
                  {errors.title && (
                    <span className="text-red-500 text-sm">{errors.title}</span>
                  )}
                </div>
              </div>

              {/* Project Select */}
              <div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-0">
                    Project <span className="text-red-500 ml-1">*</span>
                  </label>
                  <SelectBox
                    options={projects.map((project) => ({
                      label: project.project_name,
                      value: project.id,
                    }))}
                    value={formData.project_id}
                    onChange={(value) =>
                      setFormData({ ...formData, project_id: value })
                    }
                  />
                  {errors.project_id && (
                    <span className="text-red-500 text-sm">{errors.project_id}</span>
                  )}
                </div>
              </div>

              {/* Banner Attachment Upload */}
              <div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-0">
                    Banner Attachment{" "}
                    <span
                      className="relative inline-block cursor-help"
                      onMouseEnter={() => setShowVideoTooltip(true)}
                      onMouseLeave={() => setShowVideoTooltip(false)}
                    >
                      <span className="text-blue-500">[i]</span>
                      {showVideoTooltip && (
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap z-10">
                          Supports 1:1, 9:16, 16:9, 3:2 aspect ratios
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
                    <ProjectImageVideoUpload
                      onClose={() => setShowUploader(false)}
                      includeInvalidRatios={false}
                      selectedRatioProp={selectedRatios}
                      showAsModal={true}
                      label={dynamicLabel}
                      description={dynamicDescription}
                      onContinue={handleCropComplete}
                      allowVideos={true}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Media Table */}
            <div className="mt-6">
              <div
                className="rounded-lg border border-gray-200 overflow-hidden"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                <Table className="border-separate">
                  <TableHeader
                    className="sticky top-0 z-10"
                    style={{ backgroundColor: "#e6e2d8" }}
                  >
                    <TableRow className="hover:bg-gray-50">
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
                    {project_banner.map(({ key, label }) => {
                      const files = Array.isArray(formData[key])
                        ? formData[key]
                        : formData[key]
                        ? [formData[key]]
                        : [];

                      return files.map((file, index) => {
                        const preview = file.preview || file.document_url || "";
                        const name = file.name || file.document_file_name || "Unnamed";
                        const isVideo =
                          file.type === "video" ||
                          file.file?.type?.startsWith("video/") ||
                          preview.endsWith(".mp4") ||
                          preview.endsWith(".webm") ||
                          preview.endsWith(".gif") ||
                          preview.endsWith(".ogg");

                        return (
                          <TableRow
                            key={`${key}-${index}`}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <TableCell className="py-3 px-4 font-medium">
                              {name}
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              {isVideo ? (
                                <video
                                  controls
                                  className="rounded border border-gray-200"
                                  style={{ maxWidth: 100, maxHeight: 100 }}
                                >
                                  <source
                                    src={preview}
                                    type={
                                      file.file?.type ||
                                      `video/${preview.split(".").pop()}`
                                    }
                                  />
                                  Your browser does not support the video tag.
                                </video>
                              ) : (
                                <img
                                  className="rounded border border-gray-200"
                                  style={{ maxWidth: 100, maxHeight: 100 }}
                                  src={preview}
                                  alt={name}
                                />
                              )}
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              {file.ratio || label}
                            </TableCell>
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
                        );
                      });
                    })}
                    {project_banner.every(
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
              type="button"
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

export default BannerAdd;
