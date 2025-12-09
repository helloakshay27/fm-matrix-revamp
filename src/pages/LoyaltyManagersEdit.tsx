import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";


const LoyaltyManagerEdit = () => {
  const { id } = useParams(); // ✅ Get ID from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  // ✅ Fetch Loyalty Manager Data
  useEffect(() => {
    const fetchLoyaltyManager = async () => {
      try {
        const response = await axios.get(
          `${baseURL}loyalty_managers/${id}.json`
        );
        const data = response.data;
        setName(data.name || "");
        setMobile(data.mobile || "");
        setEmail(data.email || "");
      } catch (error) {
        console.error("Error fetching loyalty manager:", error);
        toast.error("Failed to load loyalty manager.");
      }
    };

    fetchLoyaltyManager();
  }, [id]);

  // ✅ Handle Form Submission (Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required!");
      return;
    }

    if (!mobile.trim()) {
      toast.error("Mobile number is required!");
      return;
    }

    // Basic mobile validation (10 digits)
    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number!");
      return;
    }

    // Email validation if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    setLoading(true);

    try {
      await axios.put(
        `${baseURL}loyalty_managers/${id}.json`,
        {
          loyalty_manager: {
            name: name,
            mobile: mobile,
            email: email || undefined,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Loyalty Manager updated successfully!");
      navigate("/setup-member/loyalty-managers-list"); // ✅ Navigate after success
    } catch (error) {
      console.error("Error updating loyalty manager:", error);

      // Extract detailed backend error message if available
      const errorMessage =
        error.response?.data?.message || "Failed to update Loyalty Manager.";
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
              <h3 className="card-title">Edit Loyalty Manager</h3>
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

                  {/* Mobile Field */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Mobile
                        <span className="otp-asterisk">{" "}*</span>
                      </label>
                      <input
                        className="form-control"
                        type="tel"
                        placeholder="Enter mobile number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        maxLength="10"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        className="form-control"
                        type="email"
                        placeholder="Enter email (optional)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                      onClick={() => navigate("/setup-member/loyalty-managers-list")}
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

export default LoyaltyManagerEdit;