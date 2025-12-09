import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft } from "lucide-react";
import SelectBox from "../components/ui/select-box";

const DepartmentCreate = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    organizationId: "",
    companyId: "",
    siteId: null,
    active: true,
    deleted: false,
  });

  const [errors, setErrors] = useState({});

  // Fetch Organizations
  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseURL}/organizations.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        const data = await response.json();
        setOrganizations(Array.isArray(data.organizations) ? data.organizations : []);
      } catch (error) {
        console.error("Error fetching organizations:", error);
        toast.error("Failed to fetch organizations.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [baseURL]);

  // Fetch Companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${baseURL}/company_setups.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        const data = await response.json();
        setCompanies(Array.isArray(data.company_setups) ? data.company_setups : []);
      } catch (error) {
        console.error("Error fetching company setups:", error);
        toast.error("Failed to fetch company setups.");
      }
    };

    fetchCompanies();
  }, [baseURL]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Department name is required";
    if (!formData.organizationId) newErrors.organizationId = "Organization is required";
    if (!formData.companyId) newErrors.companyId = "Company is required";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const response = await fetch(`${baseURL}/departments.json`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          department: {
            name: formData.name,
            organization_id: formData.organizationId,
            company_id: formData.companyId,
            site_id: formData.siteId || null,
            active: true,
            deleted: false,
          },
        }),
      });

      if (response.ok) {
        toast.success("Department created successfully!");
        navigate("/setup-member/department-list");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to create department.");
      }
    } catch (error) {
      console.error("Error submitting department:", error);
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
            <span className="text-gray-400">Department</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Create</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CREATE DEPARTMENT</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Department Details</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Department Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Department Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all`}
                    placeholder="Enter department name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={submitting}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Company ID */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Company
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <SelectBox
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
                    onChange={(value) => setFormData({ ...formData, companyId: value })}
                    disabled={submitting}
                  />
                  {errors.companyId && (
                    <p className="text-red-500 text-xs mt-1">{errors.companyId}</p>
                  )}
                </div>

                {/* Organization ID */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Organization
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <SelectBox
                    options={
                      loading
                        ? [{ value: "", label: "Loading..." }]
                        : organizations.length > 0
                        ? organizations.map((org) => ({
                            value: org.id,
                            label: org.name,
                          }))
                        : [{ value: "", label: "No organizations found" }]
                    }
                    value={formData.organizationId}
                    onChange={(value) => setFormData({ ...formData, organizationId: value })}
                    disabled={submitting}
                  />
                  {errors.organizationId && (
                    <p className="text-red-500 text-xs mt-1">{errors.organizationId}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-8 py-2.5 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors font-medium ${
                    submitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={submitting}
                  className="px-8 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentCreate;
