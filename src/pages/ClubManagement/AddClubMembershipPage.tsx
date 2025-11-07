import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormLabel
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { getFullUrl, getAuthenticatedFetchOptions, API_CONFIG } from '@/config/apiConfig';
import { getToken } from '@/utils/auth';

// Interfaces
interface OccupantUserResponse {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  company_id: number;
  site_id: number;
  user_type: string;
  lock_user_permission?: {
    id: number;
    account_id: number;
    user_type: string;
    access_level: string;
    access_to: string[];
    status: string;
    designation?: string;
  };
  unit_name?: string;
  company?: string;
}

interface UserResponse {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  flat?: string;
  tower?: string;
  unit?: {
    name: string;
  };
  building?: {
    name: string;
  };
}

interface ResidentTypeResponse {
  id: number;
  name: string;
}

interface RelationResponse {
  id: number;
  name: string;
}

// Field styles for Material-UI components
const fieldStyles = {
  height: '45px',
  backgroundColor: '#fff',
  borderRadius: '4px',
  '& .MuiOutlinedInput-root': {
    height: '45px',
    '& fieldset': {
      borderColor: '#ddd',
    },
    '&:hover fieldset': {
      borderColor: '#C72030',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
};

const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' }
];

const RESIDENT_TYPE_OPTIONS = [
  { value: 'Owner', label: 'Owner' },
  { value: 'Tenant', label: 'Tenant' },
  { value: 'Family Member', label: 'Family Member' }
];

const RELATION_OPTIONS = [
  { value: 'Self', label: 'Self' },
  { value: 'Spouse', label: 'Spouse' },
  { value: 'Father', label: 'Father' },
  { value: 'Mother', label: 'Mother' },
  { value: 'Son', label: 'Son' },
  { value: 'Daughter', label: 'Daughter' },
  { value: 'Brother', label: 'Brother' },
  { value: 'Sister', label: 'Sister' },
  { value: 'Other', label: 'Other' }
];

export const AddClubMembershipPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get ID from URL for edit mode
  const isEditMode = !!id;

  // Form state
  const [userSelectionMode, setUserSelectionMode] = useState<'select' | 'manual'>('select');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clubMembership, setClubMembership] = useState(true); // Always enabled
  const [cardAllocated, setCardAllocated] = useState(false);
  const [accessLevel, setAccessLevel] = useState('Site'); // Default access level

  // File uploads
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [residentPhotoFile, setResidentPhotoFile] = useState<File | null>(null);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null);
  const [residentPhotoPreview, setResidentPhotoPreview] = useState<string | null>(null);
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);

  // Dropdown data
  const [users, setUsers] = useState<OccupantUserResponse[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Get site and company from localStorage
  const getSiteIdFromStorage = () => {
    return localStorage.getItem('selectedSiteId') || 
         new URLSearchParams(window.location.search).get('site_id');
  };

  const getCompanyIdFromStorage = () => {
    return localStorage.getItem('selectedCompanyId') || 
         new URLSearchParams(window.location.search).get('company_id');
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };

  // Date states
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [formData, setFormData] = useState({
    // User fields
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    age: '',
    gender: '',
    
    // Location fields
    tower: '',
    flat: '',
    
    // Membership fields
    residentType: '',
    relationWithOwner: '',
    membershipNumber: '',
    accessCardId: '',
  });

  // Load users on component mount
  useEffect(() => {
    loadUsers();
    
    // Load membership data if in edit mode
    if (isEditMode && id) {
      loadMembershipData(id);
    }
  }, [id, isEditMode]);

  // Load membership data for edit mode
  const loadMembershipData = async (membershipId: string) => {
    setLoading(true);
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;
      
      const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/club_members/${membershipId}.json`);
      url.searchParams.append('access_token', token || '');
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch membership details');
      }
      
      const data = await response.json();
      console.log('Loaded membership data:', data);
      
      // Populate form with existing data
      setSelectedUserId(data.user_id);
      setSelectedUser(data.user_id?.toString() || '');
      setUserSelectionMode('select'); // Always use select mode for edit
      
      setFormData({
        firstName: data.user_name?.split(' ')[0] || '',
        lastName: data.user_name?.split(' ').slice(1).join(' ') || '',
        email: data.user_email || '',
        mobile: data.user_mobile || '',
        age: '',
        gender: '',
        tower: '',
        flat: '',
        residentType: '',
        relationWithOwner: '',
        membershipNumber: data.membership_number || '',
        accessCardId: data.access_card_id || '',
      });
      
      // Set dates
      if (data.start_date) {
        setStartDate(dayjs(data.start_date));
      }
      if (data.end_date) {
        setEndDate(dayjs(data.end_date));
      }
      
      // Set access card
      setCardAllocated(data.access_card_enabled || false);
      
      toast.success('Membership data loaded');
    } catch (error) {
      console.error('Error loading membership data:', error);
      toast.error('Failed to load membership data');
    } finally {
      setLoading(false);
    }
  };

  // Load users from API
  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const url = getFullUrl('/pms/account_setups/occupant_users.json');
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error('Failed to fetch occupant users');
      }
      
      const data = await response.json();
      
      if (data.occupant_users && Array.isArray(data.occupant_users)) {
        setUsers(data.occupant_users);
      } else {
        console.error('Unexpected API response format:', data);
        toast.error('Failed to load users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Handle user selection
  const handleUserSelection = (userId: string) => {
    setSelectedUser(userId);
    const userIdNum = parseInt(userId);
    setSelectedUserId(userIdNum);

    const user = users.find(u => u.id === userIdNum);
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        mobile: user.mobile,
        tower: '',
        flat: ''
      }));
    }
  };

  // Handle file uploads
  const handleIdCardUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIdCardFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdCardPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResidentPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResidentPhotoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setResidentPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachmentFiles(prev => [...prev, ...newFiles]);
      
      // Create previews for new files
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachmentPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove files
  const removeIdCard = () => {
    setIdCardFile(null);
    setIdCardPreview(null);
  };
  
  const removeResidentPhoto = () => {
    setResidentPhotoFile(null);
    setResidentPhotoPreview(null);
  };
  
  const removeAttachment = (index: number) => {
    setAttachmentFiles(prev => prev.filter((_, i) => i !== index));
    setAttachmentPreviews(prev => prev.filter((_, i) => i !== index));
  };
  

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (userSelectionMode === 'select' && !selectedUserId) {
      toast.error('Please select a user');
      return;
    }

    if (userSelectionMode === 'manual') {
      if (!formData.firstName || !formData.lastName) {
        toast.error('Please enter first name and last name');
        return;
      }
      if (!formData.email || !formData.mobile) {
        toast.error('Please enter email and mobile number');
        return;
      }
    }

    // Mandatory membership date validations
    if (!startDate) {
      toast.error('Please select start date (mandatory)');
      return;
    }

    if (!endDate) {
      toast.error('Please select end date (mandatory)');
      return;
    }

    // Validate that end date is after start date
    if (endDate && startDate && endDate.isBefore(startDate)) {
      toast.error('End date must be after start date');
      return;
    }

    // Mandatory file validations
    if (!idCardFile) {
      toast.error('Please upload ID card (mandatory)');
      return;
    }

    if (!residentPhotoFile) {
      toast.error('Please upload resident photo (mandatory)');
      return;
    }

    if (cardAllocated && !formData.accessCardId) {
      toast.error('Please enter access card ID');
      return;
    }

    setIsSubmitting(true);
    try {
      const siteId = getSiteIdFromStorage();
      const companyId = getCompanyIdFromStorage();

      // Convert files to base64
      let identificationImageBase64 = '';
      let avatarBase64 = '';
      const attachmentsBase64: string[] = [];

      if (idCardFile) {
        identificationImageBase64 = await fileToBase64(idCardFile);
      }

      if (residentPhotoFile) {
        avatarBase64 = await fileToBase64(residentPhotoFile);
      }

      if (attachmentFiles.length > 0) {
        for (const file of attachmentFiles) {
          const base64 = await fileToBase64(file);
          attachmentsBase64.push(base64);
        }
      }

      // Prepare payload based on mode
      let payload: any;

      if (userSelectionMode === 'select') {
        // Select user mode - only club_member data
        payload = {
          club_member: {
            user_id: selectedUserId,
            pms_site_id: parseInt(siteId),
            club_member_enabled: true,
            access_card_enabled: cardAllocated,
            access_card_id: cardAllocated ? formData.accessCardId : null,
            start_date: startDate ? startDate.format('YYYY-MM-DD') : null,
            end_date: endDate ? endDate.format('YYYY-MM-DD') : null,
            identification_image: identificationImageBase64 || null,
            attachments: attachmentsBase64,
            avatar: avatarBase64 || null
          }
        };
      } else {
        // Manual mode - include user creation
        payload = {
          club_member: {
            pms_site_id: parseInt(siteId),
            club_member_enabled: true,
            access_card_enabled: cardAllocated,
            access_card_id: cardAllocated ? formData.accessCardId : null,
            start_date: startDate ? startDate.format('YYYY-MM-DD') : null,
            end_date: endDate ? endDate.format('YYYY-MM-DD') : null,
            identification_image: identificationImageBase64 || null,
            attachments: attachmentsBase64,
            avatar: avatarBase64 || null
          },
          user: {
            site_id: parseInt(siteId),
            registration_source: 'Web',
            lock_user_permissions_attributes: [
              {
                account_id: parseInt(companyId),
                user_type: 'pms_occupant',
                access_level: accessLevel,
                access_to: [parseInt(siteId)],
                status: 'pending'
              }
            ],
            firstname: formData.firstName,
            lastname: formData.lastName,
            mobile: formData.mobile,
            email: formData.email
          }
        };
      }

      const savedToken = getToken();

      const url = getFullUrl(isEditMode ? `/club_members/${id}.json` : '/club_members.json');
      const options: RequestInit = {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${savedToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      };

      console.log('Submitting payload:', payload);

      const response = await fetch(url, options);

      if (!response.ok) {
        let errorData: any = {};
        const contentType = response.headers.get('content-type');
        
        try {
          // Try to parse as JSON first
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
          } else {
            // If not JSON, read as text
            const errorText = await response.text();
            errorData = { error: errorText };
          }
        } catch (parseError) {
          // If parsing fails, try to read as text
          const errorText = await response.text();
          errorData = { error: errorText };
        }
        
        console.error('API Error Response:', errorData);
        
        // Handle specific error messages
        if (errorData.error === "User is already exist" || errorData.error === "User already exists") {
          toast.error('This user already has a club membership');
        } else if (errorData.error && errorData.error.includes('User has already been taken')) {
          toast.error('This user already has a club membership');
        } else if (typeof errorData.error === 'string' && errorData.error.includes('already')) {
          toast.error('This user already exists in the system');
        } else if (errorData.message) {
          toast.error(errorData.message);
        } else if (errorData.error) {
          toast.error(errorData.error);
        } else {
          toast.error(`Failed to ${isEditMode ? 'update' : 'create'} club membership`);
        }
        
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      console.log(`Club membership ${isEditMode ? 'updated' : 'created'} successfully:`, data);
      
      toast.success(`Club membership ${isEditMode ? 'updated' : 'added'} successfully`);
      navigate('/club-management/membership');
    } catch (error) {
      console.error('Error adding membership:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add membership');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate('/club-management/membership');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-[#1a1a1a]">
                {isEditMode ? 'Edit Club Membership' : 'Add Club Membership'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isEditMode ? 'Update membership details' : 'Create a new club membership'}
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C72030]"></div>
              <p className="text-gray-600">Loading membership data...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* User Selection Mode */}
          <div className="mb-6">
            <FormLabel component="legend" className="text-sm font-medium text-gray-700 mb-2">
              Select User Mode
            </FormLabel>
            <RadioGroup
              row
              value={userSelectionMode}
              onChange={(e) => {
                setUserSelectionMode(e.target.value as 'select' | 'manual');
                // Reset form when switching modes
                setSelectedUser('');
                setSelectedUserId(null);
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  mobile: '',
                  age: '',
                  gender: '',
                  tower: '',
                  flat: '',
                  residentType: '',
                  relationWithOwner: '',
                  membershipNumber: '',
                  accessCardId: '',
                });
              }}
            >
              <FormControlLabel 
                value="select" 
                control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                label="Select User" 
              />
              <FormControlLabel 
                value="manual" 
                control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                label="Enter User Details" 
              />
            </RadioGroup>
          </div>

          {/* User Selection Dropdown */}
          {userSelectionMode === 'select' && (
            <div className="mb-6">
              <FormControl fullWidth sx={fieldStyles}>
                <InputLabel>User *</InputLabel>
                <Select
                  value={selectedUser}
                  onChange={(e) => handleUserSelection(e.target.value)}
                  label="User *"
                  disabled={loadingUsers}
                >
                  <MenuItem value="">
                    <em>Select User</em>
                  </MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id.toString()}>
                      {user.firstname} {user.lastname} - {user.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}

          {/* Manual User Details */}
          {userSelectionMode === 'manual' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <TextField
                label="First Name *"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                sx={fieldStyles}
                fullWidth
              />
              <TextField
                label="Last Name *"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                sx={fieldStyles}
                fullWidth
              />
              <TextField
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                sx={fieldStyles}
                fullWidth
              />
              <TextField
                label="Mobile *"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                sx={fieldStyles}
                fullWidth
              />
            </div>
          )}

      
          {/* Club Membership - Always Enabled */}
          <div className="mb-6">
            <FormControlLabel
              control={
                <Checkbox
                  checked={clubMembership}
                  disabled={true}
                  sx={{
                    color: '#C72030',
                    '&.Mui-checked': {
                      color: '#C72030',
                    },
                    '&.Mui-disabled': {
                      color: '#C72030',
                    },
                  }}
                />
              }
              label="Club Membership (Always Enabled)"
            />
          </div>

          {/* Membership Details */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Membership Details <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DatePicker
                  label="Start Date *"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue as Dayjs | null)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        ...fieldStyles,
                        '& .MuiOutlinedInput-root': {
                          ...fieldStyles['& .MuiOutlinedInput-root'],
                          backgroundColor: startDate ? '#f0fdf4' : '#fff',
                        },
                      },
                    },
                  }}
                />

                <DatePicker
                  label="End Date *"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue as Dayjs | null)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        ...fieldStyles,
                        '& .MuiOutlinedInput-root': {
                          ...fieldStyles['& .MuiOutlinedInput-root'],
                          backgroundColor: endDate ? '#f0fdf4' : '#fff',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

          {/* Access Card Checkbox */}
          <div className="mb-6">
            <FormControlLabel
              control={
                <Checkbox
                  checked={cardAllocated}
                  onChange={(e) => setCardAllocated(e.target.checked)}
                  sx={{
                    color: '#C72030',
                    '&.Mui-checked': {
                      color: '#C72030',
                    },
                  }}
                />
              }
              label="Access Card Allocated"
            />
          </div>

          {/* Access Card ID (shown only if Access Card Allocated is checked) */}
          {cardAllocated && (
            <div className="mb-6">
              <TextField
                label="Enter Access Card ID"
                value={formData.accessCardId}
                onChange={(e) => setFormData({ ...formData, accessCardId: e.target.value })}
                sx={fieldStyles}
                fullWidth
              />
            </div>
          )}

          {/* File Uploads */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Upload Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID Card Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Card <span className="text-red-500">*</span>
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  idCardFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-[#C72030]'
                }`}>
                  {idCardFile ? (
                    <div>
                      {idCardPreview && (
                        <div className="mb-3">
                          <img 
                            src={idCardPreview} 
                            alt="ID Card Preview" 
                            className="max-h-40 mx-auto rounded object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{idCardFile.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeIdCard}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">Upload ID Card (Required)</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleIdCardUpload}
                        className="hidden"
                        id="id-card-upload"
                      />
                      <label htmlFor="id-card-upload">
                        <Button variant="outline" className="cursor-pointer" asChild>
                          <span>Choose File</span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Resident Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Photo <span className="text-red-500">*</span>
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  residentPhotoFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-[#C72030]'
                }`}>
                  {residentPhotoFile ? (
                    <div>
                      {residentPhotoPreview && (
                        <div className="mb-3">
                          <img 
                            src={residentPhotoPreview} 
                            alt="Resident Photo Preview" 
                            className="max-h-40 mx-auto rounded object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{residentPhotoFile.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeResidentPhoto}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">Upload Photo (Required)</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleResidentPhotoUpload}
                        className="hidden"
                        id="resident-photo-upload"
                      />
                      <label htmlFor="resident-photo-upload">
                        <Button variant="outline" className="cursor-pointer" asChild>
                          <span>Choose File</span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Other Documents - Multiple Upload */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Other Documents</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#C72030] transition-colors">
              <div className="text-center mb-4">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Upload Additional Documents</p>
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleAttachmentUpload}
                  className="hidden"
                  id="other-documents-upload"
                  multiple
                />
                <label htmlFor="other-documents-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>Choose Files</span>
                  </Button>
                </label>
                <p className="text-xs text-gray-400 mt-2">You can select multiple files</p>
              </div>

              {/* Display uploaded documents */}
              {attachmentFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Documents ({attachmentFiles.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {attachmentFiles.map((file, index) => (
                      <div key={index} className="relative border border-gray-200 rounded-lg p-2 group">
                        {/* Preview for images */}
                        {file.type.startsWith('image/') && attachmentPreviews[index] ? (
                          <div className="mb-2">
                            <img 
                              src={attachmentPreviews[index]} 
                              alt={`Document ${index + 1}`} 
                              className="w-full h-24 object-cover rounded"
                            />
                          </div>
                        ) : (
                          <div className="mb-2 h-24 bg-gray-100 rounded flex items-center justify-center">
                            <div className="text-center">
                              <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                              <span className="text-xs text-gray-500">
                                {file.type.includes('pdf') ? 'PDF' : 'DOC'}
                              </span>
                            </div>
                          </div>
                        )}
                        <p className="text-xs text-gray-600 truncate mb-1" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                          className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleGoBack}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default AddClubMembershipPage;
