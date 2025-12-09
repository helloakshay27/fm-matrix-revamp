import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import SelectBox from "@/components/ui/select-box";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const FaqCreate = () => {
  const baseURL = API_CONFIG.BASE_URL;

  const [formData, setFormData] = useState({
    faq_category_id: "",
    faq_sub_category_id: "",
    faqs: [],
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [sites, setSites] = useState([]);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [faqTag, setFaqTag] = useState("");

  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);
  const [sitesLoading, setSitesLoading] = useState(false);

  const navigate = useNavigate();

  // Get auth headers
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json",
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const res = await axios.get(`${baseURL}faq_categories.json`, {
          headers: getAuthHeaders(),
        });

        const categoriesData = res.data?.faq_categories || res.data || [];
        const formattedCategories = categoriesData.map((category) => ({
          id: category?.id || "",
          name: category?.name || "Unnamed Category",
        }));

        setCategories(formattedCategories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        toast.error("Failed to load categories");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (formData.faq_category_id) {
      const fetchSubCategories = async () => {
        try {
          setSubCategoriesLoading(true);
          const res = await axios.get(`${baseURL}faq_sub_categories.json`, {
            headers: getAuthHeaders(),
          });

          const subCategoriesData =
            res.data?.faq_sub_categories || res.data || [];
          // Filter subcategories by selected category
          const filteredSubCategories = subCategoriesData.filter(
            (subCat) => subCat.faq_category_id == formData.faq_category_id
          );

          const formattedSubCategories = filteredSubCategories.map(
            (subCategory) => ({
              id: subCategory?.id || "",
              name: subCategory?.name || "Unnamed Sub Category",
            })
          );

          setSubCategories(formattedSubCategories);
        } catch (err) {
          console.error("Failed to fetch subcategories:", err);
          toast.error("Failed to load subcategories");
        } finally {
          setSubCategoriesLoading(false);
        }
      };
      fetchSubCategories();
    } else {
      setSubCategories([]);
      setFormData((prev) => ({ ...prev, faq_sub_category_id: "" }));
    }
  }, [formData.faq_category_id]);

  // Fetch sites
  useEffect(() => {
    const fetchSites = async () => {
      try {
        setSitesLoading(true);
        const res = await axios.get(`${baseURL}sites.json`, {
          headers: getAuthHeaders(),
        });

        const sitesData = res.data?.sites || res.data || [];
        const formattedSites = sitesData.map((site) => ({
          id: site?.id || "",
          name: site?.name || "Unnamed Site",
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

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      faq_category_id: value,
      faq_sub_category_id: "",
    }));
  };

  const handleSubCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      faq_sub_category_id: value,
    }));
  };

  const handleAddFaq = () => {
    if (!question.trim()) {
      toast.error("Question is required");
      return;
    }

    if (!answer.trim()) {
      toast.error("Answer is required");
      return;
    }

     if (
    (baseURL === "https://dev-panchshil-super-app.lockated.com/" ||
      baseURL === "https://kalpataru.lockated.com/" ||
      baseURL === "https://rustomjee-live.lockated.com/")
  ) {
    if (!formData.faq_category_id) {
      toast.error("FAQ Category is required");
      return;
    }

    if (!formData.faq_sub_category_id) {
      toast.error("FAQ Sub Category is required");
      return;
    }
  }

    // if (!selectedSiteId) {
    //   toast.error("Site is required");
    //   return;
    // }

    const newFaq = {
      question: question.trim(),
      answer: answer.trim(),
      site_id: parseInt(selectedSiteId),
      active: true,
      faq_tag: faqTag.trim(),
    };

    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, newFaq],
    }));

    // Clear input fields
    setQuestion("");
    setAnswer("");
    setFaqTag("");
    setSelectedSiteId("");

    toast.success("FAQ added to list");
  };

  const handleDeleteFaq = (index) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
    toast.success("FAQ removed from list");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // if (!formData.faq_category_id) {
    //   toast.error("FAQ Category is required");
    //   return;
    // }
    if (
  (baseURL === "https://dev-panchshil-super-app.lockated.com/" || baseURL === "https://rustomjee-live.lockated.com/") &&
  !formData.faq_category_id
) {
  toast.error("FAQ Category is required");
  return;
}

    // if (!formData.faq_sub_category_id) {
    //   toast.error("FAQ Sub Category is required");
    //   return;
    // }

    if (formData.faqs.length === 0) {
      toast.error("At least one FAQ is required");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        faq_category_id: parseInt(formData.faq_category_id),
        faq_sub_category_id: parseInt(formData.faq_sub_category_id),
        faqs: formData.faqs,
      };

      await axios.post(`${baseURL}faqs.json`, payload, {
        headers: getAuthHeaders(),
      });

      toast.success("FAQs created successfully!");
      navigate("/faq-list"); // Adjust navigation path as needed
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create FAQs";
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
            <span className="text-gray-400">FAQ</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Create FAQ</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CREATE FAQ</h1>
        </div>

        {/* Main Form Card */}
        <form id="faqCreateForm" onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">FAQ Information</h3>
            </div>
            
            <div className="p-6">
              {/* Category and Subcategory Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      FAQ Category
                      {(baseURL === "https://dev-panchshil-super-app.lockated.com/" || 
                        baseURL === "https://kalpataru.lockated.com/" || 
                        baseURL === "https://rustomjee-live.lockated.com/") && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <SelectBox
                      options={[
                        {
                          value: "",
                          label: categoriesLoading
                            ? "Loading categories..."
                            : "Select Category",
                        },
                        ...categories.map((category) => ({
                          value: category.id,
                          label: category.name,
                        })),
                      ]}
                      defaultValue={formData.faq_category_id}
                      onChange={handleCategoryChange}
                      disabled={loading || categoriesLoading}
                    />
                  </div>
                </div>

                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      FAQ Sub Category
                      {(baseURL === "https://dev-panchshil-super-app.lockated.com/" || 
                        baseURL === "https://kalpataru.lockated.com/" || 
                        baseURL === "https://rustomjee-live.lockated.com/") && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <SelectBox
                      options={[
                        {
                          value: "",
                          label: subCategoriesLoading
                            ? "Loading subcategories..."
                            : "Select Sub Category",
                        },
                        ...subCategories.map((subCategory) => ({
                          value: subCategory.id,
                          label: subCategory.name,
                        })),
                      ]}
                      defaultValue={formData.faq_sub_category_id}
                      onChange={handleSubCategoryChange}
                      disabled={
                        loading ||
                        subCategoriesLoading ||
                        !formData.faq_category_id
                      }
                    />
                  </div>
                </div>
              </div>

              {/* FAQ Entry Section */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-base font-semibold text-gray-900 mb-4">Add FAQ</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
                  {/* Question */}
                  <div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-0">
                        Question
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                        type="text"
                        name="question"
                        placeholder="Enter FAQ Question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Answer */}
                  <div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-0">
                        Answer
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent resize-y"
                        name="answer"
                        placeholder="Enter FAQ Answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        disabled={loading}
                        rows="1"
                      />
                    </div>
                  </div>

                  {/* Add Button */}
                  <div>
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleAddFaq}
                      disabled={loading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span>Add FAQ</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* FAQ List Table */}
              {formData.faqs.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-base font-semibold text-gray-900 mb-4">FAQ List</h4>
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <Table className="border-separate">
                      <TableHeader>
                        <TableRow
                          className="hover:bg-gray-50"
                          style={{ backgroundColor: "#e6e2d8" }}
                        >
                          <TableHead
                            className="font-semibold text-gray-900 py-3 px-4 border-r"
                            style={{ borderColor: "#fff" }}
                          >
                            Sr No
                          </TableHead>
                          <TableHead
                            className="font-semibold text-gray-900 py-3 px-4 border-r"
                            style={{ borderColor: "#fff" }}
                          >
                            Question
                          </TableHead>
                          <TableHead
                            className="font-semibold text-gray-900 py-3 px-4 border-r"
                            style={{ borderColor: "#fff" }}
                          >
                            Answer
                          </TableHead>
                          <TableHead
                            className="font-semibold text-gray-900 py-3 px-4"
                            style={{ borderColor: "#fff" }}
                          >
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {formData.faqs.map((faq, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <TableCell className="py-3 px-4 font-medium">
                              {index + 1}
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <div className="max-w-md" style={{ wordWrap: "break-word" }}>
                                {faq.question}
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <div className="max-w-lg" style={{ wordWrap: "break-word" }}>
                                {faq.answer}
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <button
                                type="button"
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleDeleteFaq(index)}
                                disabled={loading}
                              >
                                ×
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/setup-member/faq-list")}
                disabled={loading}
                className="px-6 py-2 bg-[#f6f4ee] text-[#C72030] rounded hover:bg-[#f0ebe0] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || formData.faqs.length === 0}
                className="px-6 py-2 bg-[#C72030] text-white rounded hover:bg-[#B8252F] transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FaqCreate;
