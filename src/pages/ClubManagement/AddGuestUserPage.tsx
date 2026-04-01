import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Camera, User } from 'lucide-react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box, Avatar } from '@mui/material';
import { toast } from 'sonner';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Entity, fetchEntities } from '@/store/slices/entitiesSlice';
import { fetchAllowedSites } from '@/store/slices/siteSlice';
import { fetchAllowedCompanies } from '@/store/slices/projectSlice';
import { RootState } from '@/store/store';

export const AddGuestUserPage: React.FC = () => {
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
    selectUserCategory: '',
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userCategories, setUserCategories] = useState([])
  const [showAdditional, setShowAdditional] = useState(false);
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const { data: entitiesData, loading: entitiesLoading, error: entitiesError } = useAppSelector((state) => state.entities);
  const { sites } = useAppSelector((state) => state.site);
  const { selectedCompany } = useAppSelector((state: RootState) => state.project);
  const [departments, setDepartments] = useState<any[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);

  const location = useLocation();

  const isClubSite = location.pathname.includes('club-management');

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
    try {
      const userStr = localStorage.getItem('user');
      const userId = userStr ? JSON.parse(userStr)?.id : undefined;
      if (userId) dispatch(fetchAllowedSites(userId));
    } catch { }
    dispatch(fetchAllowedCompanies());
    fetchUserCategories();
  }, [dispatch]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setDepartmentsLoading(true);
        const companyId = localStorage.getItem('selectedCompanyId');
        if (!baseUrl || !token || !companyId) {
          setDepartments([]);
          setDepartmentsLoading(false);
          return;
        }
        const url = `https://${baseUrl}/pms/company_setups/${companyId}/departments.json`;
        const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        const list = resp.data?.departments || [];
        setDepartments(list);
      } catch (e) {
        console.error('Fetch departments error', e);
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
    if ((field === 'mobileNumber' || field === 'altMobileNumber') && typeof value === 'string') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 10) return;
      setFormData((prev) => ({ ...prev, [field]: numericValue }));
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancel = () => navigate('/club-management/users/guest');

  const validateForm = () => {
    const newErrors = {
      firstName: !formData.firstName,
      lastName: !formData.lastName,
      email: !formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      mobileNumber: !formData.mobileNumber || !/^[0-9]{10}$/.test(formData.mobileNumber),
    };

    setErrors((prev) => ({ ...prev, ...newErrors }));

    if (newErrors.firstName) {
      toast.error("First Name is required.");
      return false;
    }
    if (newErrors.lastName) {
      toast.error("Last Name is required.");
      return false;
    }
    if (!formData.email) {
      toast.error("Email is required.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid Email Address.");
      return false;
    }
    if (!formData.mobileNumber) {
      toast.error("Mobile Number is required.");
      return false;
    }
    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      toast.error("Mobile Number must be 10 digits.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const siteId = localStorage.getItem('selectedSiteId');
      const accountId = (selectedCompany as any)?.id || localStorage.getItem('selectedCompanyId') || undefined;

      const formDataToSend = new FormData();
      formDataToSend.append('user[site_id]', siteId || '');
      formDataToSend.append('user[registration_source]', 'Web');
      formDataToSend.append('user[firstname]', formData.firstName);
      formDataToSend.append('user[lastname]', formData.lastName);
      formDataToSend.append('user[mobile]', formData.mobileNumber);
      formDataToSend.append('user[email]', formData.email);
      formDataToSend.append('user[gender]', formData.gender);
      formDataToSend.append('user[alternate_address]', formData.address);
      formDataToSend.append('user[alternate_mobile]', formData.altMobileNumber);
      formDataToSend.append('user[birth_date]', formData.birthDate);
      formDataToSend.append('user[entity_id]', formData.selectEntity);
      formDataToSend.append('user[user_category_id]', formData.selectUserCategory);

      if (profileImage) {
        formDataToSend.append('user[profile_icon]', profileImage);
      }

      // Permissions nested attributes
      const permissions = [
        {
          account_id: accountId,
          employee_id: formData.employeeId,
          designation: formData.designation,
          department_id: formData.department || '',
          user_type: 'pms_guest',
          access_level: formData.accessLevel,
          access_to: formData.accessLevel === 'Company' ? formData.selectedCompanies : formData.selectedSites,
          status: "pending"
        },
      ];

      permissions.forEach((permission, index) => {
        Object.entries(permission).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => {
              formDataToSend.append(`user[lock_user_permissions_attributes][${index}][${key}][]`, v);
            });
          } else {
            formDataToSend.append(`user[lock_user_permissions_attributes][${index}][${key}]`, String(value));
          }
        });
      });

      const url = `https://${baseUrl}/pms/users.json`;
      const response = await axios.post(url, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.error || (response.data.errors && response.data.errors.length > 0)) {
        toast.error(response.data?.error || response.data?.errors[0]);
        return;
      }

      toast.success('Guest added successfully');
      navigate('/club-management/users/guest');
    } catch (error: any) {
      const msg = error?.response?.data?.error || error?.message || 'Failed to create guest';
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
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/club-management/users/guest")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Add Guest</h1>
      </div>

      {/* Basic Details */}
      <Card>
        <CardHeader>
          <CardTitle>Guest Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Box component="form" noValidate>
            <div className="flex flex-col items-center mb-8">
              <div className="relative group cursor-pointer" onClick={handleImageClick}>
                <Avatar
                  src={profileImagePreview || ""}
                  sx={{ width: 120, height: 120, border: '2px solid #e5e7eb' }}
                >
                  {!profileImagePreview && <User size={60} color="#9ca3af" />}
                </Avatar>
                <div className="absolute bottom-0 right-0 bg-[#C72030] p-2 rounded-full border-2 border-white text-white group-hover:bg-[#A01020] transition-colors">
                  <Camera size={20} />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 font-medium">Profile Photo</p>
              <p className="text-xs text-gray-400">Recommended: Square image, max 2MB</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TextField
                label={<>First Name <span className="text-red-500">*</span></>}
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
                label={<>Last Name <span className="text-red-500">*</span></>}
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
                label={<>Mobile Number <span className="text-red-500">*</span></>}
                placeholder="Enter Mobile Number"
                value={formData.mobileNumber}
                onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                fullWidth
                variant="outlined"
                error={errors.mobileNumber}
                helperText={errors.mobileNumber ? (formData.mobileNumber ? 'Mobile Number must be 10 digits' : 'Mobile Number is required') : ''}
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />

              <TextField
                label={<>E-mail ID <span className="text-red-500">*</span></>}
                placeholder="Enter E-mail ID"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                fullWidth
                variant="outlined"
                error={errors.email}
                helperText={errors.email ? (formData.email ? 'Invalid Email ID' : 'E-mail ID is required') : ''}
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  label="Gender"
                  notched
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>
                  Access Level
                </InputLabel>
                <Select
                  value={formData.accessLevel}
                  onChange={(e) => {
                    handleInputChange('accessLevel', e.target.value);
                    handleInputChange('selectedSites', []);
                    handleInputChange('selectedCompanies', []);
                  }}
                  label="Access Level"
                  notched
                >
                  <MenuItem value="">
                    <em>Select Access Level</em>
                  </MenuItem>
                  <MenuItem value="Site">Site</MenuItem>
                  <MenuItem value="Company">Company</MenuItem>
                </Select>
              </FormControl>
              {formData.accessLevel === 'Site' && (
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>
                    Select Sites
                  </InputLabel>
                  <Select
                    multiple
                    value={formData.selectedSites}
                    onChange={(e) =>
                      handleInputChange('selectedSites', typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)
                    }
                    label="Select Sites"
                    renderValue={(selected) =>
                      sites
                        ?.filter((s) => (selected as string[]).includes(String(s.id)))
                        .map((s) => s.name)
                        .join(', ') || ''
                    }
                    notched
                  >
                    {(sites || []).map((site) => (
                      <MenuItem key={site.id} value={String(site.id)}>
                        {site.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {formData.accessLevel === 'Company' && (
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>
                    Select Companies
                  </InputLabel>
                  <Select
                    multiple
                    value={formData.selectedCompanies}
                    onChange={(e) =>
                      handleInputChange(
                        'selectedCompanies',
                        typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value
                      )
                    }
                    label="Select Companies"
                    renderValue={(selected) => (selected as string[]).join(', ')}
                    notched
                  >
                    <MenuItem value="Company A">Company A</MenuItem>
                    <MenuItem value="Company B">Company B</MenuItem>
                    <MenuItem value="Company C">Company C</MenuItem>
                  </Select>
                </FormControl>
              )}

              {
                !isClubSite && (
                  <div>
                    <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                      <InputLabel shrink>Select Entity</InputLabel>
                      <Select
                        value={formData.selectEntity}
                        onChange={(e) => handleInputChange('selectEntity', e.target.value)}
                        label="Select Entity"
                        notched
                      >
                        <MenuItem value="">
                          <em>Select Entity</em>
                        </MenuItem>
                        {(entitiesData?.entities || []).map((entity) => (
                          <MenuItem key={entity.id} value={String(entity.id)}>
                            {entity.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )
              }
            </div>

            {
              !isClubSite && (
                <div className="my-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-[#f6f4ee] text-[#C72030] hover:bg-[#ede9e0] border-[#C72030]"
                    onClick={() => setShowAdditional((s) => !s)}
                  >
                    {showAdditional ? 'Hide' : 'Show'} Additional Details
                  </Button>
                </div>
              )
            }

            {showAdditional && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
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
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Department</InputLabel>
                  <Select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    label="Department"
                    notched
                    disabled={departmentsLoading}
                  >
                    <MenuItem value="">
                      <em>Select Department</em>
                    </MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={String(dept.id)}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                  label="Alternate Mobile Number"
                  placeholder="Enter Alternate Mobile"
                  value={formData.altMobileNumber}
                  onChange={(e) => handleInputChange('altMobileNumber', e.target.value)}
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
              </div>
            )}
          </Box>
        </CardContent>
      </Card>

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

export default AddGuestUserPage;
