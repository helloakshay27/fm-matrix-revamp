import React, { useState, useEffect, useCallback } from "react";
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
} from "@mui/material";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Building, Globe, Flag, Image, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useApiConfig } from "@/hooks/useApiConfig";

interface EditOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  organizationId: number;
  countriesDropdown: Array<{ id: number; name: string }>;
  canEdit: boolean;
}

interface OrganizationFormData {
  name: string;
  description: string;
  domain: string;
  sub_domain: string;
  front_domain: string;
  front_subdomain: string;
  country_id: string;
  active: boolean;
  logo: File | null;
  powered_by_logo: File | null;
  logoUrl?: string | null;
  poweredByLogoUrl?: string | null;
}

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
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
  disableScrollLock: true,
};

export const EditOrganizationModal: React.FC<EditOrganizationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  organizationId,
  countriesDropdown,
  canEdit,
}) => {
  const { getFullUrl, getAuthHeader } = useApiConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: "",
    description: "",
    domain: "",
    sub_domain: "",
    front_domain: "",
    front_subdomain: "",
    country_id: "",
    active: true,
    logo: null,
    powered_by_logo: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate domains like example.com and with more segments (e.g., app.example.co.in)
  const isValidDomain = (value: string) => {
    if (!value) return false;
    const domainRegex =
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
    return domainRegex.test(value.trim());
  };

  const fetchOrganizationData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        getFullUrl(`/organizations/${organizationId}.json`),
        {
          headers: {
            Authorization: getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();

        // Handle different response formats - the data might be directly in result or nested
        const org = result.organization || result.data || result;

        setFormData({
          name: org?.name || "",
          description: org?.description || "",
          domain: org?.domain || "",
          sub_domain: org?.sub_domain || "",
          front_domain: org?.front_domain || "",
          front_subdomain: org?.front_subdomain || "",
          country_id: org?.country_id ? org.country_id.toString() : "",
          active: org?.active !== undefined ? org.active : true,
          logo: null,
          powered_by_logo: null,
          logoUrl: org?.attachfile?.document_url || null,
          poweredByLogoUrl: org?.powered_by_attachfile?.document_url || null,
        });
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch organization data:", errorText);
        toast.error("Failed to fetch organization data");
      }
    } catch (error) {
      console.error("Error fetching organization:", error);
      toast.error("Error fetching organization data");
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeader, getFullUrl, organizationId]);

  // Fetch organization data when modal opens
  useEffect(() => {
    if (isOpen && organizationId) {
      fetchOrganizationData();
    }
  }, [isOpen, organizationId, fetchOrganizationData]);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Organization name is required";
    }
    if (!formData.domain.trim()) {
      newErrors.domain = "Main domain is required";
    }
    if (!formData.sub_domain.trim()) {
      newErrors.sub_domain = "Sub domain is required";
    }

    // Domain validation
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z]{2,})+$/;

    if (formData.domain && !domainRegex.test(formData.domain)) {
      newErrors.domain = "Please enter a valid main domain (e.g., example.com)";
    }

    // if (formData.front_domain && !domainRegex.test(formData.front_domain)) {
    //   newErrors.front_domain = "Please enter a valid frontend domain (e.g., www.example.com)";
    // }

    // if (
    //   formData.front_subdomain &&
    //   !domainRegex.test(formData.front_subdomain)
    // ) {
    //   newErrors.front_subdomain = "Please enter a valid frontend subdomain (e.g., portal.example.com)";
    // }

    setErrors(newErrors);
    console.warn("Validation errors:", newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the highlighted errors");
      return;
    }

    if (!canEdit) {
      toast.error("You do not have permission to edit organizations");
      return;
    }

    setIsSubmitting(true);

    const submitFormData = new FormData();
    submitFormData.append("organization[name]", formData.name);
    submitFormData.append("organization[description]", formData.description);
    submitFormData.append("organization[domain]", formData.domain);
    submitFormData.append("organization[sub_domain]", formData.sub_domain);
    submitFormData.append("organization[front_domain]", formData.front_domain);
    submitFormData.append(
      "organization[front_subdomain]",
      formData.front_subdomain
    );
    if (formData.country_id && formData.country_id !== "none") {
      submitFormData.append("organization[country_id]", formData.country_id);
    }
    submitFormData.append("organization[active]", formData.active.toString());

    if (formData.logo) {
      submitFormData.append("organization[logo]", formData.logo);
    }
    if (formData.powered_by_logo) {
      submitFormData.append(
        "organization[powered_by_logo]",
        formData.powered_by_logo
      );
    }

    try {
      const response = await fetch(
        getFullUrl(`/organizations/${organizationId}.json`),
        {
          method: "PUT",
          headers: {
            Authorization: getAuthHeader(),
          },
          body: submitFormData,
        }
      );

      if (response.ok) {
        toast.success("Organization updated successfully");
        onSuccess();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to update organization");
      }
    } catch (error) {
      console.error("Error updating organization:", error);
      toast.error("Error updating organization");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        logo: file,
        logoUrl: URL.createObjectURL(file),
      });
    }
  };

  const handlePoweredByLogoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        powered_by_logo: file,
        poweredByLogoUrl: URL.createObjectURL(file),
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      domain: "",
      sub_domain: "",
      front_domain: "",
      front_subdomain: "",
      country_id: "",
      active: true,
      logo: null,
      powered_by_logo: null,
      logoUrl: null,
      poweredByLogoUrl: null,
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={false}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white z-50"
        aria-describedby="edit-organization-dialog-description"
      >
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            EDIT ORGANIZATION
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <div id="edit-organization-dialog-description" className="sr-only">
            Edit organization details including name, description, country,
            domain configuration, and logos
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
              <div className="text-gray-600">Loading organization data...</div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-sm font-medium text-[#C72030] mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <TextField
                  label="Organization Name"
                  placeholder="Enter organization name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name)
                      setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                    sx: { "& .MuiFormLabel-asterisk": { color: "#BD2828" } },
                  }}
                  InputProps={{ sx: fieldStyles }}
                  required
                  disabled={isSubmitting}
                  error={!!errors.name}
                  helperText={errors.name}
                />

                <FormControl fullWidth variant="outlined">
                  <InputLabel
                    shrink
                    sx={{ "& .MuiFormLabel-asterisk": { color: "#BD2828" } }}
                  >
                    Country
                  </InputLabel>
                  <MuiSelect
                    value={formData.country_id}
                    onChange={(e) =>
                      setFormData({ ...formData, country_id: e.target.value })
                    }
                    label="Country"
                    displayEmpty
                    MenuProps={selectMenuProps}
                    sx={fieldStyles}
                    disabled={isSubmitting}
                  >
                    <MenuItem value="">
                      <em>Select Country</em>
                    </MenuItem>
                    {countriesDropdown.map((country) => (
                      <MenuItem key={country.id} value={country.id.toString()}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>

              <div className="mt-6">
                <TextField
                  label="Description"
                  placeholder="Enter organization description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  fullWidth
                  variant="outlined"
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
                  InputProps={{ sx: fieldStyles }}
                  multiline
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mt-6">
                <div className="space-y-1">
                  <span className="text-sm font-medium">Status</span>
                  <p className="text-xs text-gray-600">
                    Set whether this organization is active or inactive
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, active: checked })
                    }
                    disabled={isSubmitting}
                  />
                  <Badge variant={formData.active ? "default" : "secondary"}>
                    {formData.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Domain Configuration Section */}
            <div>
              <h3 className="text-sm font-medium text-[#C72030] mb-4">
                Domain Configuration
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <TextField
                  label="Main Domain"
                  placeholder="example.com"
                  value={formData.domain}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, domain: val });
                    setErrors((prev) => ({
                      ...prev,
                      domain: isValidDomain(val) ? "" : prev.domain,
                    }));
                  }}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                    required: true,
                    sx: { "& .MuiFormLabel-asterisk": { color: "#BD2828" } },
                  }}
                  InputProps={{ sx: fieldStyles }}
                  disabled={isSubmitting}
                  required
                  error={!!errors.domain}
                  helperText={
                    errors.domain || "Enter a valid domain (e.g., example.com)"
                  }
                />

                <TextField
                  label="Sub Domain"
                  placeholder="app.example.com"
                  value={formData.sub_domain}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, sub_domain: val });
                    setErrors((prev) => ({
                      ...prev,
                      sub_domain: "",
                    }));
                  }}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                    required: true,
                    sx: { "& .MuiFormLabel-asterisk": { color: "#BD2828" } },
                  }}
                  InputProps={{ sx: fieldStyles }}
                  disabled={isSubmitting}
                  required
                  error={!!errors.sub_domain}
                  helperText={
                    errors.sub_domain ||
                    "Enter subdomain (e.g., app.example.com)"
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <TextField
                  label="Frontend Domain"
                  placeholder="www.example.com"
                  value={formData.front_domain}
                  onChange={(e) =>
                    setFormData({ ...formData, front_domain: e.target.value })
                  }
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                    sx: { "& .MuiFormLabel-asterisk": { color: "#BD2828" } },
                  }}
                  InputProps={{ sx: fieldStyles }}
                  disabled={isSubmitting}
                  helperText="Enter frontend domain (e.g., www.example.com)"
                />

                <TextField
                  label="Frontend Subdomain"
                  placeholder="portal.example.com"
                  value={formData.front_subdomain}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      front_subdomain: e.target.value,
                    })
                  }
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                    sx: { "& .MuiFormLabel-asterisk": { color: "#BD2828" } },
                  }}
                  InputProps={{ sx: fieldStyles }}
                  disabled={isSubmitting}
                  helperText="Enter frontend subdomain (e.g., portal.example.com)"
                />
              </div>
            </div>

            {/* Logo Upload Section */}
            <div>
              <h3 className="text-sm font-medium text-[#C72030] mb-4">
                Logo Upload
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="text-sm font-medium">Organization Logo</span>
                  <input
                    type="file"
                    onChange={handleLogoChange}
                    accept="image/*"
                    disabled={isSubmitting}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#BD2828] file:text-white hover:file:bg-[#a52121]"
                  />
                  {(formData.logoUrl || formData.logo) && (
                    <div className="flex items-center gap-2 mt-2">
                      <img
                        src={
                          formData.logoUrl ||
                          (formData.logo
                            ? URL.createObjectURL(formData.logo)
                            : "")
                        }
                        alt="Organization Logo Preview"
                        className="w-16 h-16 object-contain border rounded shadow"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            logo: null,
                            logoUrl: null,
                          })
                        }
                        className="h-6 w-6 p-0"
                        title="Remove logo"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">Powered By Logo</span>
                  <input
                    type="file"
                    onChange={handlePoweredByLogoChange}
                    accept="image/*"
                    disabled={isSubmitting}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#BD2828] file:text-white hover:file:bg-[#a52121]"
                  />
                  {(formData.poweredByLogoUrl || formData.powered_by_logo) && (
                    <div className="flex items-center gap-2 mt-2">
                      <img
                        src={
                          formData.poweredByLogoUrl ||
                          (formData.powered_by_logo
                            ? URL.createObjectURL(formData.powered_by_logo)
                            : "")
                        }
                        alt="Powered By Logo Preview"
                        className="w-16 h-16 object-contain border rounded shadow"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            powered_by_logo: null,
                            poweredByLogoUrl: null,
                          })
                        }
                        className="h-6 w-6 p-0"
                        title="Remove powered by logo"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#BD2828] border border-transparent rounded-lg p-4 mt-4 text-white">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Image className="w-4 h-4 text-white" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white">
                      Upload Guidelines
                    </p>
                    <p className="text-xs text-white/90">
                      Recommended formats: PNG, JPG, SVG • Max size: 2MB • Min
                      dimensions: 200x200px
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            className="px-6 py-2"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !canEdit || isLoading}
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90 px-6 py-2"
          >
            {isSubmitting ? "Updating..." : "Update Organization"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
