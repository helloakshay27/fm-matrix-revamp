import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLayout } from "@/contexts/LayoutContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Autocomplete,
  Chip,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Entity, fetchEntities } from "@/store/slices/entitiesSlice";
import {
  editFMUser,
  fetchRoles,
  fetchSuppliers,
  fetchUnits,
  getUserDetails,
} from "@/store/slices/fmUserSlice";
import { fetchDepartmentData } from "@/store/slices/departmentSlice";
import { fetchAllowedSites } from "@/store/slices/siteSlice";
import { fetchAllowedCompanies } from "@/store/slices/projectSlice";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { ticketManagementAPI } from "@/services/ticketManagementAPI";
import axios from "axios";

// Define interfaces for data shapes
interface UserAccount {
  company_id?: number;
}

interface Site {
  id: number;
  name: string;
}

interface Company {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
}

interface Unit {
  id: number;
  unit_name: string;
  building?: { name: string };
}

interface Department {
  id: number;
  department_name: string;
}

interface Role {
  id: number;
  name: string;
}

interface LockUserPermission {
  id?: number;
  employee_id?: string;
  designation?: string;
  access_level?: string;
  last_working_date?: string;
  lock_role_id?: number;
  access_to?: string[];
}

interface UserData {
  id?: number;
  firstname?: string;
  lastname?: string;
  mobile?: string;
  email?: string;
  gender?: string;
  employee_type?: string;
  entity_id?: number;
  supplier_id?: number;
  site_id?: number;
  unit_id?: number;
  department_id?: number;
  user_type?: string;
  role_id?: number;
  urgency_email_enabled?: boolean;
  user_category_id?: number;
  lock_user_permission?: LockUserPermission;
}

interface FormData {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  emailAddress: string;
  gender: string;
  employeeType: string;
  selectEntity: string | number;
  supplier: string | number;
  employeeId: string;
  baseSite: string | number;
  selectBaseUnit: string | number;
  selectDepartment: string | number;
  designation: string;
  selectUserType: string;
  selectRole: string | number;
  selectAccessLevel: string;
  selectEmailPreference: string;
  selectedSites: string[];
  selectedCompanies: string[];
  lastWorkingDate: string;
  selectUserCategory: string | number;
}

interface Payload {
  user: {
    site_id: string | number;
    lock_user_permissions_attributes: {
      id?: number;
      account_id?: number;
      employee_id: string;
      designation: string;
      unit_id: string | number;
      department_id: string | number;
      user_type: string;
      lock_role_id: string | number;
      access_level: string;
      access_to: string[];
      urgency_email_enabled: string;
      last_working_date: string;
    }[];
    firstname: string;
    lastname: string;
    mobile: string;
    email: string;
    gender: string;
    entity_id: string | number;
    supplier_id: string | number;
    employee_type: string;
    user_category_id: string | number;
  };
  lock_user_permission?: number;
}

export const EditFMUserPage = () => {
  const { id } = useParams<{ id: string }>(); // Explicitly type useParams
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { setCurrentSection } = useLayout();
  const baseUrl = localStorage.getItem("baseUrl") || "";
  const token = localStorage.getItem("token") || "";
  const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id as
    | number
    | undefined;

  // Type Redux state selectors
  const {
    data: entitiesData,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.entities);
  const {
    data: suppliers = [],
    loading: suppliersLoading,
    error: suppliersError,
  } = useAppSelector((state: RootState) => state.fetchSuppliers) as {
    data: Supplier[];
    loading: boolean;
    error: any;
  };
  const {
    data: units = [],
    loading: unitsLoading,
    error: unitsError,
  } = useAppSelector((state: RootState) => state.fetchUnits) as {
    data: Unit[];
    loading: boolean;
    error: any;
  };
  const {
    data: department = [],
    loading: departmentLoading,
    error: departmentError,
  } = useAppSelector((state: RootState) => state.department) as {
    data: Department[];
    loading: boolean;
    error: any;
  };
  const {
    data: roles = [],
    loading: roleLoading,
    error: roleError,
  } = useAppSelector((state: RootState) => state.fetchRoles) as {
    data: Role[];
    loading: boolean;
    error: any;
  };
  const { sites } = useAppSelector((state: RootState) => state.site);
  const { selectedCompany } = useAppSelector(
    (state: RootState) => state.project
  );

  const [userCategories, setUserCategories] = useState([])
  const [userAccount, setUserAccount] = useState<UserAccount>({});
  const [lockId, setLockId] = useState<number | undefined>();
  const [loadingSubmitting, setLoadingSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    emailAddress: "",
    gender: "",
    employeeType: "",
    selectEntity: "",
    supplier: "",
    employeeId: "",
    baseSite: "",
    selectBaseUnit: "",
    selectDepartment: "",
    designation: "",
    selectUserType: "",
    selectRole: "",
    selectAccessLevel: "",
    selectEmailPreference: "",
    selectedSites: [],
    selectedCompanies: [],
    lastWorkingDate: "",
    selectUserCategory: ""
  });
  const [userData, setUserData] = useState<UserData>({});

  const fetchUserCategories = async () => {
    try {
      const categories = await axios.get(`https://${baseUrl}/pms/admin/user_categories.json`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserCategories(categories.data);
    } catch (error) {
      console.error('Error loading user categories:', error);
      toast.error('Failed to load user categories');
    }
  }

  useEffect(() => {
    dispatch(fetchEntities());
    dispatch(fetchSuppliers({ baseUrl, token }));
    dispatch(fetchUnits({ baseUrl, token }));
    dispatch(fetchDepartmentData());
    dispatch(fetchRoles({ baseUrl, token }));
    fetchUserCategories();
    if (userId) {
      dispatch(fetchAllowedSites(userId));
    }
    dispatch(fetchAllowedCompanies());
  }, [dispatch, baseUrl, token, userId]);

  useEffect(() => {
    const loadUserAccount = async () => {
      try {
        const account =
          (await ticketManagementAPI.getUserAccount()) as UserAccount;
        setUserAccount(account);
      } catch (error) {
        console.error("Error loading user account:", error);
        toast.error("Failed to load user account");
      }
    };

    loadUserAccount();
  }, []);

  useEffect(() => {
    setCurrentSection("Master");
  }, [setCurrentSection]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const response = (await dispatch(
          getUserDetails({ baseUrl, token, id: Number(id) })
        ).unwrap()) as UserData;
        setUserData(response);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUser();
  }, [dispatch, baseUrl, token, id]);

  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      setLockId(userData.lock_user_permission?.id);
      setFormData({
        firstName: userData.firstname || "",
        lastName: userData.lastname || "",
        mobileNumber: userData.mobile || "",
        emailAddress: userData.email || "",
        gender: userData.gender || "",
        employeeType: userData.employee_type || "",
        selectEntity: userData.entity_id || "",
        supplier: userData.supplier_id || "",
        employeeId: userData.lock_user_permission?.employee_id || "",
        baseSite: userData.site_id || "",
        selectBaseUnit: userData.unit_id || "",
        selectDepartment: userData.department_id || "",
        designation: userData.lock_user_permission?.designation || "",
        selectUserType: userData.user_type || "",
        selectRole: userData.lock_user_permission?.lock_role_id || "",
        selectAccessLevel: userData.lock_user_permission?.access_level || "",
        selectEmailPreference: userData.urgency_email_enabled?.toString() || "",
        selectedSites:
          userData.lock_user_permission?.access_level === "Site"
            ? userData.lock_user_permission?.access_to || []
            : [],
        selectedCompanies:
          userData.lock_user_permission?.access_level === "Company"
            ? userData.lock_user_permission?.access_to || []
            : [],
        lastWorkingDate: userData.lock_user_permission?.last_working_date || "",
        selectUserCategory: userData.user_category_id
      });
    } else {
      console.log("userData not found for id:", id);
    }
  }, [userData, id]);

  const handleInputChange = (
    field: keyof FormData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName) {
      toast.error("Please enter first name");
      return false;
    } else if (!formData.lastName) {
      toast.error("Please enter last name");
      return false;
    } else if (!formData.mobileNumber) {
      toast.error("Please enter mobile number");
      return false;
    } else if (!formData.emailAddress) {
      toast.error("Please enter email address");
      return false;
    } else if (!formData.selectUserType) {
      toast.error("Please select user type");
      return false;
    } else if (!formData.selectRole) {
      toast.error("Please select role");
      return false;
    } else if (!formData.selectAccessLevel) {
      toast.error("Please select access level");
      return false;
    } else if (
      formData.selectAccessLevel === "Site" &&
      formData.selectedSites.length === 0
    ) {
      toast.error("Please select at least one site");
      return false;
    } else if (
      formData.selectAccessLevel === "Company" &&
      formData.selectedCompanies.length === 0
    ) {
      toast.error("Please select at least one company");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoadingSubmitting(true);
    const payload: Payload = {
      user: {
        site_id: formData.baseSite,
        lock_user_permissions_attributes: [
          {
            id: lockId,
            account_id: userAccount.company_id,
            employee_id: formData.employeeId,
            designation: formData.designation,
            unit_id: formData.selectBaseUnit,
            department_id: formData.selectDepartment,
            user_type: formData.selectUserType,
            lock_role_id: formData.selectRole,
            access_level: formData.selectAccessLevel,
            access_to:
              formData.selectAccessLevel === "Site"
                ? formData.selectedSites
                : formData.selectedCompanies,
            urgency_email_enabled: formData.selectEmailPreference,
            last_working_date: formData.lastWorkingDate,
          },
        ],
        firstname: formData.firstName,
        lastname: formData.lastName,
        mobile: formData.mobileNumber,
        email: formData.emailAddress,
        gender: formData.gender,
        entity_id: formData.selectEntity,
        supplier_id: formData.supplier,
        employee_type: formData.employeeType,
        user_category_id: formData.selectUserCategory,
      },
      lock_user_permission: lockId,
    };
    try {
      await dispatch(
        editFMUser({ data: payload, baseUrl, token, id: Number(id) })
      ).unwrap();
      toast.success("User updated successfully");
      navigate("/master/user/fm-users");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(String(error));
    } finally {
      setLoadingSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/master/user/fm-users");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/master/user/fm-users")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Edit FM User</h1>
      </div>

      {/* Form Section */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Box component="form" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Row 1 */}
                <div>
                  <TextField
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    required
                    InputLabelProps={{
                      classes: {
                        asterisk: "text-red-500", // Tailwind class for red color
                      },
                      shrink: true
                    }}
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    required
                    InputLabelProps={{
                      classes: {
                        asterisk: "text-red-500", // Tailwind class for red color
                      },
                      shrink: true
                    }}
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    variant="outlined"
                    value={formData.mobileNumber}
                    onChange={(e) =>
                      handleInputChange("mobileNumber", e.target.value)
                    }
                    required
                    InputLabelProps={{
                      classes: {
                        asterisk: "text-red-500", // Tailwind class for red color
                      },
                      shrink: true
                    }}
                  />
                </div>

                {/* Row 2 */}
                <div>
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    type="email"
                    value={formData.emailAddress}
                    onChange={(e) =>
                      handleInputChange("emailAddress", e.target.value)
                    }
                    required
                    InputLabelProps={{
                      classes: {
                        asterisk: "text-red-500", // Tailwind class for red color
                      },
                      shrink: true
                    }}
                  />
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Gender</InputLabel>
                    <Select
                      value={formData.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value as string)
                      }
                      label="Gender"
                      displayEmpty
                    >
                      <MenuItem value="">Select Gender</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Employee Type</InputLabel>
                    <Select
                      value={formData.employeeType}
                      onChange={(e) =>
                        handleInputChange("employeeType", e.target.value as string)
                      }
                      label="Gender"
                      displayEmpty
                    >
                      <MenuItem value="">Select Type</MenuItem>
                      <MenuItem value="internal">Internal</MenuItem>
                      <MenuItem value="external">External</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Select Entity</InputLabel>
                    <Select
                      value={formData.selectEntity}
                      onChange={(e) =>
                        handleInputChange(
                          "selectEntity",
                          e.target.value as string
                        )
                      }
                      label="Select Entity"
                      displayEmpty
                    >
                      <MenuItem value="">Select Entity</MenuItem>
                      {loading && <MenuItem disabled>Loading...</MenuItem>}
                      {error && <MenuItem disabled>Error: {error}</MenuItem>}
                      {entitiesData?.entities?.map((entity: Entity) => (
                        <MenuItem key={entity.id} value={entity.id}>
                          {entity.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Row 3 */}
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Supplier</InputLabel>
                    <Select
                      value={formData.supplier}
                      onChange={(e) =>
                        handleInputChange("supplier", e.target.value as string)
                      }
                      label="Supplier"
                      displayEmpty
                    >
                      <MenuItem value="">Select Supplier</MenuItem>
                      {suppliersLoading && (
                        <MenuItem disabled>Loading...</MenuItem>
                      )}
                      {suppliersError && (
                        <MenuItem disabled>Error: {suppliersError}</MenuItem>
                      )}
                      {suppliers?.map((supplier: Supplier) => (
                        <MenuItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <TextField
                    fullWidth
                    label="Employee ID"
                    variant="outlined"
                    value={formData.employeeId}
                    onChange={(e) =>
                      handleInputChange("employeeId", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Base Site</InputLabel>
                    <Select
                      value={formData.baseSite}
                      onChange={(e) =>
                        handleInputChange("baseSite", e.target.value as string)
                      }
                      label="Base Site"
                      displayEmpty
                    >
                      <MenuItem value="">Select Base Site</MenuItem>
                      {sites?.map((site: Site) => (
                        <MenuItem key={site.id} value={site.id}>
                          {site.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Row 4 */}
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Select Base Unit</InputLabel>
                    <Select
                      value={formData.selectBaseUnit}
                      onChange={(e) =>
                        handleInputChange(
                          "selectBaseUnit",
                          e.target.value as string
                        )
                      }
                      label="Select Base Unit"
                      displayEmpty
                    >
                      <MenuItem value="">Select Base Unit</MenuItem>
                      {unitsLoading && <MenuItem disabled>Loading...</MenuItem>}
                      {unitsError && (
                        <MenuItem disabled>Error: {unitsError}</MenuItem>
                      )}
                      {units?.map((unit: Unit) => (
                        <MenuItem key={unit.id} value={unit.id}>
                          {unit?.building?.name} - {unit.unit_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Select Department</InputLabel>
                    <Select
                      value={formData.selectDepartment}
                      onChange={(e) =>
                        handleInputChange(
                          "selectDepartment",
                          e.target.value as string
                        )
                      }
                      label="Select Department"
                      displayEmpty
                    >
                      <MenuItem value="">Select Department</MenuItem>
                      {departmentLoading && (
                        <MenuItem disabled>Loading...</MenuItem>
                      )}
                      {departmentError && (
                        <MenuItem disabled>Error: {departmentError}</MenuItem>
                      )}
                      {department?.map((dept: Department) => (
                        <MenuItem key={dept.id} value={dept.id}>
                          {dept.department_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Select Email Preference</InputLabel>
                    <Select
                      value={formData.selectEmailPreference}
                      onChange={(e) =>
                        handleInputChange(
                          "selectEmailPreference",
                          e.target.value as string
                        )
                      }
                      label="Select Email Preference"
                      displayEmpty
                    >
                      <MenuItem value="">Select Email Preference</MenuItem>
                      <MenuItem value="0">All Emails</MenuItem>
                      <MenuItem value="1">Critical Emails Only</MenuItem>
                      <MenuItem value="2">No Emails</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                {/* Row 5 */}
                <div>
                  <TextField
                    fullWidth
                    label="Designation"
                    variant="outlined"
                    value={formData.designation}
                    onChange={(e) =>
                      handleInputChange("designation", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Select User Type<span className="text-red-500">*</span></InputLabel>
                    <Select
                      value={formData.selectUserType}
                      onChange={(e) =>
                        handleInputChange(
                          "selectUserType",
                          e.target.value as string
                        )
                      }
                      label="Select User Type"
                      displayEmpty
                      required
                    >
                      <MenuItem value="">Select User Type</MenuItem>
                      <MenuItem value="pms_admin">Admin (Web & App)</MenuItem>
                      <MenuItem value="pms_technician">
                        Technician (App)
                      </MenuItem>
                      <MenuItem value="pms_hse">Head Site Engineer</MenuItem>
                      <MenuItem value="pms_se">Site Engineer</MenuItem>
                      <MenuItem value="pms_occupant_admin">
                        Customer Admin
                      </MenuItem>
                      <MenuItem value="pms_accounts">Accounts</MenuItem>
                      <MenuItem value="pms_po">Purchase Officer</MenuItem>
                      <MenuItem value="pms_qc">Quality Control</MenuItem>
                      <MenuItem value="pms_security">Security</MenuItem>
                      <MenuItem value="pms_security_supervisor">
                        Security Supervisor
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Select Role<span className="text-red-500">*</span></InputLabel>
                    <Select
                      value={formData.selectRole}
                      onChange={(e) =>
                        handleInputChange(
                          "selectRole",
                          e.target.value as string
                        )
                      }
                      label="Select Role"
                      displayEmpty
                      required
                    >
                      <MenuItem value="">Select Role</MenuItem>
                      {roleLoading && <MenuItem disabled>Loading...</MenuItem>}
                      {roleError && (
                        <MenuItem disabled>Error: {roleError}</MenuItem>
                      )}
                      {roles?.map((role: Role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Row 6 */}
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Select Access Level<span className="text-red-500">*</span></InputLabel>
                    <Select
                      value={formData.selectAccessLevel}
                      onChange={(e) => {
                        handleInputChange(
                          "selectAccessLevel",
                          e.target.value as string
                        );
                        if (e.target.value !== "Site") {
                          handleInputChange("selectedSites", []);
                        }
                      }}
                      label="Select Access Level"
                      displayEmpty
                      required
                    >
                      <MenuItem value="">Select Access Level</MenuItem>
                      <MenuItem value="Company">Company</MenuItem>
                      <MenuItem value="Site">Site</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                {formData.selectAccessLevel === "Site" && (
                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink>
                        Select Sites<span className="text-red-500">*</span>
                      </InputLabel>
                      <Select
                        multiple
                        value={formData.selectedSites}
                        onChange={(e) => handleInputChange("selectedSites", e.target.value as string[])}
                        label="Select Sites"
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip
                                key={value}
                                label={sites?.find((site: Site) => site.id.toString() === value)?.name || value}
                                size="small"
                              />
                            ))}
                          </Box>
                        )}
                      >
                        {sites?.map((site: Site) => (
                          <MenuItem key={site.id} value={site.id.toString()}>
                            {site.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )}

                {/* Multiple Company Selection */}
                {formData.selectAccessLevel === "Company" && (
                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink>
                        Select Companies<span className="text-red-500">*</span>
                      </InputLabel>
                      <Select
                        multiple
                        value={formData.selectedCompanies}
                        onChange={(e) => handleInputChange("selectedCompanies", e.target.value as string[])}
                        label="Select Companies"
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip
                                key={value}
                                label={selectedCompany?.id.toString() === value ? selectedCompany.name : value}
                                size="small"
                              />
                            ))}
                          </Box>
                        )}
                      >
                        {selectedCompany && (
                          <MenuItem key={selectedCompany.id} value={selectedCompany.id.toString()}>
                            {selectedCompany.name}
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </div>
                )}
                <div>
                  <TextField
                    fullWidth
                    label="Last Working Date"
                    variant="outlined"
                    type="date"
                    value={formData.lastWorkingDate}
                    onChange={(e) =>
                      handleInputChange("lastWorkingDate", e.target.value)
                    }
                    required
                    InputLabelProps={{
                      classes: {
                        asterisk: "text-red-500", // Tailwind class for red color
                      },
                      shrink: true
                    }}
                  />
                </div>

                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Select User Category</InputLabel>
                    <Select
                      value={formData.selectUserCategory}
                      onChange={(e) => handleInputChange('selectUserCategory', e.target.value.toString())}
                      label="Select User Category"
                      displayEmpty
                      required
                    >
                      <MenuItem value="">Select User Category</MenuItem>
                      {
                        userCategories?.map((category) => (
                          <MenuItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </div>
              </div>
            </Box>
            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-6">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="px-8 py-3 text-base font-medium rounded-lg"
              >
                Cancel
              </Button>
              <Button
                disabled={loadingSubmitting}
                onClick={handleSubmit}
                className="bg-[#f6f4ee] text-[#C72030] hover:bg-[#ede9e0] border-none px-8 py-3 text-base font-medium rounded-lg"
              >
                Update
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
