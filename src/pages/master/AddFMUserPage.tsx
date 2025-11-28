import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Entity, fetchEntities } from '@/store/slices/entitiesSlice';
import { createFmUser, fetchRoles, fetchSuppliers, fetchUnits } from '@/store/slices/fmUserSlice';
import { fetchDepartmentData } from '@/store/slices/departmentSlice';
import { fetchAllowedSites } from '@/store/slices/siteSlice';
import { fetchAllowedCompanies } from '@/store/slices/projectSlice';
import { RootState } from '@/store/store';
import { toast } from 'sonner';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';
import axios from 'axios';

export const AddFMUserPage = () => {
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const { data: entitiesData, loading, error } = useAppSelector((state) => state.entities);
  const { data: suppliers, loading: suppliersLoading, error: suppliersError } = useAppSelector((state) => state.fetchSuppliers);
  const { data: units, loading: unitsLoading, error: unitsError } = useAppSelector((state) => state.fetchUnits);
  const { data: department, loading: departmentLoading, error: departmentError } = useAppSelector((state) => state.department);
  const { data: roles, loading: roleLoading, error: roleError } = useAppSelector((state) => state.fetchRoles);
  const { sites } = useAppSelector((state) => state.site);
  const { selectedCompany } = useAppSelector((state: RootState) => state.project);

  const hostname = window.location.hostname;
  const isOmanSite = hostname.includes('oig.gophygital.work');

  const [userCategories, setUserCategories] = useState([])
  const [userAccount, setUserAccount] = useState({})
  const { setCurrentSection } = useLayout();
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem('user'))?.id;

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
    dispatch(fetchAllowedSites(userId));
    dispatch(fetchAllowedCompanies())
    fetchUserCategories();
  }, [dispatch, baseUrl, token, userId]);

  useEffect(() => {
    const loadUserAccount = async () => {
      try {
        const account = await ticketManagementAPI.getUserAccount();
        setUserAccount(account);
      } catch (error) {
        console.error('Error loading user account:', error);
        toast.error('Failed to load user account');
      }
    };

    loadUserAccount();
  }, [])

  useEffect(() => {
    setCurrentSection('Master');
  }, [setCurrentSection]);

  console.log(userAccount)

  const [loadingSubmitting, setLoadingSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    emailAddress: '',
    gender: '',
    selectEntity: '',
    supplier: '',
    employeeId: '',
    baseSite: '',
    selectBaseUnit: '',
    selectDepartment: '',
    designation: '',
    selectUserType: '',
    selectUserCategory: '',
    selectRole: '',
    selectAccessLevel: '',
    selectEmailPreference: '',
    selectedSites: [] as string[],
    selectedCompanies: [] as string[]
  });

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits
    if (!/^\d*$/.test(value)) return;
    // Restrict length based on isOmanSite
    const maxLength = isOmanSite ? 8 : 10;
    if (value.length <= maxLength) {
      handleInputChange('mobileNumber', value);
    }
  };

  const validateForm = () => {
    if (!formData.firstName) {
      toast.error('Please enter first name')
      return false
    } else if (!formData.lastName) {
      toast.error('Please enter last name')
      return false
    } else if (!formData.mobileNumber) {
      toast.error('Please enter mobile number')
      return false
    } else if (!/^\d+$/.test(formData.mobileNumber)) {
      toast.error('Mobile number must contain only digits')
      return false
    } else if (isOmanSite && formData.mobileNumber.length !== 8) {
      toast.error('Mobile number must be exactly 8 digits')
      return false
    } else if (!isOmanSite && formData.mobileNumber.length !== 10) {
      toast.error('Mobile number must be exactly 10 digits')
      return false
    } else if (!formData.emailAddress) {
      toast.error('Please enter email address')
      return false
    } else if (!formData.selectUserType) {
      toast.error('Please select user type')
      return false
    } else if (!formData.selectRole) {
      toast.error('Please select role')
      return false
    } else if (!formData.selectAccessLevel) {
      toast.error('Please select access level')
      return false
    } else if (formData.selectAccessLevel === 'Site' && formData.selectedSites.length === 0) {
      toast.error('Please select at least one site')
      return false
    } else if (formData.selectAccessLevel === 'Company' && formData.selectedCompanies.length === 0) {
      toast.error('Please select at least one company')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    setLoadingSubmitting(true)
    const payload = {
      user: {
        site_id: formData.baseSite,
        lock_user_permissions_attributes: [
          {
            account_id: userAccount.company_id,
            employee_id: formData.employeeId,
            designation: formData.designation,
            unit_id: formData.selectBaseUnit,
            department_id: formData.selectDepartment,
            user_type: formData.selectUserType,
            lock_role_id: formData.selectRole,
            access_level: formData.selectAccessLevel,
            access_to: formData.selectAccessLevel === 'Site' ? formData.selectedSites : formData.selectedCompanies,
            urgency_email_enabled: formData.selectEmailPreference,
          },
        ],
        firstname: formData.firstName,
        lastname: formData.lastName,
        mobile: formData.mobileNumber,
        email: formData.emailAddress,
        gender: formData.gender,
        entity_id: formData.selectEntity,
        supplier_id: formData.supplier,
        user_category_id: formData.selectUserCategory
      },
    };
    try {
      const response = await dispatch(createFmUser({ data: payload, baseUrl, token })).unwrap();
      if (response.error || (response.errors && response.errors.length > 0)) {
        toast.error(response?.error || response?.errors[0]);
        return;
      }
      toast.success('User added successfully');
      navigate('/master/user/fm-users');
    } catch (error) {
      console.log(error)
      toast.error(error);
    } finally {
      setLoadingSubmitting(false)
    }
  };

  const handleCancel = () => {
    navigate('/master/user/fm-users');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/master/user/fm-users')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Add FM User</h1>
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
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
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
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
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
                    onChange={handleMobileNumberChange}
                    required
                    inputProps={{
                      maxLength: isOmanSite ? 8 : 10,
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                    }}
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
                    onChange={(e) => handleInputChange('emailAddress', e.target.value)}
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
                      onChange={(e) => handleInputChange('gender', e.target.value)}
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
                    <InputLabel shrink>Select Entity</InputLabel>
                    <Select
                      value={formData.selectEntity}
                      onChange={(e) => handleInputChange('selectEntity', e.target.value)}
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
                      onChange={(e) => handleInputChange('supplier', e.target.value)}
                      label="Supplier"
                      displayEmpty
                    >
                      <MenuItem value="">Select Supplier</MenuItem>
                      {suppliersLoading && <MenuItem disabled>Loading...</MenuItem>}
                      {suppliersError && <MenuItem disabled>Error: {suppliersError}</MenuItem>}
                      {suppliers?.map((supplier) => (
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
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Base Site</InputLabel>
                    <Select
                      value={formData.baseSite}
                      onChange={(e) => handleInputChange('baseSite', e.target.value)}
                      label="Base Site"
                      displayEmpty
                    >
                      <MenuItem value="">Select Base Site</MenuItem>
                      {sites?.map((site) => (
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
                      onChange={(e) => handleInputChange('selectBaseUnit', e.target.value)}
                      label="Select Base Unit"
                      displayEmpty
                    >
                      <MenuItem value="">Select Base Unit</MenuItem>
                      {unitsLoading && <MenuItem disabled>Loading...</MenuItem>}
                      {unitsError && <MenuItem disabled>Error: {unitsError}</MenuItem>}
                      {units?.map((unit) => (
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
                      onChange={(e) => handleInputChange('selectDepartment', e.target.value)}
                      label="Select Department"
                      displayEmpty
                    >
                      <MenuItem value="">Select Department</MenuItem>
                      {departmentLoading && <MenuItem disabled>Loading...</MenuItem>}
                      {departmentError && <MenuItem disabled>Error: {departmentError}</MenuItem>}
                      {department?.map((dept) => (
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
                      onChange={(e) => handleInputChange('selectEmailPreference', e.target.value)}
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
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ maxLength: 50 }}
                  />
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Select User Type<span className='text-red-500'>*</span></InputLabel>
                    <Select
                      value={formData.selectUserType}
                      onChange={(e) => handleInputChange('selectUserType', e.target.value)}
                      label="Select User Type"
                      displayEmpty
                      required
                    >
                      <MenuItem value="">Select User Type</MenuItem>
                      <MenuItem value="pms_admin">Admin (Web & App)</MenuItem>
                      <MenuItem value="pms_technician">Technician (App)</MenuItem>
                      <MenuItem value="pms_hse">Head Site Engineer</MenuItem>
                      <MenuItem value="pms_se">Site Engineer</MenuItem>
                      <MenuItem value="pms_occupant_admin">Customer Admin</MenuItem>
                      <MenuItem value="pms_accounts">Accounts</MenuItem>
                      <MenuItem value="pms_po">Purchase Officer</MenuItem>
                      <MenuItem value="pms_qc">Quality Control</MenuItem>
                      <MenuItem value="pms_security">Security</MenuItem>
                      <MenuItem value="pms_security_supervisor">Security Supervisor</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Select Role<span className='text-red-500'>*</span></InputLabel>
                    <Select
                      value={formData.selectRole}
                      onChange={(e) => handleInputChange('selectRole', e.target.value)}
                      label="Select Role"
                      displayEmpty
                      required
                    >
                      <MenuItem value="">Select Role</MenuItem>
                      {roleLoading && <MenuItem disabled>Loading...</MenuItem>}
                      {roleError && <MenuItem disabled>Error: {roleError}</MenuItem>}
                      {roles?.map((role) => (
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
                    <InputLabel shrink>Select Access Level<span className='text-red-500'>*</span></InputLabel>
                    <Select
                      value={formData.selectAccessLevel}
                      onChange={(e) => {
                        handleInputChange('selectAccessLevel', e.target.value);
                        if (e.target.value !== 'Site') {
                          handleInputChange('selectedSites', []);
                        }
                        if (e.target.value !== 'Company') {
                          handleInputChange('selectedCompanies', []);
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

                {/* Multiple Site Selection */}
                {formData.selectAccessLevel === 'Site' && (
                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink>Select Sites<span className='text-red-500'>*</span></InputLabel>
                      <Select
                        multiple
                        value={formData.selectedSites}
                        onChange={(e) => handleInputChange('selectedSites', e.target.value as string[])}
                        label="Select Sites"
                        displayEmpty
                        renderValue={(selected) =>
                          selected.length > 0
                            ? sites?.filter(site => selected.includes(site.id.toString())).map(site => site.name || site.full_name).join(', ')
                            : 'Select Sites'
                        }
                      >
                        {sites?.map((site) => (
                          <MenuItem key={site.id} value={site.id.toString()}>
                            {site.name || site.full_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )}
                {formData.selectAccessLevel === 'Company' && (
                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink>Select Companies<span className='text-red-500'>*</span></InputLabel>
                      <Select
                        multiple
                        value={formData.selectedCompanies}
                        onChange={(e) => handleInputChange('selectedCompanies', e.target.value as string[])}
                        label="Select Companies"
                        displayEmpty
                        renderValue={(selected) =>
                          selected.length > 0
                            ? selectedCompany && selected.includes(selectedCompany.id.toString())
                              ? selectedCompany.name
                              : 'Select Companies'
                            : 'Select Companies'
                        }
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
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Select User Category</InputLabel>
                    <Select
                      value={formData.selectUserCategory}
                      onChange={(e) => handleInputChange('selectUserCategory', e.target.value)}
                      label="Select User Category"
                      displayEmpty
                      required
                    >
                      <MenuItem value="">Select User Category</MenuItem>
                      {
                        userCategories?.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
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
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};