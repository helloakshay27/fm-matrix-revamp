import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, Paperclip, X, User, Ticket, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { ticketManagementAPI, CategoryResponse, SubCategoryResponse, UserAccountResponse, OccupantUserResponse } from '@/services/ticketManagementAPI';
import { FMUser } from '@/store/slices/fmUserSlice';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';

interface ComplaintModeResponse {
  id: number;
  name: string;
}

// Update location interfaces to match API responses
interface AreaResponse {
  id: number;
  name: string;
  wing_id: string;
  building_id: string;
  wing?: {
    id: number;
    name: string;
  };
  building?: {
    id: number;
    name: string;
  };
}

interface BuildingResponse {
  id: number;
  name: string;
  site_id: string;
  wings?: Array<{
    id: number;
    name: string;
  }>;
  areas?: Array<{
    id: number;
    name: string;
    wing_id: string;
  }>;
}

interface WingResponse {
  id: number;
  name: string;
  building_id: string;
  building?: {
    id: number;
    name: string;
  };
}

interface FloorResponse {
  id: number;
  name: string;
  wing_id: number;
  area_id: number;
  building_id: string;
  wing?: {
    id: number;
    name: string;
  };
  area?: {
    id: number;
    name: string;
  };
}

interface RoomResponse {
  id: number;
  name: string;
  floor_id: number;
  wing_id: number;
  area_id: string;
  building_id: string;
}

const PRIORITY_OPTIONS = [
  { value: 'P1', label: 'P1 - Critical' },
  { value: 'P2', label: 'P2 - Very High' },
  { value: 'P3', label: 'P3 - High' },
  { value: 'P4', label: 'P4 - Medium' },
  { value: 'P5', label: 'P5 - Low' }
];

const PROACTIVE_REACTIVE_OPTIONS = [
  { value: 'Proactive', label: 'Proactive' },
  { value: 'Reactive', label: 'Reactive' }
];

const SEVERITY_OPTIONS = [
  { value: 'Major', label: 'Major' },
  { value: 'Minor', label: 'Minor' }
];

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

// Helper functions to get user data from localStorage
const getUserDataFromLocalStorage = () => {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      console.log('🔍 Raw user data from localStorage:', user); // Debug log

      // Try multiple possible department field names with extensive logging
      const possibleDepartmentFields = [
        'department_name',
        'designation',
        'department',
        'role_name',
        'lock_user_permission?.designation',
        'user_permission?.designation',
        'profile?.designation',
        'profile?.department_name'
      ];

      console.log('🔍 Checking department fields:', possibleDepartmentFields);

      let department = '';
      // Check each possible field
      if (user.department_name) {
        department = user.department_name;
        console.log('✅ Found department_name:', department);
      } else if (user.designation) {
        department = user.designation;
        console.log('✅ Found designation:', department);
      } else if (user.department) {
        department = user.department;
        console.log('✅ Found department:', department);
      } else if (user.role_name) {
        department = user.role_name;
        console.log('✅ Found role_name:', department);
      } else if (user.lock_user_permission?.designation) {
        department = user.lock_user_permission.designation;
        console.log('✅ Found lock_user_permission.designation:', department);
      } else if (user.user_permission?.designation) {
        department = user.user_permission.designation;
        console.log('✅ Found user_permission.designation:', department);
      } else if (user.profile?.designation) {
        department = user.profile.designation;
        console.log('✅ Found profile.designation:', department);
      } else if (user.profile?.department_name) {
        department = user.profile.department_name;
        console.log('✅ Found profile.department_name:', department);
      } else {
        console.log('❌ No department field found in user data');
        console.log('Available fields:', Object.keys(user));
      }

      console.log('🎯 Final extracted department:', department);

      return {
        name: `${user.firstname || ''} ${user.lastname || ''}`.trim(),
        department: department,
        contactNumber: user.mobile || user.contactNumber || '',
        site_id: user.site_id,
        id: user.id,
        email: user.email || '',
        company_id: user.company_id || '',
        // Add more fallback fields for department
        designation: user.designation || '',
        role_name: user.role_name || ''
      };
    }
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
  }
  return null;
};

const getFMUsersFromLocalStorage = () => {
  try {
    const fmUsersData = localStorage.getItem('fmUsers');
    if (fmUsersData) {
      return JSON.parse(fmUsersData);
    }
  } catch (error) {
    console.error('Error parsing FM users from localStorage:', error);
  }
  return [];
};

const getOccupantUsersFromLocalStorage = () => {
  try {
    const occupantUsersData = localStorage.getItem('occupantUsers');
    if (occupantUsersData) {
      return JSON.parse(occupantUsersData);
    }
  } catch (error) {
    console.error('Error parsing occupant users from localStorage:', error);
  }
  return [];
};

// Debug function to clear localStorage and force fresh API calls
const clearUserDataCache = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('fmUsers');
  localStorage.removeItem('occupantUsers');
  console.log('User data cache cleared');
};

// Helper function to try getting user profile from additional endpoints
const getUserProfileFromAlternativeAPI = async () => {
  try {
    // Try to get user profile from occupant users API (since the current user might be listed there)
    console.log('🔄 Trying alternative API for user profile...');
    const occupantResponse = await ticketManagementAPI.getOccupantUsers();
    console.log('🔄 Occupant users response:', occupantResponse);

    // Try to get current user from localStorage to find their ID
    const currentUserData = localStorage.getItem('user');
    if (currentUserData) {
      const user = JSON.parse(currentUserData);
      console.log('🔄 Looking for current user ID:', user.id);

      // Find current user in occupant users list
      const currentUserProfile = occupantResponse.find(u => u.id === user.id);
      if (currentUserProfile && currentUserProfile.lock_user_permission?.designation) {
        console.log('✅ Found user profile in occupant users with department:', currentUserProfile.lock_user_permission.designation);
        return {
          ...user,
          department_name: currentUserProfile.lock_user_permission.designation,
          designation: currentUserProfile.lock_user_permission.designation
        };
      }
    }

    // Try FM users API as well
    const fmResponse = await ticketManagementAPI.getEngineers();
    const fmUsers = fmResponse.users || [];
    console.log('🔄 FM users response:', fmUsers);

    if (currentUserData) {
      const user = JSON.parse(currentUserData);
      const currentUserFMProfile = fmUsers.find(u => u.id === user.id);
      if (currentUserFMProfile && (currentUserFMProfile.designation || currentUserFMProfile.role_name)) {
        console.log('✅ Found user profile in FM users with department:', currentUserFMProfile.designation || currentUserFMProfile.role_name);
        return {
          ...user,
          department_name: currentUserFMProfile.designation || currentUserFMProfile.role_name,
          designation: currentUserFMProfile.designation,
          role_name: currentUserFMProfile.role_name
        };
      }
    }

    console.log('❌ No alternative profile found');
    return null;
  } catch (error) {
    console.error('Error getting user profile from alternative API:', error);
    return null;
  }
};

export const AddTicketDashboardEmployee = () => {
  const navigate = useNavigate();

  // Form state
  const [onBehalfOf, setOnBehalfOf] = useState('self');
  const [ticketType, setTicketType] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFieldsReadOnly, setIsFieldsReadOnly] = useState(false);
  const [isGoldenTicket, setIsGoldenTicket] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);

  // Dropdown data states
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategoryResponse[]>([]);
  const [fmUsers, setFmUsers] = useState<FMUser[]>([]);
  const [occupantUsers, setOccupantUsers] = useState<OccupantUserResponse[]>([]);
  const [userAccount, setUserAccount] = useState<UserAccountResponse | null>(null);
  const [complaintModes, setComplaintModes] = useState<ComplaintModeResponse[]>([]);
  const [areas, setAreas] = useState<AreaResponse[]>([]);
  const [buildings, setBuildings] = useState<BuildingResponse[]>([]);
  const [wings, setWings] = useState<WingResponse[]>([]);
  const [floors, setFloors] = useState<FloorResponse[]>([]);
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [filteredBuildings, setFilteredBuildings] = useState<BuildingResponse[]>([]);
  const [filteredWings, setFilteredWings] = useState<WingResponse[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<AreaResponse[]>([]);
  const [filteredFloors, setFilteredFloors] = useState<FloorResponse[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<RoomResponse[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

  // Loading states
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [loadingComplaintModes, setLoadingComplaintModes] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    site: 'Lockated',
    department: '',
    unit: '',
    categoryType: '',
    subCategoryType: '',
    description: '',
    assignedTo: '',
    proactiveReactive: '', // will be set by effect below
    adminPriority: '',
    severity: '',
    referenceNumber: '',
    mode: '',
    vendor: '',
    complaintMode: '',
    // Add location fields
    area: '',
    building: '',
    wing: '',
    floor: '',
    room: ''
  });
  // Set default proactiveReactive based on onBehalfOf selection
  useEffect(() => {
    let defaultValue = '';
    if (onBehalfOf === 'self' || onBehalfOf === 'fm-user') {
      defaultValue = 'Proactive';
    } else if (onBehalfOf === 'occupant-user') {
      defaultValue = 'Reactive';
    }
    setFormData(prev => ({
      ...prev,
      proactiveReactive: defaultValue
    }));
  }, [onBehalfOf]);

  // Fallback API method for user account
  const loadUserAccountFromAPI = useCallback(async () => {
    setLoadingAccount(true);
    try {
      const response = await ticketManagementAPI.getUserAccount();
      console.log('🚀 API response for user account:', response); // Debug log
      console.log('🚀 API response keys:', Object.keys(response)); // Debug log
      console.log('🚀 Department field in API response:', response.department_name); // Debug log
      setUserAccount(response);

      // Store in localStorage for future use
      localStorage.setItem('user', JSON.stringify(response));
      console.log('💾 Stored user data in localStorage:', JSON.stringify(response, null, 2));

      // Populate form data when account is loaded for self
      if (onBehalfOf === 'self' && response) {
        let department = response.department_name || '';
        console.log('🎯 Department from API response:', department); // Debug log

        // If no department found, try alternative APIs
        if (!department) {
          console.log('🔄 No department in main API, trying alternative sources...');
          const alternativeProfile = await getUserProfileFromAlternativeAPI();
          if (alternativeProfile) {
            department = alternativeProfile.department_name || alternativeProfile.designation || alternativeProfile.role_name || '';
            console.log('🎯 Department from alternative API:', department);

            // Update stored user data with enhanced profile
            localStorage.setItem('user', JSON.stringify(alternativeProfile));
          }
        }

        setFormData(prev => ({
          ...prev,
          name: `${response.firstname} ${response.lastname}`,
          department: department,
          contactNumber: response.mobile || '',
          unit: '',
          site: 'Lockated'
        }));
      }
    } catch (error) {
      console.error('Error loading user account:', error);
      toast.error("Failed to load user account", { description: "Error" });
    } finally {
      setLoadingAccount(false);
    }
  }, [onBehalfOf]);

  // Load user account from localStorage (faster than API call)
  const loadUserAccountFromStorage = useCallback(() => {
    setLoadingAccount(true);
    try {
      const userData = getUserDataFromLocalStorage();

      if (userData) {
        setUserAccount({
          firstname: userData.name.split(' ')[0] || '',
          lastname: userData.name.split(' ').slice(1).join(' ') || '',
          department_name: userData.department,
          mobile: userData.contactNumber,
          site_id: userData.site_id,
          id: userData.id,
          email: userData.email || '',
          company_id: userData.company_id || ''
        });

        // Populate form data when account is loaded for self
        if (onBehalfOf === 'self') {
          console.log('🎯 Setting form data with userData:', userData); // Debug log

          // If no department in localStorage, try to fetch it fresh
          if (!userData.department) {
            console.log('🔄 No department in localStorage, will fetch from API');
            loadUserAccountFromAPI();
            return;
          }

          setFormData(prev => ({
            ...prev,
            name: userData.name,
            department: userData.department,
            contactNumber: userData.contactNumber,
            unit: '',
            site: 'Lockated'
          }));
        }
      } else {
        // Fallback to API if localStorage doesn't have user data
        loadUserAccountFromAPI();
      }
    } catch (error) {
      console.error('Error loading user account from localStorage:', error);
      // Fallback to API on error
      loadUserAccountFromAPI();
    } finally {
      setLoadingAccount(false);
    }
  }, [onBehalfOf, loadUserAccountFromAPI]);

  // Load initial data
  useEffect(() => {
    loadCategories();
    loadFMUsersFromStorage();
    loadOccupantUsersFromStorage();
    loadComplaintModes();
    loadLocationData();
    if (onBehalfOf === 'self') {
      loadUserAccountFromStorage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onBehalfOf, loadUserAccountFromStorage]);

  // This useEffect is no longer needed since we populate form data directly in loadUserAccountFromStorage
  // Keeping it as fallback for userAccount state changes
  useEffect(() => {
    if (onBehalfOf === 'self' && userAccount) {
      setFormData(prev => ({
        ...prev,
        name: `${userAccount.firstname} ${userAccount.lastname}`,
        department: userAccount.department_name || '',
        contactNumber: userAccount.mobile || '',
        unit: '',
        site: 'Lockated'
      }));
    }
  }, [userAccount, onBehalfOf]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoadingSuppliers(true);
      try {
        const url = getFullUrl('/pms/suppliers.json');
        const options = getAuthenticatedFetchOptions('GET');
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Failed to fetch suppliers');
        const data = await response.json();
        // Use pms_suppliers and company_name for dropdown
        setSuppliers(
          Array.isArray(data.pms_suppliers)
            ? data.pms_suppliers.map(s => ({
              id: s.id,
              name: s.company_name || `Supplier #${s.id}`
            }))
            : []
        );
      } catch (error) {
        console.error('Error loading suppliers:', error);
        toast.error("Failed to load suppliers", { description: "Error" });
      } finally {
        setLoadingSuppliers(false);
      }
    };
    fetchSuppliers();
  }, []);

  // Fallback API method for occupant users
  const loadOccupantUsersFromAPI = useCallback(async () => {
    try {
      const response = await ticketManagementAPI.getOccupantUsers();
      setOccupantUsers(response);
      // Store in localStorage for future use
      localStorage.setItem('occupantUsers', JSON.stringify(response));
    } catch (error) {
      console.error('Error loading occupant users:', error);
    }
  }, []);

  // Load occupant users from localStorage (faster than API)
  const loadOccupantUsersFromStorage = useCallback(() => {
    try {
      const occupantUsersData = getOccupantUsersFromLocalStorage();
      if (occupantUsersData && occupantUsersData.length > 0) {
        setOccupantUsers(occupantUsersData);
      } else {
        // Fallback to API if localStorage doesn't have data
        loadOccupantUsersFromAPI();
      }
    } catch (error) {
      console.error('Error loading occupant users from localStorage:', error);
      // Fallback to API on error
      loadOccupantUsersFromAPI();
    }
  }, [loadOccupantUsersFromAPI]);

  // Fallback API method for FM users
  const loadFMUsersFromAPI = useCallback(async () => {
    try {
      const response = await ticketManagementAPI.getEngineers();
      const users = response.users || [];
      setFmUsers(users);
      // Store in localStorage for future use
      localStorage.setItem('fmUsers', JSON.stringify(users));
    } catch (error) {
      console.error('Error loading FM users:', error);
    }
  }, []);

  // Load FM users from localStorage (faster than API)
  const loadFMUsersFromStorage = useCallback(() => {
    try {
      const fmUsersData = getFMUsersFromLocalStorage();
      if (fmUsersData && fmUsersData.length > 0) {
        setFmUsers(fmUsersData);
      } else {
        // Fallback to API if localStorage doesn't have data
        loadFMUsersFromAPI();
      }
    } catch (error) {
      console.error('Error loading FM users from localStorage:', error);
      // Fallback to API on error
      loadFMUsersFromAPI();
    }
  }, [loadFMUsersFromAPI]);

  // Reset form when behalf selection changes
  useEffect(() => {
    setSelectedUser('');
    setSelectedUserId(null);
    setIsFieldsReadOnly(false);

    if (onBehalfOf === 'self') {
      // Load user account for self, form will be populated in loadUserAccountFromStorage
      loadUserAccountFromStorage();
    } else {
      // Clear form data when switching to behalf of others
      setFormData(prev => ({
        ...prev,
        name: '',
        contactNumber: '',
        department: '',
        unit: ''
      }));
    }
  }, [onBehalfOf, loadUserAccountFromStorage]);

  // Load categories
  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await ticketManagementAPI.getCategories();
      setCategories(response.helpdesk_categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error("Failed to load categories", { description: "Error" });
    } finally {
      setLoadingCategories(false);
    }
  };

  // Load subcategories when category changes
  const loadSubcategories = async (categoryId: number) => {
    setLoadingSubcategories(true);
    try {
      const subcats = await ticketManagementAPI.getSubCategoriesByCategory(categoryId);
      setSubcategories(subcats);
    } catch (error) {
      console.error('Error loading subcategories:', error);
      toast.error("Failed to load subcategories", { description: "Error" });
    } finally {
      setLoadingSubcategories(false);
    }
  };

  // Legacy load FM users function (keeping for backward compatibility)
  const loadFMUsers = async () => {
    try {
      const response = await ticketManagementAPI.getEngineers();
      const users = response.users || [];
      setFmUsers(users);
      // Store in localStorage for future use
      localStorage.setItem('fmUsers', JSON.stringify(users));
    } catch (error) {
      console.error('Error loading FM users:', error);
    }
  };

  // Load complaint modes
  const loadComplaintModes = async () => {
    setLoadingComplaintModes(true);
    try {
      const url = getFullUrl(API_CONFIG.ENDPOINTS.COMPLAINT_MODE);
      const options = getAuthenticatedFetchOptions('GET');

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Failed to fetch complaint modes: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Complaint modes response:', data);

      // The API returns an array directly, not wrapped in complaint_modes property
      setComplaintModes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading complaint modes:', error);
      toast.error("Failed to load complaint modes", { description: "Error" });
    } finally {
      setLoadingComplaintModes(false);
    }
  };

  // Load areas, buildings, wings, floors, and rooms
  const loadLocationData = useCallback(async () => {
    await Promise.all([
      loadAreas(),
      loadBuildings(),
      loadWings(),
      loadFloors(),
      loadRooms()
    ]);
  }, []);

  const loadAreas = async () => {
    setLoadingAreas(true);
    try {
      const url = getFullUrl('/pms/areas.json');
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Failed to fetch areas');
      const data = await response.json();
      // API returns { areas: [...] }
      setAreas(data.areas || []);
    } catch (error) {
      console.error('Error loading areas:', error);
      toast.error("Failed to load areas", { description: "Error" });
    } finally {
      setLoadingAreas(false);
    }
  };

  const loadBuildings = async (siteId?: string) => {
    setLoadingBuildings(true);
    try {
      // Use site_id in API call if provided, otherwise load all buildings
      const url = siteId
        ? getFullUrl(`/pms/sites/${siteId}/buildings.json`)
        : getFullUrl('/pms/buildings.json');

      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Failed to fetch buildings');
      const data = await response.json();
      // API returns { pms_buildings: [...] }
      setBuildings(data.pms_buildings || data || []);
    } catch (error) {
      console.error('Error loading buildings:', error);
      toast.error("Failed to load buildings", { description: "Error" });
    } finally {
      setLoadingBuildings(false);
    }
  };

  const loadWings = async (buildingId?: string) => {
    setLoadingWings(true);
    try {
      // Add building_id as query parameter if provided
      const url = buildingId
        ? getFullUrl(`/pms/wings.json?building_id=${buildingId}`)
        : getFullUrl('/pms/wings.json');

      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Failed to fetch wings');
      const data = await response.json();
      // API returns { wings: [...] }
      setWings(data.wings || []);
    } catch (error) {
      console.error('Error loading wings:', error);
      toast.error("Failed to load wings", { description: "Error" });
    } finally {
      setLoadingWings(false);
    }
  };

  const loadFloors = async (wingId?: string) => {
    setLoadingFloors(true);
    try {
      // Add wing_id as query parameter if provided
      const url = wingId
        ? getFullUrl(`/pms/floors.json?wing_id=${wingId}`)
        : getFullUrl('/pms/floors.json');

      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Failed to fetch floors');
      const data = await response.json();
      // API returns { floors: [...] }
      setFloors(data.floors || []);
    } catch (error) {
      console.error('Error loading floors:', error);
      toast.error("Failed to load floors", { description: "Error" });
    } finally {
      setLoadingFloors(false);
    }
  };

  const loadRooms = async (floorId?: string) => {
    setLoadingRooms(true);
    try {
      // Add floor_id as query parameter if provided
      const url = floorId
        ? getFullUrl(`/pms/rooms.json?floor_id=${floorId}`)
        : getFullUrl('/pms/rooms.json');

      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Failed to fetch rooms');
      const data = await response.json();
      // API returns array directly
      setRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading rooms:', error);
      toast.error("Failed to load rooms", { description: "Error" });
    } finally {
      setLoadingRooms(false);
    }
  };

  // Handle user selection and populate details
  const handleUserSelection = (userId: string) => {
    setSelectedUser(userId);
    const userIdNum = parseInt(userId);
    setSelectedUserId(userIdNum);

    if (onBehalfOf === 'fm-user') {
      const selectedFmUser = fmUsers.find(user => user.id === userIdNum);
      if (selectedFmUser) {
        setFormData(prev => ({
          ...prev,
          name: selectedFmUser.full_name,
          contactNumber: selectedFmUser.mobile || '',
          department: selectedFmUser.designation || selectedFmUser.role_name || '',
          unit: `Unit ${selectedFmUser.unit_id || ''}`,
          site: selectedFmUser.company_name || 'Lockated'
        }));
        setIsFieldsReadOnly(true);
      }
    } else if (onBehalfOf === 'occupant-user') {
      const selectedOccupantUser = occupantUsers.find(user => user.id === userIdNum);
      if (selectedOccupantUser) {
        setFormData(prev => ({
          ...prev,
          name: `${selectedOccupantUser.firstname} ${selectedOccupantUser.lastname}`,
          contactNumber: selectedOccupantUser.mobile || '',
          department: selectedOccupantUser.lock_user_permission?.designation || '',
          unit: `Unit ${selectedOccupantUser.unit_id || ''}`,
          site: selectedOccupantUser.company || 'Lockated'
        }));
        setIsFieldsReadOnly(true);
      }
    }
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({ ...prev, categoryType: categoryId, subCategoryType: '' }));
    setSubcategories([]);
    if (categoryId) {
      loadSubcategories(parseInt(categoryId));
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachedFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  // Remove file from attachments
  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle area change with API call to fetch floors (Third level)
  const handleAreaChange = async (areaId: string) => {
    setFormData(prev => ({
      ...prev,
      area: areaId,
      floor: '',
      room: ''
    }));

    // Clear dependent dropdowns
    setFilteredFloors([]);
    setFilteredRooms([]);

    if (areaId) {
      // Call floors API with area_id parameter
      try {
        setLoadingFloors(true);
        const url = getFullUrl(`/pms/floors.json?area_id=${areaId}`);
        const options = getAuthenticatedFetchOptions('GET');
        const response = await fetch(url, options);
        if (response.ok) {
          const data = await response.json();
          setFilteredFloors(data.floors || []);
        }
      } catch (error) {
        console.error('Error loading floors for area:', error);
      } finally {
        setLoadingFloors(false);
      }
    }
  };

  // Handle building change with API call to fetch wings (First level)
  const handleBuildingChange = async (buildingId: string) => {
    setFormData(prev => ({
      ...prev,
      building: buildingId,
      wing: '',
      area: '',
      floor: '',
      room: ''
    }));

    // Clear all dependent dropdowns
    setFilteredWings([]);
    setFilteredAreas([]);
    setFilteredFloors([]);
    setFilteredRooms([]);

    if (buildingId) {
      // Call wings API with building_id parameter
      try {
        setLoadingWings(true);
        const url = getFullUrl(`/pms/wings.json?building_id=${buildingId}`);
        const options = getAuthenticatedFetchOptions('GET');
        const response = await fetch(url, options);
        if (response.ok) {
          const data = await response.json();
          setFilteredWings(data.wings || []);
        }
      } catch (error) {
        console.error('Error loading wings for building:', error);
      } finally {
        setLoadingWings(false);
      }
    }
  };

  // Handle wing change with API call to fetch areas (Second level)
  const handleWingChange = async (wingId: string) => {
    setFormData(prev => ({
      ...prev,
      wing: wingId,
      area: '',
      floor: '',
      room: ''
    }));

    // Clear dependent dropdowns
    setFilteredAreas([]);
    setFilteredFloors([]);
    setFilteredRooms([]);

    if (wingId) {
      // Call areas API with wing_id parameter
      try {
        setLoadingAreas(true);
        const url = getFullUrl(`/pms/areas.json?wing_id=${wingId}`);
        const options = getAuthenticatedFetchOptions('GET');
        const response = await fetch(url, options);
        if (response.ok) {
          const data = await response.json();
          setFilteredAreas(data.areas || []);
        }
      } catch (error) {
        console.error('Error loading areas for wing:', error);
      } finally {
        setLoadingAreas(false);
      }
    }
  };

  // Handle floor change with API call to fetch rooms
  const handleFloorChange = async (floorId: string) => {
    setFormData(prev => ({
      ...prev,
      floor: floorId,
      room: ''
    }));

    // Clear dependent dropdown
    setFilteredRooms([]);

    if (floorId) {
      // Call rooms API with floor_id parameter
      try {
        setLoadingRooms(true);
        const url = getFullUrl(`/pms/rooms.json?floor_id=${floorId}`);
        const options = getAuthenticatedFetchOptions('GET');
        const response = await fetch(url, options);
        if (response.ok) {
          const data = await response.json();
          setFilteredRooms(Array.isArray(data) ? data : (data.rooms || []));
        }
      } catch (error) {
        console.error('Error loading rooms for floor:', error);
      } finally {
        setLoadingRooms(false);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!ticketType || !formData.categoryType || !formData.description) {
      toast.error("Please fill in all required fields", { description: "Validation Error" });
      return;
    }

    // Validate complaint mode is selected
    if (!formData.complaintMode) {
      toast.error("Please select a complaint mode", { description: "Validation Error" });
      return;
    }

    // Validate user selection for behalf of others
    if (onBehalfOf !== 'self' && !selectedUserId) {
      toast.error("Please select a user when creating ticket on behalf of others", { description: "Validation Error" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Ensure user account is loaded to get site_id
      if (!userAccount) {
        await loadUserAccountFromAPI();
      }

      // Get site_id from user account API response
      const siteId = userAccount?.site_id?.toString();

      if (!siteId) {
        toast.error("Unable to determine site ID from user account. Please refresh and try again.", { description: "Error" });
        return;
      }

      const ticketData = {
        of_phase: 'pms',
        site_id: parseInt(siteId),
        on_behalf_of: onBehalfOf === 'self' ? 'admin' : onBehalfOf,
        complaint_type: ticketType,
        category_type_id: parseInt(formData.categoryType),
        priority: formData.adminPriority || '',
        severity: formData.severity || '',
        society_staff_type: 'User',
        ...(formData.vendor && { complaint: { supplier_id: parseInt(formData.vendor) } }),
        supplier_id: formData.vendor ? parseInt(formData.vendor) : '', // Remove old supplier_id key
        proactive_reactive: formData.proactiveReactive || '',
        heading: formData.description,
        ...(formData.complaintMode && { complaint_mode_id: parseInt(formData.complaintMode) }),
        ...(onBehalfOf === 'self' && userAccount?.id && { id_user: userAccount.id }),
        ...(onBehalfOf !== 'self' && selectedUserId && {
          sel_id_user: selectedUserId,
          id_user: selectedUserId
        }),
        ...(formData.assignedTo && { assigned_to: parseInt(formData.assignedTo) }),
        ...(formData.referenceNumber && { reference_number: formData.referenceNumber }),
        ...(formData.subCategoryType && { sub_category_id: parseInt(formData.subCategoryType) }),
        // Add location parameters with correct keys
        ...(formData.area && { area_id: parseInt(formData.area) }),
        ...(formData.building && { tower_id: parseInt(formData.building) }),
        ...(formData.wing && { wing_id: parseInt(formData.wing) }),
        ...(formData.floor && { floor_id: parseInt(formData.floor) }),
        ...(formData.room && { room_id: parseInt(formData.room) }),
        is_golden_ticket: isGoldenTicket,
        is_flagged: isFlagged
      };

      // console.log('Ticket payload before API call:', ticketData);
      // console.log('Using site ID from user account:', siteId);
      // console.log('User account info:', userAccount);
      // console.log('Form data:', formData);
      // console.log('Severity value:', formData.severity);
      // console.log('Golden Ticket:', isGoldenTicket);
      // console.log('Is Flagged:', isFlagged);

      console.log('Submitting ticket with data:', ticketData, 'and files:', attachedFiles);


      const response = await ticketManagementAPI.createTicket(ticketData, attachedFiles);
      console.log('Create ticket response:', response);

      // Extract ticket number from response - common patterns are ticket_number, complaint_number, or number
      const ticketNumber = response?.ticket_number || response?.complaint_number || response?.number || response?.complaint?.ticket_number;

      toast.success(ticketNumber
        ? `Ticket created successfully - ${ticketNumber}`
        : "Ticket created successfully!");

      // navigate('/maintenance/ticket/employee');
      const currentPath = window.location.pathname;

      if (currentPath.includes("tickets")) {
        navigate("/tickets");
      } else {
        navigate("/maintenance/ticket/employee");
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error("Failed to create ticket. Please try again.", { description: "Error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get users for dropdown based on behalf selection
  const getUsersForDropdown = () => {
    if (onBehalfOf === 'occupant-user') {
      return occupantUsers.map(user => ({
        id: user.id.toString(),
        name: `${user.firstname} ${user.lastname}`,
        type: 'occupant'
      }));
    } else if (onBehalfOf === 'fm-user') {
      return fmUsers.map(user => ({
        id: user.id.toString(),
        name: user.full_name,
        type: 'fm'
      }));
    }
    return [];
  };

  const handleGoBack = () => {
    const currentPath = window.location.pathname;

    if (currentPath.includes("tickets")) {
      navigate("/tickets");
    } else {
      navigate("/maintenance/ticket/employee");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span>Ticket List</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">Create New Ticket</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">NEW TICKET</h1>
      </div>

      {/* Debug section - remove in production */}
      {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-medium text-yellow-800">Debug Tools</h3>
        <div className="mt-2 space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              clearUserDataCache();
              window.location.reload();
            }}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300"
          >
            Clear Cache & Reload
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              console.log('Current localStorage user data:', localStorage.getItem('user'));
              console.log('Current formData:', formData);
              console.log('Current userAccount:', userAccount);
            }}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300"
          >
            Log Debug Info
          </Button>
        </div>
      </div> */}

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
        {/* Section 1: Requestor Details */}
      

        {/* Section 2: Tickets Type */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <Ticket size={16} color="#C72030" />
              </span>
              Tickets Type
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Radio buttons for ticket type and flags */}
            <div className="flex gap-8">
              <RadioGroup value={ticketType} onValueChange={setTicketType} className="flex gap-8">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="request" id="request" className="text-[#C72030] border-[#C72030]" />
                  <label htmlFor="request" className="text-sm font-medium">Request</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="complaint" id="complaint" className="text-[#C72030] border-[#C72030]" />
                  <label htmlFor="complaint" className="text-sm font-medium">Complaint</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="suggestion" id="suggestion" className="text-[#C72030] border-[#C72030]" />
                  <label htmlFor="suggestion" className="text-sm font-medium">Suggestion</label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-8">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="golden"
                  checked={isGoldenTicket}
                  onChange={(e) => setIsGoldenTicket(e.target.checked)}
                  className="w-3 h-3 rounded border-2 border-[#C72030] text-[#C72030] focus:ring-[#C72030]"
                  style={{
                    accentColor: '#C72030'
                  }}
                />
                <label htmlFor="golden" className="text-sm font-medium">Golden Ticket</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="flagged"
                  checked={isFlagged}
                  onChange={(e) => setIsFlagged(e.target.checked)}
                  className="w-3 h-3 rounded border-2 border-[#C72030] text-[#C72030]"
                  style={{
                    accentColor: '#C72030'
                  }}
                />
                <label htmlFor="flagged" className="text-sm font-medium">Is Flagged</label>
              </div>
            </div>

            {/* Golden Ticket and Is Flagged radio buttons */}

            {/* <div className="flex items-center space-x-2">
                  <RadioGroupItem value="golden" id="golden" className="text-red-500 border-red-500" 
                    checked={isGoldenTicket}
                    onClick={() => setIsGoldenTicket(!isGoldenTicket)}
                  />
                  <label htmlFor="golden" className="text-sm font-medium">Golden Ticket</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flagged" id="flagged" className="text-red-500 border-red-500"
                    checked={isFlagged}
                    onClick={() => setIsFlagged(!isFlagged)}
                  />
                  <label htmlFor="flagged" className="text-sm font-medium">Is Flagged</label>
                </div> */}



            {/* Form fields in exact layout as per image */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Row 1: Category Type, Sub Category Type, Assigned To, Mode */}
              <FormControl
                fullWidth
                variant="outlined"
                required
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Category Type</InputLabel>
                <MuiSelect
                  value={formData.categoryType}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  label="Category Type"
                  notched
                  displayEmpty
                  disabled={loadingCategories}
                >
                  <MenuItem value="">Select Category Type</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Sub Category Type</InputLabel>
                <MuiSelect
                  value={formData.subCategoryType}
                  onChange={(e) => setFormData({ ...formData, subCategoryType: e.target.value })}
                  label="Sub Category Type"
                  notched
                  displayEmpty
                  disabled={loadingSubcategories || !formData.categoryType}
                >
                  <MenuItem value="" sx={{ fontSize: '14px' }}>
                    {loadingSubcategories ? "Loading..." :
                      !formData.categoryType ? "Select Category First" :
                        "Select Sub Category Type"}
                  </MenuItem>
                  {subcategories.map((subcategory) => (
                    <MenuItem key={subcategory.id} value={subcategory.id.toString()}>
                      {subcategory.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Assigned To</InputLabel>
                <MuiSelect
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  label="Assigned To"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">Select Assigned To</MenuItem>
                  {fmUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id.toString()}>
                      {user.full_name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl
                fullWidth
                variant="outlined"
                required
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Mode</InputLabel>
                <MuiSelect
                  value={formData.complaintMode}
                  onChange={(e) => setFormData({ ...formData, complaintMode: e.target.value })}
                  label="Mode*"
                  notched
                  displayEmpty
                  disabled={loadingComplaintModes}
                >
                  <MenuItem value="">
                    {loadingComplaintModes ? "Loading..." : "Select Mode"}
                  </MenuItem>
                  {complaintModes.map((mode) => (
                    <MenuItem key={mode.id} value={mode.id.toString()}>
                      {mode.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>


              {/* Row 2: Proactive/Reactive, Admin Priority, Severity, Reference Number */}

              {/* <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Proactive/Reactive</InputLabel>
                <MuiSelect
                  value={formData.proactiveReactive}
                  onChange={(e) => setFormData({ ...formData, proactiveReactive: e.target.value })}
                  label="Proactive/Reactive"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">Select Proactive/Reactive</MenuItem>
                  {PROACTIVE_REACTIVE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl`
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Admin Priority</InputLabel>
                <MuiSelect
                  value={formData.adminPriority}
                  onChange={(e) => setFormData({ ...formData, adminPriority: e.target.value })}
                  label="Admin Priority"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">Select Admin Priority</MenuItem>
                  {PRIORITY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Severity</InputLabel>
                <MuiSelect
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  label="Severity"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">Select Severity</MenuItem>
                  {SEVERITY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Vendor</InputLabel>
                <MuiSelect
                  value={formData.vendor}
                  onChange={(e) => {
                    setFormData({
                      ...formData, vendor: e.target.value
                    }); console.log(e.target.value);
                  }}
                  label="Vendor"
                  notched
                  displayEmpty
                  disabled={loadingSuppliers}
                >
                  <MenuItem value="">
                    {loadingSuppliers ? "Loading..." : "Select Vendor"}
                  </MenuItem>
                  {suppliers.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier.id.toString()}>
                      {supplier.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <TextField
                label="Reference Number"
                placeholder="Enter Reference Number"
                value={formData.referenceNumber}
                onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              /> */}
            </div>

            {/* Description - Full width */}
            <div className="relative w-full">
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder=" "
                className="peer block w-full appearance-none rounded border border-gray-300 bg-white px-3 pt-6 pb-2 text-base text-gray-900 placeholder-transparent 
      focus:outline-none 
      focus:border-[2px] 
      focus:border-[rgb(25,118,210)] 
      resize-vertical"
              />

              <label
                htmlFor="description"
                className="absolute left-3 -top-[10px] bg-white px-1 text-sm text-gray-500 z-[1] transition-all duration-200
      peer-placeholder-shown:top-4
      peer-placeholder-shown:text-base
      peer-placeholder-shown:text-gray-400
      peer-focus:-top-[10px]
      peer-focus:text-sm
      peer-focus:text-[rgb(25,118,210)]"
              >
                Descriptions
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Location Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <MapPin size={16} color="#C72030" />
              </span>
              Location Details
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Building */}
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Building</InputLabel>
                <MuiSelect
                  value={formData.building}
                  onChange={(e) => handleBuildingChange(e.target.value)}
                  label="Building"
                  notched
                  displayEmpty
                  disabled={loadingBuildings}
                >
                  <MenuItem value="">
                    {loadingBuildings ? "Loading..." : "Select Building"}
                  </MenuItem>
                  {buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id.toString()}>
                      {building.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              {/* Wing */}
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Wing</InputLabel>
                <MuiSelect
                  value={formData.wing}
                  onChange={(e) => handleWingChange(e.target.value)}
                  label="Wing"
                  notched
                  displayEmpty
                  disabled={loadingWings || !formData.building}
                >
                  <MenuItem value="">
                    {loadingWings ? "Loading..." :
                      !formData.building ? "Select Building First" : "Select Wing"}
                  </MenuItem>
                  {filteredWings.map((wing) => (
                    <MenuItem key={wing.id} value={wing.id.toString()}>
                      {wing.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              {/* Area */}
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Area</InputLabel>
                <MuiSelect
                  value={formData.area}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  label="Area"
                  notched
                  displayEmpty
                  disabled={loadingAreas || !formData.wing}
                >
                  <MenuItem value="">
                    {loadingAreas ? "Loading..." :
                      !formData.wing ? "Select Wing First" : "Select Area"}
                  </MenuItem>
                  {filteredAreas.map((area) => (
                    <MenuItem key={area.id} value={area.id.toString()}>
                      {area.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              {/* Floor */}
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Floor</InputLabel>
                <MuiSelect
                  value={formData.floor}
                  onChange={(e) => handleFloorChange(e.target.value)}
                  label="Floor"
                  notched
                  displayEmpty
                  disabled={loadingFloors || !formData.area}
                >
                  <MenuItem value="">
                    {loadingFloors ? "Loading..." :
                      !formData.area ? "Select Area First" : "Select Floor"}
                  </MenuItem>
                  {filteredFloors.map((floor) => (
                    <MenuItem key={floor.id} value={floor.id.toString()}>
                      {floor.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              {/* Room */}
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Room</InputLabel>
                <MuiSelect
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  label="Room"
                  notched
                  displayEmpty
                  disabled={loadingRooms || !formData.floor}
                >
                  <MenuItem value="">
                    {loadingRooms ? "Loading..." :
                      !formData.floor ? "Select Floor First" : "Select Room"}
                  </MenuItem>
                  {filteredRooms.map((room) => (
                    <MenuItem key={room.id} value={room.id.toString()}>
                      {room.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
          </div>
        </div>

        {/* Section 4: Add Attachments */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 2C2.44772 2 2 2.44772 2 3V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V5.41421C14 5.149 13.8946 4.89464 13.7071 4.70711L11.2929 2.29289C11.1054 2.10536 10.851 2 10.5858 2H3Z" fill="#C72030" />
                  <path d="M10 2V5C10 5.55228 10.4477 6 11 6H14" fill="#E5E0D3" />
                </svg>
              </span>
              Add Attachments
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                type="button"
                onClick={() => document.getElementById('file-upload')?.click()}
                variant="outline"
                className="border-dashed border-2 border-gray-300 hover:border-gray-400 text-gray-600 bg-white hover:bg-gray-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>

              {/* Display attached files */}
              {attachedFiles.length > 0 && (
                <div className="space-y-2">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded border">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                        <span>{file.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-2"
          >
            {isSubmitting ? 'Creating...' : 'Create Tickets'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};