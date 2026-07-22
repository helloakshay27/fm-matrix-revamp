import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  User as UserIcon,
  Building2,
  Briefcase,
  CalendarDays,
  Clock,
  Hash,
  Eye,
  EyeOff,
  MoreVertical,
  Share2,
  Download,
  ChevronDown,
  ChevronUp,
  Instagram,
  Linkedin,
} from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import goPhygitalCardBg from "../../assets/GoPhygital-businesscard-bg.jpeg";
import goPhygitalLogo from "../../assets/gophygital-logo-min.jpg";

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
  employeeId: string;
  name: string;
  email: string;
  officeEmail?: string;
  phone: string;
  designation?: string;
  department?: string;
  company?: string;
  profileImage?: string;
  website?: string;
  address?: string;
  workingDays?: string;
  workHours?: string;
  socialLinks?: SocialLink[];
  extraLinks?: CardLink[];
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
  employee_id?: string | number;
  user_other_detail?: {
    website_link?: string;
    social_links?: SocialLink[];
    extra_links?: CardLink[];
    office_email?: string;
    working_days?: string;
    work_hours?: string;
  };
  lock_user_permission?: {
    designation?: string;
    department_name?: string;
  };
}

// Responsive scale: 1x at narrow/mobile widths, growing smoothly up to 1.4x on wide desktop screens,
// so the same card design gets visibly bigger instead of floating small in empty space.
const s = (px: number) => `calc(${px}px * var(--cs))`;

const WhatsAppIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="#25D366">
    <path d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.762.463 3.484 1.343 4.997l-1.427 5.212 5.339-1.398a9.955 9.955 0 0 0 4.742 1.186h.004c5.514 0 9.997-4.483 9.997-9.997 0-2.67-1.04-5.181-2.928-7.07a9.935 9.935 0 0 0-7.073-2.927zm.001 18.29a8.28 8.28 0 0 1-4.223-1.156l-.303-.18-3.146.824.84-3.065-.198-.314a8.264 8.264 0 0 1-1.268-4.4c0-4.573 3.72-8.293 8.302-8.293a8.24 8.24 0 0 1 5.867 2.43 8.24 8.24 0 0 1 2.428 5.868c0 4.573-3.72 8.293-8.3 8.293z" />
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
  </svg>
);

const GoPhygitalLogo: React.FC = () => (
  <img
    src={goPhygitalLogo}
    alt="goPhygital.work"
    className="w-auto select-none"
    style={{ height: s(26) }}
  />
);

const socialIconFor = (title?: string) => {
  const t = (title || "").toLowerCase();
  const style = { width: s(18), height: s(18) };
  if (t.includes("whatsapp")) return <WhatsAppIcon style={style} />;
  if (t.includes("linkedin"))
    return <Linkedin style={{ ...style, color: "#0A66C2" }} fill="#0A66C2" />;
  if (t.includes("instagram"))
    return <Instagram style={{ ...style, color: "#E1306C" }} />;
  return <Globe style={{ ...style, color: "#EA5B2E" }} />;
};

export const GoPhygitalBusinessCard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState<UserCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"basic" | "detailed">("basic");
  const [socialExpanded, setSocialExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const source = searchParams.get("source") || "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        const params = new URLSearchParams({ token: card });
        if (source) {
          params.set("source", source);
        }

        const response = await fetch(
          `https://live-api.gophygital.work/pms/users/user_info.json?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data: ApiResponse = await response.json();

        const mappedData: UserCardData = {
          id: data.id,
          employeeId: String(data.employee_id ?? data.id ?? ""),
          name: data.fullname,
          email: data.email,
          officeEmail: data.user_other_detail?.office_email || data.email,
          phone: `+${data.country_code} ${data.mobile}`,
          designation: data.lock_user_permission?.designation || "",
          department: data.lock_user_permission?.department_name || "",
          company: data.user_company_name,
          profileImage: data.business_card_url || data.avatar_url,
          website: data.user_other_detail?.website_link || "",
          address: data.site_name,
          workingDays: data.user_other_detail?.working_days || "",
          workHours: data.user_other_detail?.work_hours || "",
          socialLinks: data.user_other_detail?.social_links || [],
          extraLinks: data.user_other_detail?.extra_links || [],
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
  }, [searchParams]);

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
    setMenuOpen(false);
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
        navigator.clipboard.writeText(shareData.text);
        toast.success("Contact info copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
    setMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: "#EA5B2E" }}
        ></div>
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

  const allSocial = [...(userData.socialLinks || []), ...(userData.extraLinks || [])];
  const visibleSocial = socialExpanded ? allSocial : allSocial.slice(0, 3);

  const SocialCard = () =>
    allSocial.length > 0 ? (
      <div
        className="gp-social-card bg-white flex items-center flex-wrap"
        style={{
          marginTop: s(12),
          gap: s(12),
          paddingLeft: s(24),
          paddingRight: s(24),
          paddingTop: s(16),
          paddingBottom: s(16),
        }}
      >
        <span
          className="font-semibold flex-shrink-0"
          style={{ color: "#1a1a1a", fontSize: s(14) }}
        >
          Social links
        </span>
        <div className="flex-1 flex items-center justify-end flex-wrap" style={{ gap: s(8) }}>
          {visibleSocial.map((item, index) => (
            <a
              key={index}
              href={item.link.startsWith("http") ? item.link : `https://${item.link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white flex items-center justify-center flex-shrink-0"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.15)", width: s(32), height: s(32) }}
              title={item.title}
            >
              {socialIconFor(item.title)}
            </a>
          ))}
        </div>
        <button
          onClick={() => setSocialExpanded((v) => !v)}
          className="flex-shrink-0"
          style={{ padding: s(4) }}
          aria-label="Toggle all social links"
        >
          {allSocial.length > 3 ? (
            socialExpanded ? (
              <ChevronUp style={{ width: s(18), height: s(18), color: "#4B5563" }} />
            ) : (
              <ChevronDown style={{ width: s(18), height: s(18), color: "#4B5563" }} />
            )
          ) : (
            <ChevronDown style={{ width: s(18), height: s(18), color: "#4B5563" }} />
          )}
        </button>
      </div>
    ) : null;

  return (
    <div
      className="gp-outer min-h-screen overflow-y-auto flex items-start justify-center"
      style={
        {
          backgroundColor: "#F3F4F8",
          fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
          // Unitless scale: 1x up to ~480px-wide viewports, growing smoothly to 1.4x by ~1440px+
          // so the same design reads as an intentional "web view" instead of a tiny floating card.
          "--cs": "clamp(1, calc(1 + (100vw - 480px) / 2400px), 1.4)",
        } as React.CSSProperties
      }
    >
      {/* Below ~1024px: centered card, capped width, rounded + shadow (mobile/tablet).
          At ~1024px+: fills the full browser width edge-to-edge, no radius/shadow (matches
          ViBusinessCard's own desktop behavior) while internal spacing keeps scaling via --cs. */}
      <style>{`
        .gp-outer { padding: 24px 16px; }
        .gp-shell { width: 100%; max-width: ${s(420)}; }
        .gp-card { border-radius: ${s(24)}; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1); }
        .gp-social-card { border-radius: ${s(20)}; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08); }
        @media (min-width: 1024px) {
          .gp-outer { padding: 0; }
          .gp-shell { max-width: none; }
          .gp-card { border-radius: 0; box-shadow: none; }
          .gp-social-card { border-radius: 0; box-shadow: none; border-top: 1px solid #F0F0F2; }
        }
      `}</style>
      <div className="gp-shell">
        <div className="gp-card relative bg-white overflow-hidden w-full">
          {/* Decorative header background (out of flow, clipped to header area only) */}
          <div
            className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none"
            style={{ height: s(170) }}
          >
            <img
              src={goPhygitalCardBg}
              alt="goPhygital Business Card Background"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Top bar */}
            <div
              className="flex items-start justify-between"
              style={{ paddingLeft: s(24), paddingRight: s(24), paddingTop: s(24) }}
            >
              <GoPhygitalLogo />
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="-mt-1 -mr-1"
                  style={{ padding: s(4) }}
                  aria-label="More options"
                >
                  <MoreVertical style={{ width: s(20), height: s(20), color: "#4B5563" }} />
                </button>
                {menuOpen && (
                  <div
                    className="absolute right-0 top-8 z-20 bg-white rounded-lg overflow-hidden w-44"
                    style={{ boxShadow: "0 6px 20px rgba(0,0,0,0.18)" }}
                  >
                    <button
                      onClick={handleDownloadVCard}
                      className="w-full flex items-center gap-2 px-4 py-3 text-[13px] text-left hover:bg-gray-50"
                      style={{ color: "#1a1a1a" }}
                    >
                      <Download className="w-4 h-4" /> Save Contact
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-full flex items-center gap-2 px-4 py-3 text-[13px] text-left hover:bg-gray-50 border-t border-gray-100"
                      style={{ color: "#1a1a1a" }}
                    >
                      <Share2 className="w-4 h-4" /> Share Contact
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile image */}
            <div
              className="absolute rounded-full overflow-hidden"
              style={{
                top: s(86),
                left: s(24),
                width: s(100),
                height: s(100),
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
                border: `${s(4)} solid white`,
              }}
            >
              {userData.profileImage ? (
                <img
                  src={userData.profileImage}
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <UserIcon className="w-12 h-12 text-gray-500" />
                </div>
              )}
            </div>

            {/* Employee ID (sits in the white area, clear of the header artwork) */}
            {viewMode === "basic" && userData.employeeId && (
              <div className="absolute text-right" style={{ top: s(190), right: s(24) }}>
                <span style={{ color: "#9CA3AF", fontSize: s(12) }}>Employee ID </span>
                <span className="font-bold" style={{ color: "#141414", fontSize: s(17) }}>
                  {userData.employeeId}
                </span>
              </div>
            )}

            {/* Name + Designation */}
            <div style={{ paddingLeft: s(24), paddingRight: s(24), marginTop: s(200) }}>
              <h2 className="font-bold leading-tight" style={{ color: "#141414", fontSize: s(20) }}>
                {userData.name}
              </h2>
              {userData.designation && (
                <p style={{ color: "#8E8E93", fontSize: s(14), marginTop: s(4) }}>
                  {userData.designation}
                </p>
              )}
              {viewMode === "basic" && userData.company && (
                <p
                  className="border-b"
                  style={{
                    color: "#8E8E93",
                    fontSize: s(14),
                    marginTop: s(2),
                    paddingBottom: s(12),
                    borderColor: "#F0F0F2",
                  }}
                >
                  {userData.company}
                </p>
              )}
            </div>

            {viewMode === "basic" ? (
              <div style={{ paddingTop: s(16), paddingBottom: s(20) }}>
                {/* Phone */}
                <div
                  className="flex items-center"
                  style={{ gap: s(12), marginBottom: s(16), paddingLeft: s(24), paddingRight: s(24) }}
                >
                  <Phone style={{ width: s(18), height: s(18), color: "#4B5563", flexShrink: 0 }} />
                  <a href={`tel:${userData.phone}`} style={{ color: "#1a1a1a", fontSize: s(14) }}>
                    {userData.phone}
                  </a>
                </div>

                {/* Email + eye toggle to open detailed view */}
                <div
                  className="flex items-center"
                  style={{ gap: s(12), paddingLeft: s(24), paddingRight: s(24) }}
                >
                  <Mail style={{ width: s(18), height: s(18), color: "#4B5563", flexShrink: 0 }} />
                  <a
                    href={`mailto:${userData.email}`}
                    className="break-all flex-1"
                    style={{ color: "#1a1a1a", fontSize: s(14) }}
                  >
                    {userData.email}
                  </a>
                  <button
                    onClick={() => setViewMode("detailed")}
                    className="flex-shrink-0"
                    style={{ padding: s(4) }}
                    aria-label="View all details"
                    title="View all details"
                  >
                    <Eye style={{ width: s(18), height: s(18), color: "#4B5563" }} />
                  </button>
                </div>

              </div>
            ) : (
              <div style={{ paddingTop: s(16), paddingBottom: s(20) }}>
                <div
                  className="flex items-center justify-between"
                  style={{ paddingLeft: s(24), paddingRight: s(24), marginBottom: s(12) }}
                >
                  <h3 className="font-semibold" style={{ color: "#1a1a1a", fontSize: s(15) }}>
                    Contact &amp; Company Info
                  </h3>
                  <button
                    onClick={() => setViewMode("basic")}
                    className="flex-shrink-0"
                    style={{ padding: s(4) }}
                    aria-label="Back to summary"
                    title="Back to summary"
                  >
                    <EyeOff style={{ width: s(16), height: s(16), color: "#4B5563" }} />
                  </button>
                </div>

                {userData.address && (
                  <InfoRow icon={<MapPin style={{ width: s(16), height: s(16) }} />} label="Address" value={userData.address} />
                )}
                {userData.company && (
                  <InfoRow icon={<Building2 style={{ width: s(16), height: s(16) }} />} label="Company" value={userData.company} />
                )}
                <InfoRow icon={<Phone style={{ width: s(16), height: s(16) }} />} label="Contact" value={userData.phone} href={`tel:${userData.phone}`} />
                {userData.website && (
                  <InfoRow
                    icon={<Globe style={{ width: s(16), height: s(16) }} />}
                    label="Company Website"
                    value={userData.website}
                    href={userData.website.startsWith("http") ? userData.website : `https://${userData.website}`}
                    linkColor
                  />
                )}
                {userData.department && (
                  <InfoRow icon={<Briefcase style={{ width: s(16), height: s(16) }} />} label="Department" value={userData.department} />
                )}
                {userData.workingDays && (
                  <InfoRow icon={<CalendarDays style={{ width: s(16), height: s(16) }} />} label="Working Days" value={userData.workingDays} />
                )}
                {userData.workHours && (
                  <InfoRow icon={<Clock style={{ width: s(16), height: s(16) }} />} label="Work Hours" value={userData.workHours} />
                )}
                {userData.officeEmail && (
                  <InfoRow
                    icon={<Mail style={{ width: s(16), height: s(16) }} />}
                    label="Office Email"
                    value={userData.officeEmail}
                    href={`mailto:${userData.officeEmail}`}
                    linkColor
                  />
                )}
                {userData.employeeId && (
                  <InfoRow icon={<Hash style={{ width: s(16), height: s(16) }} />} label="Employee ID" value={`#${userData.employeeId}`} noDivider />
                )}
              </div>
            )}
          </div>
        </div>

        <SocialCard />
      </div>
    </div>
  );
};

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  linkColor?: boolean;
  noDivider?: boolean;
}> = ({ icon, label, value, href, linkColor, noDivider }) => {
  const content = href ? (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="font-medium break-all"
      style={{ color: linkColor ? "#EA5B2E" : "#1a1a1a", fontSize: s(14) }}
    >
      {value}
    </a>
  ) : (
    <span
      className="font-medium whitespace-pre-line"
      style={{ color: "#1a1a1a", fontSize: s(14) }}
    >
      {value}
    </span>
  );

  return (
    <div
      className={`flex items-start ${noDivider ? "" : "border-b"}`}
      style={{
        gap: s(12),
        paddingLeft: s(24),
        paddingRight: s(24),
        paddingBottom: s(12),
        marginBottom: s(12),
        borderColor: "#F0F0F2",
      }}
    >
      <div className="flex-shrink-0" style={{ marginTop: s(2), color: "#4B5563" }}>
        {icon}
      </div>
      <div className="flex-1">
        <p style={{ color: "#9CA3AF", fontSize: s(11.5), marginBottom: s(2) }}>
          {label}
        </p>
        {content}
      </div>
    </div>
  );
};

export default GoPhygitalBusinessCard;
