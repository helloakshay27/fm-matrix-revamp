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
} from "@mui/material";
import { Upload, Building } from "lucide-react";
import { toast } from "sonner";
import { useApiConfig } from "@/hooks/useApiConfig";

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  companyId: number;
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
  bill_to_address: { id?: number; address: string; email: string };
  postal_address: { id?: number; address: string; email: string };
  finance_spoc: {
    id?: number;
    name: string;
    designation: string;
    email: string;
    mobile: string;
  };
  operation_spoc: {
    id?: number;
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

export const EditCompanyModal: React.FC<EditCompanyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  companyId,
  organizationsDropdown,
  countriesDropdown,
  canEdit,
}) => {
  const { getFullUrl, getAuthHeader } = useApiConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (isOpen && companyId) {
      fetchCompanyDetails();
    }
  }, [isOpen, companyId]);

  const fetchCompanyDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        getFullUrl(`/pms/company_setups/${companyId}.json`),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: getAuthHeader(),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Company details response:", result);

      const company = result.data || result.company || result;

      setFormData({
        name: company.name || "",
        organization_id: company.organization_id?.toString() || "",
        country_id: company.country_id?.toString() || "",
        billing_term: company.billing_term || "",
        billing_rate: company.billing_rate || "",
        live_date: company.live_date || "",
        remarks: company.remarks || "",
        logo: null,
        company_banner: null,
        bill_to_address: {
          id: company.bill_to_address?.id,
          address: company.bill_to_address?.address || "",
          email: company.bill_to_address?.email || "",
        },
        postal_address: {
          id: company.postal_address?.id,
          address: company.postal_address?.address || "",
          email: company.postal_address?.email || "",
        },
        finance_spoc: {
          id: company.finance_spoc?.id,
          name: company.finance_spoc?.name || "",
          designation: company.finance_spoc?.designation || "",
          email: company.finance_spoc?.email || "",
          mobile: company.finance_spoc?.mobile || "",
        },
        operation_spoc: {
          id: company.operation_spoc?.id,
          name: company.operation_spoc?.name || "",
          designation: company.operation_spoc?.designation || "",
          email: company.operation_spoc?.email || "",
          mobile: company.operation_spoc?.mobile || "",
        },
      });
    } catch (error: any) {
      console.error("Error fetching company details:", error);
      toast.error(`Failed to load company details: ${error.message}`, {
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Logo file size should be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, logo: file }));
    }
  };

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Banner file size should be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, company_banner: file }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }

    if (!formData.organization_id) {
      newErrors.organization_id = "Organization is required";
    }

    if (!formData.country_id) {
      newErrors.country_id = "Country is required";
    }

    if (
      formData.finance_spoc.email &&
      !/\S+@\S+\.\S+/.test(formData.finance_spoc.email)
    ) {
      newErrors.finance_email = "Invalid email format";
    }

    if (
      formData.operation_spoc.email &&
      !/\S+@\S+\.\S+/.test(formData.operation_spoc.email)
    ) {
      newErrors.operation_email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!canEdit) {
      toast.error("You do not have permission to update companies");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
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

      // Address data with nested attributes structure (include IDs for updates)
      if (formData.bill_to_address.id) {
        formDataToSend.append(
          "pms_company_setup[bill_to_address_attributes][id]",
          formData.bill_to_address.id.toString()
        );
      }
      formDataToSend.append(
        "pms_company_setup[bill_to_address_attributes][address]",
        formData.bill_to_address.address
      );
      formDataToSend.append(
        "pms_company_setup[bill_to_address_attributes][email]",
        formData.bill_to_address.email
      );

      if (formData.postal_address.id) {
        formDataToSend.append(
          "pms_company_setup[postal_address_attributes][id]",
          formData.postal_address.id.toString()
        );
      }
      formDataToSend.append(
        "pms_company_setup[postal_address_attributes][address]",
        formData.postal_address.address
      );
      formDataToSend.append(
        "pms_company_setup[postal_address_attributes][email]",
        formData.postal_address.email
      );

      // SPOC data with nested attributes structure (include IDs for updates)
      if (formData.finance_spoc.id) {
        formDataToSend.append(
          "pms_company_setup[finance_spoc_attributes][id]",
          formData.finance_spoc.id.toString()
        );
      }
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

      if (formData.operation_spoc.id) {
        formDataToSend.append(
          "pms_company_setup[operation_spoc_attributes][id]",
          formData.operation_spoc.id.toString()
        );
      }
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
        getFullUrl(`/pms/company_setups/${companyId}/company_update.json`),
        {
          method: "PATCH",
          headers: {
            Authorization: getAuthHeader(),
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update company");
      }

      toast.success("Company updated successfully!", {
        duration: 3000,
      });

      onSuccess();
    } catch (error: any) {
      console.error("Error updating company:", error);
      toast.error(`Failed to update company: ${error.message}`, {
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
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
    onClose();
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading company details...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Edit Company
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building className="w-4 h-4" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Company Name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                required
                fullWidth
                sx={fieldStyles}
              />

              <FormControl fullWidth error={!!errors.organization_id} required>
                <InputLabel>Organization</InputLabel>
                <MuiSelect
                  value={formData.organization_id}
                  onChange={(e) =>
                    handleChange("organization_id", e.target.value)
                  }
                  label="Organization"
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  {organizationsDropdown.map((org) => (
                    <MenuItem key={org.id} value={org.id.toString()}>
                      {org.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth error={!!errors.country_id} required>
                <InputLabel>Country</InputLabel>
                <MuiSelect
                  value={formData.country_id}
                  onChange={(e) => handleChange("country_id", e.target.value)}
                  label="Country"
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  {countriesDropdown.map((country) => (
                    <MenuItem key={country.id} value={country.id.toString()}>
                      {country.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <TextField
                label="Billing Term"
                value={formData.billing_term}
                onChange={(e) => handleChange("billing_term", e.target.value)}
                fullWidth
                sx={fieldStyles}
              />

              <TextField
                label="Billing Rate"
                value={formData.billing_rate}
                onChange={(e) => handleChange("billing_rate", e.target.value)}
                fullWidth
                sx={fieldStyles}
              />

              <TextField
                label="Live Date"
                type="date"
                value={formData.live_date}
                onChange={(e) => handleChange("live_date", e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
              />

              <TextField
                label="Remarks"
                value={formData.remarks}
                onChange={(e) => handleChange("remarks", e.target.value)}
                fullWidth
                multiline
                rows={2}
                sx={fieldStyles}
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Company Logo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {formData.logo
                      ? formData.logo.name
                      : "Click to upload logo"}
                  </span>
                </label>
              </div>
            </div>

            {/* Banner Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Company Banner
              </label>
              <div className="border-2 border-dashed border-purple-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                  id="banner-upload"
                />
                <label
                  htmlFor="banner-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-purple-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {formData.company_banner
                      ? formData.company_banner.name
                      : "Click to upload banner (1920x400px recommended)"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Address Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Bill To Address"
                value={formData.bill_to_address.address}
                onChange={(e) =>
                  handleNestedChange(
                    "bill_to_address",
                    "address",
                    e.target.value
                  )
                }
                fullWidth
                multiline
                rows={2}
                sx={fieldStyles}
              />

              <TextField
                label="Bill To Email"
                value={formData.bill_to_address.email}
                onChange={(e) =>
                  handleNestedChange("bill_to_address", "email", e.target.value)
                }
                fullWidth
                sx={fieldStyles}
              />

              <TextField
                label="Postal Address"
                value={formData.postal_address.address}
                onChange={(e) =>
                  handleNestedChange(
                    "postal_address",
                    "address",
                    e.target.value
                  )
                }
                fullWidth
                multiline
                rows={2}
                sx={fieldStyles}
              />

              <TextField
                label="Postal Email"
                value={formData.postal_address.email}
                onChange={(e) =>
                  handleNestedChange("postal_address", "email", e.target.value)
                }
                fullWidth
                sx={fieldStyles}
              />
            </div>
          </div>

          {/* Finance SPOC */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Finance SPOC</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Name"
                value={formData.finance_spoc.name}
                onChange={(e) =>
                  handleNestedChange("finance_spoc", "name", e.target.value)
                }
                fullWidth
                sx={fieldStyles}
              />

              <TextField
                label="Designation"
                value={formData.finance_spoc.designation}
                onChange={(e) =>
                  handleNestedChange(
                    "finance_spoc",
                    "designation",
                    e.target.value
                  )
                }
                fullWidth
                sx={fieldStyles}
              />

              <TextField
                label="Email"
                value={formData.finance_spoc.email}
                onChange={(e) =>
                  handleNestedChange("finance_spoc", "email", e.target.value)
                }
                error={!!errors.finance_email}
                helperText={errors.finance_email}
                fullWidth
                sx={fieldStyles}
              />

              <TextField
                label="Mobile"
                value={formData.finance_spoc.mobile}
                onChange={(e) =>
                  handleNestedChange("finance_spoc", "mobile", e.target.value)
                }
                fullWidth
                sx={fieldStyles}
              />
            </div>
          </div>

          {/* Operation SPOC */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Operation SPOC</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Name"
                value={formData.operation_spoc.name}
                onChange={(e) =>
                  handleNestedChange("operation_spoc", "name", e.target.value)
                }
                fullWidth
                sx={fieldStyles}
              />

              <TextField
                label="Designation"
                value={formData.operation_spoc.designation}
                onChange={(e) =>
                  handleNestedChange(
                    "operation_spoc",
                    "designation",
                    e.target.value
                  )
                }
                fullWidth
                sx={fieldStyles}
              />

              <TextField
                label="Email"
                value={formData.operation_spoc.email}
                onChange={(e) =>
                  handleNestedChange("operation_spoc", "email", e.target.value)
                }
                error={!!errors.operation_email}
                helperText={errors.operation_email}
                fullWidth
                sx={fieldStyles}
              />

              <TextField
                label="Mobile"
                value={formData.operation_spoc.mobile}
                onChange={(e) =>
                  handleNestedChange("operation_spoc", "mobile", e.target.value)
                }
                fullWidth
                sx={fieldStyles}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !canEdit}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? "Updating..." : "Update Company"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
