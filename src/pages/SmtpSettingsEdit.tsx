import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { API_CONFIG } from "@/config/apiConfig";

const SMTPSettingsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    address: "",
    port: "",
    user_name: "",
    password: "",
    authentication: "plain",
    email: "",
    company_name: "",
  });

  console.log("formData:", formData);

  // Fetch existing SMTP settings data
  useEffect(() => {
    const fetchSMTPData = async () => {
      try {
        setFetchingData(true);
        console.log("=== FETCH DEBUG INFO ===");
        console.log(
          "Fetching from URL:",
          `${baseURL}/smtp_settings/${id}.json`
        );
        console.log("ID:", id);
        console.log("Base URL:", baseURL);

        const response = await axios.get(
          `${baseURL}/smtp_settings/${id}.json`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Fetch API Response:", response.data);
        const smtpData = response.data.smtp_setting || response.data;
        console.log("Processed SMTP data:", smtpData);

        setFormData({
          address: smtpData.address || "",
          port: smtpData.port || "",
          user_name: smtpData.user_name || "",
          password: smtpData.password || "",
          authentication: smtpData.authentication || "plain",
          email: smtpData.email || "",
          company_name: smtpData.company_name || "",
        });
      } catch (error) {
        console.error("Error fetching SMTP data:", error);
        console.error("Error status:", error.response?.status);
        console.error("Error data:", error.response?.data);
        toast.error("Failed to fetch SMTP settings data");
        navigate("/smtp-settings-list");
      } finally {
        setFetchingData(false);
      }
    };

    if (id) {
      fetchSMTPData();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert port to number if it's the port field
    const processedValue =
      name === "port" ? (value === "" ? "" : Number(value)) : value;
    setFormData({ ...formData, [name]: processedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    // Validation
    if (!formData.address.trim()) {
      toast.error("SMTP Address is required.");
      setLoading(false);
      return;
    }

    if (!formData.port || formData.port <= 0) {
      toast.error("Valid port number is required.");
      setLoading(false);
      return;
    }

    if (!formData.user_name.trim()) {
      toast.error("Username is required.");
      setLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required.");
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required.");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!formData.company_name.trim()) {
      toast.error("Company name is required.");
      setLoading(false);
      return;
    }

    try {
      console.log("=== SUBMISSION DEBUG INFO ===");
      console.log("ID:", id);
      console.log("Base URL:", baseURL);
      console.log("Full URL:", `${baseURL}/smtp_settings/${id}.json`);
      console.log("Form Data:", formData);
      console.log(
        "Access Token exists:",
        !!localStorage.getItem("access_token")
      );

      const jsonPayload = {
        smtp_setting: {
          address: formData.address.trim(),
          port: Number(formData.port),
          user_name: formData.user_name.trim(),
          password: formData.password.trim(),
          authentication: formData.authentication,
          email: formData.email.trim(),
          company_name: formData.company_name.trim(),
        },
      };

      console.log("Sending payload:", jsonPayload);

      const response = await axios.put(
        `${baseURL}/smtp_settings/${id}.json`,
        jsonPayload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update response:", response.data);
      toast.success("SMTP settings updated successfully!");
      navigate("/setup-member/smtp-settings-list");
    } catch (error) {
      console.error("=== ERROR DETAILS ===");
      console.error("Status:", error.response?.status);
      console.error("Status Text:", error.response?.statusText);
      console.error("Headers:", error.response?.headers);
      console.error("Data type:", typeof error.response?.data);
      console.error("Data:", error.response?.data);
      console.error("Full error:", error);

      // Check if the response is HTML (server error page)
      if (
        typeof error.response?.data === "string" &&
        error.response.data.includes("<!DOCTYPE html>")
      ) {
        console.error("Server returned HTML error page - likely a 500 error");
        toast.error(
          "Server error occurred. Please check the console and contact support."
        );
      } else if (error.response?.status === 422) {
        const errors = error.response.data?.errors;
        if (errors) {
          Object.keys(errors).forEach((key) => {
            errors[key].forEach((errorMsg) => {
              toast.error(`${key}: ${errorMsg}`);
            });
          });
        } else {
          toast.error("Validation failed. Please check your inputs.");
        }
      } else if (error.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
      } else if (error.response?.status === 404) {
        toast.error("SMTP settings not found. It may have been deleted.");
      } else if (error.response?.status >= 500) {
        toast.error("Server error. Please try again later or contact support.");
      } else {
        toast.error(
          "Failed to update SMTP settings. Please check the console for details."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleTestConnection = async () => {
    toast.dismiss();

    // Basic validation before testing
    if (
      !formData.address ||
      !formData.port ||
      !formData.user_name ||
      !formData.password
    ) {
      toast.error(
        "Please fill in all required fields before testing connection."
      );
      return;
    }

    try {
      setLoading(true);
      const testPayload = {
        smtp_setting: {
          address: formData.address.trim(),
          port: Number(formData.port),
          user_name: formData.user_name.trim(),
          password: formData.password.trim(),
          authentication: formData.authentication,
          email: formData.email.trim(),
          company_name: formData.company_name.trim(),
        },
      };

      // Assuming there's a test endpoint - adjust URL as needed
      const response = await axios.post(
        `${baseURL}/smtp_settings/test_connection.json`,
        testPayload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("SMTP connection test successful!");
    } catch (error) {
      console.error("SMTP test connection error:", error);
      toast.error("SMTP connection test failed. Please check your settings.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="">
        <div className="website-content overflow-auto">
          <div className="module-data-section p-3">
            <div className="card mt-4 pb-4 mx-4">
              <div className="card-header">
                <h3 className="card-title">Loading...</h3>
              </div>
              <div className="card-body">
                <div className="text-center">
                  <p>Loading SMTP settings data...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="module-data-section p-3">
        <form onSubmit={handleSubmit}>
          <div className="card mt-4 pb-4 mx-4">
            <div className="card-header">
              <h3 className="card-title">Edit SMTP Settings</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      SMTP Address<span style={{ color: "#de7008" }}> *</span>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="e.g., smtp.gmail.com"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Port<span style={{ color: "#de7008" }}> *</span>
                    </label>
                    <input
                      className="form-control"
                      type="number"
                      placeholder="e.g., 587"
                      name="port"
                      value={formData.port}
                      onChange={handleChange}
                      min="1"
                      max="65535"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Username<span style={{ color: "#de7008" }}> *</span>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter SMTP Username"
                      name="user_name"
                      value={formData.user_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group position-relative">
                    <label>
                      Password<span style={{ color: "#de7008" }}> *</span>
                    </label>
                    <input
                      className="form-control"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter SMTP Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="position-absolute mt-3"
                      style={{
                        top: "50%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                      }}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} color="var(--red)" />
                      ) : (
                        <Eye size={18} color="var(--red)" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Authentication<span style={{ color: "#de7008" }}> *</span>
                    </label>
                    <select
                      className="form-control"
                      name="authentication"
                      value={formData.authentication}
                      onChange={handleChange}
                      required
                    >
                      <option value="plain">Plain</option>
                      <option value="login">Login</option>
                      <option value="cram_md5">CRAM-MD5</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Email<span style={{ color: "#de7008" }}> *</span>
                    </label>
                    <input
                      className="form-control"
                      type="email"
                      placeholder="e.g., noreply@company.com"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Company Name<span style={{ color: "#de7008" }}> *</span>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Company Name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-2 justify-content-center">
            <div className="col-md-2">
              <button
                type="submit"
                className="purple-btn2 purple-btn2-shadow w-100"
                disabled={loading || fetchingData}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
            {/* <div className="col-md-2">
              <button
                type="button"
                className="btn btn-info w-100"
                onClick={handleTestConnection}
                disabled={loading || fetchingData}
              >
                Test Connection
              </button>
            </div> */}
            <div className="col-md-2">
              <button
                type="button"
                className="purple-btn2 purple-btn2-shadow w-100"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SMTPSettingsEdit;
