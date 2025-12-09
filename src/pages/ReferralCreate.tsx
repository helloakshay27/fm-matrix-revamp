import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";


const ReferralCreate = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const [referralData, setReferralData] = useState({
    name: "",
    email: "",
    mobile: "",
    referral_code: "",
    title: "",
    description: "",
    images: [],
  });

  console.log("formData", referralData);

  const navigate = useNavigate();

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

  const handleMobileChange = (e) => {
    const { value } = e.target;
    const numericValue = value.replace(/\D/g, "");
    setReferralData((prev) => ({
      ...prev,
      mobile: numericValue,
    }));
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

    if (!validateForm() || !selectedProjectId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    toast.dismiss();

    try {
      const formData = new FormData();

      // Add project_id and user_id at root level
      formData.append("project_id", selectedProjectId);
      formData.append("user_id", localStorage.getItem("user_id") || "");

      // Add referral data as an array with one item (to match your format)
      formData.append("referral[name]", referralData.name);
      formData.append("referral[email]", referralData.email);
      formData.append("referral[mobile]", referralData.mobile);
      formData.append("referral[referral_code]", referralData.referral_code);
      formData.append("referral[title]", referralData.title);
      formData.append("referral[description]", referralData.description);

      // Add images for this referral
      // Add images for this referral
      referralData.images.forEach((image) => {
        formData.append("referral[referral_images]", image);
      });

      const response = await axios.post(`${baseURL}referrals.json`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      toast.success("Referral created successfully!");

      // Reset form
      setReferralData({
        name: "",
        email: "",
        mobile: "",
        referral_code: "",
        title: "",
        description: "",
        images: [],
      });
      setSelectedProjectId("");

      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

      navigate("/referral-list");
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
    <div className="main-content">
      {/* <div className="website-content overflow-auto"> */}
      <div className="module-data-section p-3">
        <form onSubmit={handleSubmit}>
          <div className="card mt-4 pb-4 mx-4">
            <div className="card-header">
              <h3 className="card-title">Create Referral</h3>
            </div>
            <div className="card-body">
              <div className="row">
                {/* Project Field */}
                <div className="col-md-3">
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
                </div>

                {/* Name Field */}
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Name"
                      name="name"
                      value={referralData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      className="form-control"
                      type="email"
                      placeholder="Enter Email"
                      name="email"
                      value={referralData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Mobile Field */}
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Mobile No</label>
                    <input
                      className="form-control"
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter Mobile No"
                      name="mobile"
                      value={referralData.mobile}
                      maxLength={10}
                      onChange={handleMobileChange}
                    />
                  </div>
                </div>

                {/* Referral Code Field */}
                {/* <div className="col-md-3">
                    <div className="form-group">
                      <label>Referral Code</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter Referral Code"
                        name="referral_code"
                        value={referralData.referral_code}
                        onChange={handleInputChange}
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
                      rows={1}
                      placeholder="Enter Description"
                      name="description"
                      value={referralData.description}
                      onChange={handleInputChange}
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
                      name="referral_images"
                      accept="image/*"
                      onChange={handleImageChange}
                      multiple
                    />

                    {/* Image Preview */}
                    {referralData.images.length > 0 && (
                      <div className="mt-3">
                        <label className="form-label fw-bold">
                          {/* Image Preview: */}
                        </label>
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
                                // title="Remove image"
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
      {/* </div> */}
    </div>
  );
};

export default ReferralCreate;
