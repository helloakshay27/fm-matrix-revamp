import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { Loader2, X } from "lucide-react";
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

const fieldStyles = {
  height: '45px',
  '& .MuiInputBase-root': {
    height: '45px',
  },
  '& .MuiInputBase-input': {
    padding: '12px 14px',
  },
  '& .MuiSelect-select': {
    padding: '12px 14px',
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

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

  // Filtered dropdown options based on selections
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyOption[]>([]);
  const [filteredHeadquarters, setFilteredHeadquarters] = useState<HeadquarterOption[]>([]);

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
        region_id: typeof editingSite.region_id === 'string' ? parseInt(editingSite.region_id) : editingSite.region_id || 0,
        latitude: typeof editingSite.latitude === 'number' ? editingSite.latitude.toString() : editingSite.latitude || "",
        longitude: typeof editingSite.longitude === 'number' ? editingSite.longitude.toString() : editingSite.longitude || "",
        geofence_range: typeof editingSite.geofence_range === 'number' ? editingSite.geofence_range.toString() : editingSite.geofence_range || "",
        address: editingSite.address || "",
        state: editingSite.state || "",
        city: editingSite.city || "",
        district: editingSite.district || "",
        zone_id: typeof editingSite.zone_id === 'number' ? editingSite.zone_id.toString() : editingSite.zone_id || "",
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

  // Filter companies based on selected headquarter (country)
  useEffect(() => {
    if (formData.headquarter_id) {
      const filtered = companies.filter(company => 
        company.country_id === formData.headquarter_id
      );
      setFilteredCompanies(filtered);
      
      // Reset company and region if current selection is not valid
      if (formData.company_id && !filtered.find(c => c.id === formData.company_id)) {
        setFormData(prev => ({ ...prev, company_id: 0, region_id: 0 }));
      }
    } else {
      setFilteredCompanies(companies);
    }
  }, [formData.headquarter_id, companies]);

  // Filter regions based on selected company
  useEffect(() => {
    if (formData.company_id) {
      const filtered = regions.filter(region => 
        region.company_id === formData.company_id
      );
      setFilteredRegions(filtered);
      
      // Reset region if current selection is not valid
      if (formData.region_id && !filtered.find(r => r.id === formData.region_id)) {
        setFormData(prev => ({ ...prev, region_id: 0 }));
      }
    } else {
      setFilteredRegions([]);
    }
  }, [formData.company_id, regions]);

  // Set all headquarters as available (these are countries)
  useEffect(() => {
    setFilteredHeadquarters(headquarters);
  }, [headquarters]);

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

      // Fetch headquarters (countries)
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
          "Failed to fetch countries:",
          headquartersResponse.statusText
        );
        toast.error("Failed to fetch countries");
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
      if (field === "headquarter_id") {
        newData.company_id = 0; // Reset company when country changes
        newData.region_id = 0; // Reset region when country changes
      }
      if (field === "company_id") {
        newData.region_id = 0; // Reset region when company changes
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
    <Dialog open={isOpen} onOpenChange={handleClose} modal={false}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white z-50" aria-describedby="add-site-dialog-description">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {editingSite ? "EDIT SITE" : "ADD NEW SITE"}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <div id="add-site-dialog-description" className="sr-only">
            {editingSite ? "Edit site details" : "Add new site details including name, company, country, region, and location information"}
          </div>
        </DialogHeader>

        {isLoadingDropdowns ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <p>Loading form data...</p>
            <div className="text-xs text-gray-400 mt-2">
              Debug: Companies: {companies.length}, Countries: {headquarters.length},
              Regions: {regions.length}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-medium text-[#C72030] mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <TextField
                  label="Site Name"
                  placeholder="Enter site name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  required
                  disabled={isLoading}
                />

                <FormControl fullWidth variant="outlined" required>
                  <InputLabel shrink>Country</InputLabel>
                  <MuiSelect
                    value={formData.headquarter_id?.toString() || ""}
                    onChange={(e) => {
                      console.log("Country selected:", e.target.value);
                      handleInputChange("headquarter_id", parseInt(e.target.value as string) || 0);
                    }}
                    label="Country"
                    displayEmpty
                    MenuProps={selectMenuProps}
                    sx={fieldStyles}
                    disabled={isLoading || isLoadingDropdowns}
                  >
                    <MenuItem value="">
                      <em>
                        {isLoadingDropdowns
                          ? "Loading countries..."
                          : filteredHeadquarters.length === 0
                          ? "No countries available"
                          : "Select Country"}
                      </em>
                    </MenuItem>
                    {filteredHeadquarters.map((hq) => (
                      <MenuItem key={hq.id} value={hq.id.toString()}>
                        {hq.country_name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-6">
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel shrink>Company</InputLabel>
                  <MuiSelect
                    value={formData.company_id?.toString() || ""}
                    onChange={(e) => {
                      console.log("Company selected:", e.target.value);
                      handleInputChange("company_id", parseInt(e.target.value as string) || 0);
                    }}
                    label="Company"
                    displayEmpty
                    MenuProps={selectMenuProps}
                    sx={fieldStyles}
                    disabled={isLoading || isLoadingDropdowns || !formData.headquarter_id}
                  >
                    <MenuItem value="">
                      <em>
                        {!formData.headquarter_id
                          ? "Select country first"
                          : filteredCompanies.length === 0
                          ? "No companies available"
                          : "Select Company"}
                      </em>
                    </MenuItem>
                    {filteredCompanies.map((company) => (
                      <MenuItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Region</InputLabel>
                  <MuiSelect
                    value={formData.region_id?.toString() || ""}
                    onChange={(e) => {
                      console.log("Region selected:", e.target.value);
                      handleInputChange("region_id", parseInt(e.target.value as string) || 0);
                    }}
                    label="Region"
                    displayEmpty
                    MenuProps={selectMenuProps}
                    sx={fieldStyles}
                    disabled={isLoading || isLoadingDropdowns || !formData.company_id}
                  >
                    <MenuItem value="">
                      <em>
                        {!formData.company_id
                          ? "Select company first"
                          : filteredRegions.length === 0
                          ? "No regions available"
                          : "Select Region"}
                      </em>
                    </MenuItem>
                    {filteredRegions.map((region) => (
                      <MenuItem key={region.id} value={region.id.toString()}>
                        {region.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h3 className="text-sm font-medium text-[#C72030] mb-4">Location Information</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <TextField
                  label="Zone ID"
                  placeholder="Enter zone ID"
                  value={formData.zone_id}
                  onChange={(e) => handleInputChange("zone_id", e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  disabled={isLoading}
                />

                <TextField
                  label="Latitude"
                  placeholder="Enter latitude"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange("latitude", e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  disabled={isLoading}
                />

                <TextField
                  label="Longitude"
                  placeholder="Enter longitude"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange("longitude", e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  disabled={isLoading}
                />

                <TextField
                  label="Geofence Range"
                  placeholder="Enter geofence range"
                  value={formData.geofence_range}
                  onChange={(e) => handleInputChange("geofence_range", e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-sm font-medium text-[#C72030] mb-4">Address Information</h3>
              
              <div className="grid grid-cols-1 gap-6 mb-6">
                <TextField
                  label="Address"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  multiline
                  rows={2}
                  disabled={isLoading}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                <TextField
                  label="State"
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  disabled={isLoading}
                />

                <TextField
                  label="City"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  disabled={isLoading}
                />

                <TextField
                  label="District"
                  placeholder="Enter district"
                  value={formData.district}
                  onChange={(e) => handleInputChange("district", e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
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
                className="bg-primary text-primary-foreground hover:bg-primary/90"
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
