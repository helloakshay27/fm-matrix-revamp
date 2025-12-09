import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import SelectBox from "@/components/ui/select-box";

const SiteCreate = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const navigate = useNavigate();
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
    status: "active",
    // deleted: false,
  });

  console.log("Form Data:", formData);

  // Fetch Organizations
  useEffect(() => {
    setLoading(true);
    fetch(`${baseURL}organizations.json`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.organizations)) {
          setOrganizations(data.organizations);
        } else {
          setOrganizations([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching organizations:", error);
        toast.error("Failed to fetch organizations.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch Companies
  useEffect(() => {
    setLoading(true);
    fetch(`${baseURL}company_setups.json`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.company_setups)) {
          setCompanies(data.company_setups);
        } else {
          setCompanies([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
        toast.error("Failed to fetch companies.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch Departments
  useEffect(() => {
    setLoading(true);
    fetch(`${baseURL}departments.json`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Departments data:", data); // Debug log
        if (Array.isArray(data.departments)) {
          setDepartments(data.departments);
        } else if (Array.isArray(data)) {
          // If data is directly an array
          setDepartments(data);
        } else {
          setDepartments([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
        toast.error("Failed to fetch departments.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch Projects
  useEffect(() => {
    setLoading(true);
    fetch(`${baseURL}get_all_projects.json`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.projects)) {
          setProjects(data.projects);
        } else {
          setProjects([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        toast.error("Failed to fetch projects.");
      })
      .finally(() => setLoading(false));
  }, []);

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
    // if (!formData.organizationId) {
    //   toast.error("Organization is required.");
    //   return false;
    // }
    return true;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${baseURL}sites.json`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          site: {
            name: formData.name,
            organization_id: formData.organizationId,
            company_id: formData.companyId,
            department_id: formData.departmentId || null,
            latitude: formData.latitude ? parseFloat(formData.latitude) : null,
            longitude: formData.longitude ? parseFloat(formData.longitude) : null,
            address: formData.address,
            city: formData.city,
            district: formData.district,
            state: formData.state,
            project_id: formData.projectId || null,
            // active: true,
            // deleted: false,
            status: "active",
          },
        }),
      });

      if (response.ok) {
        toast.success("Site created successfully!");
        navigate("/site-list");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to create site.");
      }
    } catch (error) {
      console.error("Error submitting site:", error);
      toast.error("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="p-6 max-w-full h-[calc(100vh-50px)] overflow-y-auto">
        {/* Header with Back Button and Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-[#C72030] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Setup Member</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Site</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Create Site</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CREATE SITE</h1>
        </div>

        {/* Main Form Card */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Site Information</h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Site Name */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      Site Name
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter Site Name"
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      Company
                    </label>
                    <SelectBox
                      name="companyId"
                      options={
                        loading
                          ? [{ value: "", label: "Loading..." }]
                          : companies.length > 0
                          ? companies.map((comp) => ({
                              value: comp.id,
                              label: comp.name,
                            }))
                          : [{ value: "", label: "No companies found" }]
                      }
                      value={formData.companyId}
                      onChange={(value) =>
                        setFormData({ ...formData, companyId: value })
                      }
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      Department
                    </label>
                    <SelectBox
                      name="departmentId"
                      options={
                        loading
                          ? [{ value: "", label: "Loading..." }]
                          : departments.length > 0
                          ? departments.map((dept) => ({
                              value: dept.id,
                              label: dept.name,
                            }))
                          : [{ value: "", label: "No departments found" }]
                      }
                      value={formData.departmentId}
                      onChange={(value) =>
                        setFormData({ ...formData, departmentId: value })
                      }
                    />
                  </div>
                </div>

                {/* Project */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      Project
                    </label>
                    <SelectBox
                      name="projectId"
                      options={
                        loading
                          ? [{ value: "", label: "Loading..." }]
                          : projects.length > 0
                          ? projects.map((project) => ({
                              value: project.id,
                              label: project.name || project.project_name,
                            }))
                          : [{ value: "", label: "No projects found" }]
                      }
                      value={formData.projectId}
                      onChange={(value) =>
                        setFormData({ ...formData, projectId: value })
                      }
                    />
                  </div>
                </div>

                {/* Latitude */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      Latitude
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                      type="text"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="Enter Latitude"
                    />
                  </div>
                </div>

                {/* Longitude */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      Longitude
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                      type="text"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="Enter Longitude"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      Address
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter Address"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      City
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter City"
                    />
                  </div>
                </div>

                {/* District */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      District
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="Enter District"
                    />
                  </div>
                </div>

                {/* State */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      State
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
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

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-[#f6f4ee] text-[#C72030] rounded hover:bg-[#f0ebe0] transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-[#C72030] text-white rounded hover:bg-[#B8252F] transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteCreate;