import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import { ChevronRight, ArrowLeft } from "lucide-react";
import SelectBox from "../components/ui/select-box";


const FaqSubCategory = () => {
  const location = useLocation();
  const isListPage = location.pathname.includes("faq-sub-category-list");
  
  return isListPage ? <FaqSubCategoryList /> : <FaqSubCategoryForm />;
};

const FaqSubCategoryForm = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [formData, setFormData] = useState({
    name: "",
    active: true,
    faq_category_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [faqCategories, setFaqCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { faqSubId } = useParams();
  const isEditMode = !!faqSubId;  

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json",
  });

  useEffect(() => {
    const fetchFaqCategories = async () => {
      try {
        setCategoriesLoading(true);
        const res = await axios.get(`${baseURL}/faq_categories.json`, {
          headers: getAuthHeaders()
        });
        
        let categoriesData = [];
        if (Array.isArray(res.data)) {
          categoriesData = res.data;
        } else if (res.data.faq_categories) {
          categoriesData = res.data.faq_categories;
        } else if (Array.isArray(res.data.data)) {
          categoriesData = res.data.data;
        }
        
        const formattedCategories = categoriesData.map(category => ({
          id: category?.id || '',
          name: category?.name || 'Unnamed Category'
        }));
        
        setFaqCategories(formattedCategories);
      } catch (err) {
        console.error("Failed to fetch FAQ categories:", err);
        toast.error("Failed to load FAQ categories");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchFaqCategories();
  }, [baseURL]);

  useEffect(() => {
    if (isEditMode && !hasFetched) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${baseURL}/faq_sub_categories/${faqSubId}.json`, {
            headers: getAuthHeaders()
          });
          
          const subCategoryData = res.data?.faq_sub_category || res.data;
          
          if (subCategoryData) {
            setFormData({
              name: subCategoryData.name || "",
              active: subCategoryData.active !== undefined ? subCategoryData.active : true,
              faq_category_id: subCategoryData.faq_category_id || ""
            });
            setHasFetched(true);
          }
        } catch (err) {
          console.error("Failed to fetch FAQ sub category:", err);
          toast.error("Failed to load FAQ sub category");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [faqSubId, isEditMode, hasFetched, baseURL]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.faq_category_id) newErrors.faq_category_id = "FAQ Category is required";
    
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

    try {
      const payload = { faq_sub_category: formData };
      
      if (isEditMode) {
        await axios.put(
          `${baseURL}/faq_sub_categories/${faqSubId}.json`,
          payload,
          { headers: getAuthHeaders() }
        );
        toast.success("FAQ Sub Category updated successfully!");
      } else {
        await axios.post(
          `${baseURL}/faq_sub_categories.json`,
          payload,
          { headers: getAuthHeaders() }
        );
        toast.success("FAQ Sub Category created successfully!");
      }

      navigate("/setup-member/faq-subcategory-list");
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
            <span className="text-gray-400">FAQ Sub Category</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">{isEditMode ? "Edit" : "Create"}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "EDIT FAQ SUB CATEGORY" : "CREATE FAQ SUB CATEGORY"}
          </h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">FAQ Sub Category Details</h3>
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
                    className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all`}
                    placeholder="Enter FAQ sub category name"
                    disabled={loading}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* FAQ Category */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    FAQ Category
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <SelectBox
                    options={[
                      { value: "", label: categoriesLoading ? "Loading categories..." : "Select category" },
                      ...faqCategories.map((category) => ({
                        value: category.id,
                        label: category.name,
                      })),
                    ]}
                    value={formData.faq_category_id}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        faq_category_id: value,
                      }))
                    }
                    disabled={loading || categoriesLoading}
                  />
                  {errors.faq_category_id && (
                    <p className="text-red-500 text-xs mt-1">{errors.faq_category_id}</p>
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
                      {isEditMode ? "Updating..." : "Creating..."}
                    </span>
                  ) : (
                    isEditMode ? "Update" : "Create"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/setup-member/faq-subcategory-list")}
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



export default FaqSubCategory;