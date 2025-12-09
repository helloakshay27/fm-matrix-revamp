import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft, Upload, X } from "lucide-react";
import SelectBox from "../components/ui/select-box"


const CompanyCreate = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);


  const [formData, setFormData] = useState({
    companyName: "",
    companyLogo: null,
    organizationId: "",
  });

  // Fetch Organizations
  useEffect(() => {
    setLoading(true);
    fetch(`${baseURL}/organizations.json`, {
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

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only PNG, JPG, JPEG, and SVG files are allowed");
        return;
      }

      setFormData((prev) => ({ ...prev, companyLogo: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, companyLogo: null }));
    setImagePreview(null);
  };

  // ✅ Validate Form Before Submission
  const validateForm = () => {
    if (!formData.companyName.trim()) {
      toast.error("Company Name is required.");
      return false;
    }
    if (!formData.companyLogo) {
      toast.error("Company Logo is required.");
      return false;
    }
    return true;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!validateForm()) return;

    setSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("company_setup[name]", formData.companyName);
    formDataToSend.append(
      "company_setup[organization_id]",
      formData.organizationId
    );
    formDataToSend.append("company_logo", formData.companyLogo);

    try {
      const response = await fetch(`${baseURL}/company_setups.json`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        toast.success("Company created successfully!");
        setFormData({ companyName: "", companyLogo: null, organizationId: "" });
        setImagePreview(null);
        navigate("/company-list");
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);

        if (response.status === 422) {
          if (errorData.message && errorData.message.toLowerCase().includes("name")) {
            toast.error("Company name already exists. Please choose a different name.");
          } else {
            toast.error("Company name already exists. Please choose a different name.");
          }
        } else {
          toast.error(errorData.message || "Failed to create company.");
        }
      }
    } catch (error) {
      console.error("Error submitting company:", error);
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
            <span className="text-gray-400">Setup</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Company</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Create</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CREATE COMPANY</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Company Details</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </div>

                {/* Company Logo */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Logo
                    <span className="text-red-500 ml-1">*</span>
                    <span className="text-xs text-gray-500 ml-2">(Max 10MB - PNG, JPG, JPEG, SVG)</span>
                  </label>
                  <div className="space-y-3">
                    {!imagePreview ? (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#8B0203] transition-colors bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG, SVG</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".png,.jpg,.jpeg,.svg"
                          onChange={handleFileChange}
                          disabled={submitting}
                        />
                      </label>
                    ) : (
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-contain border border-gray-200 rounded-lg p-2"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          disabled={submitting}
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {formData.companyLogo && (
                          <p className="text-xs text-gray-600 mt-2">
                            {formData.companyLogo.name}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Organization */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Organization
                  </label>
                  <SelectBox
                    name="organizationId"
                    options={
                      loading
                        ? [{ value: "", label: "Loading..." }]
                        : organizations.length > 0
                        ? [
                            { value: "", label: "Select Organization" },
                            ...organizations.map((org) => ({
                              value: org.id,
                              label: org.name,
                            })),
                          ]
                        : [{ value: "", label: "No organizations found" }]
                    }
                    value={formData.organizationId}
                    onChange={(value) =>
                      setFormData({ ...formData, organizationId: value })
                    }
                    disabled={submitting}
                  />
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
                  onClick={() => {
                    setFormData({
                      companyName: "",
                      companyLogo: null,
                      organizationId: "",
                    });
                    setImagePreview(null);
                    navigate(-1);
                  }}
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

export default CompanyCreate;
