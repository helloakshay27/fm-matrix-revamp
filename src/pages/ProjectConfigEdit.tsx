import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


const ProjectConfigEdit = () => {
  const { id } = useParams(); // ✅ Get ID from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [iconPreview, setIconPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    active: "1",
    icon: null,
  });

  useEffect(() => {
    const fetchConfiguration = async () => {
      try {
        const response = await axios.get(
          `${baseURL}configuration_setups/${id}.json`
        );
        setFormData({
          name: response.data.name,
          active: response.data.active ? "1" : "0",
          icon: null, // Reset file input
        });

        if (response.data.attachfile?.document_url) {
          setIconPreview(response.data.attachfile.document_url);
        }
      } catch (error) {
        toast.error("Failed to load configuration data");
      }
    };
    fetchConfiguration();
  }, [id]);

  // Handle Input Change
  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle Icon Change
  const handleIconChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        icon: file,
      }));
      setIconPreview(URL.createObjectURL(file));
    }
  };

  // Remove Icon
  const handleRemoveIcon = () => {
    setFormData((prevData) => ({
      ...prevData,
      icon: null,
    }));
    setIconPreview(null);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
  
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("configuration_setup[name]", formData.name);
    formDataToSend.append("configuration_setup[active]", formData.active);
    if (formData.icon) {
      formDataToSend.append("configuration_setup[icon]", formData.icon);
    }
  
    try {
      await axios.put( // 🔄 Use PUT instead of PATCH if full update is required
        `${baseURL}configuration_setups/${id}.json`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Project configuration updated successfully!");
      navigate("/setup-member/project-configuration-list");
    } catch (error) {
      toast.error("Failed to update configuration");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <div className="main-content">
        <div className="website-content overflow-auto">
          <div className="module-data-section container-fluid">
            <form onSubmit={handleSubmit}>
              <div className="card mt-4 pb-4 mx-4">
                <div className="card-header">
                  <h3 className="card-title">Edit Project Configuration</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    {/* Name Field */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Name <span className="otp-asterisk">{" "}*</span>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter Name"
                        />
                      </div>
                    </div>

                    {/* Icon Upload */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Icon <span className="otp-asterisk">{" "}*</span>
                        </label>
                        <input
                          className="form-control"
                          type="file"
                          name="icon"
                          onChange={handleIconChange}
                        />
                      </div>
                    </div>

                    {/* Icon Preview */}
                    {iconPreview && (
                      <div className="col-md-3 mt-2">
                        <label>Preview:</label>
                        <div className="position-relative">
                          <img
                            src={iconPreview}
                            alt="Icon Preview"
                            className="img-thumbnail"
                            style={{
                              maxWidth: "100px",
                              maxHeight: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <button
                            type="button"
                            className="position-absolute border-0 rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              top: 2,
                              // right: -5,
                              height: 20,
                              width: 20,
                              backgroundColor: "var(--red)",
                              color: "white",
                            }}
                            onClick={handleRemoveIcon}
                          >
                            x
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="row mt-2 justify-content-center">
                <div className="col-md-2">
                  <button type="submit" className="purple-btn2 w-100" disabled={loading}>
                    {loading ? "Updating..." : "Update"}
                  </button>
                </div>
                <div className="col-md-2">
                  <button type="button" className="purple-btn2 w-100" onClick={() => navigate(-1)}>
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectConfigEdit;
