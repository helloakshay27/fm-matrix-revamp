import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";


const ServiceCategoryForm = () => {
  const [formData, setFormData] = useState({
    service_cat_name: "",
    service_image: "",
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();
  const { serviceId } = useParams();
  const isEditMode = !!serviceId;

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json",
  });

  const getMultipartHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  });

  useEffect(() => {
    if (isEditMode && !hasFetched) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${baseURL}service_categories/${serviceId}.json`, {
            headers: getAuthHeaders()
          });
          
          const categoryData = res.data?.service_category || res.data;
          
          if (categoryData) {
            setFormData({
              service_cat_name: categoryData.service_cat_name || "",
              service_image: categoryData.service_image || "",
              active: categoryData.active !== undefined ? categoryData.active : true,
            });
            
            if (categoryData.service_image) {
              if (typeof categoryData.service_image === 'object' && categoryData.service_image.document_url) {
                setImagePreview(categoryData.service_image.document_url);
              } else if (typeof categoryData.service_image === 'string') {
                setImagePreview(categoryData.service_image);
              }
            }
            
            setHasFetched(true);
          }
        } catch (err) {
          console.error("Failed to fetch service category:", err);
          toast.error("Failed to load service category");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [serviceId, isEditMode, hasFetched]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      setFormData((prev) => ({
        ...prev,
        service_image: file.name,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.service_cat_name.trim()) {
      toast.error("Service category name is required");
      return;
    }

    if (!isEditMode && !imageFile) {
      toast.error("Service image is required");
      return;
    }

    setLoading(true);

    try {
      let payload;
      let headers;
      
      if (imageFile) {
        // When there's a new image file, use FormData
        const formDataPayload = new FormData();
        formDataPayload.append('service_category[service_cat_name]', formData.service_cat_name);
        formDataPayload.append('service_category[service_image]', imageFile);
        formDataPayload.append('service_category[active]', formData.active);
        
        payload = formDataPayload;
        headers = getMultipartHeaders();
      } else {
        // When no new image file, send only text fields as JSON
        const updateData = {
          service_cat_name: formData.service_cat_name,
          active: formData.active
        };
        
        payload = { service_category: updateData };
        headers = getAuthHeaders();
      }
      
      if (isEditMode) {
        await axios.put(
          `${baseURL}service_categories/${serviceId}.json`,
          payload,
          { headers }
        );
        toast.success("Service Category updated successfully!");
      } else {
        await axios.post(
          `${baseURL}service_categories.json`,
          payload,
          { headers }
        );
        toast.success("Service Category created successfully!");
      }

      navigate("/setup-member/service-category-list");
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit form";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <form id="serviceCategoryForm" onSubmit={handleSubmit}>
            <div className="card mt-4 pb-4 mx-4">
              <div className="card-header">
                <h3 className="card-title">
                  {isEditMode ? "Edit Service Category" : "Create Service Category"}
                </h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>
                        Service Category Name <span className="otp-asterisk">*</span>
                      </label>
                      <input
                        type="text"
                        name="service_cat_name"
                        value={formData.service_cat_name}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter service category name"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>
                        Service Image {!isEditMode && <span className="otp-asterisk">*</span>}
                      </label>
                      <input
                        type="file"
                        name="service_image"
                        onChange={handleImageChange}
                        className="form-control"
                        accept="image/*"
                        disabled={loading}
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img
                            src={imagePreview}
                            alt="Service preview"
                            style={{
                              maxWidth: "100px",
                              maxHeight: "100px",
                              objectFit: "cover",
                              border: "1px solid #ddd",
                              borderRadius: "4px"
                            }}
                          />
                          {/* <div className="mt-1">
                            <small className="text-muted">
                              {imageFile ? "New image selected" : "Current image"}
                            </small>
                          </div> */}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* <div className="col-md-4">
                    <div className="form-group">
                      <label>Status</label>
                      <div className="form-check mt-2">
                        <input
                          type="checkbox"
                          name="active"
                          id="active"
                          checked={formData.active}
                          onChange={handleChange}
                          className="form-check-input"
                          disabled={loading}
                        />
                        <label className="form-check-label" htmlFor="active">
                          Active
                        </label>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
            
            <button type="submit" style={{ display: "none" }} />
          </form>
          
          <div className="row mt-3 justify-content-center mx-4">
            <div className="col-md-2">
              <button
                type="submit"
                form="serviceCategoryForm" 
                className="purple-btn2 w-100"
                disabled={loading}
              >
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update"
                  : "Create"}
              </button>
            </div>
            <div className="col-md-2">
              <button
                type="button"
                className="purple-btn2 w-100"
                onClick={() => navigate("/setup-member/service-category-list")}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCategoryForm;