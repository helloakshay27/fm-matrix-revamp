import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Loader2,
  Edit2,
  X,
  Check,
  Mail,
  Phone,
  User,
  Shield,
  Building2,
  Lock,
  Clock,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import {
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";
import { toast } from "sonner";
import { useApiConfig } from "@/hooks/useApiConfig";

interface AdminUser {
  id: number;
  email: string;
  firstname: string | null;
  lastname: string | null;
  mobile: string | null;
  country_code: string;
  user_type: string | null;
  active: boolean | null;
  created_at: string;
  updated_at: string;
  company_name?: string | null;
  organization_id?: number | null;
  company_id?: number | null;
  // Kept as a fallback in case the API still returns these as arrays.
  organization_ids?: number[] | null;
  company_ids?: number[] | null;
  otp?: string | null;
  [key: string]: any;
}

interface Organization {
  id: number;
  name: string;
  active?: boolean;
}

interface Company {
  id: number;
  name: string;
  organization_id: number;
}

interface FormData {
  email: string;
  firstname: string;
  lastname: string;
  mobile: string;
  password: string;
  password_confirmation: string;
  otp: string;
  organization_id: string;
  company_id: string;
}

// Matches the field styling used on src/pages/AddTicketDashboard.tsx so every
// MUI input/select across the two pages looks and behaves the same.
const fieldStyles = {
  height: "45px",
  backgroundColor: "#fff",
  borderRadius: "4px",
  "& .MuiOutlinedInput-root": {
    height: "45px",
    "& fieldset": {
      borderColor: "#ddd",
    },
    "&:hover fieldset": {
      borderColor: "#C72030",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#C72030",
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: "#C72030",
    },
  },
};

// Password policy per the organization's Information Security policy:
// >= 8 alphanumeric characters, mixed case, at least one digit, and not a
// common/dictionary password. Checked live as the admin types, and again
// before save, so a weak password can never reach the update request.
const PASSWORD_REQUIREMENTS: {
  key: string;
  label: string;
  test: (pwd: string) => boolean;
}[] = [
    { key: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
    { key: "upper", label: "At least one uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
    { key: "lower", label: "At least one lowercase letter (a-z)", test: (p) => /[a-z]/.test(p) },
    { key: "number", label: "At least one number (0-9)", test: (p) => /[0-9]/.test(p) },
    {
      key: "notCommon",
      label: "Not a common or easily guessable password",
      test: (p) => !COMMON_PASSWORDS.has(p.toLowerCase()),
    },
  ];

// A small set of the most common/dictionary passwords — best-effort check for
// the "must not contain dictionary words" requirement (a full dictionary
// lookup isn't practical client-side).
const COMMON_PASSWORDS = new Set([
  "password", "password1", "password123", "12345678", "123456789",
  "qwerty123", "letmein1", "welcome1", "admin1234", "iloveyou1",
  "abc123456", "passw0rd", "welcome123", "changeme1", "football1",
]);

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 280,
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

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/** A singular organization_id/company_id wins; falls back to the first entry of a legacy array field. */
const normalizeId = (singular?: number | null, arr?: number[] | null): string =>
  singular ? String(singular) : Array.isArray(arr) && arr[0] ? String(arr[0]) : "";

/** Section wrapper matching AddTicketDashboard's icon-badge card header. */
const SectionCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="px-6 py-3 border-b border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 flex items-center">
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
          style={{ backgroundColor: "#E5E0D3" }}
        >
          <Icon size={16} color="#C72030" />
        </span>
        {title}
      </h2>
    </div>
    <div className="p-6 space-y-6">{children}</div>
  </div>
);

const ViewField = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) => (
  <div>
    <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </label>
    <p className="text-gray-900 font-medium">{value || "-"}</p>
  </div>
);

export const AdminUsersDetails = () => {
  const params = useParams<{ userId?: string; id?: string }>();
  const userId = params.userId || params.id;
  const navigate = useNavigate();
  const { getFullUrl, getAuthHeader } = useApiConfig();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstname: "",
    lastname: "",
    mobile: "",
    password: "",
    password_confirmation: "",
    otp: "",
    organization_id: "",
    company_id: "",
  });

  // Password is optional here (admin can leave it blank to keep the current
  // one), so the policy only applies once they've actually typed something.
  const passwordChecks = useMemo(
    () =>
      PASSWORD_REQUIREMENTS.map((req) => ({
        ...req,
        passed: req.test(formData.password),
      })),
    [formData.password]
  );
  const isPasswordStrong = passwordChecks.every((check) => check.passed);
  const passwordsMatch =
    formData.password_confirmation.length > 0 &&
    formData.password === formData.password_confirmation;

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingOrganizations, setLoadingOrganizations] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
    fetchOrganizations();
  }, [userId]);

  // Re-fetch companies (scoped to the selected organization) whenever the
  // organization selection changes, so the company list stays a valid subset.
  useEffect(() => {
    fetchCompaniesForOrganization(formData.organization_id);
  }, [formData.organization_id]);

  const fetchOrganizations = async () => {
    setLoadingOrganizations(true);
    try {
      const response = await fetch(getFullUrl("/organizations.json?per_page=200"), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const list: Organization[] = Array.isArray(data?.organizations)
          ? data.organizations
          : Array.isArray(data)
            ? data
            : [];
        setOrganizations(list);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setLoadingOrganizations(false);
    }
  };

  const fetchCompaniesForOrganization = async (organizationId: string) => {
    if (!organizationId) {
      setCompanies([]);
      return;
    }

    setLoadingCompanies(true);
    try {
      const response = await fetch(
        getFullUrl(
          `/pms/company_setups/company_index.json?q[organization_id_eq]=${organizationId}&per_page=200`
        ),
        {
          headers: {
            Authorization: getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const list: Company[] = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.companies)
            ? data.companies
            : Array.isArray(data)
              ? data
              : [];
        setCompanies(list);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(getFullUrl(`/admin/users_details?id=${userId}`), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);

        // Handle nested user object response
        const userData = data.user || data;
        console.log("User details:", userData);

        setUser(userData);
        setFormData({
          email: userData.email || "",
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          mobile: userData.mobile || "",
          password: "",
          password_confirmation: "",
          otp: userData.otp || "",
          organization_id: normalizeId(userData.organization_id, userData.organization_ids),
          company_id: normalizeId(userData.company_id, userData.company_ids),
        });
      } else {
        toast.error("Failed to load user details");
        navigate("/ops-console/admin/users");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Error loading user details");
      navigate("/ops-console/admin/users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOrganizationChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      organization_id: value,
      // The selected company belongs to the previous organization — reset it
      // so the user re-picks from the newly scoped company list.
      company_id: "",
    }));
  };

  const handleCompanyChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      company_id: value,
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    // Validation
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }

    if (formData.password && !isPasswordStrong) {
      toast.error("Please satisfy all password requirements listed below.");
      return;
    }

    if (formData.password && formData.password !== formData.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSaving(true);
    try {
      const updateData = new FormData();
      updateData.append("user[email]", formData.email);
      updateData.append("user[firstname]", formData.firstname);
      updateData.append("user[lastname]", formData.lastname);
      updateData.append("user[mobile]", formData.mobile);
      if (formData.password) {
        updateData.append("user[password]", formData.password);
        updateData.append("user[password_confirmation]", formData.password_confirmation);
      }
      updateData.append("user[otp]", formData.otp);
      if (formData.organization_id) {
        updateData.append("user[organization_id]", formData.organization_id);
      }
      if (formData.company_id) {
        updateData.append("user[company_id]", formData.company_id);
      }

      const response = await fetch(getFullUrl(`/admin/users_update?id=${user.id}`), {
        method: "PUT",
        headers: {
          Authorization: getAuthHeader(),
        },
        body: updateData,
      });

      if (response.ok) {
        toast.success("User updated successfully");
        setIsEditing(false);
        fetchUserDetails();
      } else {
        const errorText = await response.text();
        console.error("Update error:", errorText);
        toast.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        email: user.email || "",
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        mobile: user.mobile || "",
        password: "",
        password_confirmation: "",
        otp: user.otp || "",
        organization_id: normalizeId(user.organization_id, user.organization_ids),
        company_id: normalizeId(user.company_id, user.company_ids),
      });
    }
  };

  const getNameForId = (id: string, source: { id: number; name: string }[]) =>
    source.find((item) => item.id.toString() === id)?.name;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#C72030] mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900">User not found</h3>
          <Button
            onClick={() => navigate("/ops-console/admin/users")}
            className="mt-4 bg-[#C72030] hover:bg-[#A01020] text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  const viewOrganizationId = normalizeId(user.organization_id, user.organization_ids);
  const viewCompanyId = normalizeId(user.company_id, user.company_ids);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <button
              onClick={() => navigate("/ops-console/admin/users")}
              className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span>Admin Users</span>
            <span>{">"}</span>
            <span className="text-gray-900 font-medium">
              {user.firstname} {user.lastname}
            </span>
          </div>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstname} {user.lastname}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="inline-block px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                  {user.user_type || "User"}
                </span>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${user.active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                    }`}
                >
                  {user.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                if (isEditing) {
                  handleCancel();
                } else {
                  setIsEditing(true);
                }
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-md font-medium text-sm transition-colors ${isEditing
                ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                : "bg-[#C72030] hover:bg-[#A01020] text-white"
                }`}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit
                </>
              )}
            </button>
          </div>
        </div>

        {!isEditing ? (
          // View Mode
          <div className="space-y-6">
            <SectionCard icon={User} title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ViewField label="Email Address" value={user.email} />
                <ViewField label="First Name" value={user.firstname} />
                <ViewField label="Last Name" value={user.lastname} />
                <ViewField label="Mobile Number" value={user.mobile} icon={Phone} />
              </div>
            </SectionCard>

            <SectionCard icon={Building2} title="Organization & Company">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ViewField
                  label="Organization"
                  value={getNameForId(viewOrganizationId, organizations)}
                />
                <ViewField label="Company" value={getNameForId(viewCompanyId, companies)} />
              </div>
            </SectionCard>

            <SectionCard icon={Shield} title="Security & Additional">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ViewField label="User Type" value={user.user_type} />

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Account Status
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${user.active === true
                      ? "bg-green-100 text-green-800"
                      : user.active === false
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {user.active === true
                      ? "Active"
                      : user.active === false
                        ? "Inactive"
                        : "Pending"}
                  </span>
                </div>

                <ViewField
                  label="OTP"
                  value={<span className="font-mono text-lg">{user.otp || "-"}</span>}
                />
                <ViewField label="Company Name" value={user.company_name} />
              </div>
            </SectionCard>

            {(user.created_at || user.updated_at) && (
              <SectionCard icon={Clock} title="System Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Created At
                    </p>
                    <p className="text-gray-900 font-medium">
                      {user.created_at ? formatDateTime(user.created_at) : "-"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Last Updated
                    </p>
                    <p className="text-gray-900 font-medium">
                      {user.updated_at ? formatDateTime(user.updated_at) : "-"}
                    </p>
                  </div>
                </div>
              </SectionCard>
            )}
          </div>
        ) : (
          // Edit Mode
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-6"
          >
            <SectionCard icon={User} title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Email"
                  required
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  placeholder="user@example.com"
                  disabled={isSaving}
                  slotProps={{ inputLabel: { shrink: true } }}
                  InputProps={{ sx: fieldStyles }}
                />
                <TextField
                  label="First Name"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  placeholder="First name"
                  disabled={isSaving}
                  slotProps={{ inputLabel: { shrink: true } }}
                  InputProps={{ sx: fieldStyles }}
                />
                <TextField
                  label="Last Name"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  placeholder="Last name"
                  disabled={isSaving}
                  slotProps={{ inputLabel: { shrink: true } }}
                  InputProps={{ sx: fieldStyles }}
                />
                <TextField
                  label="Mobile Number"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  placeholder="10 digit mobile"
                  disabled={isSaving}
                  slotProps={{ inputLabel: { shrink: true } }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>
            </SectionCard>

            <SectionCard icon={Building2} title="Organization & Company">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormControl
                  fullWidth
                  variant="outlined"
                  disabled={isSaving || loadingOrganizations}
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
                >
                  <InputLabel shrink>Organization</InputLabel>
                  <Select
                    notched
                    displayEmpty
                    label="Organization"
                    value={formData.organization_id}
                    onChange={handleOrganizationChange}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value="">
                      <em>
                        {loadingOrganizations ? "Loading organizations..." : "Select Organization"}
                      </em>
                    </MenuItem>
                    {organizations.map((org) => (
                      <MenuItem key={org.id} value={org.id.toString()}>
                        {org.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  variant="outlined"
                  disabled={isSaving || !formData.organization_id || loadingCompanies}
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
                >
                  <InputLabel shrink>Company</InputLabel>
                  <Select
                    notched
                    displayEmpty
                    label="Company"
                    value={formData.company_id}
                    onChange={handleCompanyChange}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value="">
                      <em>
                        {!formData.organization_id
                          ? "Select organization first"
                          : loadingCompanies
                            ? "Loading companies..."
                            : companies.length === 0
                              ? "No companies available"
                              : "Select Company"}
                      </em>
                    </MenuItem>
                    {companies.map((company) => (
                      <MenuItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </SectionCard>

            <SectionCard icon={Shield} title="Security Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="OTP Code"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  placeholder="OTP"
                  disabled={isSaving}
                  slotProps={{ inputLabel: { shrink: true } }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>
            </SectionCard>

            <SectionCard icon={Lock} title="Change Password (Optional)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <TextField
                    label="New Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    placeholder="Leave empty to keep current"
                    disabled={isSaving}
                    slotProps={{ inputLabel: { shrink: true } }}
                    InputProps={{ sx: fieldStyles }}
                  />

                  {/* Password Requirements — live-checked as the admin types */}
                  {formData.password && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                      <div
                        className={`flex items-center gap-2 mb-2 text-xs font-medium ${isPasswordStrong ? "text-brand-success" : "text-brand-warning"
                          }`}
                      >
                        {isPasswordStrong ? (
                          <ShieldCheck size={14} />
                        ) : (
                          <ShieldAlert size={14} />
                        )}
                        {isPasswordStrong
                          ? "Meets password policy"
                          : "Does not meet password policy yet"}
                      </div>
                      <div className="space-y-1">
                        {passwordChecks.map((check) => (
                          <div
                            key={check.key}
                            className={`flex items-center gap-2 text-xs ${check.passed ? "text-brand-success" : "text-brand-text-light"
                              }`}
                          >
                            {check.passed ? <Check size={12} /> : <X size={12} />}
                            {check.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <TextField
                    label="Confirm Password"
                    name="password_confirmation"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    placeholder="Confirm password"
                    disabled={isSaving}
                    slotProps={{ inputLabel: { shrink: true } }}
                    InputProps={{ sx: fieldStyles }}
                  />

                  {formData.password_confirmation && (
                    <div
                      className={`mt-2 flex items-center gap-2 text-xs ${passwordsMatch ? "text-brand-success" : "text-brand-error"
                        }`}
                    >
                      {passwordsMatch ? <Check size={12} /> : <X size={12} />}
                      {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors"
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 py-2 bg-[#C72030] hover:bg-[#A01020] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <CircularProgress size={16} sx={{ color: "#fff" }} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
