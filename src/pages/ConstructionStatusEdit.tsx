import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";


const ConstructionStatusEdit = () => {
  const { id } = useParams(); // ✅ Get ID from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    construction_status: "",
    active: true,
  });

  // ✅ Fetch Construction Status Details
  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${baseURL}construction_statuses/${id}.json`
        );
        setFormData({
          construction_status: response.data.construction_status,
          active: response.data.active,
        });
      } catch (error) {
        console.error("Error fetching status:", error);
        toast.error("Failed to load construction status.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [id]);

  // ✅ Handle Form Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Form Submission (Update Construction Status)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `${baseURL}construction_statuses/${id}.json`,
        { construction_status: formData }
      );
      toast.success("Construction status updated successfully!");
      navigate("/setup-member/construction-status-list");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
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
              <h3 className="card-title">Edit Construction Status</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Loading...</p>
              ) : (
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
                          name="construction_status"
                          value={formData.construction_status}
                          onChange={handleChange}
                          placeholder="Enter name"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit & Cancel Buttons */}
                  <div className="row mt-2 justify-content-center">
                    <div className="col-md-2">
                      <button type="submit" className="purple-btn2 w-100" disabled={loading}>
                        {loading ? "Updating..." : "Update"}
                      </button>
                    </div>

                    <div className="col-md-2">
                      <button
                        type="button"
                        className="purple-btn2 w-100"
                        onClick={() => navigate("/setup-member/construction-status-list")}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstructionStatusEdit;
