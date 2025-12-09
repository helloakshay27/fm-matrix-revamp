import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";


const ReferralProgramEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [existingImages, setExistingImages] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    attachments: [],
  });

  console.log("formData:", formData);
  console.log("existingImages:", existingImages);

  // Auto-resize textarea when formData.description changes
  useEffect(() => {
    const textarea = document.querySelector('textarea[name="description"]');
    if (textarea) {
      if (formData.description && formData.description.trim()) {
        // Reset height to measure actual scroll height
        textarea.style.height = '38px';
        // Only increase if content exceeds single line height
        if (textarea.scrollHeight > 38) {
          textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
        }
      } else {
        // Keep single row height when empty
        textarea.style.height = '38px';
      }
    }
  }, [formData.description]);

  // Fetch existing referral data
  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        setFetchingData(true);
        console.log("=== FETCH DEBUG INFO ===");
        console.log("Fetching from URL:", `${baseURL}/referral_configs/${id}.json`);
        console.log("ID:", id);
        console.log("Base URL:", baseURL);
        
        const response = await axios.get(`${baseURL}/referral_configs/${id}.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Fetch API Response:", response.data);
        const referralData = response.data.referral || response.data;
        console.log("Processed referral data:", referralData);

        setFormData({
          title: referralData.title || "",
          description: referralData.description || "",
          attachments: [],
        });
        
        // Handle existing images - ensure we preserve them
        const images = referralData.attachments || [];
        console.log("Existing images from API:", images);
        setExistingImages(images);
        
      } catch (error) {
        console.error("Error fetching referral data:", error);
        console.error("Error status:", error.response?.status);
        console.error("Error data:", error.response?.data);
        toast.error("Failed to fetch referral data");
        navigate("/referral-program-list");
      } finally {
        setFetchingData(false);
      }
    };

    if (id) {
      fetchReferralData();
    }
  }, [id, navigate]);

  // Fetch projects
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
        console.error(
          "Error fetching projects:",
          error.response?.data || error.message
        );
      }
    };

    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Auto-resize textarea function
  const handleDescriptionChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Auto-resize textarea only when content actually wraps to next line
    const textarea = e.target;
    if (value.trim()) {
      // Reset height to measure actual scroll height
      textarea.style.height = '38px';
      // Only increase if content exceeds single line height (38px + buffer for line wrapping)
      if (textarea.scrollHeight > 42) {
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
      }
    } else {
      // Reset to single row height when empty
      textarea.style.height = '38px';
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Restrict to 1 image for now
    if (files.length > 1) {
      toast.error("Please select only one image for now.");
      e.target.value = "";
      return;
    }

    if (files.length === 0) {
      setFormData({ ...formData, attachments: [] });
      return;
    }

    // Validate file types
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      toast.error("Please select only image files (JPEG, PNG, GIF, WebP).");
      e.target.value = "";
      return;
    }

    // Validate file size (max 3MB per image)
    const maxSize = 3 * 1024 * 1024;
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      toast.error("Image size must be less than 3MB.");
      e.target.value = "";
      return;
    }

    setFormData({ ...formData, attachments: files });
  };

  const removeNewImage = (indexToRemove) => {
    const updatedImages = formData.attachments.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData({ ...formData, attachments: updatedImages });

    // Clear the file input if no images left
    if (updatedImages.length === 0) {
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    }
  };

  const removeExistingImage = async (imageId, indexToRemove) => {
    try {
      console.log("Removing image with ID:", imageId);
      
      // Make API call to remove image from server
      const response = await axios.delete(
        `${baseURL}referral_configs/${id}/remove_images/${imageId}.json`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Remove image response:", response.data);

      // Remove from local state only after successful API call
      const updatedExistingImages = existingImages.filter(
        (_, index) => index !== indexToRemove
      );
      setExistingImages(updatedExistingImages);
      toast.success("Image removed successfully.");
      
    } catch (error) {
      console.error("Error removing image:", error.response?.data || error);
      toast.error("Failed to remove image. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Title is required.");
      setLoading(false);
      return;
    }

    // Check if there are existing images or new images
    if (
      existingImages.length === 0 &&
      (!formData.attachments || formData.attachments.length === 0)
    ) {
      toast.error("At least one image is required.");
      setLoading(false);
      return;
    }

    try {
      console.log("=== SUBMISSION DEBUG INFO ===");
      console.log("ID:", id);
      console.log("Base URL:", baseURL);
      console.log("Full URL:", `${baseURL}/referral_configs/${id}.json`);
      console.log("Title:", formData.title);
      console.log("Description:", formData.description);
      console.log("New attachments count:", formData.attachments.length);
      console.log("Existing images count:", existingImages.length);
      console.log("Access Token exists:", !!localStorage.getItem("access_token"));

      // Try different approaches based on whether we have new images or not
      let response;
      
      if (formData.attachments && formData.attachments.length > 0) {
        // If we have new images, use FormData (multipart/form-data)
        const formDataPayload = new FormData();
        formDataPayload.append("referral_config[title]", formData.title.trim());
        formDataPayload.append("referral_config[description]", formData.description.trim());
        
        formData.attachments.forEach((image) => {
          formDataPayload.append("referral_config[attachments][]", image);
        });

        console.log("Sending with FormData (has new images)");
        response = await axios.put(
          `${baseURL}/referral_configs/${id}.json`,
          formDataPayload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // If no new images, send as JSON
        const jsonPayload = {
          referral_config: {
            title: formData.title.trim(),
            description: formData.description.trim()
          }
        };

        console.log("Sending as JSON (no new images):", jsonPayload);
        response = await axios.put(
          `${baseURL}/referral_configs/${id}.json`,
          jsonPayload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      console.log("Update response:", response.data);
      toast.success("Referral updated successfully!");
      navigate("/referral-program-list");
      
    } catch (error) {
      console.error("=== ERROR DETAILS ===");
      console.error("Status:", error.response?.status);
      console.error("Status Text:", error.response?.statusText);
      console.error("Headers:", error.response?.headers);
      console.error("Data type:", typeof error.response?.data);
      console.error("Data:", error.response?.data);
      console.error("Full error:", error);
      
      // Check if the response is HTML (server error page)
      if (typeof error.response?.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
        console.error("Server returned HTML error page - likely a 500 error");
        toast.error("Server error occurred. Please check the console and contact support.");
      } else if (error.response?.status === 422) {
        const errors = error.response.data?.errors;
        if (errors) {
          Object.keys(errors).forEach(key => {
            errors[key].forEach(errorMsg => {
              toast.error(`${key}: ${errorMsg}`);
            });
          });
        } else {
          toast.error("Validation failed. Please check your inputs.");
        }
      } else if (error.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
      } else if (error.response?.status === 404) {
        toast.error("Referral not found. It may have been deleted.");
      } else if (error.response?.status >= 500) {
        toast.error("Server error. Please try again later or contact support.");
      } else {
        toast.error("Failed to update referral. Please check the console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (fetchingData) {
    return (
      <div className="">
        <div className="website-content overflow-auto">
          <div className="module-data-section p-3">
            <div className="card mt-4 pb-4 mx-4">
              <div className="card-header">
                <h3 className="card-title">Loading...</h3>
              </div>
              <div className="card-body">
                <div className="text-center">
                  <p>Loading referral data...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="module-data-section p-3">
        <form onSubmit={handleSubmit}>
          <div className="card mt-4 pb-4 mx-4">
            <div className="card-header">
              <h3 className="card-title">Edit Referral</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Title<span style={{ color: "#de7008" }}> *</span>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      placeholder="Enter Description"
                      name="description"
                      value={formData.description}
                      onChange={handleDescriptionChange}
                      style={{
                        height: '38px', // Single row height initially
                        maxHeight: '200px',
                        resize: 'none',
                        overflow: 'auto',
                        lineHeight: '1.5',
                        wordWrap: 'break-word'
                      }}
                      onInput={(e) => {
                        if (e.target.value.trim()) {
                          // Reset height to measure actual scroll height
                          e.target.style.height = '38px';
                          // Only increase if content exceeds single line height (38px + buffer for line wrapping)
                          if (e.target.scrollHeight > 42) {
                            e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                          }
                        } else {
                          e.target.style.height = '38px';
                        }
                      }}
                      ref={(textarea) => {
                        if (textarea) {
                          if (formData.description && formData.description.trim()) {
                            // Reset height to measure actual scroll height
                            textarea.style.height = '38px';
                            // Only increase if content exceeds single line height (38px + buffer for line wrapping)
                            if (textarea.scrollHeight > 42) {
                              textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
                            }
                          } else {
                            textarea.style.height = '38px';
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Images{" "}
                      <span
                        className="tooltip-container"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        [i]
                        {showTooltip && (
                          <span className="tooltip-text">
                            Max 1 image, 3MB each
                          </span>
                        )}
                      </span>
                      <small className="text-muted"> </small>
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      name="attachments"
                      accept="image/*"
                      onChange={handleImageChange}
                      multiple={false}
                    />

                    {/* Existing Images - show unless being replaced */}
                    {existingImages.length > 0 && (
                      <div className="mt-3">
                        <label className="form-label fw-bold">
                          Current Images:
                        </label>
                        <div className="d-flex flex-wrap gap-2">
                          {existingImages.map((image, index) => (
                            <div
                              key={`existing-${index}`}
                              className="position-relative"
                              style={{ width: "100px", height: "100px" }}
                            >
                              <img
                                src={
                                  image.document_url ||
                                  image.url ||
                                  image.image_url ||
                                  (typeof image === 'string' ? image : '')
                                }
                                alt={`Current ${index + 1}`}
                                className="img-thumbnail"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  console.log("Image load error for:", image);
                                  e.target.src = "/placeholder-image.png";
                                }}
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute"
                                title="Remove image"
                                style={{
                                  top: "-5px",
                                  right: "-5px",
                                  fontSize: "10px",
                                  width: "20px",
                                  height: "20px",
                                  padding: "0px",
                                  borderRadius: "50%",
                                }}
                                onClick={() =>
                                  removeExistingImage(
                                    image.id || index,
                                    index
                                  )
                                }
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Image Preview */}
                    {formData.attachments.length > 0 && (
                      <div className="mt-3">
                        <label className="form-label fw-bold">
                          New Image Preview:
                        </label>
                        <div className="d-flex flex-wrap gap-2">
                          {formData.attachments.slice(0, 1).map((image, index) => (
                            <div
                              key={`new-${index}`}
                              className="position-relative"
                              style={{ width: "100px", height: "100px" }}
                            >
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Preview ${index + 1}`}
                                className="img-thumbnail"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute"
                                title="Remove image"
                                style={{
                                  top: "-5px",
                                  right: "-5px",
                                  fontSize: "10px",
                                  width: "20px",
                                  height: "20px",
                                  padding: "0px",
                                  borderRadius: "50%",
                                }}
                                onClick={() => removeNewImage(index)}
                              >
                                ×
                              </button>
                              <div className="text-center mt-1">
                                <small
                                  className="text-muted"
                                  style={{ fontSize: "10px" }}
                                >
                                  {image.name.length > 15
                                    ? `${image.name.substring(0, 15)}...`
                                    : image.name}
                                </small>
                              </div>
                            </div>
                          ))}
                        </div>
                        {formData.attachments.length > 1 && (
                          <div className="text-warning mt-2">
                            <small>
                              Only one image is allowed. The first image will be used.
                            </small>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-2">
              <button
                type="submit"
                className="purple-btn2 purple-btn2-shadow w-100"
                disabled={loading || fetchingData}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
            <div className="col-md-2">
              <button
                type="button"
                className="purple-btn2 purple-btn2-shadow w-100"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReferralProgramEdit;