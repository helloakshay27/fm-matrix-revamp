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

interface MembershipPlan {
  id: number;
  name: string;
  price: string;
  user_limit: string;
  renewal_terms: string;
  plan_amenities?: PlanAmenity[];
}

interface PlanAmenity {
  id: number;
  facility_setup_id: number;
  access: string;
  facility_setup_name?: string;
  facility_setup?: {
    id: number;
    name: string;
  };
}

interface Amenity {
  id: number;
  name: string;
  price?: string;
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

const MEMBERSHIP_TYPE_OPTIONS = [
  { value: 'Day Pass', label: 'Day Pass' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Quarterly', label: 'Quarterly' },
  { value: 'Annual', label: 'Annual' },
  { value: 'Corporate', label: 'Corporate' }
];

const REFERRED_BY_OPTIONS = [
  { value: 'Friend', label: 'Friend' },
  { value: 'Hotel', label: 'Hotel' },
  { value: 'Social Media', label: 'Social Media' },
  { value: 'Partner Brand', label: 'Partner Brand' },
  { value: 'Trainer', label: 'Trainer' },
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
    dateOfBirth: '',
    gender: '',
    residentialAddress: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    
    // Location fields
    tower: '',
    flat: '',
    
    // Membership fields
    residentType: '',
    relationWithOwner: '',
    membershipNumber: '',
    accessCardId: '',
    membershipType: '',
    referredBy: '',
  });

  // Health & Wellness Information
  const [hasInjuries, setHasInjuries] = useState<'yes' | 'no' | ''>('');
  const [injuryDetails, setInjuryDetails] = useState('');
  const [physicalRestrictions, setPhysicalRestrictions] = useState('');
  const [currentMedication, setCurrentMedication] = useState('');
  const [pilatesExperience, setPilatesExperience] = useState('');

  // Activity Interests
  const [fitnessGoals, setFitnessGoals] = useState<string[]>([]);
  const [fitnessGoalsOther, setFitnessGoalsOther] = useState('');
  const [interestedSessions, setInterestedSessions] = useState<string[]>([]);
  const [interestedSessionsOther, setInterestedSessionsOther] = useState('');

  // Lifestyle & Communication Insights
  const [heardAbout, setHeardAbout] = useState('');
  const [motivations, setMotivations] = useState<string[]>([]);
  const [updatePreferences, setUpdatePreferences] = useState<string[]>([]);
  const [communicationChannel, setCommunicationChannel] = useState<string[]>([]);

  // Occupation & Demographics
  const [profession, setProfession] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [corporateInterest, setCorporateInterest] = useState<'yes' | 'no' | ''>('');

  // Step management
  const [currentStep, setCurrentStep] = useState(1);

  // Membership Plan & Add-ons
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [allAmenities, setAllAmenities] = useState<Amenity[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [editablePlanCost, setEditablePlanCost] = useState<string>('');
  const [cgstPercentage, setCgstPercentage] = useState<string>('9');
  const [sgstPercentage, setSgstPercentage] = useState<string>('9');

  // Load users on component mount
  useEffect(() => {
    loadUsers();
    loadMembershipPlans();
    loadAmenities();
    
    // Load membership data if in edit mode
    if (isEditMode && id) {
      loadMembershipData(id);
    }
  }, [id, isEditMode]);

  // Load membership plans
  const loadMembershipPlans = async () => {
    setLoadingPlans(true);
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;
      
      const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/membership_plans.json`);
      url.searchParams.append('access_token', token || '');
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch membership plans');
      }
      
      const data = await response.json();
      setMembershipPlans(data.plans || []);
    } catch (error) {
      console.error('Error loading membership plans:', error);
      toast.error('Failed to load membership plans');
    } finally {
      setLoadingPlans(false);
    }
  };

  // Load amenities
  const loadAmenities = async () => {
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;
      
      const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/membership_plans/amenitiy_list.json`);
      url.searchParams.append('access_token', token || '');
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch amenities');
      }
      
      const data = await response.json();
      setAllAmenities(data.ameneties || []);
    } catch (error) {
      console.error('Error loading amenities:', error);
      toast.error('Failed to load amenities');
    }
  };

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
        dateOfBirth: '',
        gender: '',
        residentialAddress: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        tower: '',
        flat: '',
        residentType: '',
        relationWithOwner: '',
        membershipNumber: data.membership_number || '',
        accessCardId: data.access_card_id || '',
        membershipType: data.membership_type || '',
        referredBy: data.referred_by || '',
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
      
      // Set existing image previews (but not the files, as they're already on server)
      if (data.identification_image) {
        setIdCardPreview(data.identification_image);
      }
      
      if (data.avatar) {
        // Handle avatar URL format
        const avatarUrl = data.avatar?.startsWith('%2F') 
          ? `https://fm-uat-api.lockated.com${decodeURIComponent(data.avatar)}` 
          : data.avatar;
        setResidentPhotoPreview(avatarUrl);
      }
      
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
        dateOfBirth: '',
        gender: '',
        residentialAddress: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        tower: '',
        flat: '',
        membershipType: '',
        referredBy: ''
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
    // Step 2 validation
    if (!selectedPlanId) {
      toast.error('Please select a membership plan');
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
        const clubMemberData: any = {
          user_id: selectedUserId,
          pms_site_id: parseInt(siteId),
          club_member_enabled: true,
          access_card_enabled: cardAllocated,
          access_card_id: cardAllocated ? formData.accessCardId : null,
          start_date: startDate ? startDate.format('YYYY-MM-DD') : null,
          end_date: endDate ? endDate.format('YYYY-MM-DD') : null,
          membership_plan_id: selectedPlanId,
          plan_cost: editablePlanCost,
          cgst_percentage: cgstPercentage,
          sgst_percentage: sgstPercentage,
          cgst_amount: cgstAmount.toString(),
          sgst_amount: sgstAmount.toString(),
          subtotal: subtotal.toString(),
          total_cost: totalCost.toString(),
        };

        // Add selected add-ons
        if (selectedAddOns.length > 0) {
          clubMemberData.selected_amenities = selectedAddOns;
        }

        // Only add file fields if they exist (new uploads)
        if (identificationImageBase64) {
          clubMemberData.identification_image = identificationImageBase64;
        }
        if (avatarBase64) {
          clubMemberData.avatar = avatarBase64;
        }
        if (attachmentsBase64.length > 0) {
          clubMemberData.attachments = attachmentsBase64;
        }

        payload = {
          club_member: clubMemberData
        };
      } else {
        // Manual mode - include user creation
        const clubMemberData: any = {
          pms_site_id: parseInt(siteId),
          club_member_enabled: true,
          access_card_enabled: cardAllocated,
          access_card_id: cardAllocated ? formData.accessCardId : null,
          start_date: startDate ? startDate.format('YYYY-MM-DD') : null,
          end_date: endDate ? endDate.format('YYYY-MM-DD') : null,
          membership_plan_id: selectedPlanId,
          plan_cost: editablePlanCost,
          cgst_percentage: cgstPercentage,
          sgst_percentage: sgstPercentage,
          cgst_amount: cgstAmount.toString(),
          sgst_amount: sgstAmount.toString(),
          subtotal: subtotal.toString(),
          total_cost: totalCost.toString(),
        };

        // Add selected add-ons
        if (selectedAddOns.length > 0) {
          clubMemberData.selected_amenities = selectedAddOns;
        }

        // Only add file fields if they exist (new uploads)
        if (identificationImageBase64) {
          clubMemberData.identification_image = identificationImageBase64;
        }
        if (avatarBase64) {
          clubMemberData.avatar = avatarBase64;
        }
        if (attachmentsBase64.length > 0) {
          clubMemberData.attachments = attachmentsBase64;
        }

        payload = {
          club_member: clubMemberData,
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

  // Handle next step
  const handleNext = () => {
    // Validation for step 1
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

    // Mandatory file validations - only for add mode
    if (!isEditMode) {
      if (!idCardFile) {
        toast.error('Please upload ID card (mandatory)');
        return;
      }

      if (!residentPhotoFile) {
        toast.error('Please upload resident photo (mandatory)');
        return;
      }
    }

    if (cardAllocated && !formData.accessCardId) {
      toast.error('Please enter access card ID');
      return;
    }

    // Move to next step
    setCurrentStep(2);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle back to step 1
  const handleBackToStep1 = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get selected plan
  const selectedPlan = membershipPlans.find(plan => plan.id === selectedPlanId);

  // Update editable cost when plan is selected
  React.useEffect(() => {
    if (selectedPlan) {
      setEditablePlanCost(selectedPlan.price);
    }
  }, [selectedPlan]);

  // Get plan amenity IDs
  const planAmenityIds = selectedPlan?.plan_amenities?.map(pa => pa.facility_setup_id) || [];

  // Get available add-ons (amenities not in plan)
  const availableAddOns = allAmenities.filter(amenity => !planAmenityIds.includes(amenity.id));

  // Calculate total cost
  const planCost = parseFloat(editablePlanCost) || 0;
  const addOnsCost = selectedAddOns.reduce((total, addOnId) => {
    const addOn = allAmenities.find(a => a.id === addOnId);
    return total + (parseFloat(addOn?.price || '0') || 0);
  }, 0);
  const subtotal = planCost + addOnsCost;
  const cgstAmount = (subtotal * (parseFloat(cgstPercentage) || 0)) / 100;
  const sgstAmount = (subtotal * (parseFloat(sgstPercentage) || 0)) / 100;
  const totalCost = subtotal + cgstAmount + sgstAmount;

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
          <div className="space-y-6">
          {/* Step 1: User Details and Forms */}
          {currentStep === 1 && (
            <>
          {/* Card 1: User Selection Mode */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">User Selection</h2>
            
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
                    dateOfBirth: '',
                    gender: '',
                    residentialAddress: '',
                    emergencyContactName: '',
                    emergencyContactNumber: '',
                    tower: '',
                    flat: '',
                    residentType: '',
                    relationWithOwner: '',
                    membershipNumber: '',
                    accessCardId: '',
                    membershipType: '',
                    referredBy: '',
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
              <div>
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
              <div className="space-y-6">
                <h3 className="text-sm font-medium text-gray-700">User Details</h3>
                
                {/* Row 1: First Name, Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                {/* Row 2: Date of Birth, Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    sx={fieldStyles}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <FormControl fullWidth sx={fieldStyles}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      label="Gender"
                    >
                      <MenuItem value="">
                        <em>Select Gender</em>
                      </MenuItem>
                      {GENDER_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Row 3: Mobile, Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Mobile Number *"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    sx={fieldStyles}
                    fullWidth
                  />
                  <TextField
                    label="Email Address *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    sx={fieldStyles}
                    fullWidth
                  />
                </div>

                {/* Row 4: Emergency Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Emergency Contact Name"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    sx={fieldStyles}
                    fullWidth
                  />
                  <TextField
                    label="Emergency Contact Number"
                    value={formData.emergencyContactNumber}
                    onChange={(e) => setFormData({ ...formData, emergencyContactNumber: e.target.value })}
                    sx={fieldStyles}
                    fullWidth
                  />
                </div>

                {/* Row 5: Residential Address */}
                <div className="grid grid-cols-1 gap-4">
                  <TextField
                    label="Residential Address"
                    value={formData.residentialAddress}
                    onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })}
                    sx={fieldStyles}
                    fullWidth
                  />
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Membership Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Membership Details</h2>
            
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

            {/* Membership Type and Referred By */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormControl fullWidth sx={fieldStyles}>
                  <InputLabel>Membership Type</InputLabel>
                  <Select
                    value={formData.membershipType}
                    onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
                    label="Membership Type"
                  >
                    <MenuItem value="">
                      <em>Select Membership Type</em>
                    </MenuItem>
                    {MEMBERSHIP_TYPE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={fieldStyles}>
                  <InputLabel>Referred By</InputLabel>
                  <Select
                    value={formData.referredBy}
                    onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                    label="Referred By"
                  >
                    <MenuItem value="">
                      <em>Select Referred By</em>
                    </MenuItem>
                    {REFERRED_BY_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Membership Dates */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Membership Period <span className="text-red-500">*</span>
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

            {/* Access Card Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Access Card</h3>
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
              <div>
                <TextField
                  label="Enter Access Card ID"
                  value={formData.accessCardId}
                  onChange={(e) => setFormData({ ...formData, accessCardId: e.target.value })}
                  sx={fieldStyles}
                  fullWidth
                />
              </div>
            )}
          </div>

          {/* Card 3: Upload Documents */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">
              Upload Documents {!isEditMode && <span className="text-red-500">*</span>}
              {isEditMode && <span className="text-gray-500 text-sm font-normal ml-2">(Upload new files to replace existing ones)</span>}
            </h2>
            
            {/* File Uploads */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID Card Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Card {!isEditMode && <span className="text-red-500">*</span>}
                  {isEditMode && idCardPreview && !idCardFile && <span className="text-green-600 text-xs ml-2">(Existing)</span>}
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  idCardFile ? 'border-green-300 bg-green-50' : idCardPreview ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-[#C72030]'
                }`}>
                  {(idCardFile || idCardPreview) ? (
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
                        <span className="text-sm text-gray-600">
                          {idCardFile ? idCardFile.name : (isEditMode ? 'Existing ID Card' : '')}
                        </span>
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
                      <p className="text-sm text-gray-500 mb-2">
                        Upload ID Card {!isEditMode && '(Required)'}
                      </p>
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
                  Member Photo {!isEditMode && <span className="text-red-500">*</span>}
                  {isEditMode && residentPhotoPreview && !residentPhotoFile && <span className="text-green-600 text-xs ml-2">(Existing)</span>}
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  residentPhotoFile ? 'border-green-300 bg-green-50' : residentPhotoPreview ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-[#C72030]'
                }`}>
                  {(residentPhotoFile || residentPhotoPreview) ? (
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
                        <span className="text-sm text-gray-600">
                          {residentPhotoFile ? residentPhotoFile.name : (isEditMode ? 'Existing Member Photo' : '')}
                        </span>
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
                      <p className="text-sm text-gray-500 mb-2">
                        Upload Photo {!isEditMode && '(Required)'}
                      </p>
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

          {/* Card 4: Health & Wellness Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Health & Wellness Information</h2>
            
            {/* Question 1: Existing injuries or medical conditions */}
            <div className="mb-6">
              <FormLabel component="legend" className="text-sm font-medium text-gray-700 mb-2">
                Do you have any existing injuries or medical conditions?
              </FormLabel>
              <RadioGroup
                row
                value={hasInjuries}
                onChange={(e) => setHasInjuries(e.target.value as 'yes' | 'no')}
              >
                <FormControlLabel 
                  value="yes" 
                  control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                  label="Yes" 
                />
                <FormControlLabel 
                  value="no" 
                  control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                  label="No" 
                />
              </RadioGroup>
            </div>

            {/* If yes, specify */}
            {hasInjuries === 'yes' && (
              <div className="mb-6">
                <TextField
                  label="If yes, please specify"
                  value={injuryDetails}
                  onChange={(e) => setInjuryDetails(e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                  sx={{
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    '& .MuiOutlinedInput-root': {
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
                  }}
                />
              </div>
            )}

            {/* Question 2: Physical restrictions */}
            <div className="mb-6">
              <TextField
                label="Any physical restrictions or movement limitations?"
                value={physicalRestrictions}
                onChange={(e) => setPhysicalRestrictions(e.target.value)}
                fullWidth
                sx={fieldStyles}
              />
            </div>

            {/* Question 3: Current medication */}
            <div className="mb-6">
              <TextField
                label="Are you currently under medication?"
                value={currentMedication}
                onChange={(e) => setCurrentMedication(e.target.value)}
                fullWidth
                sx={fieldStyles}
              />
            </div>

            {/* Question 4: Pilates experience */}
            <div>
              <FormControl fullWidth sx={fieldStyles}>
                <InputLabel>Have you practiced Pilates before?</InputLabel>
                <Select
                  value={pilatesExperience}
                  onChange={(e) => setPilatesExperience(e.target.value)}
                  label="Have you practiced Pilates before?"
                >
                  <MenuItem value="">
                    <em>Select Experience Level</em>
                  </MenuItem>
                  <MenuItem value="Never">Never</MenuItem>
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Card 5: Activity Interests */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-2">Activity Interests</h2>
            <p className="text-sm text-gray-500 mb-6">Helps us customise your experience and send relevant updates</p>
            
            {/* Primary Fitness Goals */}
            <div className="mb-6">
              <FormLabel component="legend" className="text-sm font-medium text-gray-700 mb-3">
                Primary Fitness Goals:
              </FormLabel>
              <div className="space-y-1">
                {[
                  'General Fitness',
                  'Strength Training',
                  'Pilates',
                  'Mobility & Flexibility',
                  'Weight Management',
                  'Performance Training (Squash/Padel/Pickle)',
                  'Stress Relief / Lifestyle Wellness',
                  'Post Workout Recovery'
                ].map((goal) => (
                  <FormControlLabel
                    key={goal}
                    control={
                      <Checkbox
                        size="small"
                        checked={fitnessGoals.includes(goal)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFitnessGoals([...fitnessGoals, goal]);
                          } else {
                            setFitnessGoals(fitnessGoals.filter(g => g !== goal));
                          }
                        }}
                        sx={{
                          color: '#C72030',
                          '&.Mui-checked': {
                            color: '#C72030',
                          },
                        }}
                      />
                    }
                    label={<span className="text-sm">{goal}</span>}
                  />
                ))}
                <div className="flex items-center gap-2">
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={fitnessGoals.includes('Other')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFitnessGoals([...fitnessGoals, 'Other']);
                          } else {
                            setFitnessGoals(fitnessGoals.filter(g => g !== 'Other'));
                            setFitnessGoalsOther('');
                          }
                        }}
                        sx={{
                          color: '#C72030',
                          '&.Mui-checked': {
                            color: '#C72030',
                          },
                        }}
                      />
                    }
                    label={<span className="text-sm">Other:</span>}
                  />
                  {fitnessGoals.includes('Other') && (
                    <TextField
                      value={fitnessGoalsOther}
                      onChange={(e) => setFitnessGoalsOther(e.target.value)}
                      placeholder="Please specify"
                      size="small"
                      sx={{ flex: 1 }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Which sessions are you interested in? */}
            <div>
              <FormLabel component="legend" className="text-sm font-medium text-gray-700 mb-3">
                Which sessions are you interested in?
              </FormLabel>
              <div className="space-y-1">
                {[
                  'Group Pilates',
                  'Private / Duo Pilates',
                  'Strength Training',
                  'Yoga',
                  'Mat Pilates',
                  'Mobility / Stretch',
                  'Kids Fitness',
                  'Corporate Wellness Sessions',
                  'Run Clubs',
                  'Social Sports Events',
                  'Racquet Sports Events'
                ].map((session) => (
                  <FormControlLabel
                    key={session}
                    control={
                      <Checkbox
                        size="small"
                        checked={interestedSessions.includes(session)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setInterestedSessions([...interestedSessions, session]);
                          } else {
                            setInterestedSessions(interestedSessions.filter(s => s !== session));
                          }
                        }}
                        sx={{
                          color: '#C72030',
                          '&.Mui-checked': {
                            color: '#C72030',
                          },
                        }}
                      />
                    }
                    label={<span className="text-sm">{session}</span>}
                  />
                ))}
                <div className="flex items-center gap-2">
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={interestedSessions.includes('Other')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setInterestedSessions([...interestedSessions, 'Other']);
                          } else {
                            setInterestedSessions(interestedSessions.filter(s => s !== 'Other'));
                            setInterestedSessionsOther('');
                          }
                        }}
                        sx={{
                          color: '#C72030',
                          '&.Mui-checked': {
                            color: '#C72030',
                          },
                        }}
                      />
                    }
                    label={<span className="text-sm">Other:</span>}
                  />
                  {interestedSessions.includes('Other') && (
                    <TextField
                      value={interestedSessionsOther}
                      onChange={(e) => setInterestedSessionsOther(e.target.value)}
                      placeholder="Please specify"
                      size="small"
                      sx={{ flex: 1 }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 6: Lifestyle & Communication Insights */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-2">Lifestyle & Communication Insights</h2>
            <p className="text-sm text-gray-500 mb-6">Helps us understand your preferences and design better offerings</p>
            
            {/* How did you first hear about The Recess Club? */}
            <div className="mb-6">
              <FormControl fullWidth sx={fieldStyles}>
                <InputLabel>How did you first hear about The Recess Club?</InputLabel>
                <Select
                  value={heardAbout}
                  onChange={(e) => setHeardAbout(e.target.value)}
                  label="How did you first hear about The Recess Club?"
                >
                  <MenuItem value="">
                    <em>Select an option</em>
                  </MenuItem>
                  <MenuItem value="Instagram">Instagram</MenuItem>
                  <MenuItem value="Friend / Referral">Friend / Referral</MenuItem>
                  <MenuItem value="Marriott Suites">Marriott Suites</MenuItem>
                  <MenuItem value="Event">Event</MenuItem>
                  <MenuItem value="Google Search">Google Search</MenuItem>
                  <MenuItem value="Influencer / Trainer">Influencer / Trainer</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* What motivates you to join a wellness club? */}
            <div className="mb-6">
              <FormLabel component="legend" className="text-sm font-medium text-gray-700 mb-3">
                What motivates you to join a wellness club?
              </FormLabel>
              <div className="space-y-1">
                {[
                  'Health',
                  'Fitness Community',
                  'Social Sports',
                  'Convenience',
                  'Stress Management',
                  'Amenities & Facilities',
                  'Trainer Expertise'
                ].map((motivation) => (
                  <FormControlLabel
                    key={motivation}
                    control={
                      <Checkbox
                        size="small"
                        checked={motivations.includes(motivation)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setMotivations([...motivations, motivation]);
                          } else {
                            setMotivations(motivations.filter(m => m !== motivation));
                          }
                        }}
                        sx={{
                          color: '#C72030',
                          '&.Mui-checked': {
                            color: '#C72030',
                          },
                        }}
                      />
                    }
                    label={<span className="text-sm">{motivation}</span>}
                  />
                ))}
              </div>
            </div>

            {/* What type of updates would you like to receive? */}
            <div className="mb-6">
              <FormLabel component="legend" className="text-sm font-medium text-gray-700 mb-3">
                What type of updates would you like to receive?
              </FormLabel>
              <div className="space-y-1">
                {[
                  'Class Schedules',
                  'New Programs / Workshops',
                  'Events & Social Sports',
                  'Promotions & Membership Offers',
                  'Facility Updates',
                  'Café Menus / Specials'
                ].map((update) => (
                  <FormControlLabel
                    key={update}
                    control={
                      <Checkbox
                        size="small"
                        checked={updatePreferences.includes(update)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setUpdatePreferences([...updatePreferences, update]);
                          } else {
                            setUpdatePreferences(updatePreferences.filter(u => u !== update));
                          }
                        }}
                        sx={{
                          color: '#C72030',
                          '&.Mui-checked': {
                            color: '#C72030',
                          },
                        }}
                      />
                    }
                    label={<span className="text-sm">{update}</span>}
                  />
                ))}
              </div>
            </div>

            {/* Preferred Communication Channel */}
            <div>
              <FormLabel component="legend" className="text-sm font-medium text-gray-700 mb-3">
                Preferred Communication Channel:
              </FormLabel>
              <div className="space-y-1">
                {[
                  'WhatsApp',
                  'Email',
                  'SMS'
                ].map((channel) => (
                  <FormControlLabel
                    key={channel}
                    control={
                      <Checkbox
                        size="small"
                        checked={communicationChannel.includes(channel)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCommunicationChannel([...communicationChannel, channel]);
                          } else {
                            setCommunicationChannel(communicationChannel.filter(c => c !== channel));
                          }
                        }}
                        sx={{
                          color: '#C72030',
                          '&.Mui-checked': {
                            color: '#C72030',
                          },
                        }}
                      />
                    }
                    label={<span className="text-sm">{channel}</span>}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Card 7: Occupation & Demographics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Occupation & Demographics</h2>
            
            {/* Profession / Industry */}
            <div className="mb-6">
              <TextField
                label="Profession / Industry"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                sx={fieldStyles}
                fullWidth
              />
            </div>

            {/* Company Name */}
            <div className="mb-6">
              <TextField
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                sx={fieldStyles}
                fullWidth
              />
            </div>

            {/* Corporate Interest */}
            <div>
              <FormLabel component="legend" className="text-sm font-medium text-gray-700 mb-2">
                Are you interested in corporate/group plans for your workplace?
              </FormLabel>
              <RadioGroup
                row
                value={corporateInterest}
                onChange={(e) => setCorporateInterest(e.target.value as 'yes' | 'no')}
              >
                <FormControlLabel 
                  value="yes" 
                  control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                  label="Yes" 
                />
                <FormControlLabel 
                  value="no" 
                  control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                  label="No" 
                />
              </RadioGroup>
            </div>
          </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleGoBack}
            >
              Cancel
            </Button>
            <Button
              onClick={handleNext}
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
            >
              Next
            </Button>
          </div>
          </>
          )}

          {/* Step 2: Membership Plan & Add-ons */}
          {currentStep === 2 && (
            <>
          {/* Card 8: Membership Plan Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-2">Select Membership Plan</h2>
            <p className="text-sm text-gray-500 mb-6">Choose a plan that suits your needs</p>
            
            {loadingPlans ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
              </div>
            ) : membershipPlans.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No membership plans available. Please contact administrator.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {membershipPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPlanId === plan.id
                        ? 'border-[#C72030] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-[#1a1a1a]">{plan.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {plan.renewal_terms && plan.renewal_terms.charAt(0).toUpperCase() + plan.renewal_terms.slice(1)} Membership
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#C72030]">₹{plan.price}</p>
                        <p className="text-xs text-gray-500">per {plan.renewal_terms}</p>
                      </div>
                    </div>
                    
                    {/* Plan Amenities */}
                    {plan.plan_amenities && plan.plan_amenities.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">Included Amenities:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {plan.plan_amenities.map((amenity) => (
                            <div key={amenity.id} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                              <span className="text-sm text-gray-600">
                                {amenity.facility_setup_name || amenity.facility_setup?.name || `Amenity #${amenity.facility_setup_id}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedPlanId === plan.id && (
                      <div className="mt-3 flex items-center gap-2 text-[#C72030]">
                        <div className="w-5 h-5 rounded-full bg-[#C72030] flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">Selected</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 9: Add-on Amenities */}
          {selectedPlanId && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-2">Additional Amenities (Add-ons)</h2>
              <p className="text-sm text-gray-500 mb-6">Select additional amenities not included in your plan</p>
              
              {availableAddOns.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-sm">All available amenities are already included in your selected plan.</p>
                </div>
              ) : (
                <div className="space-y-2">
                {availableAddOns.map((amenity) => (
                  <div key={amenity.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={selectedAddOns.includes(amenity.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAddOns([...selectedAddOns, amenity.id]);
                            } else {
                              setSelectedAddOns(selectedAddOns.filter(id => id !== amenity.id));
                            }
                          }}
                          sx={{
                            color: '#C72030',
                            '&.Mui-checked': {
                              color: '#C72030',
                            },
                          }}
                        />
                      }
                      label={<span className="text-sm font-medium">{amenity.name}</span>}
                    />
                    <span className="text-sm font-semibold text-[#C72030]">
                      +₹{amenity.price || '0'}
                    </span>
                  </div>
                ))}
              </div>
              )}
            </div>
          )}

          {/* Card 10: Cost Summary */}
          {selectedPlanId && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Cost Summary</h2>
              
              <div className="space-y-4">
                {/* Membership Plan Cost - Editable */}
                <div className="pb-3 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{selectedPlan?.name}</p>
                      <p className="text-xs text-gray-500">{selectedPlan?.renewal_terms} membership</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Plan Cost:</label>
                    <div className="flex items-center gap-1 flex-1">
                      <span className="text-gray-600">₹</span>
                      <TextField
                        value={editablePlanCost}
                        onChange={(e) => setEditablePlanCost(e.target.value)}
                        type="number"
                        size="small"
                        sx={{
                          ...fieldStyles,
                          flex: 1,
                          '& .MuiOutlinedInput-root': {
                            height: '40px',
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Add-ons Cost */}
                {selectedAddOns.length > 0 && (
                  <div className="pb-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Add-ons:</p>
                    {selectedAddOns.map(addOnId => {
                      const addOn = allAmenities.find(a => a.id === addOnId);
                      return (
                        <div key={addOnId} className="flex items-center justify-between ml-4 mb-1">
                          <p className="text-sm text-gray-600">{addOn?.name}</p>
                          <p className="text-sm font-medium text-gray-700">₹{parseFloat(addOn?.price || '0').toFixed(2)}</p>
                        </div>
                      );
                    })}
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-medium text-gray-700">Subtotal (Add-ons)</p>
                      <p className="text-lg font-semibold text-gray-900">₹{addOnsCost.toFixed(2)}</p>
                    </div>
                  </div>
                )}

                {/* Subtotal */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Subtotal</p>
                  <p className="text-lg font-semibold text-gray-900">₹{subtotal.toFixed(2)}</p>
                </div>
                
                {/* Tax Section */}
                <div className="space-y-3 pb-3 border-b border-gray-200">
                  {/* CGST */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <label className="text-sm text-gray-600">CGST (%):</label>
                      <TextField
                        value={cgstPercentage}
                        onChange={(e) => setCgstPercentage(e.target.value)}
                        type="number"
                        size="small"
                        sx={{
                          ...fieldStyles,
                          width: '80px',
                          '& .MuiOutlinedInput-root': {
                            height: '36px',
                          }
                        }}
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-700">₹{cgstAmount.toFixed(2)}</p>
                  </div>

                  {/* SGST */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <label className="text-sm text-gray-600">SGST (%):</label>
                      <TextField
                        value={sgstPercentage}
                        onChange={(e) => setSgstPercentage(e.target.value)}
                        type="number"
                        size="small"
                        sx={{
                          ...fieldStyles,
                          width: '80px',
                          '& .MuiOutlinedInput-root': {
                            height: '36px',
                          }
                        }}
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-700">₹{sgstAmount.toFixed(2)}</p>
                  </div>
                </div>
                
                {/* Total */}
                <div className="flex items-center justify-between pt-2">
                  <p className="text-base font-bold text-gray-900">Total Amount (Inc. Tax)</p>
                  <p className="text-2xl font-bold text-[#C72030]">₹{totalCost.toFixed(2)}</p>
                </div>
                
                {/* Renewal Info */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <span className="font-medium">Renewal Terms:</span> This membership will auto-renew every {selectedPlan?.renewal_terms} unless cancelled.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-between gap-3 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleBackToStep1}
            >
              Back
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleGoBack}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedPlanId}
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
              >
                {isSubmitting ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update' : 'Submit')}
              </Button>
            </div>
          </div>
          </>
          )}
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default AddClubMembershipPage;
