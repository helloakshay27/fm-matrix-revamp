import React, { useState } from "react";
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
      toast.error("You do not have permission to create companies");
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
    } catch (error: any) {
      console.error("Error creating company:", error);
      toast.error(`Failed to create company: ${error.message}`, {
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
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={false}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white z-50"
        aria-describedby="add-company-dialog-description"
      >
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            ADD NEW COMPANY
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <div id="add-company-dialog-description" className="sr-only">
            Add company details including name, organization, country, billing
            information, addresses, and SPOC contacts
          </div>
        </DialogHeader>

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
                InputLabelProps={{ shrink: true }}
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
              >
                <InputLabel shrink>Organization</InputLabel>
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
                error={!!errors.country_id}
              >
                <InputLabel shrink>Country</InputLabel>
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
                {errors.country_id && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.country_id}
                  </div>
                )}
              </FormControl>

              <TextField
                label="Billing Term"
                placeholder="Enter billing term"
                value={formData.billing_term}
                onChange={(e) => handleChange("billing_term", e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                onChange={handleLogoChange}
                accept="image/*"
                disabled={isSubmitting}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {formData.logo && (
                <div className="flex items-center gap-2 text-xs bg-green-50 text-green-700 border border-green-200 rounded px-2 py-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  {formData.logo.name}
                </div>
              )}
            </div>

            {/* Company Banner Upload */}
            <div className="space-y-2">
              <span className="text-sm font-medium">Company Banner</span>
              <input
                type="file"
                onChange={handleBannerChange}
                accept="image/*"
                disabled={isSubmitting}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              {formData.company_banner && (
                <div className="flex items-center gap-2 text-xs bg-green-50 text-green-700 border border-green-200 rounded px-2 py-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  {formData.company_banner.name}
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Image className="w-4 h-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-800">
                    Upload Guidelines
                  </p>
                  <p className="text-xs text-blue-700">
                    <strong>Logo:</strong> PNG, JPG, SVG • Max size: 5MB • Min
                    dimensions: 200x200px
                  </p>
                  <p className="text-xs text-blue-700">
                    <strong>Banner:</strong> PNG, JPG • Max size: 5MB •
                    Recommended: 1920x400px
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
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
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
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
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
            disabled={isSubmitting || !canEdit}
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90 px-6 py-2"
          >
            {isSubmitting ? "Creating..." : "Create Company"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
