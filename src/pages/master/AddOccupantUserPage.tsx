import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Box, Autocomplete, Chip } from '@mui/material';
import { Camera } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Entity, fetchEntities } from '@/store/slices/entitiesSlice';
import { fetchAllowedSites } from '@/store/slices/siteSlice';
import { fetchAllowedCompanies } from '@/store/slices/projectSlice';
import { RootState } from '@/store/store';
import { toast } from 'sonner';

export const AddOccupantUserPage: React.FC = () => {
  const navigate = useNavigate();
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
  });
  const [showAdditional, setShowAdditional] = useState(true);
  const dispatch = useAppDispatch();
  const { data: entitiesData, loading: entitiesLoading, error: entitiesError } = useAppSelector((state) => state.entities);
  const { sites } = useAppSelector((state) => state.site);
  const { selectedCompany } = useAppSelector((state: RootState) => state.project);
  const [departments, setDepartments] = useState<any[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [departmentsError, setDepartmentsError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchEntities());
    // Access Level dependencies (sites/companies)
    try {
      const userStr = localStorage.getItem('user');
      const userId = userStr ? JSON.parse(userStr)?.id : undefined;
      if (userId) dispatch(fetchAllowedSites(userId));
    } catch { }
    dispatch(fetchAllowedCompanies());
  }, [dispatch]);

  // Fetch departments using selectedCompanyId from localStorage
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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => navigate('/master/user/occupant-users');
  const handleSubmit = async () => {
    // Basic required validations mirroring style in Service Add page
    const hasFirstName = formData.firstName.trim() !== '';
    const hasLastName = formData.lastName.trim() !== '';
    const hasMobile = formData.mobileNumber.trim() !== '';
    const hasEmail = formData.email.trim() !== '';
    const hasUserType = formData.userType !== '';
    const hasAccess = formData.accessLevel !== '';

    const needSites = formData.accessLevel === 'Site' && formData.selectedSites.length === 0;
    const needCompanies = formData.accessLevel === 'Company' && formData.selectedCompanies.length === 0;

    setErrors({
      firstName: !hasFirstName,
      lastName: !hasLastName,
      mobileNumber: !hasMobile,
      email: !hasEmail,
      userType: !hasUserType,
      accessLevel: !hasAccess,
      selectedSites: needSites,
      selectedCompanies: needCompanies,
    });

    if (!hasFirstName || !hasLastName || !hasMobile || !hasEmail || !hasUserType || !hasAccess || needSites || needCompanies) {
      return;
    }

    try {
      const token = localStorage.getItem('token') || '';
      const siteId = localStorage.getItem('selectedSiteId') || '';
      const baseUrl = localStorage.getItem('baseUrl') || 'app.gophygital.work';
      // Prefer selectedCompany from Redux; fallback to localStorage selectedCompanyId
      const accountId = (selectedCompany as any)?.id || localStorage.getItem('selectedCompanyId') || undefined;

      const payload = {
        user: {
          site_id: siteId,
          registration_source: 'Web',
          lock_user_permissions_attributes: [
            {
              account_id: accountId,
              employee_id: formData.employeeId,
              designation: formData.designation,
              department_id: formData.department || undefined,
              user_type: formData.userType,
              access_level: formData.accessLevel,
              access_to: formData.accessLevel === 'Company' ? formData.selectedCompanies : formData.selectedSites,
            },
          ],
          firstname: formData.firstName,
          lastname: formData.lastName,
          mobile: formData.mobileNumber,
          email: formData.email,
          gender: formData.gender,
          alternate_address: formData.address,
          alternate_mobile: formData.altMobileNumber,
          birth_date: formData.birthDate,
          entity_id: formData.selectEntity,
        },
      };

      const url = `https://${baseUrl}/pms/users.json`;
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success('Occupant user added successfully');
      navigate('/master/user/occupant-users');
    } catch (error: any) {
      const msg = error?.response?.data?.error || error?.message || 'Failed to create occupant user';
      toast.error(msg);
    }
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  } as const;

  return (
    <div className="p-6 relative">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Setup</span>
          <span>&gt;</span>
          <span>Occupant Users</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">CREATE OCCUPANT USER</h1>
      </div>

      {/* Profile Picture Section */}
      {/* <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-yellow-400" />
          <Button 
            size="sm" 
            className="absolute -bottom-2 -right-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-full w-8 h-8 p-0"
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>
      </div> */}

      {/* Basic Details */}
      <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
        <CardHeader className='bg-[#F6F4EE] mb-4'>
          <CardTitle className="text-lg text-black flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
            BASIC DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextField
              label={<><span>First Name</span><span className='text-red-600'>*</span></>}
              placeholder="Enter First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              fullWidth
              variant="outlined"
              error={errors.firstName}
              helperText={errors.firstName ? 'First Name is required' : ''}
              slotProps={{ inputLabel: { shrink: true } }}
              InputProps={{ sx: fieldStyles }}
            />
            <TextField
              label={<><span>Last Name</span><span className='text-red-600'>*</span></>}
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              fullWidth
              variant="outlined"
              error={errors.lastName}
              helperText={errors.lastName ? 'Last Name is required' : ''}
              slotProps={{ inputLabel: { shrink: true } }}
              InputProps={{ sx: fieldStyles }}
            />
            <TextField
              label={<><span>Mobile Number</span><span className='text-red-600'>*</span></>}
              placeholder="Enter Mobile Number"
              value={formData.mobileNumber}
              onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
              fullWidth
              variant="outlined"
              error={errors.mobileNumber}
              helperText={errors.mobileNumber ? 'Mobile Number is required' : ''}
              slotProps={{ inputLabel: { shrink: true } }}
              InputProps={{ sx: fieldStyles }}
            />

            <TextField
              label={<><span>E-mail ID</span><span className='text-red-600'>*</span></>}
              placeholder="Enter E-mail ID"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              fullWidth
              variant="outlined"
              error={errors.email}
              helperText={errors.email ? 'E-mail ID is required' : ''}
              slotProps={{ inputLabel: { shrink: true } }}
              InputProps={{ sx: fieldStyles }}
            />
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>Gender</InputLabel>
              <MuiSelect
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value as string)}
                label="Gender"
                displayEmpty
                notched
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </MuiSelect>
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>Select Entity</InputLabel>
              <MuiSelect
                value={formData.selectEntity}
                onChange={(e) => handleInputChange('selectEntity', e.target.value as string)}
                label="Select Entity"
                displayEmpty
                notched
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

            <TextField
              label="Employee ID"
              placeholder="Enter Employee ID"
              value={formData.employeeId}
              onChange={(e) => handleInputChange('employeeId', e.target.value)}
              fullWidth
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
              InputProps={{ sx: fieldStyles }}
            />
            <FormControl fullWidth variant="outlined" error={errors.userType} sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>
                Select User Type<span className='text-red-600'>*</span>
              </InputLabel>
              <MuiSelect
                value={formData.userType}
                onChange={(e) => handleInputChange('userType', e.target.value as string)}
                label="Select User Type"
                displayEmpty
                notched
              >
                <MenuItem value="">Select User Type</MenuItem>
                <MenuItem value="pms_occupant_admin">Admin</MenuItem>
                <MenuItem value="pms_occupant">Member</MenuItem>
                <MenuItem value="pms_guest">Guest</MenuItem>
              </MuiSelect>
              {errors.userType && (
                <p className="text-red-600 text-xs mt-1">User Type is required</p>
              )}
            </FormControl>
            <FormControl fullWidth variant="outlined" error={errors.accessLevel} sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>
                Select Access Level<span className='text-red-600'>*</span>
              </InputLabel>
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
              >
                <MenuItem value="">Select Access Level</MenuItem>
                {["Company", "Site"].map((accessLevel) => (
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
              <div>
                <Autocomplete
                  multiple
                  options={sites || []}
                  getOptionLabel={(option: any) => option.name || option.full_name || ''}
                  value={(sites || []).filter((site: any) => formData.selectedSites.includes(String(site.id)))}
                  onChange={(event, newValue: any[]) => {
                    handleInputChange('selectedSites', newValue.map((site: any) => String(site.id)));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<span>Select Sites<span className='text-red-600'>*</span></span>}
                      placeholder="Search and select sites..."
                      variant="outlined"
                      slotProps={{ inputLabel: { shrink: true } }}
                      error={errors.selectedSites}
                      helperText={errors.selectedSites ? 'Please select at least one site' : ''}
                    />
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option: any, index: number) => (
                      <Chip key={option.id} label={option.name || option.full_name || ''} size="small" {...getTagProps({ index })} />
                    ))
                  }
                  isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                  filterSelectedOptions
                />
              </div>
            )}
            {formData.accessLevel === 'Company' && (
              <div>
                <Autocomplete
                  multiple
                  options={selectedCompany ? [selectedCompany] : []}
                  getOptionLabel={(option: any) => option.name || ''}
                  value={selectedCompany && formData.selectedCompanies.includes(String(selectedCompany.id)) ? [selectedCompany] : []}
                  onChange={(event, newValue: any[]) => {
                    handleInputChange('selectedCompanies', newValue.map((company: any) => String(company.id)));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<span>Select Companies<span className='text-red-600'>*</span></span>}
                      placeholder="Search and select companies..."
                      variant="outlined"
                      slotProps={{ inputLabel: { shrink: true } }}
                      error={errors.selectedCompanies}
                      helperText={errors.selectedCompanies ? 'Please select at least one company' : ''}
                    />
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option: any, index: number) => (
                      <Chip key={option.id} label={option.name || ''} size="small" {...getTagProps({ index })} />
                    ))
                  }
                  isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                  filterSelectedOptions
                />
              </div>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Additional Info toggle */}
      <div className="mb-2">
        <Button
          variant="outline"
          className="bg-[#f6f4ee] text-[#C72030] hover:bg-[#ede9e0] border-[#C72030]"
          onClick={() => setShowAdditional((s) => !s)}
        >
          {showAdditional ? '− Additional Info' : '+ Additional Info'}
        </Button>
      </div>

      {showAdditional && (
        <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
          <CardHeader className='bg-[#F6F4EE] mb-4'>
            <CardTitle className="text-lg text-black">ADDITIONAL INFO</CardTitle>
          </CardHeader>
          <CardContent>
            <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="Birth Date"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="Address"
                placeholder="Enter Address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="Alternate Mobile Number"
                placeholder="Enter Alternate Mobile Number"
                value={formData.altMobileNumber}
                onChange={(e) => handleInputChange('altMobileNumber', e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Select Department</InputLabel>
                <MuiSelect
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value as string)}
                  label="Select Department"
                  displayEmpty
                  notched
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
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4 pt-2">
        <Button
          onClick={handleSubmit}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90 px-8 py-3 text-base font-medium rounded-lg"
        >
          Submit
        </Button>
        <Button
          variant="outline"
          onClick={handleCancel}
          className="bg-white text-gray-700 hover:bg-gray-50 border-gray-300 px-8 py-3 text-base font-medium rounded-lg"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AddOccupantUserPage;
