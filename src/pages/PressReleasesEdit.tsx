import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft, X } from "lucide-react";
import ProjectBannerUpload from "../components/reusable/ProjectBannerUpload";

const PressReleasesEdit = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
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

  useEffect(() => {
    if (id) {
      const fetchPressRelease = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `${baseURL}/press_releases/${id}.json`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = response.data;

          setFormData({
            title: data.title || "",
            description: data.description || "",
            release_date: data.release_date
              ? formatDateForInput(data.release_date)
              : "",
            pr_image_16_by_9: data.attachfile?.document_url
              ? [{ preview: data.attachfile.document_url, name: "existing-image.jpg", ratio: "16:9" }]
              : [],
            pr_image_9_by_16: [],
            pr_image_1_by_1: [],
            attachment_url: data.attachment_url || "",
            press_source: data.press_source || "",
          });
        } catch (error) {
          console.error("Error fetching press release:", error);
          toast.error("Failed to load press release");
        } finally {
          setLoading(false);
        }
      };

      fetchPressRelease();
    }
  }, [id]);

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "release_date" ? value : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Since only one image is allowed
    const fieldName = e.target.name;

    if (fieldName === "pr_image") {
      const allowedImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      // Maximum file size: 3MB (3 * 1024 * 1024 bytes)
      const maxFileSize = 3 * 1024 * 1024;

      // Validate file type
      if (file && !allowedImageTypes.includes(file.type)) {
        toast.error("Only image files (JPG, PNG, GIF, WebP) are allowed.");
        e.target.value = "";
        return;
      }

      // Validate file size
      if (file && file.size > maxFileSize) {
        toast.error("Image size must be less than 3MB.");
        e.target.value = "";
        return;
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        pr_image: file,
      }));
    }

    if (fieldName === "attachment_url") {
      const allowedPdfTypes = ["application/pdf"];

      // Maximum file size: 3MB (3 * 1024 * 1024 bytes) - if you want to apply same limit to PDFs
      const maxFileSize = 3 * 1024 * 1024;

      // Validate file type
      if (file && !allowedPdfTypes.includes(file.type)) {
        toast.error("Only PDF files are allowed.");
        e.target.value = "";
        return;
      }

      // Validate file size for PDFs (optional - remove if not needed)
      if (file && file.size > maxFileSize) {
        toast.error(
          `PDF file size must be 3MB or less. Current file size: ${(
            file.size /
            (1024 * 1024)
          ).toFixed(2)}MB`
        );
        e.target.value = "";
        return;
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        attachment_url: file,
      }));
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (
      !formData.title.trim() ||
      !formData.release_date ||
      !formData.description.trim() ||
      formData.pr_image.length === 0 ||
      !formData.attachment_url.trim()
    ) {
      toast.dismiss();
      toast.error("Please fill in all the required fields.");
      return false;
    }

    setErrors({});
    return true;
  };

  const pressUploadConfig = {
    "pr image": ["16:9", "9:16", "1:1"],
  };

  const currentUploadType = "pr image"; // Can be dynamic
  const selectedRatios = pressUploadConfig[currentUploadType] || [];
  const dynamicLabel = currentUploadType.replace(/(^\w|\s\w)/g, (m) =>
    m.toUpperCase()
  );
  const dynamicDescription = `Supports ${selectedRatios.join(
    ", "
  )} aspect ratios`;

  const updateFormData = (key, files) => {
    setFormData((prev) => ({
      ...prev,
      [key]: files,
    }));
  };

  const handleCropComplete = (validImages) => {
    if (!validImages || validImages.length === 0) {
      toast.error("No valid images selected.");
      setShowUploader(false);
      return;
    }

    validImages.forEach((img) => {
      const formattedRatio = img.ratio.replace(":", "_by_"); // e.g., "16:9" -> "16by9"
      const key = `${currentUploadType}_${formattedRatio}`
        .replace(/\s+/g, "_")
        .toLowerCase(); // e.g., banner_image_16by9

      updateFormData(key, [img]); // send as array to preserve consistency
    });

    // setPreviewImg(validImages[0].preview); // preview first image only
    setShowUploader(false);
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

    // If the removed image is being previewed, reset previewImg
    if (previewImg === imageToRemove.preview) {
      setPreviewImg(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("access_token");

    try {
      const sendData = new FormData();
      sendData.append("press_release[title]", formData.title);
      sendData.append("press_release[release_date]", formData.release_date);
      sendData.append("press_release[press_source]", formData.press_source);
      sendData.append("press_release[description]", formData.description);

      if (formData.attachment_url) {
        sendData.append("press_release[attachment_url]", formData.attachment_url);
      }

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

      await axios.put(`${baseURL}/press_releases/${id}.json`, sendData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Press release updated successfully!");
      navigate("/setup-member/press-releases-list");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

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
      toast.error("❌ Please upload a valid image file.");
      return;
    }

    if (sizeInMB > 3) {
      toast.error("❌ Image size must be less than 3MB.");
      return;
    }

    setImage(newImageList);
    setDialogOpen(true);
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
    return file.type && imageTypes.includes(file.type);
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
        {/* Header */}
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
            <span className="text-[#C72030] font-medium">Edit</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            EDIT PRESS RELEASE
          </h1>
        </div>

        {/* Main Content - Same structure as Create */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label>
                Title
                <span className="otp-asterisk"> *</span>
              </label>
              <input
                className="form-control"
                type="text"
                name="title"
                placeholder="Enter Title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>
                Press Release Date
                <span className="otp-asterisk"> *</span>
              </label>
              <input
                className="form-control"
                type="date"
                name="release_date"
                placeholder="Enter date"
                value={formData.release_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                Description
                <span className="otp-asterisk"> *</span>
              </label>
              <textarea
                className="form-control"
                rows={1}
                name="description"
                placeholder="Enter Description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                Source Details
                <span className="otp-asterisk"> *</span>
              </label>
              <textarea
                className="form-control"
                rows={1}
                name="press_source"
                placeholder="Enter Source Details"
                value={formData.press_source}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                Attachment URL <span className="otp-asterisk"> *</span>
              </label>
              <input
                className="form-control"
                type="url"
                name="attachment_url"
                placeholder="Enter URL"
                value={formData.attachment_url}
                onChange={handleChange}
              />
            </div>

            <div className="form-group col-span-2">
              {/* Label + Tooltip + Asterisk in one line */}
              <label className="d-flex align-items-center gap-1 mb-2">
                <span>Attachment</span>

                <span
                  className="tooltip-container"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  style={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  [i]
                  {showTooltip && (
                    <span
                      className="tooltip-text"
                      style={{
                        marginLeft: "6px",
                        background: "#f9f9f9",
                        border: "1px solid #ccc",
                        padding: "6px 8px",
                        borderRadius: "4px",
                        position: "absolute",
                        zIndex: 1000,
                        fontSize: "13px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Max Upload Size 3 MB and Required ratio is 16:9
                    </span>
                  )}
                </span>

                <span className="otp-asterisk text-danger">*</span>
              </label>

              {/* Upload Button */}
              <span
                role="button"
                tabIndex={0}
                onClick={() => setShowUploader(true)}
                className="custom-upload-button input-upload-button"
              >
                <span className="upload-button-label">Choose file</span>
                <span className="upload-button-value">No file chosen</span>
              </span>

              {/* Upload Modal */}
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

            <div className="col-span-2 mt-2">
              {Array.isArray(formData.pr_image_16by9) &&
              formData.pr_image_16by9.length > 0 ? (
                // ✅ Uploaded table view
                <div className="mt-4 tbl-container">
                  <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 text-left text-gray-600">
                          File Name
                        </th>
                        <th className="py-3 px-4 text-left text-gray-600">
                          Preview
                        </th>
                        <th className="py-3 px-4 text-left text-gray-600">
                          Ratio
                        </th>
                        <th className="py-3 px-4 text-left text-gray-600">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.pr_image_16by9.map((file, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-2 px-4 border-b">
                            {file.name}
                          </td>
                          <td className="py-2 px-4 border-b">
                            <img
                              style={{ maxWidth: 100, maxHeight: 100 }}
                              className="img-fluid rounded"
                              src={file.preview}
                              alt={file.name}
                            />
                          </td>
                          <td className="py-2 px-4 border-b">
                            {file.ratio || "16:9"}
                          </td>
                          <td className="py-2 px-4 border-b">
                            <button
                              type="button"
                              className="purple-btn2"
                              onClick={() =>
                                discardImage("pr_image_16by9", file)
                              }
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                // ✅ Fallback preview from croppedImage or formData.pr_image (existing)
                <div className="mt-4 tbl-container">
                  <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 text-left text-gray-600">
                          File Name
                        </th>
                        <th className="py-3 px-4 text-left text-gray-600">
                          Preview
                        </th>
                        <th className="py-3 px-4 text-left text-gray-600">
                          Ratio
                        </th>
                        <th className="py-3 px-4 text-left text-gray-600">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b">
                          {croppedImage
                            ? "Cropped Image"
                            : "pr_image_16by9.jpg"}
                        </td>
                        <td className="py-2 px-4 border-b">
                          <img
                            src={croppedImage || formData.pr_image}
                            className="img-fluid rounded mt-2"
                            alt="Image Preview"
                            style={{
                              maxWidth: "100px",
                              maxHeight: "100px",
                              objectFit: "cover",
                            }}
                          />
                        </td>
                        <td className="py-2 px-4 border-b">16:9</td>
                        <td className="py-2 px-4 border-b">
                          <button
                            type="button"
                            className="purple-btn2"
                            onClick={() =>
                              discardImage("pr_image_16by9", {
                                preview: croppedImage || formData.pr_image,
                                name: "pr_image_16by9.jpg",
                                ratio: "16:9",
                              })
                            }
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="purple-btn2 px-6 py-3 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="loader"></span>
                Submitting...
              </>
            ) : (
              <>
                <span>💾</span>
                Save
              </>
            )}
          </button>
          <button
            onClick={handleCancel}
            className="purple-btn2 px-6 py-3 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PressReleasesEdit;