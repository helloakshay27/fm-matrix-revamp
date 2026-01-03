import React, { useState } from "react";
import { Dialog as MuiDialog, DialogTitle as MuiDialogTitle, DialogContent as MuiDialogContent, DialogActions as MuiDialogActions } from "@mui/material";
import { Button as MuiButton } from "@mui/material";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Building, Globe, Flag, Image } from "lucide-react";
import { toast } from "sonner";
import { useApiConfig } from "@/hooks/useApiConfig";

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  organizationsDropdown: Array<{ id: number; name: string }>;
  countriesDropdown: Array<{ id: number; name: string }>;
  canEdit: boolean;
}

interface CompanyFormData {
  name: string;
  organization_id: string;
  country_id: string;
  billing_term: string;
  billing_rate: string;
  live_date: string;
  remarks: string;
  logo: File | null;
  company_banner: File | null;
  bill_to_address: { address: string; email: string };
  postal_address: { address: string; email: string };
  finance_spoc: {
    name: string;
    designation: string;
    email: string;
    mobile: string;
  };
  operation_spoc: {
    name: string;
    designation: string;
    email: string;
    mobile: string;
  };
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
      maxHeight: 300,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 99999,
      overflow: "auto",
    },
  },
  anchorOrigin: {
    vertical: "bottom" as const,
    horizontal: "left" as const,
  },
  transformOrigin: {
    vertical: "top" as const,
    horizontal: "left" as const,
  },
  disablePortal: false,
  disableScrollLock: true,
};

export const AddCompanyModal: React.FC<AddCompanyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  organizationsDropdown,
  countriesDropdown,
  canEdit,
}) => {
  const { getFullUrl, getAuthHeader } = useApiConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Local preview URLs for selected images (support multiple previews)
  const [logoPreviewUrls, setLogoPreviewUrls] = useState<string[]>([]);
  const [bannerPreviewUrls, setBannerPreviewUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    organization_id: "",
    country_id: "",
    billing_term: "",
    billing_rate: "",
    live_date: "",
    remarks: "",
    logo: null,
    company_banner: null,
    bill_to_address: { address: "", email: "" },
    postal_address: { address: "", email: "" },
    finance_spoc: { name: "", designation: "", email: "", mobile: "" },
    operation_spoc: { name: "", designation: "", email: "", mobile: "" },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleNestedChange = (
    parentField: string,
    childField: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField as keyof CompanyFormData] as any),
        [childField]: value,
      },
    }));
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Maintain first file as the submitted logo if not set yet
      const first = files[0];
      if (first.size > 5 * 1024 * 1024) {
        toast.error("Logo file size should be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, logo: prev.logo ?? first }));
      // Generate previews for all newly selected files and append to existing
      const newUrls: string[] = Array.from(files).map((f) => URL.createObjectURL(f));
      setLogoPreviewUrls((prev) => [...prev, ...newUrls]);
      // Clear the input value to allow selecting the same file again if needed
      event.currentTarget.value = "";
    } else {
      // Clear when no files
      logoPreviewUrls.forEach((u) => URL.revokeObjectURL(u));
      setLogoPreviewUrls([]);
      setFormData((prev) => ({ ...prev, logo: null }));
    }
  };

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const first = files[0];
      if (first.size > 5 * 1024 * 1024) {
        toast.error("Banner file size should be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, company_banner: prev.company_banner ?? first }));
      const newUrls: string[] = Array.from(files).map((f) => URL.createObjectURL(f));
      setBannerPreviewUrls((prev) => [...prev, ...newUrls]);
      event.currentTarget.value = "";
    } else {
      bannerPreviewUrls.forEach((u) => URL.revokeObjectURL(u));
      setBannerPreviewUrls([]);
      setFormData((prev) => ({ ...prev, company_banner: null }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }

    if (!formData.organization_id) {
      newErrors.organization_id = "Please select an organization";
    }

  // Country is optional; no validation required

    if (
      formData.finance_spoc.email &&
      !/\S+@\S+\.\S+/.test(formData.finance_spoc.email)
    ) {
      newErrors.finance_email = "Please enter a valid email address";
    }

    if (
      formData.operation_spoc.email &&
      !/\S+@\S+\.\S+/.test(formData.operation_spoc.email)
    ) {
      newErrors.operation_email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!canEdit) {
      toast.error("You do not have permission to create companies");
      return;
    }

    if (!validateForm()) {
      toast.error(
        "Please fill in all required fields (Company Name and Organization)",
        {
          duration: 5000,
        }
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Company setup data
      formDataToSend.append("pms_company_setup[name]", formData.name);
      formDataToSend.append(
        "pms_company_setup[organization_id]",
        formData.organization_id
      );
      formDataToSend.append(
        "pms_company_setup[country_id]",
        formData.country_id
      );
      formDataToSend.append(
        "pms_company_setup[billing_term]",
        formData.billing_term
      );
      formDataToSend.append(
        "pms_company_setup[billing_rate]",
        formData.billing_rate
      );
      formDataToSend.append("pms_company_setup[live_date]", formData.live_date);
      formDataToSend.append("pms_company_setup[remarks]", formData.remarks);

      // Address data with nested attributes structure
      formDataToSend.append(
        "pms_company_setup[bill_to_address_attributes][address]",
        formData.bill_to_address.address
      );
      formDataToSend.append(
        "pms_company_setup[bill_to_address_attributes][email]",
        formData.bill_to_address.email
      );
      formDataToSend.append(
        "pms_company_setup[bill_to_address_attributes][address_type]",
        "BillTo"
      );

      formDataToSend.append(
        "pms_company_setup[postal_address_attributes][address]",
        formData.postal_address.address
      );
      formDataToSend.append(
        "pms_company_setup[postal_address_attributes][email]",
        formData.postal_address.email
      );
      formDataToSend.append(
        "pms_company_setup[postal_address_attributes][address_type]",
        "Postal"
      );

      // SPOC data with nested attributes structure
      formDataToSend.append(
        "pms_company_setup[finance_spoc_attributes][name]",
        formData.finance_spoc.name
      );
      formDataToSend.append(
        "pms_company_setup[finance_spoc_attributes][designation]",
        formData.finance_spoc.designation
      );
      formDataToSend.append(
        "pms_company_setup[finance_spoc_attributes][email]",
        formData.finance_spoc.email
      );
      formDataToSend.append(
        "pms_company_setup[finance_spoc_attributes][mobile]",
        formData.finance_spoc.mobile
      );
      formDataToSend.append(
        "pms_company_setup[finance_spoc_attributes][spoc_type]",
        "Finance"
      );

      formDataToSend.append(
        "pms_company_setup[operation_spoc_attributes][name]",
        formData.operation_spoc.name
      );
      formDataToSend.append(
        "pms_company_setup[operation_spoc_attributes][designation]",
        formData.operation_spoc.designation
      );
      formDataToSend.append(
        "pms_company_setup[operation_spoc_attributes][email]",
        formData.operation_spoc.email
      );
      formDataToSend.append(
        "pms_company_setup[operation_spoc_attributes][mobile]",
        formData.operation_spoc.mobile
      );
      formDataToSend.append(
        "pms_company_setup[operation_spoc_attributes][spoc_type]",
        "Operation"
      );

      // Logo
      if (formData.logo) {
        formDataToSend.append("logo", formData.logo);
      } else {
        formDataToSend.append("logo", "");
      }

      // Company Banner
      if (formData.company_banner) {
        formDataToSend.append("company_banner", formData.company_banner);
      } else {
        formDataToSend.append("company_banner", "");
      }

      const response = await fetch(
        getFullUrl("/pms/company_setups/create_company.json"),
        {
          method: "POST",
          headers: {
            Authorization: getAuthHeader(),
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create company");
      }

      toast.success("Company created successfully!", {
        duration: 3000,
      });

      onSuccess();
      resetForm();
    } catch (error: unknown) {
      console.error("Error creating company:", error);
      const message =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: unknown }).message)
          : "An unexpected error occurred";
      toast.error(`Failed to create company: ${message}`, {
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      organization_id: "",
      country_id: "",
      billing_term: "",
      billing_rate: "",
      live_date: "",
      remarks: "",
      logo: null,
      company_banner: null,
      bill_to_address: { address: "", email: "" },
      postal_address: { address: "", email: "" },
      finance_spoc: { name: "", designation: "", email: "", mobile: "" },
      operation_spoc: { name: "", designation: "", email: "", mobile: "" },
    });
    setErrors({});
  // Revoke and clear previews
  logoPreviewUrls.forEach((u) => URL.revokeObjectURL(u));
  bannerPreviewUrls.forEach((u) => URL.revokeObjectURL(u));
  setLogoPreviewUrls([]);
  setBannerPreviewUrls([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
  <MuiDialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
      <MuiDialogTitle>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">ADD NEW COMPANY</span>
          <MuiButton onClick={handleClose} size="small" variant="text">
            <X className="h-4 w-4" color="black" />
          </MuiButton>
        </div>
        <div id="add-company-dialog-description" className="sr-only">
          Add company details including name, organization, country, billing information, addresses, and SPOC contacts
        </div>
      </MuiDialogTitle>
      <MuiDialogContent
        className="max-h-[90vh] overflow-y-auto bg-white p-0"
        aria-describedby="add-company-dialog-description"
      >
        <div className="px-6">
        {/* ...existing content... */}

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">
              Basic Information
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <TextField
                label="Company Name"
                placeholder="Enter company name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  sx: { "& .MuiFormLabel-asterisk": { color: "#C72030" } },
                }}
                InputProps={{ sx: fieldStyles }}
                required
                disabled={isSubmitting}
                error={!!errors.name}
                helperText={errors.name}
              />

              <FormControl
                fullWidth
                variant="outlined"
                error={!!errors.organization_id}
                required
              >
                <InputLabel
                  shrink
                  sx={{ "& .MuiFormLabel-asterisk": { color: "#C72030" } }}
                >
                  Organization
                </InputLabel>
                <MuiSelect
                  value={formData.organization_id}
                  onChange={(e) =>
                    handleChange("organization_id", e.target.value)
                  }
                  label="Organization"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                  disabled={isSubmitting}
                >
                  <MenuItem value="">
                    <em>Select Organization</em>
                  </MenuItem>
                  {organizationsDropdown.map((org) => (
                    <MenuItem key={org.id} value={org.id.toString()}>
                      {org.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {errors.organization_id && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.organization_id}
                  </div>
                )}
              </FormControl>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <FormControl
                fullWidth
                variant="outlined"
              >
                <InputLabel
                  shrink
                  sx={{ "& .MuiFormLabel-asterisk": { color: "#C72030" } }}
                >
                  Country
                </InputLabel>
                <MuiSelect
                  value={formData.country_id}
                  onChange={(e) => handleChange("country_id", e.target.value)}
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
                {/* Country is optional; no error helper */}
              </FormControl>

              <TextField
                label="Billing Term"
                placeholder="Enter billing term"
                value={formData.billing_term}
                onChange={(e) => handleChange("billing_term", e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  sx: { "& .MuiFormLabel-asterisk": { color: "#C72030" } },
                }}
                InputProps={{ sx: fieldStyles }}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <TextField
                label="Billing Rate"
                placeholder="Enter billing rate"
                value={formData.billing_rate}
                onChange={(e) => handleChange("billing_rate", e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  sx: { "& .MuiFormLabel-asterisk": { color: "#C72030" } },
                }}
                InputProps={{ sx: fieldStyles }}
                disabled={isSubmitting}
              />

              <TextField
                label="Live Date"
                type="date"
                value={formData.live_date}
                onChange={(e) => handleChange("live_date", e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  sx: { "& .MuiFormLabel-asterisk": { color: "#C72030" } },
                }}
                InputProps={{ sx: fieldStyles }}
                disabled={isSubmitting}
              />
            </div>

            <div className="mt-6">
              <TextField
                label="Remarks"
                placeholder="Enter remarks"
                value={formData.remarks}
                onChange={(e) => handleChange("remarks", e.target.value)}
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
          </div>
          {/* Logo Upload Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">
              Logo & Banner Upload
            </h3>

            {/* Logo Upload */}
            <div className="space-y-2 mb-6">
              <span className="text-sm font-medium">Company Logo</span>
              <input
                type="file"
                multiple
                onChange={handleLogoChange}
                accept="image/*"
                disabled={isSubmitting}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#BD2828] file:text-white hover:file:bg-[#a52121]"
              />
              {(logoPreviewUrls.length > 0 || formData.logo) && (
                <div className="flex items-center gap-3 flex-wrap">
                  {formData.logo && (
                    <div className="flex items-center gap-2 text-xs bg-green-50 text-green-700 border border-green-200 rounded px-2 py-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      {formData.logo.name}
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {logoPreviewUrls.map((url, idx) => (
                      <div key={url} className="relative">
                        <img
                          src={url}
                          alt={`Company Logo Preview ${idx + 1}`}
                          className="h-16 w-16 object-cover border border-gray-200 rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            // remove preview index
                            setLogoPreviewUrls((prev) => {
                              const copy = [...prev];
                              const u = copy[idx];
                              if (u) URL.revokeObjectURL(u);
                              copy.splice(idx, 1);
                              return copy;
                            });
                            // if no previews left, clear the submitted logo
                            setFormData((prev) => {
                              if (logoPreviewUrls.length - 1 <= 0) {
                                return { ...prev, logo: null };
                              }
                              return prev;
                            });
                          }}
                          className="absolute -top-1.5 -right-1.5 bg-white text-[#BD2828] border border-gray-200 rounded-full w-5 h-5 text-xs leading-none flex items-center justify-center shadow hover:bg-[#BD2828] hover:text-white"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Company Banner Upload */}
            <div className="space-y-2">
              <span className="text-sm font-medium">Company Banner</span>
              <input
                type="file"
                multiple
                onChange={handleBannerChange}
                accept="image/*"
                disabled={isSubmitting}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#BD2828] file:text-white hover:file:bg-[#a52121]"
              />
              {(bannerPreviewUrls.length > 0 || formData.company_banner) && (
                <div className="flex items-center gap-3 flex-wrap">
                  {formData.company_banner && (
                    <div className="flex items-center gap-2 text-xs bg-green-50 text-green-700 border border-green-200 rounded px-2 py-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      {formData.company_banner.name}
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {bannerPreviewUrls.map((url, idx) => (
                      <div key={url} className="relative">
                        <img
                          src={url}
                          alt={`Company Banner Preview ${idx + 1}`}
                          className="h-16 w-16 object-cover border border-gray-200 rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setBannerPreviewUrls((prev) => {
                              const copy = [...prev];
                              const u = copy[idx];
                              if (u) URL.revokeObjectURL(u);
                              copy.splice(idx, 1);
                              return copy;
                            });
                            setFormData((prev) => {
                              if (bannerPreviewUrls.length - 1 <= 0) {
                                return { ...prev, company_banner: null };
                              }
                              return prev;
                            });
                          }}
                          className="absolute -top-1.5 -right-1.5 bg-white text-[#BD2828] border border-gray-200 rounded-full w-5 h-5 text-xs leading-none flex items-center justify-center shadow hover:bg-[#BD2828] hover:text-white"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#BD2828] border border-transparent rounded-lg p-4 mt-4 text-white">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Image className="w-4 h-4 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">Upload Guidelines</p>
                  <p className="text-xs text-white/90">
                    <strong>Logo:</strong> PNG, JPG, SVG • Max size: 5MB • Min dimensions: 200x200px
                  </p>
                  <p className="text-xs text-white/90">
                    <strong>Banner:</strong> PNG, JPG • Max size: 5MB • Recommended: 1920x400px
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">
              Address Information
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <TextField
                label="Bill To Address"
                placeholder="Enter billing address"
                value={formData.bill_to_address.address}
                onChange={(e) =>
                  handleNestedChange(
                    "bill_to_address",
                    "address",
                    e.target.value
                  )
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
                multiline
                rows={3}
                disabled={isSubmitting}
              />

              <TextField
                label="Postal Address"
                placeholder="Enter postal address"
                value={formData.postal_address.address}
                onChange={(e) =>
                  handleNestedChange(
                    "postal_address",
                    "address",
                    e.target.value
                  )
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
                multiline
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <TextField
                label="Bill To Email"
                placeholder="Enter billing email"
                value={formData.bill_to_address.email}
                onChange={(e) =>
                  handleNestedChange("bill_to_address", "email", e.target.value)
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  sx: { "& .MuiFormLabel-asterisk": { color: "#C72030" } },
                }}
                InputProps={{ sx: fieldStyles }}
                disabled={isSubmitting}
              />

              <TextField
                label="Postal Email"
                placeholder="Enter postal email"
                value={formData.postal_address.email}
                onChange={(e) =>
                  handleNestedChange("postal_address", "email", e.target.value)
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  sx: { "& .MuiFormLabel-asterisk": { color: "#C72030" } },
                }}
                InputProps={{ sx: fieldStyles }}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Finance SPOC */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">
              Finance SPOC
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <TextField
                label="Name"
                placeholder="Enter finance SPOC name"
                value={formData.finance_spoc.name}
                onChange={(e) =>
                  handleNestedChange("finance_spoc", "name", e.target.value)
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  sx: { "& .MuiFormLabel-asterisk": { color: "#C72030" } },
                }}
                InputProps={{ sx: fieldStyles }}
                disabled={isSubmitting}
              />

              <TextField
                label="Designation"
                placeholder="Enter designation"
                value={formData.finance_spoc.designation}
                onChange={(e) =>
                  handleNestedChange(
                    "finance_spoc",
                    "designation",
                    e.target.value
                  )
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  sx: { "& .MuiFormLabel-asterisk": { color: "#C72030" } },
                }}
                InputProps={{ sx: fieldStyles }}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <TextField
                label="Email"
                placeholder="Enter email address"
                value={formData.finance_spoc.email}
                onChange={(e) =>
                  handleNestedChange("finance_spoc", "email", e.target.value)
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  sx: { "& .MuiFormLabel-asterisk": { color: "#C72030" } },
                }}
                InputProps={{ sx: fieldStyles }}
                disabled={isSubmitting}
                error={!!errors.finance_email}
                helperText={errors.finance_email}
              />

              <TextField
                label="Mobile"
                placeholder="Enter mobile number"
                value={formData.finance_spoc.mobile}
                onChange={(e) =>
                  handleNestedChange("finance_spoc", "mobile", e.target.value)
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  sx: { "& .MuiFormLabel-asterisk": { color: "#C72030" } },
                }}
                InputProps={{ sx: fieldStyles }}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Operation SPOC */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">
              Operation SPOC
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <TextField
                label="Name"
                placeholder="Enter operation SPOC name"
                value={formData.operation_spoc.name}
                onChange={(e) =>
                  handleNestedChange("operation_spoc", "name", e.target.value)
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  sx: { "& .MuiFormLabel-asterisk": { color: "#C72030" } },
                }}
                InputProps={{ sx: fieldStyles }}
                disabled={isSubmitting}
              />

              <TextField
                label="Designation"
                placeholder="Enter designation"
                value={formData.operation_spoc.designation}
                onChange={(e) =>
                  handleNestedChange(
                    "operation_spoc",
                    "designation",
                    e.target.value
                  )
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  sx: { "& .MuiFormLabel-asterisk": { color: "#C72030" } },
                }}
                InputProps={{ sx: fieldStyles }}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <TextField
                label="Email"
                placeholder="Enter email address"
                value={formData.operation_spoc.email}
                onChange={(e) =>
                  handleNestedChange("operation_spoc", "email", e.target.value)
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  sx: { "& .MuiFormLabel-asterisk": { color: "#C72030" } },
                }}
                InputProps={{ sx: fieldStyles }}
                disabled={isSubmitting}
                error={!!errors.operation_email}
                helperText={errors.operation_email}
              />

              <TextField
                label="Mobile"
                placeholder="Enter mobile number"
                value={formData.operation_spoc.mobile}
                onChange={(e) =>
                  handleNestedChange("operation_spoc", "mobile", e.target.value)
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  sx: { "& .MuiFormLabel-asterisk": { color: "#C72030" } },
                }}
                InputProps={{ sx: fieldStyles }}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        </div>
      </MuiDialogContent>
      <MuiDialogActions sx={{ justifyContent: "center", borderTop: "1px solid #e5e7eb", gap: 2, py: 2 }}>
        <MuiButton
          onClick={handleClose}
          disabled={isSubmitting}
          variant="outlined"
          sx={{
            color: "#BD2828",
            borderColor: "#BD2828",
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: 500,
            '&:hover': { borderColor: '#a52121', color: '#a52121' }
          }}
        >
          Cancel
        </MuiButton>
        <MuiButton
          onClick={handleSubmit}
          disabled={isSubmitting || !canEdit}
          sx={{
            backgroundColor: "#ede9e4", // light neutral background like screenshot
            color: "#BD2828",
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: 500,
            boxShadow: "none",
            '&:hover': { backgroundColor: '#e6e1db' }
          }}
        >
          {isSubmitting ? "Creating..." : "Create Company"}
        </MuiButton>
      </MuiDialogActions>
    </MuiDialog>
  );
};
