import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  siteService,
  SiteFormData,
  SiteData,
  CompanyOption,
  HeadquarterOption,
  RegionOption,
} from "@/services/siteService";
import { useApiConfig } from "@/hooks/useApiConfig";
import { toast } from "sonner";

interface AddSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSiteAdded: () => void;
  editingSite?: SiteData | null;
}

export const AddSiteModal: React.FC<AddSiteModalProps> = ({
  isOpen,
  onClose,
  onSiteAdded,
  editingSite,
}) => {
  const { getFullUrl, getAuthHeader } = useApiConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [headquarters, setHeadquarters] = useState<HeadquarterOption[]>([]);
  const [regions, setRegions] = useState<RegionOption[]>([]);
  const [filteredRegions, setFilteredRegions] = useState<RegionOption[]>([]);

  const [formData, setFormData] = useState<SiteFormData>({
    name: "",
    company_id: 0,
    headquarter_id: 0,
    region_id: 0,
    latitude: "",
    longitude: "",
    geofence_range: "",
    address: "",
    state: "",
    city: "",
    district: "",
    zone_id: "",
  });

  // Fetch dropdown data on component mount
  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen]);

  // Reset form when editing site changes
  useEffect(() => {
    if (editingSite) {
      setFormData({
        name: editingSite.name || "",
        company_id: editingSite.company_id || 0,
        headquarter_id: editingSite.headquarter_id || 0,
        region_id: editingSite.region_id || 0,
        latitude: editingSite.latitude || "",
        longitude: editingSite.longitude || "",
        geofence_range: editingSite.geofence_range || "",
        address: editingSite.address || "",
        state: editingSite.state || "",
        city: editingSite.city || "",
        district: editingSite.district || "",
        zone_id: editingSite.zone_id || "",
      });
    } else {
      // Reset form for new site
      setFormData({
        name: "",
        company_id: 0,
        headquarter_id: 0,
        region_id: 0,
        latitude: "",
        longitude: "",
        geofence_range: "",
        address: "",
        state: "",
        city: "",
        district: "",
        zone_id: "",
      });
    }
  }, [editingSite, isOpen]);

  // Show all regions without filtering
  useEffect(() => {
    console.log("Setting all regions:", regions.length);
    console.log("First few regions:", regions.slice(0, 3));
    setFilteredRegions(regions);
  }, [regions]);

  const fetchDropdownData = async () => {
    setIsLoadingDropdowns(true);
    try {
      console.log("Starting to fetch dropdown data...");

      // Fetch companies
      const companiesResponse = await fetch(
        getFullUrl("/pms/company_setups/company_index.json"),
        {
          method: "GET",
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );

      let companiesData: CompanyOption[] = [];
      if (companiesResponse.ok) {
        const companiesResult = await companiesResponse.json();
        console.log("Companies API response:", companiesResult);

        if (
          companiesResult &&
          companiesResult.code === 200 &&
          Array.isArray(companiesResult.data)
        ) {
          companiesData = companiesResult.data;
        } else if (
          companiesResult &&
          Array.isArray(companiesResult.companies)
        ) {
          companiesData = companiesResult.companies;
        } else if (Array.isArray(companiesResult)) {
          companiesData = companiesResult;
        }
      } else {
        console.error(
          "Failed to fetch companies:",
          companiesResponse.statusText
        );
        toast.error("Failed to fetch companies");
      }

      // Fetch headquarters
      const headquartersResponse = await fetch(
        getFullUrl("/headquarters.json"),
        {
          headers: {
            Authorization: getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );

      let headquartersData: HeadquarterOption[] = [];
      if (headquartersResponse.ok) {
        const headquartersResult = await headquartersResponse.json();
        console.log("headquarters API response:", headquartersResult);

        if (Array.isArray(headquartersResult)) {
          headquartersData = headquartersResult;
        } else if (
          headquartersResult &&
          headquartersResult.headquarters &&
          Array.isArray(headquartersResult.headquarters)
        ) {
          headquartersData = headquartersResult.headquarters;
        } else if (
          headquartersResult &&
          headquartersResult.data &&
          Array.isArray(headquartersResult.data)
        ) {
          headquartersData = headquartersResult.data;
        }
      } else {
        console.error(
          "Failed to fetch headquarters:",
          headquartersResponse.statusText
        );
        toast.error("Failed to fetch headquarters");
      }

      // Fetch regions
      const regionsResponse = await fetch(getFullUrl("/pms/regions.json"), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      let regionsData: RegionOption[] = [];
      if (regionsResponse.ok) {
        const regionsResult = await regionsResponse.json();
        console.log("Regions API response:", regionsResult);

        if (Array.isArray(regionsResult)) {
          regionsData = regionsResult;
        } else if (
          regionsResult &&
          regionsResult.regions &&
          Array.isArray(regionsResult.regions)
        ) {
          regionsData = regionsResult.regions;
        } else if (
          regionsResult &&
          regionsResult.data &&
          Array.isArray(regionsResult.data)
        ) {
          regionsData = regionsResult.data;
        }
      } else {
        console.error("Failed to fetch regions:", regionsResponse.statusText);
        toast.error("Failed to fetch regions");
      }

      console.log("Fetched dropdown data counts:", {
        companies: companiesData?.length || 0,
        headquarters: headquartersData?.length || 0,
        regions: regionsData?.length || 0,
        activeRegions: regionsData?.filter((r) => r.active)?.length || 0,
      });

      // Log sample data to check structure
      console.log("Sample data:", {
        firstCompany: companiesData?.[0],
        firstHeadquarter: headquartersData?.[0],
        firstRegion: regionsData?.[0],
      });

      setCompanies(companiesData || []);
      setHeadquarters(headquartersData || []);
      setRegions(regionsData || []);
      setFilteredRegions(regionsData?.filter((r) => r.active) || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      toast.error("Error loading form data");
    } finally {
      setIsLoadingDropdowns(false);
    }
  };

  const handleInputChange = (
    field: keyof SiteFormData,
    value: string | number
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Reset dependent fields when parent changes
      if (field === "company_id") {
        newData.region_id = 0; // Reset region when company changes
      }
      if (field === "headquarter_id") {
        newData.region_id = 0; // Reset region when headquarter changes
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.company_id || !formData.headquarter_id) {
      return;
    }

    setIsLoading(true);

    try {
      let result;
      if (editingSite && editingSite.id) {
        result = await siteService.updateSite(editingSite.id, formData);
      } else {
        result = await siteService.createSite(formData);
      }

      if (result.success) {
        onSiteAdded();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting site:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingSite ? "Edit Site" : "Add New Site"}
          </DialogTitle>
        </DialogHeader>

        {isLoadingDropdowns ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <p>Loading form data...</p>
            <div className="text-xs text-gray-400 mt-2">
              Debug: Companies: {companies.length}, HQ: {headquarters.length},
              Regions: {regions.length}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Site Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter site name"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_id">Company *</Label>
                <Select
                  value={formData.company_id?.toString() || ""}
                  onValueChange={(value) => {
                    console.log("Company selected:", value);
                    handleInputChange("company_id", parseInt(value) || 0);
                  }}
                  disabled={isLoading || isLoadingDropdowns}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingDropdowns
                          ? "Loading companies..."
                          : companies.length === 0
                          ? "No companies available"
                          : "Select Company"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.length === 0 ? (
                      <SelectItem value="no-data" disabled>
                        No companies found
                      </SelectItem>
                    ) : (
                      companies.map((company) => (
                        <SelectItem
                          key={company.id}
                          value={company.id.toString()}
                        >
                          {company.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {!isLoadingDropdowns && (
                  <p className="text-xs text-gray-400">
                    {companies.length} companies loaded
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="headquarter_id">Headquarter *</Label>
                <Select
                  value={formData.headquarter_id?.toString() || ""}
                  onValueChange={(value) => {
                    console.log("Headquarter selected:", value);
                    handleInputChange("headquarter_id", parseInt(value) || 0);
                  }}
                  disabled={isLoading || isLoadingDropdowns}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingDropdowns
                          ? "Loading headquarters..."
                          : headquarters.length === 0
                          ? "No headquarters available"
                          : "Select Headquarter"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {headquarters.length === 0 ? (
                      <SelectItem value="no-data" disabled>
                        No headquarters found
                      </SelectItem>
                    ) : (
                      headquarters.map((hq) => (
                        <SelectItem key={hq.id} value={hq.id.toString()}>
                          {hq.country_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {!isLoadingDropdowns && (
                  <p className="text-xs text-gray-400">
                    {headquarters.length} headquarters loaded
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="region_id">Region *</Label>
                <Select
                  value={formData.region_id?.toString() || ""}
                  onValueChange={(value) => {
                    console.log("Region selected:", value);
                    handleInputChange("region_id", parseInt(value) || 0);
                  }}
                  disabled={isLoading || isLoadingDropdowns}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingDropdowns
                          ? "Loading regions..."
                          : filteredRegions.length === 0
                          ? "No regions available"
                          : "Select Region"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredRegions.length === 0 ? (
                      <SelectItem value="no-data" disabled>
                        No regions found
                      </SelectItem>
                    ) : (
                      filteredRegions.map((region) => (
                        <SelectItem
                          key={region.id}
                          value={region.id.toString()}
                        >
                          {region.name} (ID: {region.id})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {!isLoadingDropdowns && (
                  <p className="text-xs text-gray-400">
                    {filteredRegions.length} regions available
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zone_id">Zone ID</Label>
                <Input
                  id="zone_id"
                  value={formData.zone_id}
                  onChange={(e) => handleInputChange("zone_id", e.target.value)}
                  placeholder="Enter zone ID"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  value={formData.latitude}
                  onChange={(e) =>
                    handleInputChange("latitude", e.target.value)
                  }
                  placeholder="Enter latitude"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  value={formData.longitude}
                  onChange={(e) =>
                    handleInputChange("longitude", e.target.value)
                  }
                  placeholder="Enter longitude"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="geofence_range">Geofence Range</Label>
                <Input
                  id="geofence_range"
                  value={formData.geofence_range}
                  onChange={(e) =>
                    handleInputChange("geofence_range", e.target.value)
                  }
                  placeholder="Enter geofence range"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter address"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Enter state"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Enter city"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) =>
                    handleInputChange("district", e.target.value)
                  }
                  placeholder="Enter district"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  !formData.name ||
                  !formData.company_id ||
                  !formData.headquarter_id
                }
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingSite ? "Update Site" : "Create Site"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
