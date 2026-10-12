import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getUser } from '@/utils/auth';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Entity, fetchEntities } from '@/store/slices/entitiesSlice';
import { fetchAllowedSites } from '@/store/slices/siteSlice';
import { fetchAllowedCompanies } from '@/store/slices/projectSlice';
import { fetchFMUsers, fetchRoles } from '@/store/slices/fmUserSlice';
import { RootState } from '@/store/store';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2, FileText, Info, Paperclip, ShieldCheck, Upload, User as UserIcon } from 'lucide-react';
import { FormSection, FormActionBar, assetFieldStyles } from '@/components/common/FormSection';

const uploadSections = [
  {
    id: 'onBoardingFile',
    label: 'On Boarding',
    description: 'Upload onboarding documentation',
  },
  {
    id: 'employeeHandbookFile',
    label: 'Employee Handbook',
    description: 'Company policies and guidelines',
  },
  {
    id: 'employeeCompensationFile',
    label: 'Employee Compensation',
    description: 'Salary and benefits information',
  },
  {
    id: 'exitProcessFile',
    label: 'Exit Process',
    description: 'Offboarding procedures',
  },
  {
    id: 'managementFile',
    label: 'Employee Management & Record Keeping',
    description: 'HR records and documentation',
  },
];

export const AddOccupantUserPage: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();
  const isRestrictedUser = user?.email === 'karan.balsara@zycus.com';
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    gender: '',
    employeeId: '',
    userType: '',
    selectEntity: '',
    accessLevel: '',
    selectedSites: [] as string[],
    selectedCompanies: [] as string[],
    birthDate: '',
    department: '',
    address: '',
    altMobileNumber: '',
    designation: '',
    selectUserCategory: '',
    selectRole: '',
    shift: '',
    reportsTo: '',
    workType: '',
    onBoardingFile: null,
    employeeHandbookFile: null,
    employeeCompensationFile: null,
    exitProcessFile: null,
    managementFile: null,
  });

  const [userCategories, setUserCategories] = useState([])
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const { data: entitiesData, loading: entitiesLoading, error: entitiesError } = useAppSelector((state) => state.entities);
  const { sites } = useAppSelector((state) => state.site);
  const { selectedCompany } = useAppSelector((state: RootState) => state.project);
  const {
    data: roles,
    loading: roleLoading,
    error: roleError,
  } = useAppSelector((state) => state.fetchRoles);
  const [departments, setDepartments] = useState<any[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [departmentsError, setDepartmentsError] = useState<string | null>(null);
  const [shifts, setShifts] = useState([])
  const [users, setUsers] = useState([])

  const fetchShifts = async () => {
    try {
      const response = await axios.get(`https://${baseUrl}/pms/admin/user_shifts.json`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShifts(response.data.user_shifts);
    } catch (error) {
      console.log(error)
    }
  }

  const getUsers = async () => {
    try {
      const response = await dispatch(fetchFMUsers()).unwrap();
      setUsers(response.users);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchShifts();
    getUsers();
  }, [])

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
    if (isRestrictedUser) {
      navigate('/maintenance/asset');
      return;
    }
    dispatch(fetchEntities());
    try {
      const userStr = localStorage.getItem('user');
      const userId = userStr ? JSON.parse(userStr)?.id : undefined;
      if (userId) dispatch(fetchAllowedSites(userId));
    } catch { }
    dispatch(fetchAllowedCompanies());
    dispatch(fetchRoles({ baseUrl, token }));
    fetchUserCategories();
  }, [dispatch, isRestrictedUser, navigate]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setDepartmentsLoading(true);
        setDepartmentsError(null);
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const companyId = localStorage.getItem('selectedCompanyId');
        if (!baseUrl || !token || !companyId) {
          setDepartments([]);
          if (!companyId) setDepartmentsError('Missing selectedCompanyId');
          setDepartmentsLoading(false);
          return;
        }
        const url = `https://${baseUrl}/pms/company_setups/${companyId}/departments.json`;
        const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        const list = resp.data?.departments || [];
        setDepartments(list);
      } catch (e) {
        console.error('Fetch departments error', e);
        setDepartmentsError('Failed to load departments');
        setDepartments([]);
      } finally {
        setDepartmentsLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    mobileNumber: false,
    email: false,
    userType: false,
    accessLevel: false,
    selectedSites: false,
    selectedCompanies: false,
  });

  const handleInputChange = (field: string, value: string | string[]) => {
    // Allow only letters, numbers and spaces for firstName and lastName
    if (field === 'firstName' || field === 'lastName') {
      const stringValue = typeof value === 'string' ? value : '';
      const alphabeticValue = stringValue.replace(/[^A-Za-z0-9\s]/g, '');
      setFormData((prev) => ({ ...prev, [field]: alphabeticValue }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleCancel = () => navigate('/master/user/occupant-users');

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
    }
  };

  const validateForm = () => {
    const mobileRegex = /^[0-9]{10}$/;

    if (!formData.firstName) {
      toast.error("First Name is required.");
      return false;
    }
    if (!formData.lastName) {
      toast.error("Last Name is required.");
      return false;
    }
    if (!formData.mobileNumber) {
      toast.error("Mobile Number is required.");
      return false;
    } else if (!mobileRegex.test(formData.mobileNumber)) {
      toast.error("Mobile Number must be 10 digits.");
      return false;
    }
    if (!formData.email) {
      toast.error("Email is required.");
      return false;
    }
    if (!formData.userType) {
      toast.error("User Type is required.");
      return false;
    }
    if (!formData.accessLevel) {
      toast.error("Access Level is required.");
      return false;
    }

    if (formData.accessLevel === 'Company' && formData.selectedCompanies.length === 0) {
      toast.error("Select at least one company.");
      return false;
    }

    if (formData.accessLevel === 'Site' && formData.selectedSites.length === 0) {
      toast.error("Select at least one site.");
      return false;
    }

    return true;
  };

  console.log(formData.selectedCompanies)

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('token');
      const siteId = localStorage.getItem('selectedSiteId');
      const baseUrl = localStorage.getItem('baseUrl');
      const accountId = (selectedCompany as any)?.id || localStorage.getItem('selectedCompanyId') || undefined;

      const accessToValue = formData.accessLevel === 'Company'
        ? formData.selectedCompanies.map(c => Number(c))
        : formData.selectedSites.map(s => Number(s));

      console.log('access_to value:', accessToValue);
      console.log('access_to format check:', JSON.stringify(accessToValue));

      // Create FormData for multipart/form-data
      const formDataPayload = new FormData();

      // Add basic user fields
      formDataPayload.append('user[site_id]', siteId || '');
      formDataPayload.append('user[registration_source]', 'Web');
      formDataPayload.append('user[firstname]', formData.firstName);
      formDataPayload.append('user[lastname]', formData.lastName);
      formDataPayload.append('user[mobile]', formData.mobileNumber);
      formDataPayload.append('user[email]', formData.email);
      formDataPayload.append('user[gender]', formData.gender);
      formDataPayload.append('user[alternate_address]', formData.address);
      formDataPayload.append('user[alternate_mobile]', formData.altMobileNumber);
      formDataPayload.append('user[birth_date]', formData.birthDate);
      formDataPayload.append('user[entity_id]', formData.selectEntity);
      formDataPayload.append('user[user_category_id]', formData.selectUserCategory);
      formDataPayload.append('user[report_to_id]', formData.reportsTo);

      // Add lock_user_permissions_attributes
      formDataPayload.append('user[lock_user_permissions_attributes][0][account_id]', accountId || '');
      formDataPayload.append('user[lock_user_permissions_attributes][0][user_shift_id]', formData.shift);
      formDataPayload.append('user[lock_user_permissions_attributes][0][work_type]', formData.workType);
      formDataPayload.append('user[lock_user_permissions_attributes][0][employee_id]', formData.employeeId);
      formDataPayload.append('user[lock_user_permissions_attributes][0][designation]', formData.designation);
      if (formData.department) {
        formDataPayload.append('user[lock_user_permissions_attributes][0][department_id]', formData.department);
      }
      formDataPayload.append('user[lock_user_permissions_attributes][0][user_type]', formData.userType);
      formDataPayload.append('user[lock_user_permissions_attributes][0][access_level]', formData.accessLevel);

      // Add access_to as array - Rails expects array notation with []
      accessToValue.forEach((value) => {
        formDataPayload.append('user[lock_user_permissions_attributes][0][access_to][]', value.toString());
      });

      formDataPayload.append('user[lock_user_permissions_attributes][0][status]', 'pending');
      if (formData.selectRole) {
        formDataPayload.append('user[lock_user_permissions_attributes][0][lock_role_id]', formData.selectRole);
      }

      // Add file attachments
      if (formData.onBoardingFile) {
        formDataPayload.append('user[lock_user_permissions_attributes][0][on_boarding_attachments_attributes][0][document]', formData.onBoardingFile);
      }
      if (formData.employeeHandbookFile) {
        formDataPayload.append('user[lock_user_permissions_attributes][0][handbook_attachments_attributes][0][document]', formData.employeeHandbookFile);
      }
      if (formData.employeeCompensationFile) {
        formDataPayload.append('user[lock_user_permissions_attributes][0][compensation_attachments_attributes][0][document]', formData.employeeCompensationFile);
      }
      if (formData.exitProcessFile) {
        formDataPayload.append('user[lock_user_permissions_attributes][0][exit_process_attachments_attributes][0][document]', formData.exitProcessFile);
      }
      if (formData.managementFile) {
        formDataPayload.append('user[lock_user_permissions_attributes][0][management_record_attachments_attributes][0][document]', formData.managementFile);
      }

      const url = `https://${baseUrl}/pms/users.json`;
      const response = await axios.post(url, formDataPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.error || (response.data.errors && response.data.errors.length > 0)) {
        toast.error(response.data?.error || response.data?.errors[0]);
        return;
      }

      toast.success('Occupant user added successfully');
      navigate('/master/user/occupant-users');
    } catch (error: any) {
      const msg = error?.response?.data?.error || error?.message || 'Failed to create occupant user';
      toast.error(msg);
    }
  };

  const requiredLabel = (text: string) => (
    <span>
      {text}
      <span className="fm-required-mark">*</span>
    </span>
  );

  if (isRestrictedUser) return null;

  return (
    <div className="p-4 sm:p-6 max-w-full mx-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span>Occupant Users</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">Add Occupant User</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          ADD OCCUPANT USER
        </h1>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Basic Details */}
        <FormSection title="BASIC DETAILS" icon={UserIcon}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <TextField
              label={requiredLabel('First Name')}
              placeholder="Enter First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              fullWidth
              variant="outlined"
              error={errors.firstName}
              helperText={errors.firstName ? 'First Name is required' : ''}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: assetFieldStyles }}
            />
            <TextField
              label={requiredLabel('Last Name')}
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              fullWidth
              variant="outlined"
              error={errors.lastName}
              helperText={errors.lastName ? 'Last Name is required' : ''}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: assetFieldStyles }}
            />
            <TextField
              label={requiredLabel('Mobile Number')}
              placeholder="Enter Mobile Number"
              value={formData.mobileNumber}
              onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
              fullWidth
              variant="outlined"
              error={errors.mobileNumber}
              helperText={errors.mobileNumber ? 'Mobile Number is required' : ''}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: assetFieldStyles }}
              inputProps={{
                maxLength: 10,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />
            <TextField
              label={requiredLabel('E-mail ID')}
              placeholder="Enter E-mail ID"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              fullWidth
              variant="outlined"
              error={errors.email}
              helperText={errors.email ? 'E-mail ID is required' : ''}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: assetFieldStyles }}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Gender</InputLabel>
              <MuiSelect
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value as string)}
                label="Gender"
                displayEmpty
                notched
                sx={assetFieldStyles}
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </MuiSelect>
            </FormControl>
            <TextField
              label="Employee ID"
              placeholder="Enter Employee ID"
              value={formData.employeeId}
              onChange={(e) => handleInputChange('employeeId', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: assetFieldStyles }}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Select Entity</InputLabel>
              <MuiSelect
                value={formData.selectEntity}
                onChange={(e) => handleInputChange('selectEntity', e.target.value as string)}
                label="Select Entity"
                displayEmpty
                notched
                sx={assetFieldStyles}
              >
                <MenuItem value="">Select Entity</MenuItem>
                {entitiesLoading && (
                  <MenuItem value="" disabled>Loading...</MenuItem>
                )}
                {entitiesError && (
                  <MenuItem value="" disabled>Error loading entities</MenuItem>
                )}
                {entitiesData?.entities?.map((entity: Entity) => (
                  <MenuItem key={entity.id} value={String(entity.id)}>
                    {entity.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>
        </FormSection>

        {/* Access & Role */}
        <FormSection title="ACCESS & ROLE" icon={ShieldCheck}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormControl fullWidth variant="outlined" error={errors.userType}>
              <InputLabel shrink>{requiredLabel('Select User Type')}</InputLabel>
              <MuiSelect
                value={formData.userType}
                onChange={(e) => handleInputChange('userType', e.target.value as string)}
                label="Select User Type"
                displayEmpty
                notched
                sx={assetFieldStyles}
              >
                <MenuItem value="">Select User Type</MenuItem>
                <MenuItem value="pms_occupant_admin">Admin</MenuItem>
                <MenuItem value="pms_occupant">Member</MenuItem>
                {/* <MenuItem value="pms_guest">Guest</MenuItem> */}
              </MuiSelect>
              {errors.userType && (
                <p className="text-red-600 text-xs mt-1">User Type is required</p>
              )}
            </FormControl>
            <FormControl fullWidth variant="outlined" error={errors.accessLevel}>
              <InputLabel shrink>{requiredLabel('Select Access Level')}</InputLabel>
              <MuiSelect
                value={formData.accessLevel}
                onChange={(e) => {
                  const val = e.target.value as string;
                  handleInputChange('accessLevel', val);
                  if (val !== 'Site') handleInputChange('selectedSites', []);
                  if (val !== 'Company') handleInputChange('selectedCompanies', []);
                }}
                label="Select Access Level"
                displayEmpty
                notched
                sx={assetFieldStyles}
              >
                <MenuItem value="">Select Access Level</MenuItem>
                {['Company', 'Site'].map((accessLevel) => (
                  <MenuItem key={accessLevel} value={accessLevel}>
                    {accessLevel}
                  </MenuItem>
                ))}
              </MuiSelect>
              {errors.accessLevel && (
                <p className="text-red-600 text-xs mt-1">Access Level is required</p>
              )}
            </FormControl>
            {formData.accessLevel === 'Site' && (
              <FormControl fullWidth variant="outlined" error={errors.selectedSites}>
                <InputLabel shrink>{requiredLabel('Select Sites')}</InputLabel>
                <MuiSelect
                  multiple
                  value={formData.selectedSites}
                  onChange={(e) => handleInputChange('selectedSites', e.target.value as string[])}
                  label="Select Sites"
                  displayEmpty
                  notched
                  sx={assetFieldStyles}
                  renderValue={(selected) =>
                    selected.length > 0
                      ? sites?.filter(site => selected.includes(site.id.toString())).map(site => site.name).join(', ')
                      : 'Select Sites'
                  }
                >
                  {sites?.map((site) => (
                    <MenuItem key={site.id} value={site.id.toString()}>
                      {site.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {errors.selectedSites && (
                  <p className="text-red-600 text-xs mt-1">At least one site is required</p>
                )}
              </FormControl>
            )}
            {formData.accessLevel === 'Company' && (
              <FormControl fullWidth variant="outlined" error={errors.selectedCompanies}>
                <InputLabel shrink>{requiredLabel('Select Companies')}</InputLabel>
                <MuiSelect
                  multiple
                  value={formData.selectedCompanies}
                  onChange={(e) => handleInputChange('selectedCompanies', e.target.value as string[])}
                  label="Select Companies"
                  displayEmpty
                  notched
                  sx={assetFieldStyles}
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
                </MuiSelect>
                {errors.selectedCompanies && (
                  <p className="text-red-600 text-xs mt-1">At least one company is required</p>
                )}
              </FormControl>
            )}
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Select Role</InputLabel>
              <MuiSelect
                value={formData.selectRole}
                onChange={(e) => handleInputChange('selectRole', e.target.value)}
                label="Select Role"
                displayEmpty
                notched
                sx={assetFieldStyles}
              >
                <MenuItem value="">Select Role</MenuItem>
                {roleLoading && <MenuItem disabled>Loading...</MenuItem>}
                {roleError && <MenuItem disabled>Error: {roleError}</MenuItem>}
                {Array.isArray(roles) && roles?.map((role: any) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Select User Category</InputLabel>
              <MuiSelect
                value={formData.selectUserCategory}
                onChange={(e) => handleInputChange('selectUserCategory', e.target.value)}
                label="Select User Category"
                displayEmpty
                notched
                required
                sx={assetFieldStyles}
              >
                <MenuItem value="">Select User Category</MenuItem>
                {userCategories?.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>
        </FormSection>

        {/* Additional Info */}
        <FormSection title="ADDITIONAL INFO" icon={Info} collapsible defaultExpanded={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <TextField
              label="Birth Date"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: assetFieldStyles }}
            />
            <TextField
              label="Alternate Mobile Number"
              placeholder="Enter Alternate Mobile Number"
              value={formData.altMobileNumber}
              onChange={(e) => handleInputChange('altMobileNumber', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: assetFieldStyles }}
            />
            <TextField
              label="Address"
              placeholder="Enter Address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: assetFieldStyles }}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Select Department</InputLabel>
              <MuiSelect
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value as string)}
                label="Select Department"
                displayEmpty
                notched
                sx={assetFieldStyles}
              >
                <MenuItem value="">Select Department</MenuItem>
                {departmentsLoading && (
                  <MenuItem value="" disabled>Loading...</MenuItem>
                )}
                {departmentsError && (
                  <MenuItem value="" disabled>{departmentsError}</MenuItem>
                )}
                {departments?.map((d: any) => (
                  <MenuItem key={d.id} value={String(d.id)}>{d.department_name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
            <TextField
              label="Designation"
              placeholder="Enter Designation"
              value={formData.designation}
              onChange={(e) => handleInputChange('designation', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: assetFieldStyles }}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Select Shift</InputLabel>
              <MuiSelect
                value={formData.shift}
                onChange={(e) => handleInputChange('shift', e.target.value as string)}
                label="Select Shift"
                displayEmpty
                notched
                sx={assetFieldStyles}
              >
                <MenuItem value="">Select Shift</MenuItem>
                {shifts?.map((s: any) => (
                  <MenuItem key={s.id} value={String(s.id)}>{s.timings}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Reports To</InputLabel>
              <MuiSelect
                value={formData.reportsTo}
                onChange={(e) => handleInputChange('reportsTo', e.target.value as string)}
                label="Reports To"
                displayEmpty
                notched
                sx={assetFieldStyles}
              >
                <MenuItem value="">Select Reports To</MenuItem>
                {users?.map((d: any) => (
                  <MenuItem key={d.id} value={String(d.id)}>{d.full_name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Work Type</InputLabel>
              <MuiSelect
                value={formData.workType}
                onChange={(e) => handleInputChange('workType', e.target.value as string)}
                label="Work Type"
                displayEmpty
                notched
                sx={assetFieldStyles}
              >
                <MenuItem value="">Select Work Type</MenuItem>
                {[
                  { label: 'Work from Office', value: 'Work from Office' },
                  { label: 'Work from Home/Office', value: 'Work from Home/Office' },
                ]?.map((d) => (
                  <MenuItem key={d.value} value={String(d.value)}>{d.label}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>
        </FormSection>

        {/* Documents */}
        <FormSection title="DOCUMENTS" icon={Paperclip} collapsible defaultExpanded={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadSections.map((section) => (
              <div
                key={section.id}
                className="border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-all duration-200 bg-white"
              >
                <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-1">
                  {section.label}
                </label>
                <p className="text-xs text-gray-500 mb-4">{section.description}</p>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {formData[section.id] ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-brand-success flex-shrink-0" />
                        <span className="text-sm text-gray-700 truncate font-medium">
                          {formData[section.id].name}
                        </span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-500 italic">No file chosen</span>
                      </>
                    )}
                  </div>

                  <label className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-hover text-white text-sm font-medium rounded-md cursor-pointer transition-colors duration-200 flex-shrink-0">
                    <Upload className="w-4 h-4" />
                    Choose
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, section.id)}
                      className="hidden"
                    />
                  </label>
                </div>

                {formData[section.id] && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Size: {(formData[section.id].size / 1024).toFixed(1)} KB</span>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, [section.id]: null }))}
                        className="text-brand-error hover:underline font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </FormSection>
      </div>

      <FormActionBar onCancel={handleCancel} onSubmit={handleSubmit} submitLabel="Submit" />
    </div>
  );
};

export default AddOccupantUserPage;
