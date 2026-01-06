import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Shield,
  Loader2,
  Globe,
  Users,
  Settings,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { useApiConfig } from "@/hooks/useApiConfig";

interface UserDetails {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  fullname: string;
  mobile: string;
  country_code: string;
  active: boolean;
  is_admin: boolean;
  company_id: number;
  organization_id: number;
  user_type: string;
  site_id: number;
  site_name: string;
  user_company_name: string;
  user_organization_name: string;
  // Additional contact info
  alternate_email1: string | null;
  alternate_email2: string | null;
  alternate_address: string | null;
  // Personal info
  gender: string | null;
  birth_date: string | null;
  blood_group: string | null;
  user_title: string | null;
  // Work info
  department_id: number | null;
  department_name: string | null;
  employee_type: string | null;
  profile_type: string | null;
  work_location: string | null;
  // Status flags
  is_online: boolean;
  is_available: boolean;
  is_busy_on_call: boolean;
  kyc_status: string;
  consent_provided: boolean;
  consented_on: string | null;
  // Timestamps
  created_at: string;
  updated_at: string;
  created_by_id: number | null;
  // Images
  avatar_url: string | null;
  profile_icon_url: string;
  business_card_url: string;
  // Relations
  report_to_id: number | null;
  report_to: {
    id: number | null;
    name: string | null;
    email: string | null;
    mobile: string | null;
  };
  created_by: {
    id: number | null;
    name: string | null;
    email: string | null;
    mobile: string | null;
  };
  lmc_manager: {
    id: number | null;
    name: string | null;
    email: string | null;
    mobile: string | null;
  };
  // Permission data
  lock_user_permission: {
    id: number;
    access_level: string;
    access_to: number[];
    user_type: string;
    status: string;
    role_for: string;
    active: boolean;
    deactivated_at: string | null;
    permissions_hash: string;
  } | null;
}

export const UserDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFullUrl, getAuthHeader } = useApiConfig();

  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = async (userId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        getFullUrl(`/pms/users/${userId}/user_show.json`),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: getAuthHeader(),
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("User not found");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching user details:", error);
      setError(errorMessage);
      toast.error(`Failed to load user details: ${errorMessage}`, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserDetails(parseInt(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const formatDateOnly = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const getUserTypeLabel = (userType: string) => {
    const labels: { [key: string]: string } = {
      pms_organization_admin: "Organization Admin",
      pms_company_admin: "Company Admin",
      pms_site_admin: "Site Admin",
      super_admin: "Super Admin",
    };
    return labels[userType] || userType;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-[#C72030]" />
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            User Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The requested user could not be found."}
          </p>
          <Button
            onClick={() => navigate("/ops-console/admin/users")}
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/ops-console/admin/users")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {(user.avatar_url || user.profile_icon_url) && (
                <img
                  src={user.avatar_url || user.profile_icon_url}
                  alt={user.fullname}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.fullname}
                </h1>
                <p className="text-gray-600 mt-1">
                  {getUserTypeLabel(user.user_type)}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.active ? "Active" : "Inactive"}
                  </span>
                  {user.is_admin && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      Admin
                    </span>
                  )}
                  {user.is_online && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Online
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#C72030]" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile
                    </label>
                    <p className="text-gray-900">
                      +{user.country_code} {user.mobile}
                    </p>
                  </div>
                </div>
                {(user.alternate_email1 || user.alternate_email2) && (
                  <div className="grid grid-cols-2 gap-4">
                    {user.alternate_email1 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alternate Email 1
                        </label>
                        <p className="text-gray-900">{user.alternate_email1}</p>
                      </div>
                    )}
                    {user.alternate_email2 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alternate Email 2
                        </label>
                        <p className="text-gray-900">{user.alternate_email2}</p>
                      </div>
                    )}
                  </div>
                )}
                {user.alternate_address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alternate Address
                    </label>
                    <p className="text-gray-900">{user.alternate_address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Organization & Work Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-[#C72030]" />
                Organization & Work Details
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization
                    </label>
                    <p className="text-gray-900">
                      {user.user_organization_name || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <p className="text-gray-900">
                      {user.user_company_name || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Site
                    </label>
                    <p className="text-gray-900">
                      {user.site_name || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <p className="text-gray-900">
                      {user.department_name || "Not specified"}
                    </p>
                  </div>
                </div>
                {(user.work_location ||
                  user.employee_type ||
                  user.profile_type) && (
                  <div className="grid grid-cols-2 gap-4">
                    {user.work_location && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Work Location
                        </label>
                        <p className="text-gray-900">{user.work_location}</p>
                      </div>
                    )}
                    {user.employee_type && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Employee Type
                        </label>
                        <p className="text-gray-900">{user.employee_type}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Personal Information */}
            {(user.gender ||
              user.birth_date ||
              user.blood_group ||
              user.user_title) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#C72030]" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {user.user_title && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <p className="text-gray-900">{user.user_title}</p>
                    </div>
                  )}
                  {user.gender && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <p className="text-gray-900">{user.gender}</p>
                    </div>
                  )}
                  {user.birth_date && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Birth Date
                      </label>
                      <p className="text-gray-900">
                        {formatDateOnly(user.birth_date)}
                      </p>
                    </div>
                  )}
                  {user.blood_group && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Blood Group
                      </label>
                      <p className="text-gray-900">{user.blood_group}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reporting Structure */}
            {(user.report_to.id ||
              user.created_by.id ||
              user.lmc_manager.id) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#C72030]" />
                  Reporting Structure
                </h2>
                <div className="space-y-4">
                  {user.report_to.id && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Reports To
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-900">{user.report_to.name}</p>
                        {user.report_to.email && (
                          <p className="text-gray-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.report_to.email}
                          </p>
                        )}
                        {user.report_to.mobile && (
                          <p className="text-gray-600 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.report_to.mobile}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {user.created_by.id && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Created By
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-900">{user.created_by.name}</p>
                        {user.created_by.email && (
                          <p className="text-gray-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.created_by.email}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {user.lmc_manager.id && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">
                        LMC Manager
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-900">{user.lmc_manager.name}</p>
                        {user.lmc_manager.email && (
                          <p className="text-gray-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.lmc_manager.email}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Meta Information */}
          <div className="space-y-6">
            {/* Status Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#C72030]" />
                Status Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">
                    Account Status
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      user.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">
                    Online Status
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      user.is_online
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.is_online ? "Online" : "Offline"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">
                    Availability
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      user.is_available
                        ? "bg-green-100 text-green-800"
                        : user.is_busy_on_call
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.is_available
                      ? "Available"
                      : user.is_busy_on_call
                        ? "On Call"
                        : "Unavailable"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">
                    KYC Status
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      user.kyc_status === "approved"
                        ? "bg-green-100 text-green-800"
                        : user.kyc_status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.kyc_status || "Not Set"}
                  </span>
                </div>
                {user.consent_provided && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-700">
                      Consent Provided
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                      Yes
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Permission Info */}
            {user.lock_user_permission && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#C72030]" />
                  Permission Details
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Access Level
                    </label>
                    <p className="text-gray-900">
                      {user.lock_user_permission.access_level}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role For
                    </label>
                    <p className="text-gray-900">
                      {user.lock_user_permission.role_for.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-700">
                      Permission Status
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        user.lock_user_permission.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.lock_user_permission.status}
                    </span>
                  </div>
                  {user.lock_user_permission.access_to &&
                    user.lock_user_permission.access_to.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Access To (IDs)
                        </label>
                        <p className="text-gray-900 text-sm">
                          {user.lock_user_permission.access_to.join(", ")}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Timeline Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#C72030]" />
                Timeline
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created At
                  </label>
                  <p className="text-gray-900 text-sm">
                    {formatDate(user.created_at)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Updated
                  </label>
                  <p className="text-gray-900 text-sm">
                    {formatDate(user.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
