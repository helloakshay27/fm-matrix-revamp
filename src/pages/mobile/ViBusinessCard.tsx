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
import baseClient from "@/utils/withoutTokenBase";

interface SocialLink {
  title: string;
  link: string;
}

interface CardLink {
  title?: string;
  link: string;
}

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
  socialLinks?: SocialLink[]; // ✅ added
  extraLinks?: CardLink[]; // ✅ added
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
  business_card_url?: string;
  user_other_detail?: {
    website_link?: string;
    social_links?: SocialLink[];
    extra_links?: CardLink[];
  };
  lock_user_permission?: {
    designation?: string;
    department_name?: string;
  };
}

export const ViBusinessCard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState<UserCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add meta tags for cache control
  useEffect(() => {
    const metaTags = [
      {
        httpEquiv: "Cache-Control",
        content: "no-cache, no-store, must-revalidate",
      },
      { httpEquiv: "Pragma", content: "no-cache" },
      { httpEquiv: "Expires", content: "0" },
    ];

    const createdTags: HTMLMetaElement[] = [];

    metaTags.forEach((tag) => {
      const meta = document.createElement("meta");
      if (tag.httpEquiv) {
        meta.httpEquiv = tag.httpEquiv;
      }
      meta.content = tag.content;
      document.head.appendChild(meta);
      createdTags.push(meta);
    });

    return () => {
      createdTags.forEach((tag) => {
        if (tag.parentNode) {
          tag.parentNode.removeChild(tag);
        }
      });
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const card = searchParams.get("card");
        if (!card) {
          setError("No card token provided");
          setLoading(false);
          return;
        }

        // Add timestamp for cache busting
        const timestamp = new Date().getTime();
        const response = await fetch(
          `https://live-api.gophygital.work/pms/users/user_info.json?token=${card}&_t=${timestamp}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data: ApiResponse = await response.json();

        // const data: ApiResponse = response.data;
        console.log("Fetched user data:", data);
        console.log(
          "Social links from API:",
          data.user_other_detail?.social_links
        );
        console.log(
          "Extra links from API:",
          data.user_other_detail?.extra_links
        );

        // Map API response to UserCardData
        const mappedData: UserCardData = {
          id: data.id,
          name: data.fullname,
          email: data.email,
          phone: `+${data.country_code} ${data.mobile}`,
          designation: data.lock_user_permission?.designation || "",
          department: data.lock_user_permission?.department_name || "",
          company: data.user_company_name,
          profileImage: data.business_card_url || data.avatar_url,
          website: data.user_other_detail?.website_link || "",
          address: data.site_name,
          socialLinks: data.user_other_detail?.social_links || [],
          extraLinks: data.user_other_detail?.extra_links || [],
        };

        console.log("Mapped social links:", mappedData.socialLinks);
        console.log("Social links length:", mappedData.socialLinks?.length);

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
  }, [searchParams]);

  // const allLinks = [
  //   ...(userData.socialLinks || []),
  //   ...(userData.extraLinks || []),
  // ];

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
      className="h-screen bg-gray-50 overflow-y-auto"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div className="w-full h-full pt-[130px]">
        {/* Business Card */}
        <div
          className="relative bg-white overflow-hidden w-full"
          style={{
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            borderRadius: "0",
          }}
        >
          {/* Decorative background image */}
          <div className="absolute top-0 left-0 w-full h-[240px] overflow-hidden pointer-events-none">
            <img
              src={viBusinessCardBg}
              alt="VI Business Card Background"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="relative z-10">
            {/* Profile Image - Positioned inside VI background area */}
            <div className="absolute top-[130px] left-12">
              <div
                className="w-[100px] h-[100px] overflow-hidden"
                style={{
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
                  border: "5px solid white",
                }}
              >
                {userData.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt={userData.name}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: "-webkit-optimize-contrast" }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <UserIcon className="w-12 h-12 text-gray-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="pt-[240px] pb-8">
              {/* Name and Designation */}
              <div
                className="flex items-start gap-3 mb-4 py-3 px-6"
                style={{ backgroundColor: "#F5F5F5" }}
              >
                <div className="mt-1 flex-shrink-0">
                  <UserIcon className="w-5 h-5" style={{ color: "#666" }} />
                </div>
                <div className="flex-1">
                  <h2
                    className="text-[15px] font-semibold leading-tight"
                    style={{ color: "#000" }}
                  >
                    {userData.name}
                  </h2>
                  {userData.designation && (
                    <p
                      className="text-[13px] leading-tight mt-1"
                      style={{ color: "#666" }}
                    >
                      {userData.designation}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 mb-4 px-6">
                <div className="flex-shrink-0">
                  <Phone className="w-5 h-5" style={{ color: "#666" }} />
                </div>
                <div className="flex-1">
                  <a
                    href={`tel:${userData.phone}`}
                    className="text-[14px]"
                    style={{ color: "#000" }}
                  >
                    {userData.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div
                className="flex items-center gap-3 mb-4 py-3 px-6"
                style={{ backgroundColor: "#F5F5F5" }}
              >
                <div className="flex-shrink-0">
                  <Mail className="w-5 h-5" style={{ color: "#666" }} />
                </div>
                <div className="flex-1">
                  <a
                    href={`mailto:${userData.email}`}
                    className="text-[14px] break-all"
                    style={{ color: "#000" }}
                  >
                    {userData.email}
                  </a>
                </div>
              </div>

              {/* Website */}
              {userData.website && (
                <div className="flex items-center gap-3 mb-4 px-6">
                  <div className="flex-shrink-0">
                    <Globe className="w-5 h-5" style={{ color: "#666" }} />
                  </div>
                  <div className="flex-1">
                    <a
                      href={userData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14px] break-all"
                      style={{ color: "#000" }}
                    >
                      {userData.website}
                    </a>
                  </div>
                </div>
              )}

              {/* Address */}
              {userData.address && (
                <div
                  className="flex items-start gap-3 py-3 px-6"
                  style={{ backgroundColor: "#F5F5F5" }}
                >
                  <div className="mt-1 flex-shrink-0">
                    <MapPin className="w-5 h-5" style={{ color: "#666" }} />
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-[14px] leading-relaxed whitespace-pre-line"
                      style={{ color: "#000" }}
                    >
                      {userData.address}
                    </p>
                  </div>
                </div>
              )}

              {/* Social Links */}
              {userData?.socialLinks?.length > 0 &&
                userData?.socialLinks.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 mb-4 py-3 px-6"
                    style={{
                      backgroundColor:
                        index % 2 === 1 ? "#F5F5F5" : "transparent",
                    }}
                  >
                    <div className="flex-shrink-0">
                      <Globe className="w-5 h-5" style={{ color: "#666" }} />
                    </div>

                    <div className="flex-1">
                      <a
                        href={
                          item.link.startsWith("http")
                            ? item.link
                            : `https://${item.link}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[14px] break-all"
                        style={{ color: "#000" }}
                      >
                        {/* <span className="">
            {item.title}:
          </span>{" "} */}
                        <span>
                          {item.title
                            ? item.title.charAt(0).toUpperCase() +
                              item.title.slice(1)
                            : ""}
                          :
                        </span>{" "}
                        {item.link}
                      </a>
                    </div>
                  </div>
                ))}

              {/* Social + Extra Links */}
              {/* {allLinks.length > 0 &&
  allLinks.map((item, index) => (
    <div
      key={index}
      className="flex items-center gap-3 mb-4 py-3 px-6"
      style={{
        backgroundColor: index % 2 === 1 ? "#F5F5F5" : "transparent",
      }}
    >
      <div className="flex-shrink-0">
        <Globe className="w-5 h-5" style={{ color: "#666" }} />
      </div>

      <div className="flex-1">
        <a
          href={
            item.link.startsWith("http")
              ? item.link
              : `https://${item.link}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] break-all"
          style={{ color: "#000" }}
        >
          {item.title && (
            <span className="">
              {item.title}:
            </span>
          )}{" "}
          {item.link}
        </a>
      </div>
    </div>
  ))} */}

              {userData?.extraLinks?.length > 0 &&
                userData?.extraLinks.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 mb-4 py-3 px-6"
                    style={{
                      backgroundColor:
                        index % 2 === 1 ? "#F5F5F5" : "transparent",
                    }}
                  >
                    <div className="flex-shrink-0">
                      <Globe className="w-5 h-5" style={{ color: "#666" }} />
                    </div>

                    <div className="flex-1">
                      <a
                        href={
                          item.link.startsWith("http")
                            ? item.link
                            : `https://${item.link}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[14px] break-all"
                        style={{ color: "#000" }}
                      >
                        {item.title ? (
                          <span className="font-semibold capitalize">
                            {item.title}:
                          </span>
                        ) : null}
                        {"Other Links: "}
                        {item.link}
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Save Contact Button */}
        {/* <button
          onClick={handleDownloadVCard}
          className="w-full mt-7 text-white font-semibold text-[15px] py-[15px] px-6 rounded-full transition-all active:scale-[0.98]"
          style={{ 
            backgroundColor: '#E31E24',
            boxShadow: '0 4px 14px rgba(227, 30, 36, 0.4)',
            letterSpacing: '0.3px'
          }}
        >
          Save Contact
        </button> */}
      </div>
    </div>
  );
};

export default ViBusinessCard;
