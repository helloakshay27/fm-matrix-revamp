import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Edit2, X, Check, Mail, Phone, User, Shield } from "lucide-react";
import { TextField, CircularProgress } from "@mui/material";
import { toast } from "sonner";
import { useApiConfig } from "@/hooks/useApiConfig";

interface AdminUser {
  id: number;
  email: string;
  firstname: string | null;
  lastname: string | null;
  mobile: string | null;
  country_code: string;
  user_type: string | null;
  active: boolean | null;
  created_at: string;
  updated_at: string;
  company_name?: string | null;
  organization_id?: number | null;
  otp?: string | null;
  [key: string]: any;
}

interface FormData {
  email: string;
  firstname: string;
  lastname: string;
  mobile: string;
  password: string;
  password_confirmation: string;
  otp: string;
}

export const AdminUsersDetails = () => {
  const params = useParams<{ userId?: string; id?: string }>();
  const userId = params.userId || params.id;
  const navigate = useNavigate();
  const { getFullUrl, getAuthHeader } = useApiConfig();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstname: "",
    lastname: "",
    mobile: "",
    password: "",
    password_confirmation: "",
    otp: "",
  });

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(getFullUrl(`/admin/users_details?id=${userId}`), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);
        
        // Handle nested user object response
        const userData = data.user || data;
        console.log("User details:", userData);
        
        setUser(userData);
        setFormData({
          email: userData.email || "",
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          mobile: userData.mobile || "",
          password: "",
          password_confirmation: "",
          otp: userData.otp || "",
        });
      } else {
        toast.error("Failed to load user details");
        navigate("/ops-console/admin/users");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Error loading user details");
      navigate("/ops-console/admin/users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    // Validation
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }

    if (formData.password && formData.password !== formData.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSaving(true);
    try {
      const updateData = new FormData();
      updateData.append("user[email]", formData.email);
      updateData.append("user[firstname]", formData.firstname);
      updateData.append("user[lastname]", formData.lastname);
      updateData.append("user[mobile]", formData.mobile);
      if (formData.password) {
        updateData.append("user[password]", formData.password);
        updateData.append("user[password_confirmation]", formData.password_confirmation);
      }
      updateData.append("user[otp]", formData.otp);

      const response = await fetch(getFullUrl(`/admin/users_update?id=${user.id}`), {
        method: "PUT",
        headers: {
          Authorization: getAuthHeader(),
        },
        body: updateData,
      });

      if (response.ok) {
        toast.success("User updated successfully");
        setIsEditing(false);
        fetchUserDetails();
      } else {
        const errorText = await response.text();
        console.error("Update error:", errorText);
        toast.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        email: user.email || "",
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        mobile: user.mobile || "",
        password: "",
        password_confirmation: "",
        otp: user.otp || "",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#C72030] mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900">User not found</h3>
          <Button
            onClick={() => navigate("/ops-console/admin/users")}
            className="mt-4 bg-[#C72030] hover:bg-[#A01020] text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Background */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/ops-console/admin/users")}
            className="mb-6 text-gray-600 hover:text-gray-900 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>

          <div className="bg-gradient-to-r from-[#C72030] to-[#A01020] rounded-lg p-6 text-white shadow-lg mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {user.firstname} {user.lastname}
                </h1>
                <div className="flex items-center gap-2 text-gray-100">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    {user.user_type || "User"}
                  </span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      user.active
                        ? "bg-green-400/20 text-green-50"
                        : "bg-red-400/20 text-red-50"
                    }`}
                  >
                    {user.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (isEditing) {
                    handleCancel();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                  isEditing
                    ? "bg-white text-[#C72030] hover:bg-gray-50"
                    : "bg-white/20 text-white hover:bg-white/30 backdrop-blur"
                }`}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {!isEditing ? (
            // View Mode
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Information Card */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <User className="w-5 h-5 text-[#C72030]" />
                    <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                  </div>
                  <div className="space-y-5">
                    <div className="pb-5 border-b border-gray-200 last:border-0">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Email Address
                      </label>
                      <p className="text-gray-900 font-medium">{user.email}</p>
                    </div>

                    <div className="pb-5 border-b border-gray-200 last:border-0">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        First Name
                      </label>
                      <p className="text-gray-900 font-medium">{user.firstname || "-"}</p>
                    </div>

                    <div className="pb-5 border-b border-gray-200 last:border-0">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Last Name
                      </label>
                      <p className="text-gray-900 font-medium">{user.lastname || "-"}</p>
                    </div>

                    <div className="pb-5 border-b border-gray-200 last:border-0">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        Mobile Number
                      </label>
                      <p className="text-gray-900 font-medium">{user.mobile || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Information Card */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Shield className="w-5 h-5 text-[#C72030]" />
                    <h2 className="text-lg font-semibold text-gray-900">Security & Additional</h2>
                  </div>
                  <div className="space-y-5">
                    <div className="pb-5 border-b border-gray-200 last:border-0">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        User Type
                      </label>
                      <p className="text-gray-900 font-medium">{user.user_type || "-"}</p>
                    </div>

                    <div className="pb-5 border-b border-gray-200 last:border-0">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Account Status
                      </label>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          user.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.active === true
                          ? "Active"
                          : user.active === false
                            ? "Inactive"
                            : "Pending"}
                      </span>
                    </div>

                    <div className="pb-5 border-b border-gray-200 last:border-0">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        OTP
                      </label>
                      <p className="text-gray-900 font-medium font-mono text-lg">{user.otp || "-"}</p>
                    </div>

                    <div className="pb-5 border-b border-gray-200 last:border-0">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Company Name
                      </label>
                      <p className="text-gray-900 font-medium">{user.company_name || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps Section */}
              {(user.created_at || user.updated_at) && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    System Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Created At
                      </p>
                      <p className="text-gray-900 font-medium">
                        {new Date(user.created_at).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Last Updated
                      </p>
                      <p className="text-gray-900 font-medium">
                        {new Date(user.updated_at).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Edit Mode
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <Edit2 className="w-6 h-6 text-[#C72030]" />
                Edit User Information
              </h2>

              <div className="space-y-8">
                {/* Basic Information Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 pb-3 border-b-2 border-[#C72030]">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Email <span className="text-[#C72030]">*</span>
                      </label>
                      <TextField
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        placeholder="user@example.com"
                        disabled={isSaving}
                        slotProps={{
                          input: {
                            style: {
                              height: "44px",
                              fontSize: "14px",
                            },
                          },
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        First Name
                      </label>
                      <TextField
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        placeholder="First name"
                        disabled={isSaving}
                        slotProps={{
                          input: {
                            style: {
                              height: "44px",
                              fontSize: "14px",
                            },
                          },
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Last Name
                      </label>
                      <TextField
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        placeholder="Last name"
                        disabled={isSaving}
                        slotProps={{
                          input: {
                            style: {
                              height: "44px",
                              fontSize: "14px",
                            },
                          },
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Mobile Number
                      </label>
                      <TextField
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        placeholder="10 digit mobile"
                        disabled={isSaving}
                        slotProps={{
                          input: {
                            style: {
                              height: "44px",
                              fontSize: "14px",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Security Information Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 pb-3 border-b-2 border-[#C72030]">
                    Security Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        OTP Code
                      </label>
                      <TextField
                        name="otp"
                        value={formData.otp}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        placeholder="OTP"
                        disabled={isSaving}
                        slotProps={{
                          input: {
                            style: {
                              height: "44px",
                              fontSize: "14px",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Password Section */}
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                    Change Password (Optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        New Password
                      </label>
                      <TextField
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        placeholder="Leave empty to keep current"
                        disabled={isSaving}
                        slotProps={{
                          input: {
                            style: {
                              height: "44px",
                              fontSize: "14px",
                            },
                          },
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Confirm Password
                      </label>
                      <TextField
                        name="password_confirmation"
                        type="password"
                        value={formData.password_confirmation}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        placeholder="Confirm password"
                        disabled={isSaving}
                        slotProps={{
                          input: {
                            style: {
                              height: "44px",
                              fontSize: "14px",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
                  <Button
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors"
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="px-6 py-2 bg-[#C72030] hover:bg-[#A01020] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <CircularProgress size={16} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
