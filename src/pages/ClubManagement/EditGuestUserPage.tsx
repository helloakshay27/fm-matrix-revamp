import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Box, Autocomplete, Chip, Select, Avatar } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Entity, fetchEntities } from '@/store/slices/entitiesSlice';
import { fetchAllowedSites } from '@/store/slices/siteSlice';
import { fetchAllowedCompanies } from '@/store/slices/projectSlice';
import { RootState } from '@/store/store';
import { toast } from 'sonner';
import { ArrowLeft, Camera, User } from 'lucide-react';

export const EditGuestUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
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

  const [showAdditional, setShowAdditional] = useState(true);
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const { data: entitiesData, loading: entitiesLoading, error: entitiesError } = useAppSelector((state) => state.entities);
  const { sites } = useAppSelector((state) => state.site);
  const { selectedCompany } = useAppSelector((state: RootState) => state.project);
  const [departments, setDepartments] = useState<any[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [departmentsError, setDepartmentsError] = useState<string | null>(null);
  const [userCategories, setUserCategories] = useState([])

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

  // Prefill by fetching user
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const baseUrl = localStorage.getItem('baseUrl') || 'app.gophygital.work';
        const token = localStorage.getItem('token') || '';
        const url = `https://${baseUrl}/pms/get_fm_user_detail.json?id=${id}`;
        const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        const u = resp.data?.user || resp.data || {};
        const lup = u.lock_user_permission || {};

        const accessLevel = lup.access_level || '';
        const accessTo: string[] = Array.isArray(lup.access_to) ? lup.access_to.map((v: any) => String(v)) : [];

        if (u.avatar || u.profile_image_url || u.profile_image) {
          setProfileImagePreview(u.avatar || u.profile_image_url || u.profile_image);
        }

        setFormData((prev) => ({
          ...prev,
          firstName: u.firstname || '',
          lastName: u.lastname || '',
          mobileNumber: u.mobile || '',
          email: u.email || '',
          gender: u.gender || '',
          employeeId: lup.employee_id || '',
          userType: u.user_type || lup.user_type || '',
          selectEntity: u.entity_id ? String(u.entity_id) : '',
          accessLevel: accessLevel,
          selectedSites: accessLevel === 'Site' ? accessTo : [],
          selectedCompanies: accessLevel === 'Company' ? accessTo : [],
          birthDate: u.birth_date || '',
          department: (lup.department_id ?? lup.department?.id) ? String(lup.department_id ?? lup.department?.id) : '',
          address: u.alternate_address || '',
          altMobileNumber: u.alternate_mobile || '',
          designation: lup.designation || '',
          selectUserCategory: u.user_category_id || '',
        }));
      } catch (e) {
        console.error('Error fetching user for edit', e);
        toast.error('Failed to load user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

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

  const handleCancel = () => navigate(`/club-management/users/guest/view/${id}`);

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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('token') || '';
      const siteId = localStorage.getItem('selectedSiteId') || '';
      const baseUrl = localStorage.getItem('baseUrl') || 'app.gophygital.work';
      const accountId = (selectedCompany as any)?.id || localStorage.getItem('selectedCompanyId') || undefined;

      const formDataToSend = new FormData();
      formDataToSend.append('user[site_id]', siteId);
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
        formDataToSend.append('user[avatar]', profileImage);
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

      if (!id) throw new Error('Missing user id');

      const url = `https://${baseUrl}/pms/users/${id}.json`;
      await axios.put(url, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Guest updated successfully');
      navigate(`/club-management/users/guest/view/${id}`);
    } catch (error: any) {
      const msg = error?.response?.data?.error || error?.message || 'Failed to update guest';
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
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Edit Guest</h1>
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
                <FormControl fullWidth variant="outlined" error={errors.selectedSites} sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>
                    Select Sites<span className='text-red-600'>*</span>
                  </InputLabel>
                  <MuiSelect
                    multiple
                    value={formData.selectedSites}
                    onChange={(e) => handleInputChange('selectedSites', e.target.value as string[])}
                    label="Select Sites"
                    displayEmpty
                    notched
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
                <FormControl fullWidth variant="outlined" error={errors.selectedCompanies} sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>
                    Select Companies<span className='text-red-600'>*</span>
                  </InputLabel>
                  <MuiSelect
                    multiple
                    value={formData.selectedCompanies}
                    onChange={(e) => handleInputChange('selectedCompanies', e.target.value as string[])}
                    label="Select Companies"
                    displayEmpty
                    notched
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

            <div className="my-6">
              <Button
                type='button'
                variant="outline"
                className="bg-[#f6f4ee] text-[#C72030] hover:bg-[#ede9e0] border-[#C72030]"
                onClick={() => setShowAdditional((s) => !s)}
              >
                {showAdditional ? '− Additional Info' : '+ Additional Info'}
              </Button>
            </div>

            {showAdditional && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          disabled={loading}
        >
          Update
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

export default EditGuestUserPage;
