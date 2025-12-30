import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Building,
  Globe,
  MapPin,
  Calendar,
  Shield,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useApiConfig } from "@/hooks/useApiConfig";

interface OrganizationDetails {
  id: number;
  name: string;
  description?: string;
  active: boolean;
  created_by_id: number;
  domain: string;
  sub_domain: string;
  country_id: number | null;
  front_domain: string;
  front_subdomain: string;
  created_at: string;
  updated_at: string;
  url: string;
  attachfile?: {
    id: number;
    document_file_name: string;
    document_url: string;
  };
  powered_by_attachfile?: {
    id: number;
    document_file_name: string;
    document_url: string;
  };
  country?: {
    id: number;
    name: string;
  };
}

export const OrganizationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFullUrl, getAuthHeader } = useApiConfig();

  const [organization, setOrganization] = useState<OrganizationDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizationDetails = async (orgId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getFullUrl(`/organizations/${orgId}.json`), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Organization not found");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle both direct object and wrapped response
      const orgData = data.organization || data;

      // Check if organization is active (FM55)
      if (!orgData.active) {
        toast.error("This organization is inactive and cannot be accessed", {
          duration: 5000,
        });
        navigate("/ops-console/master/location/account");
        return;
      }

      setOrganization(orgData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching organization details:", error);
      setError(errorMessage);
      toast.error(`Failed to load organization details: ${errorMessage}`, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrganizationDetails(parseInt(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-[#C72030]" />
          <p className="text-gray-600">Loading organization details...</p>
        </div>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Organization Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The requested organization could not be found."}
          </p>
          <Button
            onClick={() => navigate("/ops-console/master/location/account")}
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Organizations
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
            onClick={() => navigate("/ops-console/master/location/account")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Organizations
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {organization.attachfile?.document_url && (
                <img
                  src={organization.attachfile.document_url}
                  alt={organization.name}
                  className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {organization.name}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      organization.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {organization.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-[#C72030]" />
                Basic Information
              </h2>
              <div className="space-y-4">
                {organization.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <p className="text-gray-900">{organization.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization ID
                    </label>
                    <p className="text-gray-900 font-mono">
                      #{organization.id}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Created By
                    </label>
                    <p className="text-gray-900">
                      User ID: {organization.created_by_id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Domain Configuration Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#C72030]" />
                Domain Configuration
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Main Domain
                  </label>
                  <p className="text-gray-900 font-mono break-all">
                    {organization.domain || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub Domain
                  </label>
                  <p className="text-gray-900 font-mono break-all">
                    {organization.sub_domain || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frontend Domain
                  </label>
                  <p className="text-gray-900 font-mono break-all">
                    {organization.front_domain || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frontend Subdomain
                  </label>
                  <p className="text-gray-900 font-mono break-all">
                    {organization.front_subdomain || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Logos Card */}
            {(organization.attachfile ||
              organization.powered_by_attachfile) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Logos
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  {organization.attachfile?.document_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Logo
                      </label>
                      <img
                        src={organization.attachfile.document_url}
                        alt="Organization Logo"
                        className="w-full max-w-xs h-auto rounded border-2 border-gray-200"
                      />
                    </div>
                  )}
                  {organization.powered_by_attachfile?.document_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Powered By Logo
                      </label>
                      <img
                        src={organization.powered_by_attachfile.document_url}
                        alt="Powered By Logo"
                        className="w-full max-w-xs h-auto rounded border-2 border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Meta Information */}
          <div className="space-y-6">
            {/* Location Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#C72030]" />
                Location
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <p className="text-gray-900">
                  {organization.country?.name || "Not specified"}
                </p>
              </div>
            </div>

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
                    {formatDate(organization.created_at)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Updated
                  </label>
                  <p className="text-gray-900 text-sm">
                    {formatDate(organization.updated_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#C72030]" />
                Status Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">
                    Active Status
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      organization.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {organization.active ? "Active" : "Inactive"}
                  </span>
                </div>
                {organization.url && (
                  <div className="p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-700 block mb-1">
                      API URL
                    </span>
                    <p className="text-xs text-gray-600 font-mono break-all">
                      {organization.url}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
