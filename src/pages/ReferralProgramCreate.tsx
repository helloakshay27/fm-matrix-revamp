import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";


const ReferralProgramCreate = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const [referralData, setReferralData] = useState({
    title: "",
    description: "",
    images: [],
  });

  console.log("formData", referralData);

  const navigate = useNavigate();

  // Auto-resize textarea when referralData.description changes
  useEffect(() => {
    const textarea = document.querySelector('textarea[name="description"]');
    if (textarea) {
      if (referralData.description && referralData.description.trim()) {
        // Reset height to measure actual scroll height
        textarea.style.height = '35px';
        // Only increase if content exceeds single line height
        if (textarea.scrollHeight > 35) {
          textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
        }
      } else {
        // Keep single row height when empty
        textarea.style.height = '35px';
      }
    }
  }, [referralData.description]);

  

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
        toast.error("Failed to load projects");
      }
    };

    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReferralData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Auto-resize textarea function
  const handleDescriptionChange = (e) => {
    const { name, value } = e.target;
    setReferralData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Auto-resize textarea only when content actually wraps to next line
    const textarea = e.target;
    if (value.trim()) {
      // Reset height to measure actual scroll height
      textarea.style.height = '35px';
      // Only increase if content exceeds single line height
      if (textarea.scrollHeight > 35) {
        textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
      }
    } else {
      // Reset to single row height when empty
      textarea.style.height = '35px';
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) {
      setReferralData((prev) => ({ ...prev, images: [] }));
      return;
    }

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

    const maxSize = 3 * 1024 * 1024;
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      toast.error("Each image must be less than 3MB.");
      e.target.value = "";
      return;
    }

    if (files.length > 5) {
      toast.error("Maximum 5 images allowed.");
      e.target.value = "";
      return;
    }

    setReferralData((prev) => ({ ...prev, images: files }));
  };

  const removeImage = (imageIndex) => {
    const updatedImages = referralData.images.filter(
      (_, index) => index !== imageIndex
    );
    setReferralData((prev) => ({ ...prev, images: updatedImages }));

    if (updatedImages.length === 0) {
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    }
  };

  const validateForm = () => {
    if (!referralData.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!validateForm() || !selectedProjectId) {
    //   toast.error("Please fill in all required fields");
    //   return;
    // }

    setLoading(true);
    toast.dismiss();

    try {
      const formData = new FormData();

      // Add project_id and user_id at root level
      formData.append("project_id", selectedProjectId);
      formData.append("user_id", localStorage.getItem("user_id") || "");

      // Add referral_config data (matching the desired JSON structure)
      formData.append("referral_config[title]", referralData.title);
      formData.append("referral_config[description]", referralData.description);

      // Add images as attachments
      referralData.images.forEach((image) => {
        formData.append("referral_config[attachments][]", image);
      });

      // Fixed URL - removed extra space
      const response = await axios.post(`${baseURL}referral_configs.json`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      toast.success("Referral created successfully!");

      // Reset form
      setReferralData({
        title: "",
        description: "",
        images: [],
      });
      setSelectedProjectId("");

      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

      navigate("/referral-program-list");
    } catch (error) {
      console.error("Error creating referral:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="">
      <div className="module-data-section p-3">
        <form onSubmit={handleSubmit}>
          <div className="card mt-4 pb-4 mx-4">
            <div className="card-header">
              <h3 className="card-title">Create Referral Program</h3>
            </div>
            <div className="card-body">
              <div className="row">
                {/* Project Field */}
                {/* <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Project <span className="otp-asterisk"> *</span>
                    </label>
                    <SelectBox
                      options={projects.map((proj) => ({
                        label: proj.project_name,
                        value: proj.id,
                      }))}
                      value={selectedProjectId}
                      onChange={(value) => setSelectedProjectId(value)}
                      required
                    />
                  </div>
                </div> */}

                {/* Title Field */}
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Title <span className="otp-asterisk"> *</span>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Title"
                      name="title"
                      value={referralData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Description Field */}
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      placeholder="Enter Description"
                      name="description"
                      value={referralData.description}
                      onChange={handleDescriptionChange}
                      style={{
                        height: '35px', // Single row height initially
                        maxHeight: '300px',
                        resize: 'none',
                        overflow: 'auto',
                        lineHeight: '1.5',
                        wordWrap: 'break-word'
                      }}
                      onInput={(e) => {
                        if (e.target.value.trim()) {
                          // Reset height to measure actual scroll height
                          e.target.style.height = '35px';
                          // Only increase if content exceeds single line height
                          if (e.target.scrollHeight > 35) {
                            e.target.style.height = Math.min(e.target.scrollHeight, 300) + 'px';
                          }
                        } else {
                          e.target.style.height = '35px';
                        }
                      }}
                      ref={(textarea) => {
                        if (textarea) {
                          if (referralData.description && referralData.description.trim()) {
                            // Reset height to measure actual scroll height
                            textarea.style.height = '35px';
                            // Only increase if content exceeds single line height
                            if (textarea.scrollHeight > 35) {
                              textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
                            }
                          } else {
                            textarea.style.height = '35px';
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Images Field */}
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
                            Max 5 images, 3MB each
                          </span>
                        )}
                      </span>
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      name="attachments"
                      accept="image/*"
                      onChange={handleImageChange}
                      multiple
                    />

                    {/* Image Preview */}
                    {referralData.images.length > 0 && (
                      <div className="mt-3">
                        <div className="d-flex flex-wrap gap-2">
                          {referralData.images.map((image, index) => (
                            <div
                              key={index}
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
                                onClick={() => removeImage(index)}
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
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="row mt-2 justify-content-center">
            <div className="col-md-2">
              <button
                type="submit"
                className="purple-btn2 purple-btn2-shadow w-100"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
            <div className="col-md-2">
              <button
                type="button"
                className="purple-btn2 purple-btn2-shadow w-100"
                onClick={handleCancel}
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

export default ReferralProgramCreate;