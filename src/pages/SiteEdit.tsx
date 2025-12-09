import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";


const SiteEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the site ID from URL params
  const [organizations, setOrganizations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  

  // Initialize form data with all required fields
  const [formData, setFormData] = useState({
    name: "",
    companyId: "",
    departmentId: "",
    latitude: "",
    longitude: "",
    address: "",
    city: "",
    district: "",
    state: "",
    projectId: "",
    status:"active",
    // deleted: false,
  });

  // Fetch Site Data by ID
  const fetchSiteData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}sites/${id}.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
  
      console.log("Site data:", response.data);
  
      const siteData =
        response.data.site ||
        response.data.data ||
        (Array.isArray(response.data) ? response.data[0] : response.data);
  
      if (!siteData) {
        throw new Error("Invalid site data structure in API response");
      }
  
      setFormData({
        name: siteData.name || "",
        companyId: siteData.company_id || "",
        departmentId: siteData.department_id || "",
        latitude: siteData.latitude ? siteData.latitude.toString() : "",
        longitude: siteData.longitude ? siteData.longitude.toString() : "",
        address: siteData.address || "",
        city: siteData.city || "",
        district: siteData.district || "",
        state: siteData.state || "",
        projectId: siteData.project_id || "",
        // active: siteData.active !== false,
        // deleted: siteData.deleted === true,
      });
  
    } catch (error) {
      console.error("Error fetching site data:", error);
      toast.error("Failed to fetch site data");
      navigate("/site-list");
    } finally {
      setLoading(false);
    }
  };
  

  // Fetch Organizations
  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(`${baseURL}organizations.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      
      if (Array.isArray(response.data.organizations)) {
        setOrganizations(response.data.organizations);
      } else {
        setOrganizations([]);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast.error("Failed to fetch organizations.");
    }
  };

  // Fetch Companies
  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${baseURL}company_setups.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      
      if (Array.isArray(response.data.company_setups)) {
        setCompanies(response.data.company_setups);
      } else {
        setCompanies([]);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to fetch companies.");
    }
  };

  // Fetch Departments
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${baseURL}departments.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      
      if (Array.isArray(response.data.departments)) {
        setDepartments(response.data.departments);
      } else if (Array.isArray(response.data)) {
        // If data is directly an array
        setDepartments(response.data);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments.");
    }
  };

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${baseURL}get_all_projects.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      
      if (Array.isArray(response.data.projects)) {
        setProjects(response.data.projects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects.");
    }
  };

  // Load all data when component mounts
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchSiteData(),
          fetchOrganizations(),
          fetchCompanies(),
          fetchDepartments(),
          fetchProjects()
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, [id]);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate Form Before Submission
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Site Name is required.");
      return false;
    }
    // if (!formData.companyId) {
    //   toast.error("Company is required.");
    //   return false;
    // }
    return true;
  };

  // Handle Form Submission (Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
        const response = await axios.put(
            `${baseURL}sites/${id}.json`, 
        {
          site: {
            name: formData.name,
            company_id: formData.companyId,
            department_id: formData.departmentId || null,
            latitude: formData.latitude ? parseFloat(formData.latitude) : null,
            longitude: formData.longitude ? parseFloat(formData.longitude) : null,
            address: formData.address,
            city: formData.city,
            district: formData.district,
            state: formData.state,
            project_id: formData.projectId || null,
            // active: formData.active,
            // deleted: formData.deleted,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Site updated successfully!");
        navigate("/site-list");
      } else {
        toast.error(response.data.message || "Failed to update site.");
      }
    } catch (error) {
      console.error("Error updating site:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="website-content">
          <div className="container-fluid">
            <div className="card mt-4 pb-4 mx-4">
              <div className="card-body text-center">
                <h3>Loading site data...</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <form onSubmit={handleSubmit}>
            <div className="card mt-4 pb-4 mx-4">
              <div className="card-header">
                <h3 className="card-title">Edit Site</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  {/* Site Name */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Site Name <span className="otp-asterisk"> *</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter Site Name"
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Company 
                      </label>
                      <SelectBox
                        name="companyId"
                        options={
                          companies.length > 0
                            ? companies.map((comp) => ({
                                value: comp.id,
                                label: comp.name,
                              }))
                            : [{ value: "", label: "No companies found" }]
                        }
                        defaultValue={formData.companyId}
                        onChange={(value) =>
                          setFormData({ ...formData, companyId: value })
                        }
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Department</label>
                      <SelectBox
                        name="departmentId"
                        options={
                          departments.length > 0
                            ? departments.map((dept) => ({
                                value: dept.id,
                                label: dept.name,
                              }))
                            : [{ value: "", label: "No departments found" }]
                        }
                        defaultValue={formData.departmentId}
                        onChange={(value) =>
                          setFormData({ ...formData, departmentId: value })
                        }
                      />
                    </div>
                  </div>

                  {/* Project */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Project</label>
                      <SelectBox
                        name="projectId"
                        options={
                          projects.length > 0
                            ? projects.map((project) => ({
                                value: project.id,
                                label: project.name || project.project_name,
                              }))
                            : [{ value: "", label: "No projects found" }]
                        }
                        defaultValue={formData.projectId}
                        onChange={(value) =>
                          setFormData({ ...formData, projectId: value })
                        }
                      />
                    </div>
                  </div>

                  {/* Latitude */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Latitude</label>
                      <input
                        className="form-control"
                        type="text"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        placeholder="Enter Latitude"
                      />
                    </div>
                  </div>

                  {/* Longitude */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Longitude</label>
                      <input
                        className="form-control"
                        type="text"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        placeholder="Enter Longitude"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        className="form-control"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter Address"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        className="form-control"
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter City"
                      />
                    </div>
                  </div>

                  {/* District */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>District</label>
                      <input
                        className="form-control"
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder="Enter District"
                      />
                    </div>
                  </div>

                  {/* State */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>State</label>
                      <input
                        className="form-control"
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Enter State"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="row mt-2 justify-content-center">
              <div className="col-md-2">
                <button
                  type="submit"
                  className="purple-btn2 purple-btn2-shadow w-100"
                  disabled={submitting}
                >
                  {submitting ? "Updating..." : "Submit"}
                </button>
              </div>
              <div className="col-md-2">
                <button
                  type="button"
                  className="purple-btn2 purple-btn2-shadow w-100"
                  onClick={() => navigate(-1)}
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

export default SiteEdit;