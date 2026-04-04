import React, { useState, useEffect } from "react";
import {
  Clock,
  ExternalLink,
  Info,
  Megaphone,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { AdminViewEmulation } from "@/components/AdminViewEmulation";
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
        "relative overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 shadow-sm",
        "pl-1"
      )}
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-[#DA7756]" aria-hidden />
      <div className="flex gap-4 px-5 py-5 pl-6 sm:px-6 sm:py-6">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DA7756]/10 text-[#DA7756]"
          aria-hidden
        >
          <Info className="h-5 w-5 stroke-[2.5]" />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2 gap-y-2">
            <span className="inline-flex items-center rounded-full bg-[#DA7756] px-2.5 py-0.5 text-xs font-semibold text-white">
              {item.typeLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DA7756] px-2.5 py-0.5 text-xs font-semibold text-white">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/25">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              {item.categoryLabel}
            </span>
            <span className="flex w-full items-center gap-1.5 text-xs text-neutral-400 sm:ml-1 sm:w-auto">
              <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
              {item.dateLine}
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold leading-snug text-neutral-900 sm:text-xl">
              {item.title}
            </h2>
            <p className="text-xs font-bold uppercase tracking-wide text-neutral-600 sm:text-sm">
              {item.subtitle}
            </p>
            <p className="text-sm leading-relaxed text-neutral-600">
              {item.body}
            </p>
            <p className="text-xs font-semibold uppercase leading-relaxed tracking-wide text-neutral-500">
              {item.slogan}
            </p>
          </div>

          <p className="text-[11px] text-neutral-400">
            Expires: {item.expires}
          </p>
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
    <div className="min-h-[calc(100vh-4rem)] bg-[#f6f4ee] px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#DA7756] shadow-sm">
            <Megaphone className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              Announcements
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-neutral-500 sm:text-base">
              All company announcements from the admin team
            </p>
          </div>
        </header>

        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Current
          </h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#DA7756]" />
              <span className="ml-2 text-neutral-600">Loading announcements...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <span className="ml-2 text-neutral-600">{error}</span>
            </div>
          ) : announcements.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Megaphone className="h-12 w-12 text-neutral-300" />
              <div className="ml-4 text-center">
                <p className="text-neutral-600 font-medium">No active announcements</p>
                <p className="text-neutral-400 text-sm mt-1">Check back later for updates</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
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
