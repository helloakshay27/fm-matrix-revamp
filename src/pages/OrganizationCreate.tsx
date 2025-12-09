import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";
import { ChevronRight, ArrowLeft, Upload, X } from "lucide-react";

const OrganizationCreate = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const navigate = useNavigate();
  const [imagePreviews, setImagePreviews] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    sub_domain: "",
    country_id: "",
    mobile: "",
    attachment: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMobileChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile" && value.length > 10) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const file = files[0];

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

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    setFormData({ ...formData, attachment: files[0] });
  };

  const handleRemoveImage = () => {
    setImagePreviews([]);
    setFormData({ ...formData, attachment: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    if (!formData.name) {
      toast.error("Organization Name is required.");
      setLoading(false);
      return;
    }
    if (!formData.domain) {
      toast.error("Domain is required.");
      setLoading(false);
      return;
    }
    if (!formData.sub_domain) {
      toast.error("Sub-domain is required.");
      setLoading(false);
      return;
    }
    if (!formData.country_id) {
      toast.error("Country ID is required.");
      setLoading(false);
      return;
    }
    if (!formData.mobile || formData.mobile.length !== 10) {
      toast.error("Mobile number must be 10 digits.");
      setLoading(false);
      return;
    }
    if (!formData.attachment) {
      toast.error("Attachment is required.");
      setLoading(false);
      return;
    }

    const payload = new FormData();
    payload.append("organization[name]", formData.name);
    payload.append("organization[domain]", formData.domain);
    payload.append("organization[sub_domain]", formData.sub_domain);
    payload.append("organization[country_id]", formData.country_id);
    payload.append("organization[mobile]", formData.mobile);
    payload.append("organization[active]", true);
    payload.append("organization[created_by_id]", 1);
    if (formData.attachment) {
      payload.append("organization[org_image]", formData.attachment);
    }

    try {
      const response = await axios.post(
        `${baseURL}/organizations.json`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Organization created successfully!");
      }

      setFormData({
        name: "",
        domain: "",
        sub_domain: "",
        country_id: "",
        mobile: "",
        attachment: null,
      });
      setImagePreviews([]);
      navigate("/organization-list");
    } catch (error) {
      console.error(
        "Error creating Organization:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to create Organization. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      domain: "",
      mobile: "",
      sub_domain: "",
      country_id: "",
      attachment: null,
    });
    setImagePreviews([]);
    navigate(-1);
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
            <span className="text-gray-400">Organization</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Create</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CREATE ORGANIZATION</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Organization Details</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                    placeholder="Enter organization name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Domain Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Domain
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="domain"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                    placeholder="Enter domain"
                    value={formData.domain}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Sub-domain Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Sub-domain
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="sub_domain"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                    placeholder="Enter sub-domain"
                    value={formData.sub_domain}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Country ID Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Country ID
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    name="country_id"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                    placeholder="Enter country ID"
                    value={formData.country_id}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Mobile Number Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile Number
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d{10}"
                    name="mobile"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                    placeholder="Enter 10-digit mobile number"
                    value={formData.mobile}
                    maxLength={10}
                    onChange={handleMobileChange}
                    disabled={loading}
                  />
                </div>

                {/* Attachment Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Attachment
                    <span className="text-red-500 ml-1">*</span>
                    <span className="text-xs text-gray-500 ml-2">(Max 10MB - PNG, JPG, JPEG, SVG)</span>
                  </label>
                  <div className="space-y-3">
                    {imagePreviews.length === 0 ? (
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
                          name="attachment"
                          accept=".png,.jpg,.jpeg,.svg"
                          onChange={handleFileChange}
                          disabled={loading}
                        />
                      </label>
                    ) : (
                      <div className="relative inline-block">
                        <img
                          src={imagePreviews[0]}
                          alt="Preview"
                          className="w-32 h-32 object-cover border border-gray-200 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          disabled={loading}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-2.5 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors font-medium ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
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
                  onClick={handleCancel}
                  disabled={loading}
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

export default OrganizationCreate;
