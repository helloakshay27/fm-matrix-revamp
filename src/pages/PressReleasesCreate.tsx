import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft, Upload, X } from "lucide-react";
import ProjectBannerUpload from "../components/reusable/ProjectBannerUpload";

const PressReleasesCreate = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    release_date: "",
    pr_image_16_by_9: [],
    pr_image_9_by_16: [],
    pr_image_1_by_1: [],
    attachment_url: "",
    press_source: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Title is mandatory");
      return false;
    }

    if (!formData.release_date) {
      toast.error("Press Releases Date is mandatory");
      return false;
    }

    if (!formData.description.trim()) {
      toast.error("Description is mandatory");
      return false;
    }

    // Check if at least one image ratio is uploaded
    const hasAnyImage =
      (formData.pr_image_16_by_9 && formData.pr_image_16_by_9.length > 0) ||
      (formData.pr_image_9_by_16 && formData.pr_image_9_by_16.length > 0) ||
      (formData.pr_image_1_by_1 && formData.pr_image_1_by_1.length > 0);

    if (!hasAnyImage) {
      toast.error("At least one image attachment is mandatory");
      return false;
    }

    if (!formData.attachment_url.trim()) {
      toast.error("Attachment URL is mandatory");
      return false;
    }

    return true;
  };

  const pressUploadConfig = {
    "pr image": ["16:9", "9:16", "1:1"],
  };

  const currentUploadType = "pr image";
  const selectedRatios = pressUploadConfig[currentUploadType] || [];
  const dynamicLabel = currentUploadType.replace(/(^\w|\s\w)/g, (m) =>
    m.toUpperCase()
  );
  const dynamicDescription = `Supports ${selectedRatios.join(", ")} aspect ratios`;

  const updateFormData = (key, files) => {
    setFormData((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), ...files],
    }));
  };

  const handleCropComplete = (validImages) => {
    if (!validImages || validImages.length === 0) {
      toast.error("No valid images selected.");
      setShowUploader(false);
      return;
    }

    validImages.forEach((img) => {
      const formattedRatio = img.ratio.replace(":", "_by_");
      const key = `${currentUploadType}_${formattedRatio}`
        .replace(/\s+/g, "_")
        .toLowerCase();

      updateFormData(key, [img]);
    });

    setShowUploader(false);
    toast.success("Images uploaded successfully");
  };

  const discardImage = (key, imageToRemove) => {
    setFormData((prev) => {
      const updatedArray = (prev[key] || []).filter(
        (img) => img.id !== imageToRemove.id
      );

      const newFormData = { ...prev };
      if (updatedArray.length === 0) {
        delete newFormData[key];
      } else {
        newFormData[key] = updatedArray;
      }

      return newFormData;
    });
    toast.success("Image removed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Authentication error: Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const sendData = new FormData();
      sendData.append("press_release[title]", formData.title);
      sendData.append("press_release[release_date]", formData.release_date);
      sendData.append("press_release[press_source]", formData.press_source);
      sendData.append("press_release[description]", formData.description);

      if (formData.attachment_url) {
        sendData.append("press_release[attachment_url]", formData.attachment_url);
      }

      // Append all image ratios
      Object.entries(formData).forEach(([key, images]) => {
        if (key.startsWith("pr_image_") && Array.isArray(images)) {
          images.forEach((img) => {
            const backendField = key.replace("pr_image_", "press_release[pr_image_") + "]";
            if (img.file instanceof File) {
              sendData.append(backendField, img.file);
            }
          });
        }
      });

      await axios.post(`${baseURL}/press_releases.json`, sendData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Press release created successfully!");
      navigate("/setup-member/press-releases-list");
    } catch (error) {
      console.error("Error response:", error.response);
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Get all uploaded images for display
  const allUploadedImages = [
    ...(formData.pr_image_16_by_9 || []).map((file) => ({
      ...file,
      type: "pr_image_16_by_9",
    })),
    ...(formData.pr_image_9_by_16 || []).map((file) => ({
      ...file,
      type: "pr_image_9_by_16",
    })),
    ...(formData.pr_image_1_by_1 || []).map((file) => ({
      ...file,
      type: "pr_image_1_by_1",
    })),
  ];

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
            <span className="text-gray-400">Content</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Press Releases</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Create</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CREATE PRESS RELEASE</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Press Release Details</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                    placeholder="Enter title"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Release Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Press Releases Date
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="date"
                    name="release_date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                    value={formData.release_date}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={1}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Source Details */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Source Details
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    name="press_source"
                    rows={1}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Enter source details"
                    value={formData.press_source}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Attachment URL */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Attachment URL
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="url"
                    name="attachment_url"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                    placeholder="Enter URL"
                    value={formData.attachment_url}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Attachment Image */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span>Attachment</span>
                    <span
                      className="relative cursor-pointer text-blue-600"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      ℹ️
                      {showTooltip && (
                        <span className="absolute left-6 top-0 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                          Max Upload Size 3 MB. Ratios: 16:9, 9:16, 1:1
                        </span>
                      )}
                    </span>
                    <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowUploader(true)}
                    disabled={loading}
                    className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left text-gray-600"
                  >
                    <span className="text-sm">Choose files (multiple ratios supported)</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </button>
                  <p className="text-xs text-gray-500">
                    Upload images in different aspect ratios: 16:9 (landscape), 9:16 (portrait), 1:1 (square)
                  </p>

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

              {/* Image Preview Table */}
              {allUploadedImages.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Uploaded Images ({allUploadedImages.length})
                  </h4>
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-[#e6e2d8]">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">File Name</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Preview</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Aspect Ratio</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Dimensions</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUploadedImages.map((file, index) => (
                          <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{file.name}</td>
                            <td className="px-4 py-3">
                              <img
                                src={file.preview}
                                alt={file.name}
                                className="w-20 h-20 object-cover rounded border border-gray-200"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {file.ratio || "N/A"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {file.width && file.height ? `${file.width} × ${file.height}` : "N/A"}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                onClick={() => discardImage(file.type, file)}
                                className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove image"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-2.5 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors font-medium ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/setup-member/press-releases-list")}
                  disabled={loading}
                  className="px-8 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressReleasesCreate;