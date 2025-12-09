import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";


const CategoryTypesEdit = () => {
  const { id } = useParams(); // Get category ID from URL
  const navigate = useNavigate();
  const [categoryType, setCategoryType] = useState("");
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({ tag_id: "" });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetchTags();
    fetchCategoryType();
  }, [id]);

  const fetchTags = async () => {
    try {
      const response = await axios.get(
        `${baseURL}tags.json`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast.error("Failed to load tags.");
    }
  };

  const fetchCategoryType = async () => {
    try {
      const response = await axios.get(
        `${baseURL}category_types/${id}.json`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data) {
        setCategoryType(response.data.category_type);
        setFormData({ tag_id: response.data.tag_id }); // ✅ Set tag_id
      }
    } catch (error) {
      console.error("Error fetching category type:", error);
      toast.error("Failed to load category type.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(
        `${baseURL}category_types/${id}.json`,
        {
          category_type: {
            category_type: categoryType,
            tag_id: formData.tag_id, // ✅ Include tag_id in update
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Category Type updated successfully!");
      setLoading(false);
      navigate("/setup-member/category-types-list"); // ✅ Redirect after success
    } catch (error) {
      console.error("Error updating category type:", error);
      toast.error("Error updating category type.");
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <div className="card mt-4 pb-4 mx-4">
            <div className="card-header">
              <h3 className="card-title">Edit Category Type</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Tag Selection */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Tags</label>
                      <SelectBox
                        options={tags.map((tag) => ({
                          value: tag.id,
                          label: tag.tag_type,
                        }))}
                        value={formData.tag_id} // ✅ Controlled Component
                        onChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            tag_id: value,
                          }))
                        }
                        disabled={loading || tags.length === 0} // ✅ Disable until tags are loaded
                      />
                    </div>
                  </div>

                  {/* Name Field */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Name{" "}
                        <span style={{ color: "#de7008", fontSize: "16px" }}>
                          *
                        </span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter name"
                        value={categoryType}
                        onChange={(e) => setCategoryType(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="row mt-2 justify-content-center">
                  <div className="col-md-2">
                    <button
                      type="submit"
                      className="purple-btn2 w-100"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Submit"}
                    </button>
                  </div>
                  <div className="col-md-2">
                    <button
                      type="button"
                      className="purple-btn2 w-100"
                      onClick={() => navigate(-1)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryTypesEdit;
