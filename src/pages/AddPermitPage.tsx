import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Checkbox, ListItemText, FormControlLabel } from '@mui/material';

const fieldStyles = {
  height: {
    xs: 28,
    sm: 36,
    md: 45
  },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: {
      xs: '8px',
      sm: '10px',
      md: '12px'
    }
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'white',
    '& fieldset': {
      borderColor: '#e5e7eb',
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
};

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: 300,
      zIndex: 9999,
      backgroundColor: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
  },
  MenuListProps: {
    style: {
      padding: 0,
    },
  },
  anchorOrigin: {
    vertical: 'bottom' as const,
    horizontal: 'left' as const,
  },
  transformOrigin: {
    vertical: 'top' as const,
    horizontal: 'left' as const,
  },
};

export const AddPermitPage = () => {
  const navigate = useNavigate();
  const [permitData, setPermitData] = useState({
    // Requestor Details
    name: '',
    contactNumber: '',
    department: '',
    unit: '',
    site: '',

    // Basic Details
    permitFor: '',
    building: '',
    wing: '',
    area: '',
    floor: '',
    room: '',
    clientSpecific: 'Internal',
    copyTo: [] as string[],
    listOfEntity: [] as string[],

    // Permit Details
    permitType: '',
    permitDescription: '',
    activity: '',
    subActivity: '',
    categoryOfHazards: '',
    risks: '',
    vendor: '',
    comment: '',

    // Attachments
    attachments: null as File | null
  });

  // State for user account loading
  const [loadingUserAccount, setLoadingUserAccount] = useState(false);

  // State for Copy To users data
  const [copyToUsers, setCopyToUsers] = useState<{ id: string; name: string }[]>([]);
  const [loadingCopyToUsers, setLoadingCopyToUsers] = useState(false);

  // State for Entity data
  const [entityOptions, setEntityOptions] = useState<{ id: string; name: string }[]>([]);
  const [loadingEntityOptions, setLoadingEntityOptions] = useState(false);

  // State for Permit Types data
  const [permitTypes, setPermitTypes] = useState<{ id: number; name: string }[]>([]);
  const [loadingPermitTypes, setLoadingPermitTypes] = useState(false);

  // State for Permit Activities data
  const [permitActivities, setPermitActivities] = useState<{ id: number; name: string; parent_id: number }[]>([]);
  const [loadingPermitActivities, setLoadingPermitActivities] = useState(false);

  // State for Permit Sub Activities data
  const [permitSubActivities, setPermitSubActivities] = useState<{ id: number; name: string; parent_id: number }[]>([]);
  const [loadingPermitSubActivities, setLoadingPermitSubActivities] = useState(false);

  // State for Permit Hazard Categories data
  const [permitHazardCategories, setPermitHazardCategories] = useState<{ id: number; name: string; parent_id: number }[]>([]);
  const [loadingPermitHazardCategories, setLoadingPermitHazardCategories] = useState(false);

  // State for Permit Risks data
  const [permitRisks, setPermitRisks] = useState<{ id: number; name: string; parent_id: number }[]>([]);
  const [loadingPermitRisks, setLoadingPermitRisks] = useState(false);

  // State for Suppliers/Vendors data
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

  // State for buildings data
  const [buildings, setBuildings] = useState<{ id: number; name: string }[]>([]);
  const [loadingBuildings, setLoadingBuildings] = useState(false);

  // State for wings, areas, floors, rooms
  const [wings, setWings] = useState<{ id: number; name: string }[]>([]);
  const [areas, setAreas] = useState<{ id: number; name: string }[]>([]);
  const [floors, setFloors] = useState<{ id: number; name: string }[]>([]);
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);

  // Loading states
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activities, setActivities] = useState([
    { activity: '', subActivity: '', categoryOfHazards: '', selectedRisks: [] as string[] }
  ]);

  // Handler for multi-select changes
  const handleMultiSelectChange = (field: string, value: string[]) => {
    setPermitData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // API functions for permit data
  const getFullUrl = (endpoint: string) => {
    let baseUrl = localStorage.getItem('baseUrl') || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/\/+/, '');
    }
    return `${baseUrl}${endpoint}`;
  };

  const getAuthenticatedFetchOptions = (method: string, body?: any) => {
    const token = localStorage.getItem('token') || '';
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    return options;
  };

  // Fetch permit types
  const fetchPermitTypes = async () => {
    try {
      setLoadingPermitTypes(true);
      const url = getFullUrl('/pms/permit_tags.json');
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let permitTypeItems = [];

      if (data && Array.isArray(data)) {
        permitTypeItems = data
          .filter(item => item.tag_type === 'PermitType')
          .map(item => ({
            id: item.id,
            name: item.name
          }));
      }

      setPermitTypes(permitTypeItems);
    } catch (error) {
      console.error('Error fetching permit types:', error);
      toast.error('Failed to fetch permit types');
    } finally {
      setLoadingPermitTypes(false);
    }
  };

  // Fetch permit activities based on permit type
  const fetchPermitActivities = async (permitTypeId: string) => {
    try {
      setLoadingPermitActivities(true);
      const url = getFullUrl(`/pms/permit_tags.json?q[tag_type_eq]=PermitActivity`);
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let permitActivityItems = [];

      if (data && Array.isArray(data)) {
        permitActivityItems = data
          .filter(item => item.tag_type === 'PermitActivity' && item.parent_id?.toString() === permitTypeId)
          .map(item => ({
            id: item.id,
            name: item.name,
            parent_id: item.parent_id
          }));
      }

      setPermitActivities(permitActivityItems);
    } catch (error) {
      console.error('Error fetching permit activities:', error);
      toast.error('Failed to fetch permit activities');
    } finally {
      setLoadingPermitActivities(false);
    }
  };

  // Fetch permit sub activities based on permit activity
  const fetchPermitSubActivities = async (permitActivityId: string) => {
    try {
      setLoadingPermitSubActivities(true);
      const url = getFullUrl(`/pms/permit_tags.json?q[tag_type_eq]=PermitSubActivity`);
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let permitSubActivityItems = [];

      if (data && Array.isArray(data)) {
        permitSubActivityItems = data
          .filter(item => item.tag_type === 'PermitSubActivity' && item.parent_id?.toString() === permitActivityId)
          .map(item => ({
            id: item.id,
            name: item.name,
            parent_id: item.parent_id
          }));
      }

      setPermitSubActivities(permitSubActivityItems);
    } catch (error) {
      console.error('Error fetching permit sub activities:', error);
      toast.error('Failed to fetch permit sub activities');
    } finally {
      setLoadingPermitSubActivities(false);
    }
  };

  // Fetch permit hazard categories based on permit sub activity
  const fetchPermitHazardCategories = async (permitSubActivityId: string) => {
    try {
      setLoadingPermitHazardCategories(true);
      const url = getFullUrl(`/pms/permit_tags.json?q[tag_type_eq]=PermitHazardCategory`);
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let permitHazardCategoryItems = [];

      if (data && Array.isArray(data)) {
        permitHazardCategoryItems = data
          .filter(item => item.tag_type === 'PermitHazardCategory' && item.parent_id?.toString() === permitSubActivityId)
          .map(item => ({
            id: item.id,
            name: item.name,
            parent_id: item.parent_id
          }));
      }

      setPermitHazardCategories(permitHazardCategoryItems);
    } catch (error) {
      console.error('Error fetching permit hazard categories:', error);
      toast.error('Failed to fetch permit hazard categories');
    } finally {
      setLoadingPermitHazardCategories(false);
    }
  };

  // Fetch permit risks based on permit hazard category
  const fetchPermitRisks = async (permitHazardCategoryId: string) => {
    try {
      setLoadingPermitRisks(true);
      const url = getFullUrl(`/pms/permit_tags.json?q[tag_type_eq]=PermitRisk`);
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let permitRiskItems = [];

      if (data && Array.isArray(data)) {
        permitRiskItems = data
          .filter(item => item.tag_type === 'PermitRisk' && item.parent_id?.toString() === permitHazardCategoryId)
          .map(item => ({
            id: item.id,
            name: item.name,
            parent_id: item.parent_id
          }));
      }

      setPermitRisks(permitRiskItems);
    } catch (error) {
      console.error('Error fetching permit risks:', error);
      toast.error('Failed to fetch permit risks');
    } finally {
      setLoadingPermitRisks(false);
    }
  };

  // Fetch suppliers/vendors
  const fetchSuppliers = async () => {
    try {
      setLoadingSuppliers(true);
      // const url = getFullUrl('/pms/suppliers/get_suppliers.json');
      const url = getFullUrl('/pms/suppliers/vendor_with_user_name.json');

      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data)) {
        const supplierItems = data.map((supplier: any) => ({
          id: supplier.id.toString(),
          name: supplier.name
        }));
        setSuppliers(supplierItems);
      } else {
        setSuppliers([]);
        toast.error('No suppliers found');
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Failed to fetch suppliers');
    } finally {
      setLoadingSuppliers(false);
    }
  };

  // Handle permit type change
  const handlePermitTypeChange = (permitTypeId: string) => {
    setPermitData(prev => ({
      ...prev,
      permitType: permitTypeId,
      activity: '',
      subActivity: '',
      categoryOfHazards: ''
    }));

    // Clear dependent data
    setPermitActivities([]);
    setPermitSubActivities([]);
    setPermitHazardCategories([]);
    setPermitRisks([]);

    // Update activities array to reset fields
    setActivities(prev => prev.map(activity => ({
      ...activity,
      activity: '',
      subActivity: '',
      categoryOfHazards: '',
      selectedRisks: []
    })));

    // Fetch permit activities for the selected permit type
    if (permitTypeId) {
      fetchPermitActivities(permitTypeId);
    }
  };

  // Handle activity change in the activities array
  const handleActivityChangeWithAPI = (index: number, field: string, value: string) => {
    handleActivityChange(index, field, value);

    if (field === 'activity' && value) {
      // Reset dependent fields for this activity
      setActivities(prev => prev.map((activity, i) =>
        i === index ? { ...activity, subActivity: '', categoryOfHazards: '', selectedRisks: [] } : activity
      ));

      // Clear risks when activity changes
      setPermitRisks([]);

      // Fetch permit sub activities
      fetchPermitSubActivities(value);
    } else if (field === 'subActivity' && value) {
      // Reset dependent fields for this activity
      setActivities(prev => prev.map((activity, i) =>
        i === index ? { ...activity, categoryOfHazards: '', selectedRisks: [] } : activity
      ));

      // Clear risks when sub activity changes
      setPermitRisks([]);

      // Fetch permit hazard categories
      fetchPermitHazardCategories(value);
    } else if (field === 'categoryOfHazards' && value) {
      // Reset selected risks for this activity
      setActivities(prev => prev.map((activity, i) =>
        i === index ? { ...activity, selectedRisks: [] } : activity
      ));

      // Fetch permit risks based on hazard category
      fetchPermitRisks(value);
    }
  };

  // Fetch Entity options on component mount
  useEffect(() => {
    const fetchEntityOptions = async () => {
      setLoadingEntityOptions(true);
      try {
        // Get baseUrl and token from localStorage
        let baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        // Ensure baseUrl starts with https://
        if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
          baseUrl = 'https://' + baseUrl.replace(/^\/\/+/, '');
        }

        const response = await fetch(`${baseUrl}/entities.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.entities && Array.isArray(result.entities)) {
            setEntityOptions(result.entities.map((entity: any) => ({
              id: entity.id.toString(),
              name: entity.name
            })));
          } else {
            setEntityOptions([]);
            toast.error('No entities found');
          }
        } else {
          setEntityOptions([]);
          toast.error('Failed to fetch entities');
        }
      } catch (error) {
        console.error('Error fetching entities:', error);
        setEntityOptions([]);
        toast.error('Error fetching entities');
      } finally {
        setLoadingEntityOptions(false);
      }
    };

    fetchEntityOptions();
  }, []);

  // Fetch Permit Types on component mount
  useEffect(() => {
    fetchPermitTypes();
  }, []);

  // Fetch Suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Fetch Copy To users on component mount
  useEffect(() => {
    const fetchCopyToUsers = async () => {
      setLoadingCopyToUsers(true);
      try {
        // Get baseUrl and token from localStorage
        let baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        // Ensure baseUrl starts with https://
        if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
          baseUrl = 'https://' + baseUrl.replace(/^\/\/+/, '');
        }

        const response = await fetch(`${baseUrl}/pms/users/get_escalate_to_users.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.users && Array.isArray(result.users)) {
            setCopyToUsers(result.users.map((user: any) => ({
              id: user.id.toString(),
              name: user.full_name
            })));
          } else {
            setCopyToUsers([]);
            toast.error('No users found for Copy To');
          }
        } else {
          setCopyToUsers([]);
          toast.error('Failed to fetch Copy To users');
        }
      } catch (error) {
        console.error('Error fetching Copy To users:', error);
        setCopyToUsers([]);
        toast.error('Error fetching Copy To users');
      } finally {
        setLoadingCopyToUsers(false);
      }
    };

    fetchCopyToUsers();
  }, []);

  // Fetch user account details on component mount
  useEffect(() => {
    const fetchUserAccount = async () => {
      setLoadingUserAccount(true);
      try {
        // Get baseUrl and token from localStorage
        let baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        // Ensure baseUrl starts with https://
        if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
          baseUrl = 'https://' + baseUrl.replace(/^\/\/+/, '');
        }

        const response = await fetch(`${baseUrl}/api/users/account.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result) {
            setPermitData(prev => ({
              ...prev,
              name: `${result.firstname || ''} ${result.lastname || ''}`.trim(),
              contactNumber: result.mobile || '',
              department: result.department_name || '',
              unit: result.unit_name || '',
              site: result.site_name || ''
            }));
          } else {
            toast.error('User account data not found');
          }
        } else {
          toast.error('Failed to fetch user account details');
        }
      } catch (error) {
        console.error('Error fetching user account:', error);
        toast.error('Error fetching user account details');
      } finally {
        setLoadingUserAccount(false);
      }
    };

    fetchUserAccount();
  }, []);

  // Fetch buildings on component mount
  useEffect(() => {
    const fetchBuildings = async () => {
      setLoadingBuildings(true);
      try {
        // Get baseUrl and token from localStorage
        let baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        // Ensure baseUrl starts with https://
        if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
          baseUrl = 'https://' + baseUrl.replace(/^\/\/+/, '');
        }

        const response = await fetch(`${baseUrl}/pms/buildings.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.pms_buildings && Array.isArray(result.pms_buildings)) {
            setBuildings(result.pms_buildings.map((building: any) => ({
              id: building.id,
              name: building.name
            })));
          } else {
            setBuildings([]);
            toast.error('No buildings found');
          }
        } else {
          setBuildings([]);
          toast.error('Failed to fetch buildings');
        }
      } catch (error) {
        console.error('Error fetching buildings:', error);
        setBuildings([]);
        toast.error('Error fetching buildings');
      } finally {
        setLoadingBuildings(false);
      }
    };

    fetchBuildings();
  }, []);

  // Fetch wings when building changes
  useEffect(() => {
    const fetchWings = async () => {
      if (!permitData.building) {
        setWings([]);
        setPermitData(prev => ({
          ...prev,
          wing: '',
          area: '',
          floor: '',
          room: ''
        }));
        return;
      }

      setLoadingWings(true);
      try {
        // Get baseUrl and token from localStorage
        let baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        // Ensure baseUrl starts with https://
        if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
          baseUrl = 'https://' + baseUrl.replace(/^\/\/+/, '');
        }

        const response = await fetch(`${baseUrl}/pms/buildings/${permitData.building}/wings.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          // Extract wings from nested structure: [].wings
          const wingsData = Array.isArray(result)
            ? result.map((item: any) => item.wings).filter(Boolean).flat()
            : [];
          setWings(wingsData.map((wing: any) => ({
            id: wing.id,
            name: wing.name
          })));
        } else {
          setWings([]);
          toast.error('Failed to fetch wings');
        }
      } catch (error) {
        console.error('Error fetching wings:', error);
        setWings([]);
        toast.error('Error fetching wings');
      } finally {
        setLoadingWings(false);
      }
    };

    fetchWings();
  }, [permitData.building]);

  // Fetch areas when wing changes
  useEffect(() => {
    const fetchAreas = async () => {
      if (!permitData.wing) {
        setAreas([]);
        setPermitData(prev => ({
          ...prev,
          area: '',
          floor: '',
          room: ''
        }));
        return;
      }

      setLoadingAreas(true);
      try {
        // Get baseUrl and token from localStorage
        let baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        // Ensure baseUrl starts with https://
        if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
          baseUrl = 'https://' + baseUrl.replace(/^\/\/+/, '');
        }

        const response = await fetch(`${baseUrl}/pms/wings/${permitData.wing}/areas.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.areas && Array.isArray(result.areas)) {
            setAreas(result.areas.map((area: any) => ({
              id: area.id,
              name: area.name
            })));
          } else {
            setAreas([]);
          }
        } else {
          setAreas([]);
          toast.error('Failed to fetch areas');
        }
      } catch (error) {
        console.error('Error fetching areas:', error);
        setAreas([]);
        toast.error('Error fetching areas');
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchAreas();
  }, [permitData.wing]);

  // Fetch floors when area changes
  useEffect(() => {
    const fetchFloors = async () => {
      if (!permitData.area) {
        setFloors([]);
        setPermitData(prev => ({
          ...prev,
          floor: '',
          room: ''
        }));
        return;
      }

      setLoadingFloors(true);
      try {
        // Get baseUrl and token from localStorage
        let baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        // Ensure baseUrl starts with https://
        if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
          baseUrl = 'https://' + baseUrl.replace(/^\/\/+/, '');
        }

        const response = await fetch(`${baseUrl}/pms/areas/${permitData.area}/floors.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.floors && Array.isArray(result.floors)) {
            setFloors(result.floors.map((floor: any) => ({
              id: floor.id,
              name: floor.name
            })));
          } else {
            setFloors([]);
          }
        } else {
          setFloors([]);
          toast.error('Failed to fetch floors');
        }
      } catch (error) {
        console.error('Error fetching floors:', error);
        setFloors([]);
        toast.error('Error fetching floors');
      } finally {
        setLoadingFloors(false);
      }
    };

    fetchFloors();
  }, [permitData.area]);

  // Fetch rooms when floor changes
  useEffect(() => {
    const fetchRooms = async () => {
      if (!permitData.floor) {
        setRooms([]);
        setPermitData(prev => ({
          ...prev,
          room: ''
        }));
        return;
      }

      setLoadingRooms(true);
      try {
        // Get baseUrl and token from localStorage
        let baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        // Ensure baseUrl starts with https://
        if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
          baseUrl = 'https://' + baseUrl.replace(/^\/\/+/, '');
        }

        const response = await fetch(`${baseUrl}/pms/floors/${permitData.floor}/rooms.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          // Extract rooms from nested structure: [].rooms
          const roomsData = Array.isArray(result)
            ? result.map((item: any) => item.rooms).filter(Boolean).flat()
            : [];
          setRooms(roomsData.map((room: any) => ({
            id: room.id,
            name: room.name
          })));
        } else {
          setRooms([]);
          toast.error('Failed to fetch rooms');
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setRooms([]);
        toast.error('Error fetching rooms');
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, [permitData.floor]);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'clientSpecific') {
      // Reset copy to and list of entity when client specific changes
      setPermitData(prev => ({
        ...prev,
        [field]: value,
        copyTo: [],
        listOfEntity: []
      }));
    } else {
      setPermitData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Handle building change and reset dependent dropdowns
  const handleBuildingChange = (value: string) => {
    setPermitData(prev => ({
      ...prev,
      building: value,
      wing: '',
      area: '',
      floor: '',
      room: ''
    }));
  };

  // Handle wing change and reset dependent dropdowns
  const handleWingChange = (value: string) => {
    setPermitData(prev => ({
      ...prev,
      wing: value,
      area: '',
      floor: '',
      room: ''
    }));
  };

  // Handle area change and reset dependent dropdowns
  const handleAreaChange = (value: string) => {
    setPermitData(prev => ({
      ...prev,
      area: value,
      floor: '',
      room: ''
    }));
  };

  // Handle floor change and reset room
  const handleFloorChange = (value: string) => {
    setPermitData(prev => ({
      ...prev,
      floor: value,
      room: ''
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPermitData(prev => ({
        ...prev,
        attachments: file
      }));
      toast.success('File uploaded successfully');
    }
  };

  const handleAddActivity = () => {
    setActivities(prev => [...prev, { activity: '', subActivity: '', categoryOfHazards: '', selectedRisks: [] }]);
  };

  const handleRemoveActivity = (index: number) => {
    if (activities.length > 1) {
      setActivities(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleActivityChange = (index: number, field: string, value: string) => {
    setActivities(prev => prev.map((activity, i) =>
      i === index ? { ...activity, [field]: value } : activity
    ));
  };

  // Handle risk checkbox changes
  const handleRiskChange = (index: number, riskId: string, checked: boolean) => {
    setActivities(prev => prev.map((activity, i) => {
      if (i === index) {
        const updatedRisks = checked
          ? [...activity.selectedRisks, riskId]
          : activity.selectedRisks.filter(id => id !== riskId);
        return { ...activity, selectedRisks: updatedRisks };
      }
      return activity;
    }));
  };

  // const handleSubmit = async () => {
  //   if (isSubmitting) return; // Prevent double submission

  //   try {
  //     setIsSubmitting(true);

  //     // Validate required fields
  //     if (!permitData.permitFor.trim()) {
  //       toast.error('Please enter permit for field');
  //       return;
  //     }
  //     if (!permitData.building) {
  //       toast.error('Please select building');
  //       return;
  //     }
  //     if (!permitData.permitType) {
  //       toast.error('Please select permit type');
  //       return;
  //     }
  //     if (activities.length === 0 || !activities[0].activity) {
  //       toast.error('Please add at least one activity');
  //       return;
  //     }

  //     const formData = new FormData();

  //     // Basic permit data
  //     formData.append('pms_permit[permit_for]', permitData.permitFor);
  //     formData.append('pms_permit[building_id]', permitData.building);
  //     if (permitData.wing) formData.append('pms_permit[wing_id]', permitData.wing);
  //     if (permitData.area) formData.append('pms_permit[area_id]', permitData.area);
  //     if (permitData.floor) formData.append('pms_permit[floor_id]', permitData.floor);
  //     if (permitData.room) formData.append('pms_permit[room_id]', permitData.room);
  //     formData.append('pms_permit[client_specific]', permitData.clientSpecific);
  //     formData.append('pms_permit[comment]', permitData.comment ?? '');

  //     // Entity ID - take first selected entity if multiple
  //     if (permitData.listOfEntity.length > 0) {
  //       formData.append('pms_permit[entity_id]', permitData.listOfEntity[0]);
  //     }

  //     // Copy To (intimate_to) - multiple values
  //     permitData.copyTo.forEach(userId => {
  //       formData.append('pms_permit[intimate_to][]', userId);
  //     });

  //     formData.append('pms_permit[permit_type_id]', permitData.permitType);

  //     // Vendor ID
  //     if (permitData.vendor) {
  //       formData.append('pms_permit[vendor_id]', permitData.vendor);
  //     }

  //     // Permit details (activities) with nested attributes
  //     activities.forEach((activity, index) => {
  //       if (activity.activity && activity.subActivity && activity.categoryOfHazards) {
  //         formData.append(`pms_permit[permit_details_attributes][${index}][_destroy]`, 'false');
  //         formData.append(`pms_permit[permit_details_attributes][${index}][permit_activity_id]`, activity.activity);
  //         formData.append(`pms_permit[permit_details_attributes][${index}][permit_sub_activity_id]`, activity.subActivity);
  //         formData.append(`pms_permit[permit_details_attributes][${index}][permit_hazard_category_id]`, activity.categoryOfHazards);

  //         // Add selected risks for this activity
  //         activity.selectedRisks.forEach((riskId, riskIndex) => {
  //           formData.append(`pms_permit[permit_details_attributes][${index}][permit_risks_attributes][${riskIndex}][permit_risk_id]`, riskId);
  //         });
  //       }
  //     });

  //     // Attachments
  //     if (permitData.attachments) {
  //       formData.append('attachments[]', permitData.attachments);
  //     }

  //     // Get API URL and token from localStorage
  //     const baseUrl = localStorage.getItem('baseUrl') || '';
  //     const token = localStorage.getItem('token') || '';

  //     let fullBaseUrl = baseUrl;
  //     if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
  //       fullBaseUrl = 'https://' + baseUrl.replace(/^\/\/+/, '');
  //     }

  //     const url = `${fullBaseUrl}/pms/permits.json`;

  //     const response = await fetch(url, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //         // Note: Don't set Content-Type for FormData, let browser set it with boundary
  //       },
  //       body: formData
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.text();
  //       console.error('API Error:', errorData);
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const responseData = await response.json();
  //     console.log('Permit created successfully:', responseData);

  //     toast.success(`Permit created successfully! Reference Number: ${responseData.permit?.reference_number || 'N/A'}`);
  //     navigate('/safety/permit');

  //   } catch (error) {
  //     console.error('Error creating permit:', error);
  //     toast.error('Failed to create permit. Please try again.');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent double submission

    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!permitData.permitFor.trim()) {
        toast.error('Please enter permit for field');
        return;
      }
      if (!permitData.building) {
        toast.error('Please select building');
        return;
      }
      if (!permitData.permitType) {
        toast.error('Please select permit type');
        return;
      }
      if (activities.length === 0 || !activities[0].activity) {
        toast.error('Please add at least one activity');
        return;
      }

      // Validate first activity details (mandatory: sub activity, category of hazards, risks)
      const firstActivity = activities[0];
      if (!firstActivity.subActivity) {
        toast.error('Please select sub activity for Activity 1');
        return;
      }
      if (!firstActivity.categoryOfHazards) {
        toast.error('Please select category of hazards for Activity 1');
        return;
      }
      if (firstActivity.selectedRisks.length === 0) {
        toast.error('Please select at least one risk for Activity 1');
        return;
      }

      // Validate vendor (mandatory)
      if (!permitData.vendor) {
        toast.error('Please select vendor');
        return;
      }

      const formData = new FormData();

      // Basic permit data
      formData.append('pms_permit[permit_for]', permitData.permitFor);
      formData.append('pms_permit[building_id]', permitData.building);
      if (permitData.wing) formData.append('pms_permit[wing_id]', permitData.wing);
      if (permitData.area) formData.append('pms_permit[area_id]', permitData.area);
      if (permitData.floor) formData.append('pms_permit[floor_id]', permitData.floor);
      if (permitData.room) formData.append('pms_permit[room_id]', permitData.room);
      formData.append('pms_permit[client_specific]', permitData.clientSpecific);
      formData.append('pms_permit[comment]', permitData.comment ?? '');

      // Entity ID - take first selected entity if multiple
      if (permitData.listOfEntity.length > 0) {
        formData.append('pms_permit[entity_id]', permitData.listOfEntity[0]);
      }

      // Copy To (intimate_to) - multiple values
      permitData.copyTo.forEach(userId => {
        formData.append('pms_permit[intimate_to][]', userId);
      });

      formData.append('pms_permit[permit_type_id]', permitData.permitType);

      // Vendor ID
      if (permitData.vendor) {
        formData.append('pms_permit[vendor_id]', permitData.vendor);
      }

      // Permit details (activities) with nested attributes
      activities.forEach((activity, index) => {
        if (activity.activity && activity.subActivity && activity.categoryOfHazards) {
          formData.append(`pms_permit[permit_details_attributes][${index}][_destroy]`, 'false');
          formData.append(`pms_permit[permit_details_attributes][${index}][permit_activity_id]`, activity.activity);
          formData.append(`pms_permit[permit_details_attributes][${index}][permit_sub_activity_id]`, activity.subActivity);
          formData.append(`pms_permit[permit_details_attributes][${index}][permit_hazard_category_id]`, activity.categoryOfHazards);

          // Add selected risks for this activity
          activity.selectedRisks.forEach((riskId, riskIndex) => {
            formData.append(`pms_permit[permit_details_attributes][${index}][permit_risks_attributes][${riskIndex}][permit_risk_id]`, riskId);
          });
        }
      });

      // Attachments
      if (permitData.attachments) {
        formData.append('attachments[]', permitData.attachments);
      }

      // Get API URL and token from localStorage
      const baseUrl = localStorage.getItem('baseUrl') || '';
      const token = localStorage.getItem('token') || '';

      let fullBaseUrl = baseUrl;
      if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        fullBaseUrl = 'https://' + baseUrl.replace(/^\/\/+/, '');
      }

      const url = `${fullBaseUrl}/pms/permits.json`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Note: Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Permit created successfully:', responseData);

      toast.success(`Permit created successfully! Reference Number: ${responseData.permit?.reference_number || 'N/A'}`);
      navigate('/safety/permit');

    } catch (error) {
      console.error('Error creating permit:', error);
      toast.error('Failed to create permit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/safety/permit')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Permit List
        </Button>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">NEW PERMIT</h1>
      </div>

      {/* Permit Requestor Details */}
      <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
        <CardHeader className='bg-[#F6F4EE] mb-4'>
          <CardTitle className="text-lg text-black flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
            PERMIT REQUESTOR DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          {loadingUserAccount ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-600">Loading user data...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Name<span style={{ color: '#C72030' }}>*</span></label>
                <div className="text-base text-gray-900 py-2 px-3 bg-gray-50 rounded-lg border">
                  {permitData.name || 'N/A'}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Contact Number<span style={{ color: '#C72030' }}>*</span></label>
                <div className="text-base text-gray-900 py-2 px-3 bg-gray-50 rounded-lg border">
                  {permitData.contactNumber || 'N/A'}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Department<span style={{ color: '#C72030' }}>*</span></label>
                <div className="text-base text-gray-900 py-2 px-3 bg-gray-50 rounded-lg border">
                  {permitData.department || 'N/A'}
                </div>
              </div>

              {permitData.unit && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Unit</label>
                  <div className="text-base text-gray-900 py-2 px-3 bg-gray-50 rounded-lg border">
                    {permitData.unit}
                  </div>
                </div>
              )}

              {permitData.site && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Site</label>
                  <div className="text-base text-gray-900 py-2 px-3 bg-gray-50 rounded-lg border">
                    {permitData.site}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Basic Details */}
      <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
        <CardHeader className='bg-[#F6F4EE] mb-4'>
          <CardTitle className="text-lg text-black flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">2</span>
            BASIC DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <div className="space-y-6">
            <TextField
              label={<>Permit For <span style={{ color: '#C72030', fontWeight: 600 }}>*</span></>}
              value={permitData.permitFor}
              onChange={(e) => handleInputChange('permitFor', e.target.value)}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
              size="small"

            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel id="building-select-label" shrink>Building
                  <span style={{ color: '#C72030', fontWeight: 600 }}>*</span>
                </InputLabel>
                <MuiSelect
                  labelId="building-select-label"
                  label="Building*"
                  value={permitData.building}
                  onChange={(e) => handleBuildingChange(e.target.value)}
                  displayEmpty
                  MenuProps={menuProps}
                  disabled={loadingBuildings}
                  size="small"
                >
                  <MenuItem value="">
                    <em>{loadingBuildings ? 'Loading buildings...' : 'Select Building'}</em>
                  </MenuItem>
                  {buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id.toString()}>
                      {building.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel id="wing-select-label" shrink>Wing</InputLabel>
                <MuiSelect
                  labelId="wing-select-label"
                  label="Wing"
                  value={permitData.wing}
                  onChange={(e) => handleWingChange(e.target.value)}
                  displayEmpty
                  MenuProps={menuProps}
                  disabled={loadingWings || !permitData.building}
                  size="small"
                >
                  <MenuItem value="">
                    <em>
                      {!permitData.building
                        ? 'Select Building First'
                        : loadingWings
                          ? 'Loading wings...'
                          : 'Select Wing'
                      }
                    </em>
                  </MenuItem>
                  {wings.map((wing) => (
                    <MenuItem key={wing.id} value={wing.id.toString()}>
                      {wing.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel id="area-select-label" shrink>Area</InputLabel>
                <MuiSelect
                  labelId="area-select-label"
                  label="Area"
                  value={permitData.area}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  displayEmpty
                  MenuProps={menuProps}
                  disabled={loadingAreas || !permitData.wing}
                  size="small"
                >
                  <MenuItem value="">
                    <em>
                      {!permitData.wing
                        ? 'Select Wing First'
                        : loadingAreas
                          ? 'Loading areas...'
                          : 'Select Area'
                      }
                    </em>
                  </MenuItem>
                  {areas.map((area) => (
                    <MenuItem key={area.id} value={area.id.toString()}>
                      {area.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel id="floor-select-label" shrink>Floor</InputLabel>
                <MuiSelect
                  labelId="floor-select-label"
                  label="Floor"
                  value={permitData.floor}
                  onChange={(e) => handleFloorChange(e.target.value)}
                  displayEmpty
                  MenuProps={menuProps}
                  disabled={loadingFloors || !permitData.area}
                  size="small"
                >
                  <MenuItem value="">
                    <em>
                      {!permitData.area
                        ? 'Select Area First'
                        : loadingFloors
                          ? 'Loading floors...'
                          : 'Select Floor'
                      }
                    </em>
                  </MenuItem>
                  {floors.map((floor) => (
                    <MenuItem key={floor.id} value={floor.id.toString()}>
                      {floor.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel id="room-select-label" shrink>Room</InputLabel>
                <MuiSelect
                  labelId="room-select-label"
                  label="Room"
                  value={permitData.room}
                  onChange={(e) => handleInputChange('room', e.target.value)}
                  displayEmpty
                  MenuProps={menuProps}
                  disabled={loadingRooms || !permitData.floor}
                  size="small"
                >
                  <MenuItem value="">
                    <em>
                      {!permitData.floor
                        ? 'Select Floor First'
                        : loadingRooms
                          ? 'Loading rooms...'
                          : 'Select Room'
                      }
                    </em>
                  </MenuItem>
                  {rooms.map((room) => (
                    <MenuItem key={room.id} value={room.id.toString()}>
                      {room.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-gray-700">Client Specific</label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="clientSpecific"
                    value="Internal"
                    checked={permitData.clientSpecific === 'Internal'}
                    onChange={(e) => handleInputChange('clientSpecific', e.target.value)}
                    className="mr-2 w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                  />
                  <span className="text-sm text-gray-700">Internal</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="clientSpecific"
                    value="Client"
                    checked={permitData.clientSpecific === 'Client'}
                    onChange={(e) => handleInputChange('clientSpecific', e.target.value)}
                    className="mr-2 w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                  />
                  <span className="text-sm text-gray-700">Client</span>
                </label>
              </div>
            </div>

            {/* Copy To Dropdown - Shows for Internal */}
            {permitData.clientSpecific === 'Internal' && (
              <div>
                <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                  <InputLabel shrink>Copy To</InputLabel>
                  <MuiSelect
                    multiple
                    value={permitData.copyTo}
                    onChange={(e) => handleMultiSelectChange('copyTo', e.target.value as string[])}
                    label="Copy To"
                    MenuProps={menuProps}
                    size="small"
                    disabled={loadingCopyToUsers}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return loadingCopyToUsers ? 'Loading users...' : 'Select Copy To';
                      }
                      const selectedNames = copyToUsers
                        .filter(option => selected.includes(option.id))
                        .map(option => option.name);
                      return selectedNames.join(', ');
                    }}
                  >
                    {loadingCopyToUsers ? (
                      <MenuItem disabled>
                        <em>Loading users...</em>
                      </MenuItem>
                    ) : (
                      copyToUsers.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          <Checkbox checked={permitData.copyTo.includes(option.id)} />
                          <ListItemText primary={option.name} />
                        </MenuItem>
                      ))
                    )}
                  </MuiSelect>
                </FormControl>
              </div>
            )}

            {/* Copy To and List of Entity Dropdowns - Shows for Client */}
            {permitData.clientSpecific === 'Client' && (
              <div className="space-y-4">
                <div>
                  <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                    <InputLabel shrink>Copy To</InputLabel>
                    <MuiSelect
                      multiple
                      value={permitData.copyTo}
                      onChange={(e) => handleMultiSelectChange('copyTo', e.target.value as string[])}
                      label="Copy To"
                      MenuProps={menuProps}
                      size="small"
                      disabled={loadingCopyToUsers}
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return loadingCopyToUsers ? 'Loading users...' : 'Select Copy To';
                        }
                        const selectedNames = copyToUsers
                          .filter(option => selected.includes(option.id))
                          .map(option => option.name);
                        return selectedNames.join(', ');
                      }}
                    >
                      {loadingCopyToUsers ? (
                        <MenuItem disabled>
                          <em>Loading users...</em>
                        </MenuItem>
                      ) : (
                        copyToUsers.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            <Checkbox checked={permitData.copyTo.includes(option.id)} />
                            <ListItemText primary={option.name} />
                          </MenuItem>
                        ))
                      )}
                    </MuiSelect>
                  </FormControl>
                </div>

                <div>
                  <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                    <InputLabel shrink>List of Entity</InputLabel>
                    <MuiSelect
                      multiple
                      value={permitData.listOfEntity}
                      onChange={(e) => handleMultiSelectChange('listOfEntity', e.target.value as string[])}
                      label="List of Entity"
                      MenuProps={menuProps}
                      size="small"
                      disabled={loadingEntityOptions}
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return loadingEntityOptions ? 'Loading entities...' : 'Select Entity';
                        }
                        const selectedNames = entityOptions
                          .filter(option => selected.includes(option.id))
                          .map(option => option.name);
                        return selectedNames.join(', ');
                      }}
                    >
                      {loadingEntityOptions ? (
                        <MenuItem disabled>
                          <em>Loading entities...</em>
                        </MenuItem>
                      ) : (
                        entityOptions.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            <Checkbox checked={permitData.listOfEntity.includes(option.id)} />
                            <ListItemText primary={option.name} />
                          </MenuItem>
                        ))
                      )}
                    </MuiSelect>
                  </FormControl>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Permit Details */}
      <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
        <CardHeader className='bg-[#F6F4EE] mb-4'>
          <CardTitle className="text-lg text-black flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">3</span>
            PERMIT DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-700">Select Permit Type    <span style={{ color: '#C72030', fontWeight: 600 }}>*</span>
              </label>
              {loadingPermitTypes ? (
                <div className="flex items-center justify-center py-8 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="text-center text-gray-600">Loading permit types...</div>
                </div>
              ) : permitTypes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {permitTypes.map((permitType) => (
                    <div
                      key={permitType.id}
                      className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${permitData.permitType === permitType.id.toString()
                        ? 'border-[#C72030] bg-[#C72030]/5 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      onClick={() => handlePermitTypeChange(permitType.id.toString())}
                    >
                      <label className="flex items-center cursor-pointer w-full">
                        <input
                          type="radio"
                          name="permitType"
                          value={permitType.id.toString()}
                          checked={permitData.permitType === permitType.id.toString()}
                          onChange={(e) => handlePermitTypeChange(e.target.value)}
                          className="mr-3 w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                        />
                        <span className={`text-sm font-medium ${permitData.permitType === permitType.id.toString()
                          ? 'text-[#C72030]'
                          : 'text-gray-700'
                          }`}>
                          {permitType.name}
                        </span>
                      </label>
                      {permitData.permitType === permitType.id.toString() && (
                        <div className="absolute top-2 right-2">
                          <div className="w-2 h-2 bg-[#C72030] rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="text-center text-gray-600">No permit types available</div>
                </div>
              )}
            </div>

            {/* Enter Permit Description */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-700">Enter Permit DescriptionEnter Permit Description <span style={{ color: '#C72030', fontWeight: 600 }}>*</span></label>
            </div>

            {/* Dynamic Activities */}
            {activities.map((activity, index) => (
              <div key={index} className="space-y-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
                {/* Header with remove button */}
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Activity {index + 1}</h4>
                  {activities.length > 1 && (
                    <button
                      onClick={() => handleRemoveActivity(index)}
                      className="text-red-500 hover:text-red-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors"
                      title="Remove Activity"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <FormControl fullWidth variant="outlined">
                    {/* <InputLabel sx={{ color: '#6b7280', '&.Mui-focused': { color: '#C72030' } }}>Activity*</InputLabel> */}
                    <InputLabel sx={{ color: '#6b7280', '&.Mui-focused': { color: '#C72030' } }}>
                      Activity
                      <span style={{ color: '#C72030', fontWeight: 600 }}>*</span>
                    </InputLabel>
                    <MuiSelect
                      label="Activity*"
                      value={activity.activity}
                      onChange={(e) => handleActivityChangeWithAPI(index, 'activity', e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                      MenuProps={menuProps}
                      disabled={loadingPermitActivities || !permitData.permitType}
                    >
                      <MenuItem value="">
                        {/* <em>
                          {!permitData.permitType
                            ? 'Select Permit Type First'
                            : loadingPermitActivities
                              ? 'Loading activities...'
                              : 'Select Activity'
                          }
                        </em> */}
                      </MenuItem>
                      {permitActivities.map((permitActivity) => (
                        <MenuItem key={permitActivity.id} value={permitActivity.id.toString()}>
                          {permitActivity.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>

                  <FormControl fullWidth variant="outlined">
                    {/* <InputLabel sx={{ color: '#6b7280', '&.Mui-focused': { color: '#C72030' } }}>Sub Activity*</InputLabel>
                     */}
                    <InputLabel sx={{ color: '#6b7280', '&.Mui-focused': { color: '#C72030' } }}>
                      Sub Activity
                      <span style={{ color: '#C72030', fontWeight: 600 }}>*</span>
                    </InputLabel>
                    <MuiSelect
                      label="Sub Activity*"
                      value={activity.subActivity}
                      onChange={(e) => handleActivityChangeWithAPI(index, 'subActivity', e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                      MenuProps={menuProps}
                      disabled={loadingPermitSubActivities || !activity.activity}
                    >
                      <MenuItem value="">
                        {/* <em>
                          {!activity.activity
                            ? 'Select Activity First'
                            : loadingPermitSubActivities
                              ? 'Loading sub activities...'
                              : 'Select Sub Activity'
                          }
                        </em> */}
                      </MenuItem>
                      {permitSubActivities.map((permitSubActivity) => (
                        <MenuItem key={permitSubActivity.id} value={permitSubActivity.id.toString()}>
                          {permitSubActivity.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>

                  <FormControl fullWidth variant="outlined">
                    {/* <InputLabel sx={{ color: '#6b7280', '&.Mui-focused': { color: '#C72030' } }}>Category of Hazards*</InputLabel> */}
                    <InputLabel sx={{ color: '#6b7280', '&.Mui-focused': { color: '#C72030' } }}>
                      Category of Hazards
                      <span style={{ color: '#C72030', fontWeight: 600 }}>*</span>
                    </InputLabel>

                    <MuiSelect
                      label="Category of Hazards*"
                      value={activity.categoryOfHazards}
                      onChange={(e) => handleActivityChangeWithAPI(index, 'categoryOfHazards', e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                      MenuProps={menuProps}
                      disabled={loadingPermitHazardCategories || !activity.subActivity}
                    >
                      <MenuItem value="">
                        {/* <em>
                          {!activity.subActivity
                            ? 'Select Sub Activity First'
                            : loadingPermitHazardCategories
                              ? 'Loading hazard categories...'
                              : 'Select Hazard Category'
                          }
                        </em> */}
                      </MenuItem>
                      {permitHazardCategories.map((permitHazardCategory) => (
                        <MenuItem key={permitHazardCategory.id} value={permitHazardCategory.id.toString()}>
                          {permitHazardCategory.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </div>

                {/* Risks Section */}
                {activity.categoryOfHazards && (
                  <div className="mt-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">
                      Risks
                      <span style={{ color: '#C72030', fontWeight: 600 }}>*</span>
                    </h5>

                    {loadingPermitRisks ? (
                      <div className="flex items-center justify-center py-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="text-center text-gray-600">Loading risks...</div>
                      </div>
                    ) : permitRisks.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border border-gray-200 rounded-lg bg-white">
                        {permitRisks.map((risk) => (
                          <FormControlLabel
                            key={risk.id}
                            control={
                              <Checkbox
                                checked={activity.selectedRisks.includes(risk.id.toString())}
                                onChange={(e) => handleRiskChange(index, risk.id.toString(), e.target.checked)}
                                sx={{
                                  color: '#6b7280',
                                  '&.Mui-checked': {
                                    color: '#C72030',
                                  },
                                }}
                              />
                            }
                            label={
                              <span className="text-sm text-gray-700">{risk.name}</span>
                            }
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="text-center text-gray-600">No risks available for this hazard category</div>
                      </div>
                    )}
                  </div>
                )}

                {/* <TextField
                  label="Risks*"
                  value={permitData.risks}
                  onChange={(e) => handleInputChange('risks', e.target.value)}
                  fullWidth
                  variant="outlined"
                  multiline

                  sx={fieldStyles}
                /> */}
              </div>
            ))}

            <Button
              onClick={handleAddActivity}
              className="bg-[#C72030] hover:bg-[#A61B28] text-white px-6 py-2 rounded-lg font-medium"
            >
              + Add Activity
            </Button>

            <FormControl fullWidth variant="outlined">
              {/* <InputLabel sx={{ color: '#6b7280', '&.Mui-focused': { color: '#C72030' } }}>Vendor</InputLabel> */}
              <InputLabel sx={{ color: '#6b7280', '&.Mui-focused': { color: '#C72030' } }}>
                Vendor
                <span style={{ color: '#C72030', fontWeight: 600 }}>*</span>
              </InputLabel>

              <MuiSelect
                label="Vendor"
                value={permitData.vendor}
                onChange={(e) => handleInputChange('vendor', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={menuProps}
                disabled={loadingSuppliers}
              >
                <MenuItem value="">
                  {/* <em>{loadingSuppliers ? 'Loading suppliers...' : 'Select Vendor'}</em> */}
                </MenuItem>
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            {/* <TextField
              label="Comment (Optional)"
              value={permitData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              fullWidth
              variant="outlined"
              multiline

              sx={fieldStyles}
            /> */}
            <TextField
              label="Comment (Optional)"
              value={permitData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              sx={{ ...fieldStyles, width: "100%", mb: 1 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
        <CardHeader className='bg-[#F6F4EE] mb-4'>
          <CardTitle className="text-lg text-black flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">4</span>
            ATTACHMENTS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <div className="space-y-4">
            <div>
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors font-medium text-gray-700"
              >
                Choose Files
              </label>
              <span className="ml-4 text-sm text-gray-500">
                {permitData.attachments ? permitData.attachments.name : 'No file chosen'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{ backgroundColor: isSubmitting ? '#9ca3af' : '#C72030' }}
          className="text-white hover:bg-[#C72030]/90 flex items-center px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating Permit...' : 'Raise a Request'}
        </Button>
      </div>
    </div>
  );
};

export default AddPermitPage;
