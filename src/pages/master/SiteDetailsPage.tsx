import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Building,
  MapPin,
  Calendar,
  Clock,
  Star,
  Heart,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useApiConfig } from "@/hooks/useApiConfig";

interface SiteDetails {
  id: number;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  company_id: number;
  region_id: string;
  headquarter_id: number;
  latitude: number;
  longitude: number;
  zone_id: number;
  address: string;
  city: string;
  district: string;
  state: string;
  location_url: string;
  name_with_zone: string;
  pms_region: {
    id: number;
    name: string;
    active: boolean;
    headquarter: {
      id: number;
      name: string;
      active: boolean;
    };
  };
  pms_zone: {
    name: string;
  };
  is_favourite: boolean;
  favoured_by: {
    users: Array<{
      first_name: string | null;
      last_name: string | null;
    }>;
    user_like_count: number;
  };
  site_advantages: Array<{
    name: string;
    icon: string;
  }>;
  amenities: Array<{
    id: number;
    name: string;
    description: string;
    icon: string | null;
  }>;
  operational_schedule: Array<{
    day: string;
    times: Array<{
      start_hour: string;
      start_min: string;
      end_hour: string;
      end_min: string;
    }>;
  }>;
  operational_days: string[];
  image_url: Array<{
    id: number;
    url: string;
    doctype: string;
  }>;
  shared_content: string;
  google_maps_url: string;
}

export const SiteDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFullUrl, getAuthHeader } = useApiConfig();

  const [site, setSite] = useState<SiteDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSiteDetails = async (siteId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getFullUrl(`/pms/sites/${siteId}.json`), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Site not found");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const siteData = data.site || data;

      if (!siteData.active) {
        toast.error("This site is inactive and cannot be accessed", {
          duration: 5000,
        });
        navigate("/ops-console/master/location/account");
        return;
      }

      setSite(siteData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching site details:", error);
      setError(errorMessage);
      toast.error(`Failed to load site details: ${errorMessage}`, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSiteDetails(parseInt(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  const formatTime = (hour: string, min: string) => {
    const h = parseInt(hour);
    const m = parseInt(min);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 || 12;
    return `${displayHour}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  const capitalizeDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-[#C72030]" />
          <p className="text-gray-600">Loading site details...</p>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Site Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The requested site could not be found."}
          </p>
          <Button
            onClick={() => navigate("/ops-console/master/location/account")}
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sites
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
            Back to Sites
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{site.name}</h1>
              <p className="text-gray-600 mt-2">{site.name_with_zone}</p>
              <div className="flex items-center gap-2 mt-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    site.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {site.active ? "Active" : "Inactive"}
                </span>
                {site.is_favourite && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                    <Heart className="w-4 h-4 fill-current" />
                    {site.favoured_by.user_like_count} Likes
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images Section */}
            {site.image_url && site.image_url.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#C72030]" />
                  Site Images
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {site.image_url.map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200"
                    >
                      <img
                        src={image.url}
                        alt={`Site image ${image.id}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-[#C72030]" />
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Name
                  </label>
                  <p className="text-gray-900">{site.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Site ID
                    </label>
                    <p className="text-gray-900 font-mono">#{site.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company ID
                    </label>
                    <p className="text-gray-900 font-mono">
                      #{site.company_id}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <p className="text-gray-900 font-mono">
                      {site?.company_name}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Region
                    </label>
                    <p className="text-gray-900">
                      {site.region_name || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zone
                    </label>
                    <p className="text-gray-900">
                      {site?.name_with_zone || "Not specified"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Headquarters
                  </label>
                  <p className="text-gray-900">
                    {site?.headquarter_name || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#C72030]" />
                Location Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <p className="text-gray-900">
                    {site.address || "Not specified"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <p className="text-gray-900">
                      {site.city || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <p className="text-gray-900">
                      {site.district || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <p className="text-gray-900">
                      {site.state || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coordinates (Latitude, Longitude)
                    </label>
                    <p className="text-gray-900 font-mono text-sm">
                      {site.latitude}, {site.longitude}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Geofence Range
                    </label>
                    <p className="text-gray-900 font-mono text-sm">
                      {site.geofence_range}
                    </p>
                  </div>
                </div>
                {site.location_url && (
                  <div className="pt-2">
                    <a
                      href={site.location_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#C72030] hover:text-[#C72030]/80 font-medium"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      View on Maps
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Site Advantages */}
            {site.site_advantages && site.site_advantages.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#C72030]" />
                  Site Advantages
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {site.site_advantages.map((advantage, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
                    >
                      {advantage.icon && (
                        <img
                          src={advantage.icon}
                          alt={advantage.name}
                          className="w-12 h-12 object-contain mb-2"
                        />
                      )}
                      <p className="text-sm text-gray-900 text-center font-medium">
                        {advantage.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {site.amenities && site.amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Amenities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {site.amenities.map((amenity) => (
                    <div
                      key={amenity.id}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                    >
                      {amenity.icon && (
                        <img
                          src={amenity.icon}
                          alt={amenity.name}
                          className="w-10 h-10 object-contain rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {amenity.name}
                        </h3>
                        {amenity.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {amenity.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shared Content */}
            {/* {site.shared && ( */}
            <div className="bg-white rounded-lg shadow p-6">
              {/* Enabled Site Configuration Details */}
              <div className="">
                {/* <h3 className="text-sm font-medium  mb-4">
                    Enabled Site Configurations
                  </h3> */}

                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#C72030]" />
                  Enabled Site Configurations
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    { key: "skip_host_approval", label: "Skip Host Approval" },
                    { key: "survey_enabled", label: "Survey Enabled" },
                    { key: "fitout_enabled", label: "Fitout Enabled" },
                    { key: "mailroom_enabled", label: "Mailroom Enabled" },
                    {
                      key: "create_breakdown_ticket",
                      label: "Create Breakdown Ticket",
                    },
                    { key: "parking_enabled", label: "Parking Enabled" },
                    {
                      key: "default_visitor_pass",
                      label: "Default Visitor Pass",
                    },
                    {
                      key: "ecommerce_service_enabled",
                      label: "Ecommerce Service Enabled",
                    },
                    {
                      key: "operational_audit_enabled",
                      label: "Operational Audit Enabled",
                    },
                    { key: "steps_enabled", label: "Steps Enabled" },
                    {
                      key: "transportation_enabled",
                      label: "Transportation Enabled",
                    },
                    {
                      key: "business_card_enabled",
                      label: "Business Card Enabled",
                    },
                    { key: "visitor_enabled", label: "Visitor Enabled" },
                    { key: "govt_id_enabled", label: "Govt ID Enabled" },
                    {
                      key: "visitor_host_mandatory",
                      label: "Visitor Host Mandatory",
                    },
                  ]
                    .filter((item) => site && site[item.key])
                    .map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center gap-2 text-black-700"
                      >
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                        {item.label}
                      </div>
                    ))}
                  {site &&
                    [
                      "skip_host_approval",
                      "survey_enabled",
                      "fitout_enabled",
                      "mailroom_enabled",
                      "create_breakdown_ticket",
                      "parking_enabled",
                      "default_visitor_pass",
                      "ecommerce_service_enabled",
                      "operational_audit_enabled",
                      "steps_enabled",
                      "transportation_enabled",
                      "business_card_enabled",
                      "visitor_enabled",
                      "govt_id_enabled",
                      "visitor_host_mandatory",
                    ].every((key) => !site[key]) && (
                      <div className="text-gray-500 col-span-2">
                        No configurations enabled
                      </div>
                    )}
                </div>
              </div>
              {/* <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Additional Information
                </h2>
                <p className="text-gray-900">{site.shared_content}</p> */}
            </div>
            {/* )} */}
          </div>

          {/* Right Column - Meta Information */}
          <div className="space-y-6">
            {/* Operational Schedule */}
            {site.operational_schedule &&
              site.operational_schedule.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#C72030]" />
                    Operating Hours
                  </h2>
                  <div className="space-y-3">
                    {site.operational_schedule.map((schedule, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded">
                        <p className="font-medium text-gray-900 mb-1">
                          {capitalizeDay(schedule.day)}
                        </p>
                        <div className="space-y-1">
                          {schedule.times.map((time, timeIndex) => (
                            <p
                              key={timeIndex}
                              className="text-sm text-gray-600"
                            >
                              {formatTime(time.start_hour, time.start_min)} -{" "}
                              {formatTime(time.end_hour, time.end_min)}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Timeline */}
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
                    {formatDate(site.created_at)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Updated
                  </label>
                  <p className="text-gray-900 text-sm">
                    {formatDate(site.updated_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Favorite Status */}
            {site.is_favourite && site.favoured_by.users.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#C72030]" />
                  Liked By
                </h2>
                <div className="space-y-2">
                  {site.favoured_by.users.map((user, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-50 rounded text-sm text-gray-900"
                    >
                      {user.first_name || user.last_name
                        ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
                        : "Anonymous User"}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteDetailsPage;
