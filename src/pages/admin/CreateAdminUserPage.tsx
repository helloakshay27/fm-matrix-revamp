import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";
import { ArrowLeft, Plus, User } from "lucide-react";
import { toast } from "sonner";
import { useApiConfig } from "@/hooks/useApiConfig";
import {
  createOrganizationAdmin,
  getOrganizations,
  getCompanies,
} from "@/services/adminUserAPI";

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

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  organization_id: string;
  company_id: string;
}

interface Organization {
  id: number;
  name: string;
  active: boolean;
}

interface Company {
  id: number;
  name: string;
  organization_id: number;
}

export const CreateAdminUserPage = () => {
  const navigate = useNavigate();
  const { getFullUrl, getAuthHeader } = useApiConfig();

  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    organization_id: "",
    company_id: "",
  });

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingOrganizations, setLoadingOrganizations] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  // Fetch organizations on component mount
  useEffect(() => {
    fetchOrganizations();
    fetchCompanies();
  }, []);

  // Filter companies when organization is selected
  useEffect(() => {
    if (formData.organization_id) {
      const filtered = companies.filter(
        (company) =>
          company.organization_id.toString() === formData.organization_id
      );
      setFilteredCompanies(filtered);
      // Reset company selection if current selection is not in filtered list
      if (
        formData.company_id &&
        !filtered.find((c) => c.id.toString() === formData.company_id)
      ) {
        setFormData((prev) => ({ ...prev, company_id: "" }));
      }
    } else {
      setFilteredCompanies([]);
      setFormData((prev) => ({ ...prev, company_id: "" }));
    }
  }, [formData.organization_id, companies]);

  const fetchOrganizations = async () => {
    setLoadingOrganizations(true);
    try {
      const result = await getOrganizations();

      if (result.success && result.data) {
        setOrganizations(result.data);
      } else {
        console.error("Failed to fetch organizations:", result.error);
        toast.error(result.error || "Failed to load organizations");
        setOrganizations([]);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast.error("Error loading organizations");
      setOrganizations([]);
    } finally {
      setLoadingOrganizations(false);
    }
  };

  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const result = await getCompanies();

      if (result.success && result.data) {
        setCompanies(result.data);
      } else {
        console.error("Failed to fetch companies:", result.error);
        toast.error(result.error || "Failed to load companies");
        setCompanies([]);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Error loading companies");
      setCompanies([]);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstname.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!formData.lastname.trim()) {
      toast.error("Last name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!formData.mobile.trim()) {
      toast.error("Mobile number is required");
      return false;
    }
    if (!formData.mobile.match(/^\d{10,15}$/)) {
      toast.error("Please enter a valid mobile number (10-15 digits)");
      return false;
    }
    if (!formData.organization_id) {
      toast.error("Organization is required");
      return false;
    }
    if (!formData.company_id) {
      toast.error("Company is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Prepare the payload according to the API specification
      const payload = {
        user: {
          firstname: formData.firstname.trim(),
          lastname: formData.lastname.trim(),
          email: formData.email.trim().toLowerCase(),
          mobile: formData.mobile.trim(),
          organization_id: parseInt(formData.organization_id),
          company_id: parseInt(formData.company_id),
        },
      };

      console.log("Creating admin user with payload:", payload);

      const result = await createOrganizationAdmin(payload);

      if (result.success) {
        console.log("Admin user created successfully:", result.data);
        toast.success("Organization admin user created successfully!");

        // Navigate back to the users list or admin console
        navigate("/ops-console/master/user/fm-users");
      } else {
        console.error("Failed to create admin user:", result.error);

        // Handle specific error messages
        const errorMessage = result.error || "Failed to create admin user";

        if (
          errorMessage.toLowerCase().includes("user is already exists") ||
          errorMessage.toLowerCase().includes("user already exists")
        ) {
          toast.error(
            "User with this email or mobile already exists. Please use different credentials."
          );
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error: any) {
      console.error("Error creating admin user:", error);

      // Check if error object has response data with message
      const errorMessage =
        error?.response?.data?.message || error?.message || "";

      if (
        errorMessage.toLowerCase().includes("user is already exists") ||
        errorMessage.toLowerCase().includes("user already exists")
      ) {
        toast.error(
          "User with this email or mobile already exists. Please use different credentials."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/ops-console/master/user/fm-users");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">
            Create Organization Admin User
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Create a new organization admin user with appropriate permissions
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="grid grid-cols-1 gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-[#C72030] mb-4">
                Personal Information
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <TextField
                  label="First Name"
                  placeholder="Enter first name"
                  value={formData.firstname}
                  onChange={(e) =>
                    handleInputChange("firstname", e.target.value)
                  }
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  required
                  disabled={isSubmitting}
                />

                <TextField
                  label="Last Name"
                  placeholder="Enter last name"
                  value={formData.lastname}
                  onChange={(e) =>
                    handleInputChange("lastname", e.target.value)
                  }
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  required
                  disabled={isSubmitting}
                />

                <TextField
                  label="Email Address"
                  placeholder="Enter email address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  required
                  disabled={isSubmitting}
                />

                <TextField
                  label="Mobile Number"
                  placeholder="Enter mobile number"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 15) {
                      handleInputChange("mobile", value);
                    }
                  }}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Organization Information */}
            <div className="space-y-6 mt-8">
              <h3 className="text-sm font-medium text-[#C72030] mb-4">
                Organization Information
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel shrink>Organization</InputLabel>
                  <MuiSelect
                    value={formData.organization_id}
                    onChange={(e) =>
                      handleInputChange(
                        "organization_id",
                        e.target.value as string
                      )
                    }
                    label="Organization"
                    displayEmpty
                    MenuProps={selectMenuProps}
                    sx={fieldStyles}
                    disabled={loadingOrganizations || isSubmitting}
                  >
                    <MenuItem value="">
                      <em>
                        {loadingOrganizations
                          ? "Loading organizations..."
                          : "Select Organization"}
                      </em>
                    </MenuItem>
                    {organizations.map((org) => (
                      <MenuItem key={org.id} value={org.id.toString()}>
                        {org.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                <FormControl fullWidth variant="outlined" required>
                  <InputLabel shrink>Company</InputLabel>
                  <MuiSelect
                    value={formData.company_id}
                    onChange={(e) =>
                      handleInputChange("company_id", e.target.value as string)
                    }
                    label="Company"
                    displayEmpty
                    MenuProps={selectMenuProps}
                    sx={fieldStyles}
                    disabled={
                      loadingCompanies ||
                      !formData.organization_id ||
                      filteredCompanies.length === 0 ||
                      isSubmitting
                    }
                  >
                    <MenuItem value="">
                      <em>
                        {!formData.organization_id
                          ? "Select organization first"
                          : loadingCompanies
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
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#C72030] text-white hover:bg-[#A61B29] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Admin User
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
