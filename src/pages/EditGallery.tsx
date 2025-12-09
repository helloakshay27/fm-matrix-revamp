import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
// import SelectBox from "../components/base/SingleSelect";


const EditGallery = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  console.log(location.state);

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    projectId: location.state?.gallery?.project_id || "",
    name: location.state?.gallery?.name || "",
    title: location.state?.gallery?.title || "",
    gallery_image: null,
  });
  console.log(formData.projectId);
  const [imagePreview, setImagePreview] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${baseURL}galleries/${id}.json`
        );
        const data = response.data;

        console.log("Gallery Data:", data); // 🔍 Debug API response

        setFormData((prev) => ({
          ...prev,
          projectId: data.project_id || prev.projectId,
          name: data.name || "",
          title: data.title || "",
          gallery_image: null,
        }));

        // ✅ Ensure default image is set
        setImagePreview(data.attachfile?.document_url || null);
      } catch (error) {
        toast.error("Failed to fetch gallery data.");
      } finally {
        setLoading(false);
      }
    };

    if (location.state?.gallery) {
      setFormData((prev) => ({
        ...prev,
        projectId: location.state.gallery.project_id || prev.projectId,
        name: location.state.gallery.name || "",
        title: location.state.gallery.title || "",
      }));

      // setImagePreview(location.state.gallery.attachfiles?.document_url || null);
      if (
        location.state?.gallery.attachfiles &&
        location.state?.gallery.attachfiles.length > 0
      ) {
        const imageUrls = location.state?.gallery.attachfiles.map(
          (file) => file.document_url
        );
        setImagePreview(imageUrls); // Set an array of image URLs
      } else {
        setImagePreview([]);
      }
    } else {
      fetchGallery();
    }
  }, [id, location.state?.gallery]);

  // Fetch Projects List
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${baseURL}projects.json`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setProjects(response.data.projects || []);

        setFormData((prev) => ({
          ...prev,
          projectId: prev.projectId || response.data.projects[0]?.id || "", // Set first project as default if none is set
        }));
      } catch (error) {
        toast.error("Failed to fetch projects.");
      }
    };

    fetchProjects();
    console.log("Projects:", projects);
  }, []);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const newImages = Array.from(files);
      const imageUrls = newImages.map((file) => URL.createObjectURL(file));

      setFormData((prev) => ({
        ...prev,
        attachment: [...(prev.attachment || []), ...newImages],
      }));

      setImagePreview((prev) => [...prev, ...imageUrls]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Corrected Image Upload in PUT Request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("gallery[project_id]", formData.projectId);
    data.append("gallery[name]", formData.name);
    data.append("gallery[title]", formData.title);

    if (formData.attachment.length > 0) {
      formData.attachment.forEach((file) => {
        data.append("gallery[gallery_image][]", file);
      });
    }

    try {
      await axios.put(
        `${baseURL}galleries/${id}.json`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Gallery updated successfully!");
      navigate("/gallery-list");
    } catch (error) {
      toast.error("Failed to update gallery.");
      console.error("Update error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };


  // Handle Cancel
  const handleCancel = () => {
    navigate(-1);
  };
  const handleRemoveImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));

    setFormData((prev) => {
      const updatedAttachments = prev.attachment ? [...prev.attachment] : [];
      updatedAttachments.splice(index, 1); // Remove the selected image

      return { ...prev, attachment: updatedAttachments };
    });
  };


  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <form onSubmit={handleSubmit}>
            <div className="card mx-4 pb-4 mt-4">
              <div className="card-header">
                <h3 className="card-title">Edit Gallery</h3>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center">Loading...</div>
                ) : (
                  <div className="row">
                    {/* Project Dropdown */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Project</label>
                        <select
                          className="form-control"
                          value={formData.projectId || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              projectId: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select Project</option>
                          {projects.map((proj) => (
                            <option key={proj.id} value={proj.id}>
                              {proj.project_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Name Input */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          className="form-control"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter name"
                        />
                      </div>
                    </div>

                    {/* Title Input */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          className="form-control"
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Enter title"
                        />
                      </div>
                    </div>

                    {/* Attachment Input */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Attachment</label>
                        <input
                          className="form-control"
                          type="file"
                          name="attachment"
                          onChange={handleInputChange}
                        />
                        {/* Image Preview */}
                        {imagePreview.length > 0 && (
                          <div className="mt-2 d-flex gap-2">
                            {imagePreview.map((url, index) => (
                              <div key={index} className="position-relative me-2">
                                <img
                                  key={index}
                                  src={url}
                                  alt={`Preview ${index}`}
                                  className="img-fluid rounded"
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
                                    right: -5,
                                    height: 20,
                                    width: 20,
                                    backgroundColor: "var(--red)",
                                    color: "white",
                                  }}
                                  onClick={() => handleRemoveImage(index)}
                                >
                                  ✖
                                </button>
                              </div>
                            ))}

                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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
                  {loading ? "Saving..." : "Submit"}
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

export default EditGallery;
