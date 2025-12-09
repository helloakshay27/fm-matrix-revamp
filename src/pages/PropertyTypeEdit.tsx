import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";


const PropertyTypeEdit = () => {
  const { id } = useParams(); // ✅ Get ID from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  // ✅ Fetch Property Type Data
  useEffect(() => {
    const fetchPropertyType = async () => {
      try {
        const response = await axios.get(
          `${baseURL}property_types/${id}.json`
        );
        setName(response.data.property_type || ""); // ✅ Ensure correct field
      } catch (error) {
        console.error("Error fetching property type:", error);
        toast.error("Failed to load property type.");
      }
    };

    fetchPropertyType();
  }, [id]);

  // ✅ Handle Form Submission (Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Property Type Name is required!");
      return;
    }

    setLoading(true);

    try {
      await axios.put(
        `${baseURL}property_types/${id}.json`,
        { property_type: { property_type: name } }, // ✅ Correct backend format
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Property Type updated successfully!");
      navigate("/setup-member/property-type-list"); // ✅ Navigate after success
    } catch (error) {
      console.error("Error updating property type:", error);

      // Extract detailed backend error message if available
      const errorMessage =
        error.response?.data?.message || "Failed to update Property Type.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <div className="card mt-4 pb-4 mx-4">
            <div className="card-header">
              <h3 className="card-title">Edit Property Type</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Name Field */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Name
                        <span className="otp-asterisk">{" "}*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* ✅ Submit & Cancel Buttons */}
                <div className="row mt-2 justify-content-center">
                  <div className="col-md-2">
                    <button
                      type="submit"
                      className="purple-btn2 w-100"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update"}
                    </button>
                  </div>

                  <div className="col-md-2">
                    <button
                      type="button"
                      className="purple-btn2 w-100"
                      onClick={() => navigate("/setup-member/property-type-list")}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                {/* ✅ End of Buttons */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyTypeEdit;
