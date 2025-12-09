import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowLeft, Upload } from "lucide-react";
import MultiSelectBox from "../components/ui/multi-selector";
import SelectBox from "../components/ui/select-box";


const ConstructionUpdatesCreate = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [onDate, setOnDate] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [eventUserID, setEventUserID] = useState([]);
  const [buildingTypes, setBuildingTypes] = useState([]);
  const [sitesLoading, setSitesLoading] = useState(false);
  const [buildingTypesLoading, setBuildingTypesLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    user_id: "",
    project_id: "",
    site_id: "",
    building_id: "",
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${baseURL}/projects.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
        setProjects(response.data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects");
      }
    };

    fetchProjects();
  }, [baseURL]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${baseURL}users/get_users.json`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setEventUserID(response?.data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      }
    };
    fetchUsers();
  }, [baseURL]);

  useEffect(() => {
    const fetchSites = async () => {
      setSitesLoading(true);
      try {
        const response = await axios.get(`${baseURL}sites.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setSites(response.data);
        } else if (response.data && Array.isArray(response.data.sites)) {
          setSites(response.data.sites);
        } else {
          console.error("Invalid sites data format:", response.data);
          toast.error("Failed to load sites: Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching sites:", error);
        toast.error("Failed to load sites");
      } finally {
        setSitesLoading(false);
      }
    };

    fetchSites();
  }, [baseURL]);

  useEffect(() => {
    const fetchBuildingTypes = async () => {
      setBuildingTypesLoading(true);
      try {
        const response = await axios.get(`${baseURL}building_types.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
        
        const buildingTypesData = response.data || [];
        setBuildingTypes(buildingTypesData);
      } catch (error) {
        console.error("Error fetching building types:", error);
        toast.error("Failed to load building types");
      } finally {
        setBuildingTypesLoading(false);
      }
    };

    fetchBuildingTypes();
  }, [baseURL]);

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAttachment(file);

    if (file) {
      const fileType = file.type;
      
      // Check if it's an image
      if (fileType.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      } 
      // Check if it's a video
      else if (fileType.startsWith('video/')) {
        const videoUrl = URL.createObjectURL(file);
        setPreviewImage(videoUrl);
      } 
      // For other file types (PDF, DOC, etc.)
      else {
        setPreviewImage(null);
      }
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("construction_update[title]", title);
    formDataToSend.append("construction_update[description]", description);
    formDataToSend.append("construction_update[user_id]", formData.user_id);
    formDataToSend.append("construction_update[status]", status);
    formDataToSend.append("construction_update[project_id]", formData.project_id);
    formDataToSend.append("construction_update[site_id]", formData.site_id);
    formDataToSend.append("construction_update[building_id]", formData.building_id);
    formDataToSend.append("construction_update[on_date]", onDate);
    
    if (attachment) {
      formDataToSend.append("construction_update[attachment]", attachment);
    }

    try {
      await axios.post(`${baseURL}construction_updates.json`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      toast.success("Construction update added successfully");
      resetForm();
      navigate("/setup-member/construction-updates-list");
    } catch (err) {
      if (err.response?.status === 422) {
        toast.error("Construction update with this title already exists.");
      } else {
        toast.error(`Error adding construction update: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("active");
    setOnDate("");
    setAttachment(null);
    setPreviewImage(null);
    setFormData({
      user_id: "",
      project_id: "",
      site_id: "",
      building_id: "",
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    // if (!formData.user_id) newErrors.user_id = "User selection is required";
    // if (!formData.project_id) newErrors.project_id = "Project selection is required";
    // if (!formData.site_id) newErrors.site_id = "Site selection is required";
    // if (!formData.building_id) newErrors.building_id = "Building type selection is required";
    // if (!onDate) newErrors.onDate = "Date is required";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all the required fields.");
      return false;
    }
    return true;
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
            <span className="text-gray-400">Construction Updates</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Create</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CREATE CONSTRUCTION UPDATE</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Construction Update Details</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all`}
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    rows={1}
                    className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all resize-none`}
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                  )}
                </div>

                {/* User */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">User</label>
                  <MultiSelectBox
                    options={eventUserID.map((user) => ({
                      value: user.id,
                      label: `${user.firstname} ${user.lastname}`,
                    }))}
                    value={
                      formData.user_id
                        ? formData.user_id.split(",").map((id) => {
                            const user = eventUserID.find((u) => u.id.toString() === id);
                            return {
                              value: id,
                              label: `${user?.firstname} ${user?.lastname}`,
                            };
                          })
                        : []
                    }
                    onChange={(selectedOptions) =>
                      setFormData((prev) => ({
                        ...prev,
                        user_id: selectedOptions.map((option) => option.value).join(","),
                      }))
                    }
                  />
                </div>

                {/* Project */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Project</label>
                  <SelectBox
                    options={projects.map((project) => ({
                      label: project.project_name,
                      value: project.id,
                    }))}
                    value={formData.project_id}
                    onChange={(value) => setFormData({ ...formData, project_id: value })}
                  />
                </div>

                {/* Site */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Site</label>
                  <SelectBox
                    options={
                      sitesLoading
                        ? [{ value: "", label: "Loading..." }]
                        : sites.length > 0
                        ? sites.map((site) => ({ value: site.id, label: site.name }))
                        : [{ value: "", label: "No sites found" }]
                    }
                    value={formData.site_id}
                    onChange={(value) => setFormData({ ...formData, site_id: value })}
                  />
                </div>

                {/* Building Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Building Type</label>
                  <SelectBox
                    options={
                      buildingTypesLoading
                        ? [{ value: "", label: "Loading..." }]
                        : buildingTypes.length > 0
                        ? buildingTypes.map((building) => ({ value: building.id, label: building.building_type }))
                        : [{ value: "", label: "No building types found" }]
                    }
                    value={formData.building_id}
                    onChange={(value) => setFormData({ ...formData, building_id: value })}
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                    value={onDate}
                    onChange={(e) => setOnDate(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {/* Upload Attachment */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span>Upload Attachment</span>
                    <span
                      className="relative cursor-pointer text-blue-600"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      ℹ️
                      {showTooltip && (
                        <span className="absolute left-6 top-0 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                          Max 10 MB - Images, Videos, PDF, DOC
                        </span>
                      )}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="attachment-upload"
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.svg,.pdf,.doc,.docx,.mp4,.mov,.avi,.mkv,.webm"
                      onChange={handleFileChange}
                      disabled={loading}
                    />
                    <label
                      htmlFor="attachment-upload"
                      className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-600 text-sm">
                        {attachment ? attachment.name : "Choose file"}
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
                  {previewImage && attachment && (
                    <div className="mt-2">
                      {attachment.type.startsWith('image/') ? (
                        <div className="relative inline-block">
                          <img
                            src={previewImage}
                            alt="Attachment Preview"
                            className="rounded-lg border border-gray-200"
                            style={{
                              maxWidth: "100px",
                              maxHeight: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setAttachment(null);
                              setPreviewImage(null);
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ) : attachment.type.startsWith('video/') ? (
                        <div className="relative inline-block">
                          <video
                            src={previewImage}
                            controls
                            className="rounded-lg border border-gray-200"
                            style={{
                              maxWidth: "150px",
                              maxHeight: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setAttachment(null);
                              setPreviewImage(null);
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {attachment.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(attachment.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setAttachment(null);
                              setPreviewImage(null);
                            }}
                            className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      )}
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

export default ConstructionUpdatesCreate;