import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";


const OrganizationUpdate = () => {
  const { id } = useParams(); // Get organization ID from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    sub_domain: "",
    country_id: "",
    mobile: "",
    attachment: null, // File upload
  });

  // Fetch organization details when component loads
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await axios.get(`${baseURL}organizations/${id}.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
        const org = response.data;
        setFormData({
          name: org.name || "",
          domain: org.domain || "",
          sub_domain: org.sub_domain || "",
          country_id: org.country_id || "",
          mobile: org.mobile || "",
          attachment: null, // Only for new upload
        });
        if (org.attachfile?.document_url) {
          setExistingImageUrl(org.attachfile.document_url);
        }
      } catch (error) {
        console.error("Error fetching organization:", error);
        toast.error("Failed to load organization data.");
      }
    };

    fetchOrganization();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, attachment: files[0] });

    // Generate image preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Handle form submission (Update Organization)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    payload.append("organization[name]", formData.name);
    payload.append("organization[domain]", formData.domain);
    payload.append("organization[sub_domain]", formData.sub_domain);
    payload.append("organization[country_id]", formData.country_id);
    payload.append("organization[mobile]", formData.mobile);

    if (formData.attachment) {
      payload.append("organization[org_image]", formData.attachment);
    }

    try {
      const response = await axios.put(
        `${baseURL}organizations/${id}.json`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Organization updated successfully!");
        navigate("/organization-list");
      }
    } catch (error) {
      console.error("Error updating organization:", error);
      toast.error("Failed to update organization.");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <form onSubmit={handleSubmit}>
            <div className="card mt-4 pb-4 mx-4">
              <div className="card-header">
                <h3 className="card-title">Update Organization</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  {/* Name */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Name <span className="otp-asterisk"> *</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Domain */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Domain <span className="otp-asterisk"> *</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="domain"
                        value={formData.domain}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Sub-domain */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Sub-domain <span className="otp-asterisk"> *</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="sub_domain"
                        value={formData.sub_domain}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Country ID */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Country ID <span className="otp-asterisk"> *</span>
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        name="country_id"
                        value={formData.country_id}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Mobile No <span className="otp-asterisk"> *</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>

                  {/* Attachment */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Attachment <span className="otp-asterisk"> *</span>
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        name="attachment"
                        onChange={handleFileChange}
                        multiple // Allow multiple file selection
                      />

                      {/* Image Preview Section */}
                      <div className="mt-2 d-flex flex-wrap">
                        {imagePreviews.length > 0 ? (
                          imagePreviews.map((src, index) => (
                            <div key={index} className="position-relative me-2">
                              <img
                                src={src}
                                alt={`Preview ${index}`}
                                style={{
                                  maxWidth: "100px",
                                  maxHeight: "100px",
                                  borderRadius: "5px",
                                  marginTop: "10px",
                                }}
                              />
                            </div>
                          ))
                        ) : existingImageUrl ? (
                          <div className="position-relative me-2">
                            <img
                              src={existingImageUrl}
                              alt="Existing"
                              style={{
                                maxWidth: "100px",
                                maxHeight: "100px",
                                borderRadius: "5px",
                                marginTop: "10px",
                              }}
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="row mt-3 justify-content-center">
              <div className="col-md-2">
                <button
                  type="submit"
                  className="purple-btn2 w-100"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Submit"}
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationUpdate;
