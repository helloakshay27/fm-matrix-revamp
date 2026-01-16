import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
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
  height: "45px",
  "& .MuiInputBase-root": {
    height: "45px",
  },
  "& .MuiInputBase-input": {
    padding: "12px 14px",
  },
  "& .MuiSelect-select": {
    padding: "12px 14px",
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
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
    // Boolean configuration fields
    skip_host_approval: false,
    survey_enabled: false,
    fitout_enabled: false,
    mailroom_enabled: false,
    create_breakdown_ticket: false,
    parking_enabled: false,
    default_visitor_pass: false,
    ecommerce_service_enabled: false,
    operational_audit_enabled: false,
    steps_enabled: false,
    transportation_enabled: false,
    business_card_enabled: false,
    visitor_enabled: false,
    govt_id_enabled: false,
    visitor_host_mandatory: false,
    attachfile: null,
  });

  // Filtered dropdown options based on selections
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyOption[]>(
    []
  );
  const [filteredHeadquarters, setFilteredHeadquarters] = useState<
    HeadquarterOption[]
  >([]);

  // Local preview for site image (single)
  const [siteImagePreviewUrl, setSiteImagePreviewUrl] = useState<string | null>(
    null
  );

  // Fetch dropdown data on component mount (moved below after declaration)

  // Reset form when editing site changes
  useEffect(() => {
    if (editingSite) {
      setFormData({
        name: editingSite.name || "",
        company_id: editingSite.company_id || 0,
        headquarter_id: editingSite.headquarter_id || 0,
        region_id:
          typeof editingSite.region_id === "string"
            ? parseInt(editingSite.region_id)
            : editingSite.region_id || 0,
        latitude:
          typeof editingSite.latitude === "number"
            ? editingSite.latitude.toString()
            : editingSite.latitude || "",
        longitude:
          typeof editingSite.longitude === "number"
            ? editingSite.longitude.toString()
            : editingSite.longitude || "",
        geofence_range:
          typeof editingSite.geofence_range === "number"
            ? editingSite.geofence_range.toString()
            : editingSite.geofence_range || "",
        address: editingSite.address || "",
        state: editingSite.state || "",
        city: editingSite.city || "",
        district: editingSite.district || "",
        zone_id:
          typeof editingSite.zone_id === "number"
            ? editingSite.zone_id.toString()
            : editingSite.zone_id || "",
        // Boolean configuration fields
        skip_host_approval: editingSite.skip_host_approval ?? false,
        survey_enabled: editingSite.survey_enabled ?? false,
        fitout_enabled: editingSite.fitout_enabled ?? false,
        mailroom_enabled: editingSite.mailroom_enabled ?? false,
        create_breakdown_ticket: editingSite.create_breakdown_ticket ?? false,
        parking_enabled: editingSite.parking_enabled ?? false,
        default_visitor_pass: editingSite.default_visitor_pass ?? false,
        ecommerce_service_enabled:
          editingSite.ecommerce_service_enabled ?? false,
        operational_audit_enabled:
          editingSite.operational_audit_enabled ?? false,
        steps_enabled: editingSite.steps_enabled ?? false,
        transportation_enabled: editingSite.transportation_enabled ?? false,
        business_card_enabled: editingSite.business_card_enabled ?? false,
        visitor_enabled: editingSite.visitor_enabled ?? false,
        govt_id_enabled: editingSite.govt_id_enabled ?? false,
        visitor_host_mandatory: editingSite.visitor_host_mandatory ?? false,
        attachfile: null,
      });
      // Show preselected image preview if available
      // Support both array and object for attachfile
      if (Array.isArray(editingSite.attachfile) && editingSite.attachfile.length > 0 && editingSite.attachfile[0].url) {
        setSiteImagePreviewUrl(editingSite.attachfile[0].url);
      } else if (editingSite.attachfile && editingSite.attachfile.document_url) {
        setSiteImagePreviewUrl(editingSite.attachfile.document_url);
      } else {
        setSiteImagePreviewUrl(null);
      }
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
        // Boolean configuration fields
        skip_host_approval: false,
        survey_enabled: false,
        fitout_enabled: false,
        mailroom_enabled: false,
        create_breakdown_ticket: false,
        parking_enabled: false,
        default_visitor_pass: false,
        ecommerce_service_enabled: false,
        operational_audit_enabled: false,
        steps_enabled: false,
        transportation_enabled: false,
        business_card_enabled: false,
        visitor_enabled: false,
        govt_id_enabled: false,
        visitor_host_mandatory: false,
        attachfile: null,
      });
      setSiteImagePreviewUrl(null);
    }
  }, [editingSite, isOpen]);

  // Country dropdown should not auto-select on company change; keep all countries available
  useEffect(() => {
    setFilteredHeadquarters(headquarters);
  }, [formData.company_id, headquarters]);

  // Filter regions based on selected company
  useEffect(() => {
    if (formData.company_id) {
      const filtered = regions.filter(
        (region) => region.company_id === formData.company_id
      );
      setFilteredRegions(filtered);

      // Reset region if current selection is not valid
      if (
        formData.region_id &&
        !filtered.find((r) => r.id === formData.region_id)
      ) {
        setFormData((prev) => ({ ...prev, region_id: 0 }));
      }
    } else {
      setFilteredRegions([]);
    }
  }, [formData.company_id, regions, formData.region_id]);

  // Set all companies as available initially
  useEffect(() => {
    setFilteredCompanies(companies);
  }, [companies]);

  const fetchDropdownData = React.useCallback(async () => {
    setIsLoadingDropdowns(true);
    try {
      console.warn("Starting to fetch dropdown data...");

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
        console.warn("Companies API response:", companiesResult);

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
        console.warn("headquarters API response:", headquartersResult);

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
        console.warn("Regions API response:", regionsResult);

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

      console.warn("Fetched dropdown data counts:", {
        companies: companiesData?.length || 0,
        headquarters: headquartersData?.length || 0,
        regions: regionsData?.length || 0,
        activeRegions: regionsData?.filter((r) => r.active)?.length || 0,
      });

      // Log sample data to check structure
      console.warn("Sample data:", {
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
  }, [getFullUrl, getAuthHeader]);

  // Fetch dropdown data on component mount
  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen, fetchDropdownData]);

  const handleInputChange = async (
    field: keyof SiteFormData,
    value: string | number
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Reset dependent fields when parent changes
      if (field === "company_id") {
        newData.region_id = 0; // Reset region when company changes
        newData.headquarter_id = 0; // Reset headquarter when company changes
      }
      return newData;
    });

    // If company_id changes, fetch headquarters
    if (field === "company_id") {
      if (value && Number(value) > 0) {
        try {
          const apiUrl = getFullUrl(
            `/headquarters.json?q[company_setup_id_eq]=${value}`
          );
          const response = await fetch(apiUrl, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: getAuthHeader(),
            },
          });
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data.headquarters)) {
              setFilteredHeadquarters(data.headquarters);
            } else if (Array.isArray(data)) {
              setFilteredHeadquarters(data);
            } else {
              setFilteredHeadquarters([]);
            }
          } else {
            setFilteredHeadquarters([]);
          }
        } catch (error) {
          setFilteredHeadquarters([]);
        }
      } else {
        setFilteredHeadquarters([]);
      }
    }
  };

  const handleCheckboxChange = (
    field: keyof SiteFormData,
    checked: boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Country (headquarter_id) is optional
    if (!formData.name || !formData.company_id) {
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
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white z-50"
        aria-describedby="add-site-dialog-description"
      >
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
            {editingSite
              ? "Edit site details"
              : "Add new site details including name, company, country, region, and location information"}
          </div>
        </DialogHeader>
        {/* Console log for edit preselected data */}
        {editingSite && (
          <>{console.log('Preselected edit data:', editingSite)}</>
        )}

        {isLoadingDropdowns ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <p>Loading form data...</p>
            {/* <div className="text-xs text-gray-400 mt-2">
              Debug: Companies: {companies.length}, Countries:{" "}
              {headquarters.length}, Regions: {regions.length}
            </div> */}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-medium text-[#C72030] mb-4">
                Basic Information
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <TextField
                  label="Site Name"
                  placeholder="Enter site name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                    sx: { "& .MuiFormLabel-asterisk": { color: "#C72030" } },
                  }}
                  InputProps={{ sx: fieldStyles }}
                  required
                  disabled={isLoading}
                />

                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Company</InputLabel>
                  <MuiSelect
                    value={formData.company_id?.toString() || ""}
                    onChange={(e) => {
                      handleInputChange(
                        "company_id",
                        parseInt(e.target.value as string) || 0
                      );
                    }}
                    label="Company"
                    displayEmpty
                    MenuProps={selectMenuProps}
                    sx={fieldStyles}
                    disabled={isLoading || isLoadingDropdowns}
                  >
                    <MenuItem value="">
                      <em>
                        {isLoadingDropdowns
                          ? "Loading companies..."
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
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Country</InputLabel>
                  <MuiSelect
                    value={formData.headquarter_id?.toString() || ""}
                    onChange={(e) => {
                      handleInputChange(
                        "headquarter_id",
                        parseInt(e.target.value as string) || 0
                      );
                    }}
                    label="Country"
                    displayEmpty
                    MenuProps={selectMenuProps}
                    sx={fieldStyles}
                    disabled={
                      isLoading || isLoadingDropdowns || !formData.company_id
                    }
                  >
                    <MenuItem value="">
                      <em>
                        {filteredHeadquarters.length === 0
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
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Region</InputLabel>
                  <MuiSelect
                    value={formData.region_id?.toString() || ""}
                    onChange={(e) => {
                      handleInputChange(
                        "region_id",
                        parseInt(e.target.value as string) || 0
                      );
                    }}
                    label="Region"
                    displayEmpty
                    MenuProps={selectMenuProps}
                    sx={fieldStyles}
                    disabled={
                      isLoading || isLoadingDropdowns || !formData.company_id
                    }
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
              <h3 className="text-sm font-medium text-[#C72030] mb-4">
                Location Information
              </h3>

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
                  onChange={(e) =>
                    handleInputChange("latitude", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleInputChange("longitude", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleInputChange("geofence_range", e.target.value)
                  }
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
              <h3 className="text-sm font-medium text-[#C72030] mb-4">
                Address Information
              </h3>

              <div className="grid grid-cols-1 gap-6 mb-6">
                <TextField
                  label="Address"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "auto !important",
                      padding: "2px !important",
                      display: "flex",
                    },
                    "& .MuiInputBase-input[aria-hidden='true']": {
                      flex: 0,
                      width: 0,
                      height: 0,
                      padding: "0 !important",
                      margin: 0,
                      display: "none",
                    },
                    "& .MuiInputBase-input": {
                      resize: "none !important",
                    },
                  }}
                  multiline
                  rows={2}
                  disabled={isLoading}
                />

                {/* Single image upload */}
                <div className="space-y-2 mb-2">
                  <span className="text-sm font-medium text-[#C72030] ">
                    Site Image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file =
                        e.target.files && e.target.files[0]
                          ? e.target.files[0]
                          : null;
                      // enforce single image and 5MB max similar to AddCompanyModal
                      if (file) {
                        if (file.size > 10 * 1024 * 1024) {
                          toast.error(
                            "Image file size should be less than 10MB"
                          );
                          return;
                        }
                        // cleanup previous preview
                        if (siteImagePreviewUrl) {
                          URL.revokeObjectURL(siteImagePreviewUrl);
                        }
                        const url = URL.createObjectURL(file);
                        setSiteImagePreviewUrl(url);
                        setFormData((prev) => ({ ...prev, attachfile: file }));
                        // clear input so same file can be selected again
                        e.currentTarget.value = "";
                      } else {
                        if (siteImagePreviewUrl)
                          URL.revokeObjectURL(siteImagePreviewUrl);
                        setSiteImagePreviewUrl(null);
                        setFormData((prev) => ({ ...prev, attachfile: null }));
                      }
                    }}
                    disabled={isLoading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#BD2828] file:text-white hover:file:bg-[#a52121]"
                  />

                  {(siteImagePreviewUrl || formData.attachfile) && (
                    <div className="flex items-center gap-3 flex-wrap">
                      {formData.attachfile && (
                        <div className="flex items-center gap-2 text-xs bg-green-50 text-green-700 border border-green-200 rounded px-2 py-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          {formData.attachfile.name}
                        </div>
                      )}
                      {siteImagePreviewUrl && (
                        <div className="relative">
                          <img
                            src={siteImagePreviewUrl}
                            alt="Site Image Preview"
                            className="h-16 w-16 object-cover border border-gray-200 rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (siteImagePreviewUrl)
                                URL.revokeObjectURL(siteImagePreviewUrl);
                              setSiteImagePreviewUrl(null);
                              setFormData((prev) => ({
                                ...prev,
                                attachfile: null,
                              }));
                            }}
                            className="absolute -top-1.5 -right-1.5 bg-white text-[#BD2828] border border-gray-200 rounded-full w-5 h-5 text-xs leading-none flex items-center justify-center shadow hover:bg-[#BD2828] hover:text-white"
                            aria-label="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
                  label="District"
                  placeholder="Enter district"
                  value={formData.district}
                  onChange={(e) =>
                    handleInputChange("district", e.target.value)
                  }
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
              </div>
            </div>

            {/* Site Configuration */}
            <div>
              <h3 className="text-sm font-medium text-[#C72030] mb-4">
                Site Configuration
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.skip_host_approval ?? false}
                      onChange={(e) =>
                        handleCheckboxChange(
                          "skip_host_approval",
                          e.target.checked
                        )
                      }
                      disabled={isLoading}
                    />
                  }
                  label="Skip Host Approval"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.survey_enabled ?? false}
                      onChange={(e) =>
                        handleCheckboxChange("survey_enabled", e.target.checked)
                      }
                      disabled={isLoading}
                    />
                  }
                  label="Survey Enabled"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.fitout_enabled ?? false}
                      onChange={(e) =>
                        handleCheckboxChange("fitout_enabled", e.target.checked)
                      }
                      disabled={isLoading}
                    />
                  }
                  label="Fitout Enabled"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.mailroom_enabled ?? false}
                      onChange={(e) =>
                        handleCheckboxChange(
                          "mailroom_enabled",
                          e.target.checked
                        )
                      }
                      disabled={isLoading}
                    />
                  }
                  label="Mailroom Enabled"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.create_breakdown_ticket ?? false}
                      onChange={(e) =>
                        handleCheckboxChange(
                          "create_breakdown_ticket",
                          e.target.checked
                        )
                      }
                      disabled={isLoading}
                    />
                  }
                  label="Create Breakdown Ticket"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.parking_enabled ?? false}
                      onChange={(e) =>
                        handleCheckboxChange(
                          "parking_enabled",
                          e.target.checked
                        )
                      }
                      disabled={isLoading}
                    />
                  }
                  label="Parking Enabled"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.default_visitor_pass ?? false}
                      onChange={(e) =>
                        handleCheckboxChange(
                          "default_visitor_pass",
                          e.target.checked
                        )
                      }
                      disabled={isLoading}
                    />
                  }
                  label="Default Visitor Pass"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.ecommerce_service_enabled ?? false}
                      onChange={(e) =>
                        handleCheckboxChange(
                          "ecommerce_service_enabled",
                          e.target.checked
                        )
                      }
                      disabled={isLoading}
                    />
                  }
                  label="Ecommerce Service Enabled"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.operational_audit_enabled ?? false}
                      onChange={(e) =>
                        handleCheckboxChange(
                          "operational_audit_enabled",
                          e.target.checked
                        )
                      }
                      disabled={isLoading}
                    />
                  }
                  label="Operational Audit Enabled"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.steps_enabled ?? false}
                      onChange={(e) =>
                        handleCheckboxChange("steps_enabled", e.target.checked)
                      }
                      disabled={isLoading}
                    />
                  }
                  label="Steps Enabled"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.transportation_enabled ?? false}
                      onChange={(e) =>
                        handleCheckboxChange(
                          "transportation_enabled",
                          e.target.checked
                        )
                      }
                      disabled={isLoading}
                    />
                  }
                  label="Transportation Enabled"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.business_card_enabled ?? false}
                      onChange={(e) =>
                        handleCheckboxChange(
                          "business_card_enabled",
                          e.target.checked
                        )
                      }
                      disabled={isLoading}
                    />
                  }
                  label="Business Card Enabled"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.visitor_enabled ?? false}
                      onChange={(e) =>
                        handleCheckboxChange(
                          "visitor_enabled",
                          e.target.checked
                        )
                      }
                      disabled={isLoading}
                    />
                  }
                  label="Visitor Enabled"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.govt_id_enabled ?? false}
                      onChange={(e) =>
                        handleCheckboxChange(
                          "govt_id_enabled",
                          e.target.checked
                        )
                      }
                      disabled={isLoading}
                    />
                  }
                  label="Govt ID Enabled"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.visitor_host_mandatory ?? false}
                      onChange={(e) =>
                        handleCheckboxChange(
                          "visitor_host_mandatory",
                          e.target.checked
                        )
                      }
                      disabled={isLoading}
                    />
                  }
                  label="Visitor Host Mandatory"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t">
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
                disabled={isLoading || !formData.name || !formData.company_id}
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
