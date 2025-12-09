import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import "../mor.css";
import { useNavigate, useParams } from "react-router-dom";
import MultiSelectBox from "../components/ui/multi-selector";


const ConstructionUpdatesEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [onDate, setOnDate] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [existingAttachment, setExistingAttachment] = useState(null);
  const [existingAttachmentName, setExistingAttachmentName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [eventUserID, setEventUserID] = useState([]);
  const [buildingTypes, setBuildingTypes] = useState([]);
  const [sitesLoading, setSitesLoading] = useState(false);
  const [buildingTypesLoading, setBuildingTypesLoading] = useState(false);

  const [formData, setFormData] = useState({
    user_id: "",
    project_id: "",
    site_id: "",
    building_id: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchConstructionUpdate();
    fetchProjects();
    fetchUsers();
    fetchSites();
    fetchBuildingTypes();

    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, []);

  const fetchConstructionUpdate = async () => {
    try {
      setDataLoading(true);
      const response = await axios.get(
        `${baseURL}construction_updates/${id}.json`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        const updateData = response.data;

        setTitle(updateData.title || "");
        setDescription(updateData.description || "");
        setStatus(updateData.status || "active");
        setOnDate(updateData.on_date || "");
        
        if (updateData.attachment && updateData.attachment.document_url) {
          setExistingAttachment(updateData.attachment.document_url);
          setExistingAttachmentName(updateData.attachment.document_file_name || "attachment");
          setPreviewImage(updateData.attachment.document_url);
        }

        setFormData({
          user_id: updateData.user_id || "",
          project_id: updateData.project_id || "",
          site_id: updateData.site_id || "",
          building_id: updateData.building_id || "",
        });
      }
    } catch (error) {
      console.error("Error fetching construction update:", error);
      toast.error("Failed to load construction update data");
      navigate("/setup-member/construction-updates-list");
    } finally {
      setDataLoading(false);
    }
  };

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
      toast.error("Failed to load projects");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseURL}users/get_users.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });
      setEventUserID(response?.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  const fetchSites = async () => {
    setSitesLoading(true);
    try {
      const response = await axios.get(`${baseURL}sites.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setSites(response.data);
      } else if (response.data && Array.isArray(response.data.sites)) {
        setSites(response.data.sites);
      } else {
        console.error("Invalid sites data format:", response.data);
        toast.error("Failed to load sites: Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching sites:", error);
      toast.error("Failed to load sites");
    } finally {
      setSitesLoading(false);
    }
  };

  const fetchBuildingTypes = async () => {
    setBuildingTypesLoading(true);
    try {
      const response = await axios.get(`${baseURL}building_types.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      const buildingTypesData = response.data || [];
      setBuildingTypes(buildingTypesData);
    } catch (error) {
      console.error("Error fetching building types:", error);
      toast.error("Failed to load building types");
    } finally {
      setBuildingTypesLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAttachment(file);

    if (file) {
      const fileType = file.type;
      
      // Check if it's an image
      if (fileType.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      } 
      // Check if it's a video
      else if (fileType.startsWith('video/')) {
        const videoUrl = URL.createObjectURL(file);
        setPreviewImage(videoUrl);
      } 
      // For other file types (PDF, DOC, etc.)
      else {
        setPreviewImage(null);
      }
    } else {
      setPreviewImage(existingAttachment);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("construction_update[title]", title);
    formDataToSend.append("construction_update[description]", description);
    formDataToSend.append("construction_update[user_id]", formData.user_id);
    formDataToSend.append("construction_update[status]", status);
    formDataToSend.append(
      "construction_update[project_id]",
      formData.project_id
    );
    formDataToSend.append("construction_update[site_id]", formData.site_id);
    formDataToSend.append(
      "construction_update[building_id]",
      formData.building_id
    );
    formDataToSend.append("construction_update[on_date]", onDate);
    formDataToSend.append("_method", "PUT"); 

    if (attachment) {
      formDataToSend.append("construction_update[attachment]", attachment);
    }

    try {
      await axios.post(
        `${baseURL}construction_updates/${id}.json`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      toast.success("Construction update updated successfully");
      navigate("/setup-member/construction-updates-list");
    } catch (err) {
      if (err.response?.status === 422) {
        toast.error("Construction update with this title already exists.");
      } else {
        toast.error(`Error updating construction update: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    // if (!formData.user_id) newErrors.user_id = "User selection is required";
    // if (!formData.project_id)
    //   newErrors.project_id = "Project selection is required";
    // // if (!formData.site_id) newErrors.site_id = "Site selection is required";
    // if (!formData.building_id)
    //   newErrors.building_id = "Building type selection is required";
    // if (!onDate) newErrors.onDate = "Date is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all the required fields.");
      return false;
    }
    return true;
  };


  return (
    <>
      <div className="main-content">
        <div className="">
          <div className="module-data-section container-fluid">
            <form onSubmit={handleSubmit}>
              <div className="card mt-4 pb-4 mx-4">
                <div className="card-header">
                  <h3 className="card-title">Edit Construction Update</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                  
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Title <span className="text-danger"> *</span>
                        </label>
                        <input
                          className={`form-control ${
                            errors.title ? "is-invalid" : ""
                          }`}
                          type="text"
                          placeholder="Enter title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                        {errors.title && (
                          <span className="text-danger">{errors.title}</span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Description <span className="text-danger"> *</span>
                        </label>
                        <textarea
                          className={`form-control ${
                            errors.description ? "is-invalid" : ""
                          }`}
                          rows="1"
                          placeholder="Enter description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                        {errors.description && (
                          <span className="text-danger">
                            {errors.description}
                          </span>
                        )}
                      </div>
                    </div>

              
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          User 
                          {/* <span className="text-danger"> *</span> */}
                        </label>
                        <SelectBox
                          options={eventUserID.map((user) => ({
                            value: user.id,
                            label: `${user.firstname} ${user.lastname}`,
                          }))}
                          defaultValue={formData.user_id}
                          onChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              user_id: value,
                            }))
                          }
                        />
                        {errors.user_id && (
                          <span className="text-danger">{errors.user_id}</span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Project 
                          {/* <span className="text-danger"> *</span> */}
                        </label>
                        <SelectBox
                          options={projects.map((p) => ({
                            label: p.project_name,
                            value: p.id,
                          }))}
                          defaultValue={formData.project_id}
                          onChange={(value) =>
                            setFormData({ ...formData, project_id: value })
                          }
                        />
                        {errors.project_id && (
                          <span className="text-danger">
                            {errors.project_id}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Site 
                          {/* <span className="text-danger"> *</span> */}
                        </label>
                        <SelectBox
                          name="site_id"
                          options={
                            sitesLoading
                              ? [{ value: "", label: "Loading..." }]
                              : sites.length > 0
                              ? sites.map((site) => ({
                                  value: site.id,
                                  label: site.name,
                                }))
                              : [{ value: "", label: "No sites found" }]
                          }
                          defaultValue={formData.site_id}
                          onChange={(value) =>
                            setFormData({ ...formData, site_id: value })
                          }
                        />
                        {errors.site_id && (
                          <span className="text-danger">{errors.site_id}</span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Building Type 
                          {/* <span className="text-danger"> *</span> */}
                        </label>
                        <SelectBox
                          name="building_id"
                          options={
                            buildingTypesLoading
                              ? [{ value: "", label: "Loading..." }]
                              : buildingTypes.length > 0
                              ? buildingTypes.map((building) => ({
                                  value: building.id,
                                  label: building.building_type,
                                }))
                              : [
                                  {
                                    value: "",
                                    label: "No building types found",
                                  },
                                ]
                          }
                          defaultValue={formData.building_id}
                          onChange={(value) =>
                            setFormData({ ...formData, building_id: value })
                          }
                        />
                        {errors.building_id && (
                          <span className="text-danger">
                            {errors.building_id}
                          </span>
                        )}
                      </div>
                    </div>


                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Date <span className="text-danger"> *</span>
                        </label>
                        <input
                          className={`form-control ${
                            errors.onDate ? "is-invalid" : ""
                          }`}
                          type="date"
                          value={onDate}
                          onChange={(e) => setOnDate(e.target.value)}
                        />
                        {errors.onDate && (
                          <span className="text-danger">{errors.onDate}</span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Upload Attachment{" "}
                          <span
                            className="tooltip-container"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                          >
                            [i]
                            {showTooltip && (
                              <span className="tooltip-text">
                                Max Upload Size 10 MB - Supports Images, Videos, PDF, DOC
                              </span>
                            )}
                          </span>
                        </label>
                        <input
                          className="form-control"
                          type="file"
                          accept=".png,.jpg,.jpeg,.svg,.pdf,.doc,.docx,.mp4,.mov,.avi,.mkv,.webm"
                          onChange={handleFileChange}
                        />
                       
                      </div>
                      {previewImage && (
                        <div className="mt-2">
                          {/* Check if we have an attachment (new file) or existing attachment */}
                          {attachment ? (
                            // New file preview
                            attachment.type.startsWith('image/') ? (
                              <img
                                src={previewImage}
                                alt="Attachment Preview"
                                className="img-fluid rounded"
                                style={{
                                  maxWidth: "100px",
                                  maxHeight: "100px",
                                  objectFit: "cover",
                                  border: "1px solid #ccc",
                                  padding: "5px",
                                }}
                              />
                            ) : attachment.type.startsWith('video/') ? (
                              <video
                                src={previewImage}
                                controls
                                className="img-fluid rounded"
                                style={{
                                  maxWidth: "150px",
                                  maxHeight: "100px",
                                  objectFit: "cover",
                                  border: "1px solid #ccc",
                                  padding: "5px",
                                }}
                              />
                            ) : (
                              <div 
                                className="file-preview d-flex align-items-center justify-content-center rounded"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  border: "1px solid #ccc",
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                <div className="text-center">
                                  <i className="fas fa-file fa-2x text-secondary mb-1"></i>
                                  <div className="small text-muted">
                                    {attachment.name.split('.').pop().toUpperCase()}
                                  </div>
                                </div>
                              </div>
                            )
                          ) : (
                            // Existing attachment preview (from server)
                            existingAttachmentName && existingAttachmentName.match(/\.(mp4|mov|avi|mkv|webm)$/i) ? (
                              <video
                                src={previewImage}
                                controls
                                className="img-fluid rounded"
                                style={{
                                  maxWidth: "150px",
                                  maxHeight: "100px",
                                  objectFit: "cover",
                                  border: "1px solid #ccc",
                                  padding: "5px",
                                }}
                              />
                            ) : existingAttachmentName && existingAttachmentName.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i) ? (
                              <img
                                src={previewImage}
                                alt="Attachment Preview"
                                className="img-fluid rounded"
                                style={{
                                  maxWidth: "100px",
                                  maxHeight: "100px",
                                  objectFit: "cover",
                                  border: "1px solid #ccc",
                                  padding: "5px",
                                }}
                              />
                            ) : (
                              <div 
                                className="file-preview d-flex align-items-center justify-content-center rounded"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  border: "1px solid #ccc",
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                <div className="text-center">
                                  <i className="fas fa-file fa-2x text-secondary mb-1"></i>
                                  <div className="small text-muted">
                                    {existingAttachmentName ? existingAttachmentName.split('.').pop().toUpperCase() : 'FILE'}
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                          {/* File info */}
                          <div className="small text-muted mt-1">
                            {attachment ? (
                              `${attachment.name} (${(attachment.size / (1024 * 1024)).toFixed(2)} MB)`
                            ) : existingAttachmentName ? (
                              existingAttachmentName
                            ) : (
                              'Existing attachment'
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-2 justify-content-center">
                <div className="col-md-2">
                  <button
                    type="submit"
                    className="purple-btn2 w-100"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="purple-btn2 w-100"
                    onClick={() =>
                      navigate("/setup-member/construction-updates-list")
                    }
                  >
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

export default ConstructionUpdatesEdit;