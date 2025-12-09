import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";


const FaqEdit = () => {
  const [formData, setFormData] = useState({
    faq_category_id: "",
    faq_sub_category_id: "",
    faqs: [],
  });

  console.log("formdata", formData);

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
  const [hasFetched, setHasFetched] = useState(false);

  const navigate = useNavigate();
  const { faqId } = useParams();

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json",
  });

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

  // Fetch existing FAQ data
  // useEffect(() => {
  //   if (faqId && !hasFetched) {
  //     const fetchFaqData = async () => {
  //       try {
  //         setLoading(true);
  //         const res = await axios.get(`${baseURL}faqs/${faqId}.json`, {
  //           headers: getAuthHeaders(),
  //         });

  //         const faqData = res.data?.faq || res.data;

  //         if (faqData) {
  //           setFormData({
  //             faq_category_id: faqData.faq_category_id || "",
  //             faq_sub_category_id: faqData.faq_sub_category_id || "",
  //             faqs: [
  //               {
  //                 id: faqData.id,
  //                 faq_category_id: faqData.faq_category_id || "",
  //                 faq_sub_category_id: faqData.faq_sub_category_id || "",
  //                 question: faqData.question || "",
  //                 answer: faqData.answer || "",
  //                 site_id: faqData.site_id || "",
  //                 active: faqData.active !== undefined ? faqData.active : true,
  //                 faq_tag: faqData.faq_tag || "",
  //                 isExisting: true,
  //               },
  //             ],
  //           });

  //           setHasFetched(true);
  //         }
  //       } catch (err) {
  //         console.error("Failed to fetch FAQ:", err);
  //         toast.error("Failed to load FAQ data");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     fetchFaqData();
  //   }
  // }, [faqId, hasFetched]);

  useEffect(() => {
  if (faqId && !hasFetched) {
    const fetchFaqData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseURL}faqs/${faqId}.json`, {
          headers: getAuthHeaders(),
        });

        const faqData = res.data?.faq || res.data;

        if (faqData) {
          setFormData({
            faq_category_id: faqData.faq_category_id || "",
            faq_sub_category_id: faqData.faq_sub_category_id || "",
            faqs: [
              {
                id: faqData.id,
                faq_category_id: faqData.faq_category_id || "",
                faq_sub_category_id: faqData.faq_sub_category_id || "",
                question: faqData.question || "",
                answer: faqData.answer || "",
                site_id: faqData.site_id || "",
                active: faqData.active !== undefined ? faqData.active : true,
                faq_tag: faqData.faq_tag || "",
                isExisting: true,
              },
            ],
          });

          // Set question and answer input fields
          setQuestion(faqData.question || "");
          setAnswer(faqData.answer || "");

          setHasFetched(true);
        }
      } catch (err) {
        console.error("Failed to fetch FAQ:", err);
        toast.error("Failed to load FAQ data");
      } finally {
        setLoading(false);
      }
    };
    fetchFaqData();
  }
}, [faqId, hasFetched]);

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

    const newFaq = {
      question: question.trim(),
      answer: answer.trim(),
      site_id: parseInt(selectedSiteId),
      active: true,
      faq_tag: faqTag.trim(),
      isExisting: false, // Flag for new FAQ
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

  const handleEditFaq = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq
      ),
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!formData.faq_category_id) {
  //     toast.error("FAQ Category is required");
  //     return;
  //   }

  //   if (formData.faqs.length === 0) {
  //     toast.error("At least one FAQ is required");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     // Update existing FAQ - only PUT method used
  //     const existingFaq = formData.faqs.find((faq) => faq.isExisting);
  //     if (existingFaq) {
  //       const payload = {
  //         faq: {
  //           faq_category_id: parseInt(formData.faq_category_id),
  //           faq_sub_category_id: parseInt(formData.faq_sub_category_id),
  //           question: existingFaq.question,
  //           answer: existingFaq.answer,
  //           site_id: parseInt(existingFaq.site_id),
  //           active: existingFaq.active,
  //           faq_tag: existingFaq.faq_tag,
  //         },
  //       };

  //       await axios.put(`${baseURL}faqs/${faqId}.json`, payload, {
  //         headers: getAuthHeaders(),
  //       });
  //     }

  //     toast.success("FAQ updated successfully!");
  //     navigate("/faq-list");
  //   } catch (error) {
  //     console.error("Error:", error);
  //     const errorMessage =
  //       error.response?.data?.message || "Failed to update FAQ";
  //     toast.error(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Sync question and answer state to formData.faqs[0]
  setFormData((prev) => ({
    ...prev,
    faqs: prev.faqs.map((faq, i) =>
      i === 0
        ? { ...faq, question: question.trim(), answer: answer.trim() }
        : faq
    ),
  }));

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

  if (question.trim() === "" || answer.trim() === "") {
    toast.error("Question and Answer are required");
    return;
  }

  if (formData.faqs.length === 0) {
    toast.error("At least one FAQ is required");
    return;
  }

  setLoading(true);

  try {
    const existingFaq = {
      ...formData.faqs[0],
      question: question.trim(),
      answer: answer.trim(),
    };
    const payload = {
      faq: {
        faq_category_id: parseInt(formData.faq_category_id),
        faq_sub_category_id: parseInt(formData.faq_sub_category_id),
        question: existingFaq.question,
        answer: existingFaq.answer,
        site_id: parseInt(existingFaq.site_id),
        active: existingFaq.active,
        faq_tag: existingFaq.faq_tag,
      },
    };

    await axios.put(`${baseURL}faqs/${faqId}.json`, payload, {
      headers: getAuthHeaders(),
    });

    toast.success("FAQ updated successfully!");
    navigate("/faq-list");
  } catch (error) {
    console.error("Error:", error);
    const errorMessage =
      error.response?.data?.message || "Failed to update FAQ";
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <form id="faqEditForm" onSubmit={handleSubmit}>
            <div className="card mt-4 pb-4 mx-4">
              <div className="card-header">
                <h3 className="card-title">Edit FAQ</h3>
              </div>
              <div className="card-body">
                {/* Category and Subcategory Selection */}
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        FAQ Category 
                         {(baseURL === "https://dev-panchshil-super-app.lockated.com/" || baseURL === "https://kalpataru.lockated.com/" || baseURL === "https://rustomjee-live.lockated.com/") && (
                                                    <span className="otp-asterisk"> *</span>
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

                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        FAQ Sub Category 
                        {(baseURL === "https://dev-panchshil-super-app.lockated.com/" || baseURL === "https://kalpataru.lockated.com/" || baseURL === "https://rustomjee-live.lockated.com/") && (
                                                 <span className="otp-asterisk"> *</span>
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
              
             
                {/* <div className="row align-items-center"> */}
                 
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Question <span className="otp-asterisk">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="question"
                        placeholder="Enter FAQ Question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                 
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Answer <span className="otp-asterisk">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        name="answer"
                        placeholder="Enter FAQ Answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        disabled={loading}
                        rows="1"
                      />
                    </div>
                  </div>
                    </div>


                 
                  {/* <div className="col-md-2 mt-2">
                    <button
                      type="button"
                      className="purple-btn2 rounded-3"
                      style={{ marginTop: "23px" }}
                      onClick={handleAddFaq}
                      disabled={loading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={26}
                        height={20}
                        fill="currentColor"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span> Add</span>
                    </button>
                  </div>
                </div> */}

               
                {/* {formData.faqs.length > 0 && (
                  <div className="col-md-12 mt-4">
                    <div className="mt-4 tbl-container w-100">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>Sr No</th>
                            <th>Question</th>
                            <th>Answer</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.faqs.map((faq, index) => {
                            const siteName =
                              sites.find((site) => site.id == faq.site_id)
                                ?.name || "Unknown Site";
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={faq.question}
                                    onChange={(e) =>
                                      handleEditFaq(
                                        index,
                                        "question",
                                        e.target.value
                                      )
                                    }
                                    disabled={loading}
                                    style={{ minWidth: "200px" }}
                                  />
                                </td>
                                <td>
                                  <textarea
                                    className="form-control"
                                    value={faq.answer}
                                    onChange={(e) =>
                                      handleEditFaq(
                                        index,
                                        "answer",
                                        e.target.value
                                      )
                                    }
                                    disabled={loading}
                                    rows="1"
                                    style={{ minWidth: "250px" }}
                                  />
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="purple-btn2"
                                    onClick={() => handleDeleteFaq(index)}
                                    disabled={loading}
                                  >
                                    x
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )} */}
              </div>
            </div>

            {/* Hidden submit button for form submission */}
            <button type="submit" style={{ display: "none" }} />
          </form>

          {/* Visible buttons positioned below the card */}
          <div className="row mt-3 justify-content-center mx-4">
            <div className="col-md-2">
              <button
                type="submit"
                form="faqEditForm"
                className="purple-btn2 w-100"
                disabled={loading || formData.faqs.length === 0}
              >
                {loading ? "Submiting..." : "Submit"}
              </button>
            </div>
            <div className="col-md-2">
              <button
                type="button"
                className="purple-btn2 w-100"
                onClick={() => navigate("/faq-list")}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqEdit;
