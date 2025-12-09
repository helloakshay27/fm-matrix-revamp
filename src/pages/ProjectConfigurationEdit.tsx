import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft } from "lucide-react";

const ProjectConfigurationEdit = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const { id } = useParams();
  const [iconPreview, setIconPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    active: "1",
    icon: null,
    existing_icon_url: "",
  });

  useEffect(() => {
    const fetchConfiguration = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/configuration_setups/${id}.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        
        const config = response.data;
        setFormData({
          name: config.name || "",
          active: config.active ? "1" : "0",
          icon: null,
          existing_icon_url: config.attachfile?.document_url || "",
        });
        
        if (config.attachfile?.document_url) {
          setIconPreview(config.attachfile.document_url);
        }
      } catch (error) {
        console.error("Error fetching configuration:", error);
        toast.error("Failed to load configuration");
      } finally {
        setLoading(false);
      }
    };

    fetchConfiguration();
  }, [id, baseURL]);

  const handleIconChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        icon: file,
      }));
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveIcon = () => {
    setFormData((prevData) => ({
      ...prevData,
      icon: null,
      existing_icon_url: "",
    }));
    setIconPreview(null);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("configuration_setup[name]", formData.name);
    formDataToSend.append("configuration_setup[active]", formData.active);
    
    if (formData.icon) {
      formDataToSend.append("configuration_setup[icon]", formData.icon);
    }

    try {
      await axios.put(`${baseURL}/configuration_setups/${id}.json`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Project configuration updated successfully!");
      navigate("/setup-member/project-configuration-list");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Update Failed!");
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
            <span className="text-gray-400">Project Configuration</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Edit</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">EDIT PROJECT CONFIGURATION</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Configuration Details</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    placeholder="Enter configuration name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                {/* Icon Upload */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span>Icon</span>
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
                  </label>
                  <input
                    type="file"
                    name="icon"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                    onChange={handleIconChange}
                    disabled={loading}
                    accept="image/*"
                  />
                </div>

                {/* Icon Preview */}
                {iconPreview && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Preview</label>
                    <div className="relative inline-block">
                      <img
                        src={iconPreview}
                        alt="Icon Preview"
                        className="rounded-lg border border-gray-200"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                        onClick={handleRemoveIcon}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
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
                      Updating...
                    </span>
                  ) : (
                    "Update"
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

export default ProjectConfigurationEdit;
