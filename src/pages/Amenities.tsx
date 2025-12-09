import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import { ChevronRight, ArrowLeft } from "lucide-react";

const Amenities = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [darkModeIcon, setDarkModeIcon] = useState(null);
  const [previewDarkModeImage, setPreviewDarkModeImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDarkModeTooltip, setShowDarkModeTooltip] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setIcon(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleDarkModeFileChange = (e) => {
    const file = e.target.files[0];
    setDarkModeIcon(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewDarkModeImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewDarkModeImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("amenity_setup[name]", name);
    formData.append("amenity_setup[night_mode]", nightMode);
    if (icon) {
      formData.append("icon", icon);
    }
    if (darkModeIcon) {
      formData.append("dark_mode_icon", darkModeIcon);
    }

    try {
      await axios.post(`${baseURL}/amenity_setups.json`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      toast.success("Amenity added successfully");
      navigate("/setup-member/amenities-list");
    } catch (err) {
      if (err.response?.status === 422) {
        toast.error("Amenity with this name already exists.");
      } else {
        toast.error(`Error adding amenity: ${err.message}`);
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
            <span className="text-gray-400">Amenities</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Create</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CREATE AMENITY</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Amenity Details</h3>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                    placeholder="Enter amenity name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {/* Icon Upload */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span>Upload Icon</span>
                    <span
                      className="relative cursor-pointer text-blue-600"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      ℹ️
                      {showTooltip && (
                        <span className="absolute left-6 top-0 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                          Max Upload Size 10 MB
                        </span>
                      )}
                    </span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="icon-upload"
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.svg"
                      onChange={handleFileChange}
                      disabled={loading}
                    />
                    <label
                      htmlFor="icon-upload"
                      className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-600 text-sm">
                        {icon ? icon.name : "Choose file"}
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
                  {previewImage && (
                    <div className="mt-2 relative inline-block">
                      <img
                        src={previewImage}
                        alt="Icon Preview"
                        className="rounded-lg border border-gray-200"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIcon(null);
                          setPreviewImage(null);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                {/* Dark Mode Icon Upload */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span>Dark Mode Icon</span>
                    <span
                      className="relative cursor-pointer text-blue-600"
                      onMouseEnter={() => setShowDarkModeTooltip(true)}
                      onMouseLeave={() => setShowDarkModeTooltip(false)}
                    >
                      ℹ️
                      {showDarkModeTooltip && (
                        <span className="absolute left-6 top-0 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                          Max Upload Size 10 MB
                        </span>
                      )}
                    </span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="dark-mode-icon-upload"
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.svg"
                      onChange={handleDarkModeFileChange}
                      disabled={loading}
                    />
                    <label
                      htmlFor="dark-mode-icon-upload"
                      className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-600 text-sm">
                        {darkModeIcon ? darkModeIcon.name : "Choose file"}
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
                  {previewDarkModeImage && (
                    <div className="mt-2 relative inline-block">
                      <img
                        src={previewDarkModeImage}
                        alt="Dark Mode Preview"
                        className="rounded-lg border border-gray-200"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setDarkModeIcon(null);
                          setPreviewDarkModeImage(null);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                {/* Night Mode Toggle */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Night Mode
                  </label>
                  <button
                    type="button"
                    onClick={() => setNightMode(!nightMode)}
                    className="text-gray-600 hover:opacity-80 transition-opacity"
                  >
                    {nightMode ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="24"
                        fill="#28a745"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="24"
                        fill="#6c757d"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zM5 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5" />
                      </svg>
                    )}
                  </button>
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

export default Amenities;