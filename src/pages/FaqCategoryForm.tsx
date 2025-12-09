import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import { ChevronRight, ArrowLeft } from "lucide-react";
import SelectBox from "../components/ui/select-box";


const FaqCategoryForm = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [formData, setFormData] = useState({
    name: "",
    active: true,
    site_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [sites, setSites] = useState([]);
  const [sitesLoading, setSitesLoading] = useState(false);

  const navigate = useNavigate();
  const { faqId } = useParams();
  const isEditMode = !!faqId;

  // Get auth headers
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json",
  });

  // Fetch sites for dropdown
  useEffect(() => {
    const fetchSites = async () => {
      try {
        setSitesLoading(true);
        const res = await axios.get(`${baseURL}sites.json`, {
          headers: getAuthHeaders()
        });
        
        const sitesData = res.data?.sites || res.data || [];
        const formattedSites = sitesData.map(site => ({
          id: site?.id || '',
          name: site?.name || 'Unnamed Site'
        }));
        
        setSites(formattedSites);
      } catch (err) {
        console.error("Failed to fetch sites:", err);
        toast.error("Failed to load sites");
      } finally {
        setSitesLoading(false);
      }
    };
    fetchSites();
  }, []);

  // Fetch existing data for edit
  useEffect(() => {
    if (isEditMode && !hasFetched) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${baseURL}faq_categories/${faqId}.json`, {
            headers: getAuthHeaders()
          });
          
          const categoryData = res.data?.faq_category || res.data;
          
          if (categoryData) {
            setFormData({
              name: categoryData.name || "",
              active: categoryData.active !== undefined ? categoryData.active : true,
              site_id: categoryData.site_id || ""
            });
            setHasFetched(true);
          }
        } catch (err) {
          console.error("Failed to fetch FAQ category:", err);
          toast.error("Failed to load FAQ category");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [faqId, isEditMode, hasFetched]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.site_id) {
      toast.error("Site is required");
      return;
    }

    setLoading(true);

    try {
      const payload = { faq_category: formData };
      
      if (isEditMode) {
        await axios.put(
          `${baseURL}faq_categories/${faqId}.json`,
          payload,
          { headers: getAuthHeaders() }
        );
        toast.success("FAQ Category updated successfully!");
      } else {
        await axios.post(
          `${baseURL}faq_categories.json`,
          payload,
          { headers: getAuthHeaders() }
        );
        toast.success("FAQ Category created successfully!");
      }

      navigate("/setup-member/faq-category-list");
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit form";
      toast.error(errorMessage);
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
            <span className="text-gray-400">FAQ Category</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">{isEditMode ? "Edit" : "Create"}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "EDIT FAQ CATEGORY" : "CREATE FAQ CATEGORY"}
          </h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">FAQ Category Details</h3>
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
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                    placeholder="Enter FAQ category name"
                    disabled={loading}
                  />
                </div>

                {/* Site */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Site
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <SelectBox
                    options={[
                      { value: "", label: sitesLoading ? "Loading sites..." : "Select site" },
                      ...sites.map((site) => ({
                        value: site.id,
                        label: site.name,
                      })),
                    ]}
                    value={formData.site_id}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        site_id: value,
                      }))
                    }
                    disabled={loading || sitesLoading}
                  />
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
                      {isEditMode ? "Updating..." : "Creating..."}
                    </span>
                  ) : (
                    isEditMode ? "Update" : "Create"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/setup-member/faq-category-list")}
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

export default FaqCategoryForm;