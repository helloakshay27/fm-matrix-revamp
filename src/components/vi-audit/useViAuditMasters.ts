import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";

const VI_AUDIT_MASTERS_ENDPOINT = "/vi_audits/masters.json";

export interface MasterOption {
  value: string; // master record id
  label: string;
}

interface NamedRecord {
  id: number;
  name?: string;
}

interface ViAuditMastersResponse {
  code?: number;
  data?: {
    audit_types?: string[];
    clusters?: { id: number; cluster_name: string }[];
    circles?: NamedRecord[];
    work_locations?: { id: number; work_location_code?: string; work_location_name: string }[];
    departments?: { id: number; department_name: string }[];
    classifications?: NamedRecord[];
    categories?: NamedRecord[];
    sub_categories?: NamedRecord[];
    visit_business_areas?: NamedRecord[];
  };
}

export interface ViAuditMasters {
  auditTypes: string[];
  clusters: MasterOption[];
  circles: MasterOption[];
  workLocations: MasterOption[];
  departments: MasterOption[];
  classifications: MasterOption[];
  categories: MasterOption[];
  subCategories: MasterOption[];
  visitBusinessAreas: MasterOption[];
}

const EMPTY_MASTERS: ViAuditMasters = {
  auditTypes: [],
  clusters: [],
  circles: [],
  workLocations: [],
  departments: [],
  classifications: [],
  categories: [],
  subCategories: [],
  visitBusinessAreas: [],
};

const toOptions = <T extends { id: number }>(records: T[] | undefined, label: (record: T) => string | undefined) =>
  (records ?? [])
    .map((record) => ({ value: String(record.id), label: label(record) ?? "" }))
    .filter((option) => option.label);

/** Dropdown masters for the Vi Audit forms (GET /vi_audits/masters.json). */
export const useViAuditMasters = () => {
  const [masters, setMasters] = useState<ViAuditMasters>(EMPTY_MASTERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const response = await fetch(getFullUrl(VI_AUDIT_MASTERS_ENDPOINT), {
          headers: { Authorization: getAuthHeader() },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        const { data }: ViAuditMastersResponse = await response.json();
        setMasters({
          auditTypes: data?.audit_types ?? [],
          clusters: toOptions(data?.clusters, (r) => r.cluster_name),
          circles: toOptions(data?.circles, (r) => r.name),
          workLocations: toOptions(data?.work_locations, (r) => r.work_location_name),
          departments: toOptions(data?.departments, (r) => r.department_name),
          classifications: toOptions(data?.classifications, (r) => r.name),
          categories: toOptions(data?.categories, (r) => r.name),
          subCategories: toOptions(data?.sub_categories, (r) => r.name),
          visitBusinessAreas: toOptions(data?.visit_business_areas, (r) => r.name),
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to load audit masters:", error);
        toast.error("Failed to load audit dropdown options");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  return { masters, loading };
};
