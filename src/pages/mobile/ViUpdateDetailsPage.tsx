import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MuiMultiSelect } from "@/components/MuiMultiSelect";
import { Building2, MapPin, Layers } from "lucide-react";

const COMPANY_ID = 145;
const API_BASE = "https://live-api.gophygital.work";

interface LocationItem {
  id: number;
  name: string;
}

interface SelectOption {
  label: string;
  value: string | number;
}

const toList = (data: unknown, ...keys: string[]): LocationItem[] => {
  const obj = data as Record<string, unknown>;
  const arrayKey = [...keys, "data"].find((k) => Array.isArray(obj?.[k]));
  const raw = Array.isArray(data) ? data : arrayKey ? obj[arrayKey] : [];
  return (raw as Record<string, unknown>[])
    .map((item) => ({
      id: Number(item.id),
      name: String(item.name ?? item.building_name ?? item.floor_name ?? item.site_name ?? ""),
    }))
    .filter((item) => item.name);
};

export const ViUpdateDetailsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const userId = searchParams.get("user_id") || "";

  const [sites, setSites] = useState<LocationItem[]>([]);
  const [buildings, setBuildings] = useState<LocationItem[]>([]);
  const [floors, setFloors] = useState<LocationItem[]>([]);

  const [selectedSite, setSelectedSite] = useState<string>("");
  const [selectedBuildings, setSelectedBuildings] = useState<SelectOption[]>([]);
  const [selectedFloors, setSelectedFloors] = useState<SelectOption[]>([]);

  const [loadingSites, setLoadingSites] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token || !userId) return;

    const fetchSites = async () => {
      setLoadingSites(true);
      try {
        const response = await fetch(
          `${API_BASE}/pms/sites/active_site_index?company_id=${COMPANY_ID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) throw new Error("Failed to fetch sites");
        const data = await response.json();
        setSites(toList(data, "sites"));
      } catch (error) {
        console.error("Error fetching sites:", error);
        toast.error("Failed to load sites");
      } finally {
        setLoadingSites(false);
      }
    };

    fetchSites();
  }, [token, userId]);

  useEffect(() => {
    setSelectedBuildings([]);
    setBuildings([]);
    if (!selectedSite) return;

    const fetchBuildings = async () => {
      setLoadingBuildings(true);
      try {
        const response = await fetch(
          `${API_BASE}/pms/buildings.json?site_id=${selectedSite}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) throw new Error("Failed to fetch buildings");
        const data = await response.json();
        setBuildings(toList(data, "buildings", "pms_buildings"));
      } catch (error) {
        console.error("Error fetching buildings:", error);
        toast.error("Failed to load buildings");
      } finally {
        setLoadingBuildings(false);
      }
    };

    fetchBuildings();
  }, [selectedSite]);

  useEffect(() => {
    setSelectedFloors([]);
    setFloors([]);
    if (selectedBuildings.length === 0) return;

    const fetchFloors = async () => {
      setLoadingFloors(true);
      try {
        const results = await Promise.all(
          selectedBuildings.map((building) =>
            fetch(
              `${API_BASE}/pms/floors/by_building.json?building_id=${building.value}`,
              { headers: { Authorization: `Bearer ${token}` } }
            ).then((res) => (res.ok ? res.json() : []))
          )
        );

        const merged = new Map<number, LocationItem>();
        results.forEach((data) => {
          toList(data, "floors").forEach((floor) => merged.set(floor.id, floor));
        });
        setFloors(Array.from(merged.values()));
      } catch (error) {
        console.error("Error fetching floors:", error);
        toast.error("Failed to load floors");
      } finally {
        setLoadingFloors(false);
      }
    };

    fetchFloors();
  }, [selectedBuildings]);

  const canSubmit =
    !!selectedSite && selectedBuildings.length > 0 && selectedFloors.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error("Please select site, building and floor");
      return;
    }

    setSubmitting(true);
    try {
      // This endpoint responds with a 302 redirect once the update succeeds (it's built for
      // a browser SSO bounce, not a JSON API response). `redirect: "manual"` stops fetch from
      // following that redirect - reaching this point without a thrown network error means
      // the server accepted the PUT, so we treat it as success rather than checking response.ok.
      await fetch(
        `${API_BASE}/pms/users/${userId}/vi_sso_update_details.json`,
        {
          method: "PUT",
          redirect: "manual",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            access_level: "Site",
            access_to: [selectedSite],
            building_id: selectedBuildings.map((b) => String(b.value)),
            floor_id: selectedFloors.map((f) => String(f.value)),
          }),
        }
      );

      toast.success("Details updated successfully");
    } catch (error) {
      console.error("Error updating details:", error);
      toast.error("Failed to update details");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token || !userId) {
    return (
      <div className="min-h-screen w-full bg-brand-bg flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-xl font-semibold text-brand-text mb-2">
          Invalid Link
        </h2>
        <p className="text-brand-text-light text-center">
          This link is missing a valid token or user. Please use the link
          shared with you.
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full bg-brand-bg flex flex-col"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div className="w-full bg-white px-6 py-5 border-b border-brand-border">
        <h1 className="text-lg font-semibold text-brand-text">
          Update Details
        </h1>
        <p className="text-sm text-brand-text-light mt-1">
          Select your site, building and floor to update your details.
        </p>
      </div>

      <div className="flex-1 w-full p-4 md:p-6">
        <div className="bg-white rounded-xl p-4 md:p-6 space-y-4 w-full">
          <div>
            <Label className="text-xs font-medium mb-1 flex items-center gap-1.5 text-brand-text-light">
              <MapPin className="w-3.5 h-3.5" /> Site{" "}
              <span className="text-brand">*</span>
            </Label>
            <Select
              value={selectedSite}
              onValueChange={setSelectedSite}
              disabled={loadingSites}
            >
              <SelectTrigger className="h-11 rounded-lg text-sm border-brand-border bg-white">
                <SelectValue
                  placeholder={loadingSites ? "Loading..." : "Select site"}
                />
              </SelectTrigger>
              <SelectContent>
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id.toString()}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-medium mb-1 flex items-center gap-1.5 text-brand-text-light">
              <Building2 className="w-3.5 h-3.5" /> Building{" "}
              <span className="text-brand">*</span>
            </Label>
            <MuiMultiSelect
              options={buildings.map((b) => ({ label: b.name, value: b.id }))}
              value={selectedBuildings}
              onChange={setSelectedBuildings}
              disabled={!selectedSite || loadingBuildings}
              placeholder={
                !selectedSite
                  ? "Select site first"
                  : loadingBuildings
                  ? "Loading..."
                  : "Select building(s)"
              }
              maxHeight="90px"
            />
          </div>

          <div>
            <Label className="text-xs font-medium mb-1 flex items-center gap-1.5 text-brand-text-light">
              <Layers className="w-3.5 h-3.5" /> Floor{" "}
              <span className="text-brand">*</span>
            </Label>
            <MuiMultiSelect
              options={floors.map((f) => ({ label: f.name, value: f.id }))}
              value={selectedFloors}
              onChange={setSelectedFloors}
              disabled={selectedBuildings.length === 0 || loadingFloors}
              placeholder={
                selectedBuildings.length === 0
                  ? "Select building first"
                  : loadingFloors
                  ? "Loading..."
                  : "Select floor(s)"
              }
              maxHeight="90px"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="w-full h-11 rounded-lg bg-brand hover:bg-brand-hover text-white mt-2"
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViUpdateDetailsPage;
