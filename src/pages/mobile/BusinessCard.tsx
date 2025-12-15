import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  User as UserIcon,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import viBusinessCardBg from "../../assets/VI-businesscard.png";
import { API_CONFIG } from "@/config/apiConfig";

interface UserCardData {
  id: number;
  name: string;
  email: string;
  phone: string;
  designation?: string;
  department?: string;
  company?: string;
  profileImage?: string;
  website?: string;
  address?: string;
}

interface ApiResponse {
  id: number;
  fullname: string;
  email: string;
  mobile: string;
  country_code: string;
  site_name: string;
  user_company_name: string;
  avatar_url: string;
  user_other_detail?: {
    website_link?: string;
  };
  lock_user_permission?: {
    designation?: string;
    department_name?: string;
  };
}

export const BusinessCard: React.FC = () => {
  const [userData, setUserData] = useState<UserCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {


        // Get base URL from config
        let baseUrl = API_CONFIG.BASE_URL;
        const token = API_CONFIG.TOKEN;

        // Ensure base URL has proper format
        if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
          baseUrl = `https://${baseUrl}`;
        }

        // Remove trailing slash if present
        baseUrl = baseUrl.replace(/\/$/, "");

        // Build the API URL - using card as token in Authorization header
        const apiUrl = `${baseUrl}/pms/users/user_info.json?is_token=true`;


        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data: ApiResponse = await response.json();

        console.log("Fetched user data:", data);
        // Map API response to UserCardData
        const mappedData: UserCardData = {
          id: data.id,
          name: data.fullname,
          email: data.email,
          phone: `+${data.country_code} ${data.mobile}`,
          designation: data.lock_user_permission?.department_name || "",
          department: data.lock_user_permission?.department_name || "",
          company: data.user_company_name,
          profileImage: data.avatar_url,
          website: data.user_other_detail?.website_link || "",
          address: data.site_name,
        };

        setUserData(mappedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
        setLoading(false);
        toast.error("Failed to load user information");
      }
    };

    fetchUserData();
  }, []);

  const handleDownloadVCard = () => {
    if (!userData) return;

    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${userData.name}
EMAIL:${userData.email}
TEL:${userData.phone}
ORG:${userData.company || ""}
TITLE:${userData.designation || ""}
ADR:;;${userData.address || ""};;;;
URL:${userData.website || ""}
END:VCARD`;

    const blob = new Blob([vCard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${userData.name.replace(/\s+/g, "_")}_contact.vcf`;
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success("Contact saved to device!");
  };

  const handleShare = async () => {
    if (!userData) return;

    const shareData = {
      title: userData.name,
      text: `${userData.name}\n${userData.designation}\n${userData.phone}\n${userData.email}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareData.text);
        toast.success("Contact info copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">👤</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {error || "User Not Found"}
        </h2>
        <p className="text-gray-600 text-center">
          {error || "The user data could not be loaded."}
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 overflow-y-auto"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div className="w-full min-h-screen p-4 flex items-center justify-center">
        {/* Business Card Container */}
        <div className="w-full max-w-lg">
          <div
            className="relative bg-white overflow-hidden w-full"
            style={{
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
              borderRadius: "16px",
            }}
          >
            {/* Decorative background image */}
            <div className="absolute top-0 left-0 w-full h-[220px] overflow-hidden pointer-events-none">
              <img
                src={viBusinessCardBg}
                alt="VI Business Card Background"
                className="w-full h-full object-cover"
                style={{
                  filter: "brightness(1.05) contrast(1.05)",
                }}
              />
              {/* Gradient overlay for better text visibility */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white"
                style={{ opacity: 0.3 }}
              />
            </div>

            {/* Content Section */}
            <div className="relative z-10">
              {/* Profile Image - Positioned overlapping background */}
              <div className="flex justify-center pt-[140px]">
                <div
                  className="w-[120px] h-[120px] rounded-full overflow-hidden"
                  style={{
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                    border: "6px solid white",
                  }}
                >
                  {userData.profileImage ? (
                    <img
                      src={userData.profileImage}
                      alt={userData.name}
                      className="w-full h-full object-cover"
                      style={{
                        imageRendering: "-webkit-optimize-contrast",
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <UserIcon className="w-14 h-14 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Name and Designation - Centered */}
              <div className="text-center px-6 pt-4 pb-6">
                <h2
                  className="text-2xl font-bold mb-1"
                  style={{ color: "#1a1a1a", letterSpacing: "-0.02em" }}
                >
                  {userData.name}
                </h2>
                {userData.designation && (
                  <p
                    className="text-base font-medium"
                    style={{ color: "#666" }}
                  >
                    {userData.designation}
                  </p>
                )}
                {userData.company && (
                  <p className="text-sm mt-1" style={{ color: "#999" }}>
                    {userData.company}
                  </p>
                )}
              </div>

              {/* Contact Information */}
              <div className="px-6 pb-6 space-y-3">
                {/* Phone */}
                <a
                  href={`tel:${userData.phone}`}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-gray-50 active:scale-[0.98]"
                  style={{
                    backgroundColor: "#F8F9FA",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#E31E24" }}
                  >
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-0.5">
                      Phone
                    </p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userData.phone}
                    </p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${userData.email}`}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-gray-50 active:scale-[0.98]"
                  style={{
                    backgroundColor: "#F8F9FA",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#E31E24" }}
                  >
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-0.5">
                      Email
                    </p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userData.email}
                    </p>
                  </div>
                </a>

                {/* Website */}
                {userData.website && (
                  <a
                    href={userData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-gray-50 active:scale-[0.98]"
                    style={{
                      backgroundColor: "#F8F9FA",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#E31E24" }}
                    >
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 mb-0.5">
                        Website
                      </p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {userData.website}
                      </p>
                    </div>
                  </a>
                )}

                {/* Address */}
                {userData.address && (
                  <div
                    className="flex items-start gap-4 p-4 rounded-xl"
                    style={{
                      backgroundColor: "#F8F9FA",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: "#E31E24" }}
                    >
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Location
                      </p>
                      <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                        {userData.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6 space-y-3">
                <button
                  onClick={handleDownloadVCard}
                  className="w-full text-white font-semibold text-base py-4 px-6 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
                  style={{
                    backgroundColor: "#E31E24",
                    boxShadow: "0 4px 14px rgba(227, 30, 36, 0.4)",
                  }}
                >
                  <UserIcon className="w-5 h-5" />
                  Save to Contacts
                </button>

                <button
                  onClick={handleShare}
                  className="w-full font-semibold text-base py-4 px-6 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: "#F8F9FA",
                    border: "2px solid #E31E24",
                    color: "#E31E24",
                  }}
                >
                  <Share2 className="w-5 h-5" />
                  Share Contact
                </button>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-500 mt-4 px-4">
            Tap on any contact method to get in touch
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
