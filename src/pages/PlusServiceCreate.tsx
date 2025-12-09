import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft } from "lucide-react";
import SelectBox from "../components/ui/select-box";

const PlusServiceCreate = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();

  const [serviceData, setServiceData] = useState({
    name: "",
    description: "",
    attachment: null,
    service_category_id: "",
    order_no: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`${baseURL}/service_categories.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
        setServices(response.data || []);
      } catch (error) {
        console.error("Error fetching services:", error.response?.data || error.message);
        toast.error("Failed to load service categories");
      }
    };

    fetchService();
  }, [baseURL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setServiceData((prev) => ({ ...prev, attachment: null }));
      return;
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

    if (!validTypes.includes(file.type)) {
      toast.error("Please select only image files (JPEG, PNG, GIF, WebP).");
      e.target.value = "";
      return;
    }

    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image must be less than 3MB.");
      e.target.value = "";
      return;
    }

    setServiceData((prev) => ({ ...prev, attachment: file }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!serviceData.name.trim()) newErrors.name = "Service name is required";
    if (!serviceData.description.trim()) newErrors.description = "Description is required";
    
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

    setLoading(true);
    toast.dismiss();

    try {
      const formData = new FormData();
      formData.append("plus_service[name]", serviceData.name);
      formData.append("plus_service[description]", serviceData.description);
      formData.append("plus_service[service_category_id]", serviceData.service_category_id);
      
      if (serviceData.order_no) {
        formData.append("plus_service[order_no]", serviceData.order_no);
      }

      if (serviceData.attachment) {
        formData.append("plus_service[attachment]", serviceData.attachment);
      }

      await axios.post(`${baseURL}/plus_services.json`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      toast.success("Plus Service created successfully!");
      navigate("/setup-member/plus-services-list");
    } catch (error) {
      console.error("Error creating plus service:", error);

      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`;
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
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
            <span className="text-gray-400">Plus Services</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Create</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CREATE PLUS SERVICE</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Service Details</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all`}
                    placeholder="Enter name"
                    value={serviceData.name}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={1}
                    className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all resize-none`}
                    placeholder="Enter description"
                    value={serviceData.description}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                  )}
                </div>

                {/* Service Category */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Service Category
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <SelectBox
                    options={services.map((service) => ({
                      label: service.service_cat_name,
                      value: service.id,
                    }))}
                    value={serviceData.service_category_id}
                    onChange={(value) => setServiceData({ ...serviceData, service_category_id: value })}
                    disabled={loading}
                  />
                </div>

                {/* Order Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Order Number</label>
                  <input
                    type="number"
                    name="order_no"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                    placeholder="Enter order number"
                    value={serviceData.order_no}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                {/* Service Image */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span>Service Image</span>
                    <span
                      className="relative cursor-pointer text-blue-600"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      ℹ️
                      {showTooltip && (
                        <span className="absolute left-6 top-0 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                          Single image, max 3MB
                        </span>
                      )}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="attachment-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={loading}
                    />
                    <label
                      htmlFor="attachment-upload"
                      className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-600 text-sm">
                        {serviceData.attachment ? serviceData.attachment.name : "Choose image"}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </label>
                  </div>
                  {serviceData.attachment && (
                    <div className="mt-2 relative inline-block">
                      <img
                        src={URL.createObjectURL(serviceData.attachment)}
                        alt="Service Preview"
                        className="rounded-lg border border-gray-200"
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setServiceData((prev) => ({ ...prev, attachment: null }));
                          const fileInput = document.getElementById('attachment-upload');
                          if (fileInput) fileInput.value = "";
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  )}
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
                  onClick={() => navigate(-1)}
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

export default PlusServiceCreate;
