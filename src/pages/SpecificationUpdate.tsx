import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";


const SpecificationUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [setupName, setSetupName] = useState("");
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(""); // Store existing image URL
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSpecification = async () => {
      try {
        // Fetching data from LIST API to get the icon_url
        const listResponse = await axios.get(
          `${baseURL}specification_setups.json`
        );

        // Find the specific item by ID
        const spec = listResponse.data.specification_setups.find(
          (item) => item.id === Number(id)
        );

        if (spec) {
          setSetupName(spec.name);
          setIconPreview(spec.icon_url || ""); // Set image if exists
        }
      } catch (error) {
        console.error("Error fetching specification:", error);
        toast.error("Failed to fetch specification details.");
      }
    };

    fetchSpecification();
  }, [id]);

  const handleCancel = () => {
    setSetupName("");
    setIcon(null);
    setIconPreview("");
    navigate(-1);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIcon(file);
      setIconPreview(URL.createObjectURL(file)); // Show preview for new image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss(); // Clear previous toasts

    // Validation - Ensures only one error toast appears
    if (!setupName.trim()) {
      toast.error("Name is mandatory");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("specification_setup[name]", setupName.trim());
    if (icon) {
      formData.append("icon", icon);
    }

    try {
      await axios.put(
        `${baseURL}specification_setups/${id}.json`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Specification updated successfully!");
      navigate("/specification-list");
    } catch (error) {
      console.error("Error updating specification:", error);
      toast.error("Failed to update specification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
        <form onSubmit={handleSubmit}>
          <div className="card mt-4 pb-4 mx-4">
          
            <div className="card-header">
              <h3 className="card-title">Edit Specification</h3>
            </div>
            <div className="card-body">
              
                <div className="row">
                  {/* Name Input */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Name <span className="otp-asterisk">{" "}*</span></label>
                      <input
                        className="form-control"
                        type="text"
                        value={setupName}
                        onChange={(e) => setSetupName(e.target.value)}
                        placeholder="Enter name"
                      />
                    </div>
                  </div>

                  {/* File Input & Preview */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Icon</label>
                      <input
                        className="form-control"
                        type="file"
                        accept=".png,.jpg,.jpeg,.svg"
                        onChange={handleFileChange}
                      />

                      {/* Image Preview */}
                      {iconPreview && (
                        <div className="mt-2">
                          <p>Preview:</p>
                          <img
                            src={iconPreview}
                            alt="Specification Icon"
                            style={{
                              width: "140px",
                              height: "140px",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit & Cancel Buttons */}
                
            </div>
            
          </div>
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
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
        </div>
      </div>
    </div>
  );
};

export default SpecificationUpdate;
