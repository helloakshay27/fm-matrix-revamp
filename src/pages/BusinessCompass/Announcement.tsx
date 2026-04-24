import React, { useState, useEffect } from "react";
import {
  Clock,
  Info,
  Megaphone,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { getUser } from "@/utils/auth";
import axios from "axios";

type AnnouncementItem = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  slogan: string;
  typeLabel: string;
  categoryLabel: string;
  dateLine: string;
  ctaLabel: string;
  ctaHref?: string;
  expires: string;
  isActive: boolean;
  dbId?: number;
};

function AnnouncementCard({ item }: { item: AnnouncementItem }) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[rgba(218,119,86,0.18)] bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#DA7756]/40",
        "pl-1.5"
      )}
    >
      {/* Left Accent Border */}
      <div className="absolute left-0 top-0 h-full w-1.5 bg-[#DA7756]" aria-hidden />
      
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 px-5 py-5 pl-5 sm:px-6 sm:py-6">
        {/* Icon */}
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF9F6] text-[#DA7756] border border-[rgba(218,119,86,0.18)]"
          aria-hidden
        >
          <Info className="h-6 w-6 stroke-[2]" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-3">
          {/* Badges & Date */}
          <div className="flex flex-wrap items-center gap-2 gap-y-2">
            <span className="inline-flex items-center rounded-md border border-[#DA7756]/20 bg-[#DA7756]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#DA7756]">
              {item.typeLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
              {item.categoryLabel}
            </span>
            <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-neutral-500 sm:ml-2">
              <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
              {item.dateLine}
            </span>
          </div>

          {/* Text Content */}
          <div className="space-y-1.5">
            <h2 className="text-[17px] font-bold leading-snug text-neutral-900 sm:text-lg">
              {item.title}
            </h2>
            {item.subtitle && (
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                {item.subtitle}
              </p>
            )}
            <p className="text-[14.5px] leading-relaxed text-neutral-700 mt-2">
              {item.body}
            </p>
            {item.slogan && (
              <p className="text-[13px] font-semibold italic text-neutral-500 pt-1">
                "{item.slogan}"
              </p>
            )}
          </div>

          {/* Footer (Expires) */}
          {item.expires && (
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <p className="text-[12px] font-medium text-neutral-400">
                Expires: {item.expires}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

const Announcement = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = getUser() as unknown as { lock_role?: { company_id?: number | string } };
  const companyId = localStorage.getItem("org_id") || user?.lock_role?.company_id || "116";

  const fetchAnnouncements = async () => {
    if (!companyId) {
      setError("No company ID found");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const baseUrl = localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
      const protocol = baseUrl.startsWith("http") ? "" : "https://";

      const annEndpoint = `${protocol}${baseUrl}/extra_fields?resource_id=${companyId}&resource_type=CompanySetup&group_name=announcement`;
      const response = await axios.get(annEndpoint, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      let fetchedAnns = [];
      if (Array.isArray(response.data)) {
         fetchedAnns = response.data;
      } else if (Array.isArray(response.data?.data)) {
         fetchedAnns = response.data.data;
      } else if (Array.isArray(response.data?.announcement)) {
         fetchedAnns = response.data.announcement;
      }

      if (fetchedAnns.length > 0) {
        const mappedAnns = fetchedAnns
          .filter((a: Record<string, any>) => {
            // Default to active if no field_value or not JSON
            if (!a.field_value || !a.field_value.trim().startsWith("{")) {
              return true;
            }
            
            try {
              const parsed = JSON.parse(a.field_value);
              // Only show announcements explicitly marked as active (isActive: true)
              return parsed.isActive === true;
            } catch (e) {
              console.error("Failed to parse announcement data", e);
              // If parsing fails, don't show the announcement
              return false;
            }
          })
          .map((a: Record<string, any>) => {
            let description = a.field_value || "";
            let isActive = true;
            if (a.field_value && a.field_value.trim().startsWith("{")) {
              try {
                const parsed = JSON.parse(a.field_value);
                description = parsed.description || parsed.content || a.field_value;
                isActive = parsed.isActive !== undefined ? parsed.isActive : true;
              } catch (e) {
                console.error("Failed to parse announcement data", e);
              }
            }
            
            return {
              id: String(a.id || a.extra_field_id),
              title: a.field_name || "Announcement",
              subtitle: "COMPANY ANNOUNCEMENT",
              body: description,
              slogan: "Stay informed with the latest updates.",
              typeLabel: "Info",
              categoryLabel: "Company",
              dateLine: `${new Date().toLocaleDateString()} by Admin`,
              ctaLabel: "Learn More",
              ctaHref: "#",
              expires: "Dec 31, 2026",
              isActive: isActive,
              dbId: a.id || a.extra_field_id
            };
          });
        
        setAnnouncements(mappedAnns);
      } else {
        setAnnouncements([]);
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [companyId]);

  return (
    <div 
      className="min-h-[calc(100vh-4rem)] w-full bg-[#f6f4ee] px-4 py-6 sm:px-6"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#DA7756] shadow-sm">
            <Megaphone className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
              Announcements
            </h1>
            <p className="mt-1 text-sm font-medium text-neutral-500">
              All company announcements from the admin team
            </p>
          </div>
        </header>

        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">
            Current
          </h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-[#DA7756]" />
              <span className="ml-3 text-sm font-semibold text-neutral-500">Loading announcements...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 rounded-2xl border border-red-200 bg-red-50">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <span className="ml-2 text-sm font-semibold text-red-700">{error}</span>
            </div>
          ) : announcements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-[rgba(218,119,86,0.18)] bg-white text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-50">
                <Megaphone className="h-8 w-8 text-neutral-300" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mt-4">
                No active announcements
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                Check back later for updates
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-5">
              {announcements.map((item) => (
                <AnnouncementCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Announcement;