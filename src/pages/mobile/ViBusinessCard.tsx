import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  User as UserIcon,
  ArrowLeft,
  Share2,
  Download,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import viBusinessCardBg from "../../assets/vi new (1).jpeg";
import baseClient from "@/utils/withoutTokenBase";
import { SaveContactButton } from "@/components/vi-business-card/SaveContactButton";
import type { VCardContact } from "@/utils/vCard";

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
  office_address: string;
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
  const source = searchParams.get("source") || "";
  const scannedById = searchParams.get("scanned_by_id") || "";
  // The card element captured for the PDF download.
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

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
        const params = new URLSearchParams({
          token: card,
          // _t: timestamp.toString(),s
        });

        if (source) {
          params.set("source", source);
        }

        if (scannedById) {
          params.set("scanned_by_id", scannedById);
        }

        const response = await fetch(
          `https://live-api.gophygital.work/pms/users/user_info_by_enc_id.json?${params.toString()}`
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
          // Country code is optional; without it the number is shown as sent (no "+undefined").
          phone: data.mobile ? (data.country_code ? `+${String(data.country_code).replace(/^\+/, "")} ${data.mobile}` : data.mobile) : "",
          designation: data.lock_user_permission?.designation || "",
          department: data.lock_user_permission?.department_name || "",
          company: data.user_company_name,
          profileImage: data.business_card_url || data.avatar_url,
          website: data.user_other_detail?.website_link || "",
          address: data.office_address || "",
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

  // Contact for "Save Contact" (.vcf), built from this card's API data.
  const contact = useMemo<VCardContact | null>(() => {
    if (!userData) return null;
    return {
      fullName: userData.name || "",
      company: userData.company,
      designation: userData.designation,
      department: userData.department,
      mobile: userData.phone,
      email: userData.email,
      website: userData.website,
      address: userData.address,
      links: [...(userData.socialLinks ?? []), ...(userData.extraLinks ?? [])]
        .filter((item) => item.link)
        .map((item) => ({ title: item.title, url: item.link })),
    };
  }, [userData]);

  // Download the card exactly as shown (banner, photo and details) as a one-page PDF.
  const handleDownloadPdf = async () => {
    if (!userData || !cardRef.current || downloading) return;
    setDownloading(true);
    try {
      // Loaded on demand so the card page itself stays light.
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      // Render at a fixed phone width so the PDF looks the same from any screen size.
      const CARD_WIDTH = 420;
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: CARD_WIDTH,
        onclone: (doc) => {
          const clone = doc.getElementById("vi-business-card");
          if (clone) clone.style.width = `${CARD_WIDTH}px`;
        },
      });
      // One page sized to the card, so nothing is cut or padded.
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / 3, canvas.height / 3],
        hotfixes: ["px_scaling"],
      });
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, canvas.width / 3, canvas.height / 3);
      pdf.save(`${userData.name.replace(/\s+/g, "_")}_business_card.pdf`);
      toast.success("Business card downloaded");
    } catch (err) {
      console.error("Business card PDF failed:", err);
      toast.error("Could not download the business card");
    } finally {
      setDownloading(false);
    }
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
      className="min-h-screen w-full bg-white overflow-y-auto"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Business Card (captured by Download PDF) */}
      <div id="vi-business-card" ref={cardRef} className="relative bg-white w-full border border-gray-200">
        {/* Banner: sized to the source image's own aspect ratio (1551x1014) so the full
            logo and ribbon art always show uncropped, and scales fluidly with card width
            at any screen size instead of being clipped by a fixed pixel height. */}
        <div className="relative w-full">
          <div className="w-full aspect-[1551/1014] overflow-hidden">
            <img
              src={viBusinessCardBg}
              alt="VI Business Card Background"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Image - sits inside the lower-left of the banner, sized/positioned as a
              percentage of the banner box so it scales proportionally at any width */}
          <div
            className="absolute"
            style={{ left: "14%", width: "23%", top: "58%" }}
          >
            <div
              className="w-full aspect-square overflow-hidden"
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
                  <UserIcon className="w-1/2 h-1/2 text-gray-500" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative z-10">
          {/* Contact Information */}
          <div className="pt-4 pb-8 w-full">
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
                    href={userData.website.startsWith("http") ? userData.website : `https://${userData.website}`}
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

      {/* Save Contact (.vcf) and Download PDF — outside the card, so they aren't in the PDF */}
      <div className="flex flex-wrap justify-center gap-3 px-6 pb-8">
        <SaveContactButton
          contact={contact}
          photoUrl={userData.profileImage}
          className="inline-flex items-center justify-center gap-2 text-white font-semibold text-[13px] py-2 px-5 rounded-full transition-all active:scale-[0.98] disabled:opacity-70"
          style={{ backgroundColor: "#E31E24", boxShadow: "0 3px 10px rgba(227, 30, 36, 0.3)" }}
        />
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="inline-flex items-center justify-center gap-2 text-white font-semibold text-[13px] py-2 px-5 rounded-full transition-all active:scale-[0.98] disabled:opacity-70"
          style={{ backgroundColor: "#E31E24", boxShadow: "0 3px 10px rgba(227, 30, 36, 0.3)" }}
        >
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {downloading ? "Preparing PDF..." : "Download PDF"}
        </button>
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
  );
};

export default ViBusinessCard;
