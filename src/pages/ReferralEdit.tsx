import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";


const ReferralEdit = () => {
  const { id } = useParams(); // Get referral ID from URL params
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [existingImages, setExistingImages] = useState([]); // For existing images from server
  const [showTooltip, setShowTooltip] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    referralCode: "",
    title: "",
    description: "",
    referral_images: [], // New images to upload
  });

  console.log("formData:", formData);

  // Fetch existing referral data
  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        setFetchingData(true);
        const response = await axios.get(`${baseURL}referrals/${id}.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        const referralData = response.data.referral || response.data;

        setFormData({
          name: referralData.name || "",
          email: referralData.email || "",
          mobile: referralData.mobile || "",
          referralCode: referralData.referral_code || "",
          title: referralData.title || "",
          description: referralData.description || "",
          images: [],
        });

        setProjectName(referralData.project_name || ""); // <-- set project name here
        setSelectedProjectId(referralData.project_id || "");
        setExistingImages(referralData.referral_images || []);
      } catch (error) {
        // ...existing code...
      } finally {
        setFetchingData(false);
      }
    };

    if (id) {
      fetchReferralData();
    }
  }, [id, navigate]);
  // ...existing code...

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Restrict to 1 image for now
    if (files.length > 1) {
      toast.error("Please select only one image for now.");
      e.target.value = ""; // Clear the input
      return;
    }

    if (files.length === 0) {
      setFormData({ ...formData, images: [] });
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
      e.target.value = ""; // Clear the input
      return;
    }

    // Validate file size (max 5MB per image)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      toast.error("Each image must be less than 5MB.");
      e.target.value = ""; // Clear the input
      return;
    }

    setFormData({ ...formData, images: files });
  };

  const removeNewImage = (indexToRemove) => {
    const updatedImages = formData.images.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData({ ...formData, images: updatedImages });

    // Clear the file input if no images left
    if (updatedImages.length === 0) {
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    }
  };

  const removeExistingImage = async (imageId, indexToRemove) => {
    try {
      // Make API call to remove image from server using the remove_images endpoint
      await axios.delete(`${baseURL}referrals/${id}/remove_images/${imageId}.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        data: {
          image_id: imageId, // Send the image ID in the request body
        },
      });

      // Remove from local state
      const updatedExistingImages = existingImages.filter(
        (_, index) => index !== indexToRemove
      );
      setExistingImages(updatedExistingImages);
      toast.success("Image removed successfully.");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss(); // Clears previous toasts to prevent duplicates

    // Validation - Ensures only one error toast appears
    if (!formData.name) {
      toast.error("Name is required.");
      setLoading(false);
      return;
    }
    if (!formData.email) {
      toast.error("Email is required.");
      setLoading(false);
      return;
    }
    if (!formData.mobile || formData.mobile.length !== 10) {
      toast.error("Mobile number must be 10 digits.");
      setLoading(false);
      return;
    }
    if (!formData.title) {
      toast.error("Title is required.");
      setLoading(false);
      return;
    }
    // if (!formData.description) {
    //   toast.error("Description is required.");
    //   setLoading(false);
    //   return;
    // }
    // Check if there are existing images or new images
    if (
      existingImages.length === 0 &&
      (!formData.images || formData.images.length === 0)
    ) {
      toast.error("At least one image is required.");
      setLoading(false);
      return;
    }
    if (!selectedProjectId) {
      toast.error("Project selection is required.");
      setLoading(false);
      return;
    }

    // Create FormData for file upload
    const formDataPayload = new FormData();
    formDataPayload.append("referral[name]", formData.name);
    formDataPayload.append("referral[email]", formData.email);
    formDataPayload.append("referral[mobile]", formData.mobile);
    formDataPayload.append(
      "referral[referral_code]",
      formData.referralCode || ""
    );
    formDataPayload.append("referral[title]", formData.title);
    formDataPayload.append("referral[description]", formData.description);

    // Append new images only
    formData.images.forEach((image, index) => {
      formDataPayload.append(`referral[referral_images][]`, image);
    });

    formDataPayload.append("referral[project_id]", selectedProjectId);

    try {
      const response = await axios.put(
        `${baseURL}referrals/${id}.json`,
        formDataPayload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Referral updated successfully!");
      console.log("Response:", response.data);

      navigate("/referral-list"); // Redirect to referral list after success
    } catch (error) {
      console.error(
        "Error updating referral:",
        error.response?.data || error.message
      );
      toast.error("Failed to update referral. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleMobileChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile" && value.length > 10) return; // Limit to 10 digits
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    navigate(-1); // This navigates back one step in history
  };

  if (fetchingData) {
    return (
      <div className="main-content">
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
    <div className="main-content">
      {/* <div className="website-content overflow-auto"> */}
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
                        Name<span style={{ color: "#de7008" }}> *</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Email<span style={{ color: "#de7008" }}> *</span>
                      </label>
                      <input
                        className="form-control"
                        type="email"
                        placeholder="Enter Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Mobile No<span style={{ color: "#de7008" }}> *</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        inputMode="numeric"
                        pattern="\d{10}"
                        placeholder="Enter Mobile No"
                        name="mobile"
                        value={formData.mobile}
                        maxLength={10}
                        onChange={handleMobileChange}
                        style={{ appearance: "textfield" }}
                      />
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Project<span style={{ color: "#de7008" }}> *</span>
                      </label>

                      <SelectBox
                        options={projects.map((proj) => ({
                          label: proj.project_name,
                          value: proj.id,
                        }))}
                        defaultValue={selectedProjectId}
                        onChange={(value) => setSelectedProjectId(value)}
                      />
                    </div>
                  </div>

                  {/* <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Referral Code
                        <span style={{ color: "#de7008" }}> *</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter referral code"
                        name="referralCode"
                        value={formData.referralCode}
                        onChange={handleChange}
                      />
                    </div>
                  </div> */}

                  {/* New row for title, description, and image */}
                  {/* <div className="row"> */}
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
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        className="form-control"
                        rows={1}
                        placeholder="Enter Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Images <span
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
                        <small className="text-muted"> </small>
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        name="images"
                        accept="image/*"
                        onChange={handleImageChange}
                        // Ensure only one file can be selected
                        multiple={false}
                      />

                      {/* Existing Images - hide if new image is selected */}
                      {existingImages.length > 0 &&
                        formData.images.length === 0 && (
                          <div className="mb-3">
                            <label className="form-label fw-bold">
                              {/* Current Images: */}
                            </label>
                            <div className="d-flex flex-wrap gap-2">
                              {existingImages.map((image, index) => (
                                <div
                                  key={index}
                                  className="position-relative"
                                  style={{ width: "100px", height: "100px" }}
                                >
                                  <img
                                    src={
                                      image.document_url ||
                                      image.url ||
                                      image.image_url ||
                                      image
                                    }
                                    alt={`Current ${index + 1}`}
                                    className="img-thumbnail"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                    onError={(e) => {
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

                      {/* New Image Preview - Show only the first image if multiple are selected */}
                      {formData.images.length > 0 && (
                        <div className="mt-3">
                          <label className="form-label fw-bold">
                            {/* New Image Preview: */}
                          </label>
                          <div className="d-flex flex-wrap gap-2">
                            {/* Only show the first image */}
                            {formData.images.slice(0, 1).map((image, index) => (
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
                          {/* Show warning if more than one image was selected */}
                          {formData.images.length > 1 && (
                            <div className="text-warning mt-2">
                              <small>
                                Only one image is allowed. The first image will
                                be used.
                              </small>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* </div> */}
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
                  {loading ? "Updating..." : "Submit"}
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

export default ReferralEdit;
