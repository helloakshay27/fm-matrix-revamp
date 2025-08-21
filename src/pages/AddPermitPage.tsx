import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Checkbox, ListItemText } from '@mui/material';

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
    name: 'Ankit Gupta',
    contactNumber: '91 7388997281',
    department: '',
    unit: '',
    site: 'Lockated',

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

  const [activities, setActivities] = useState([
    { activity: '', subActivity: '', categoryOfHazards: '' }
  ]);

  // Sample data for new dropdowns
  const copyToOptions = [
    { id: '1', name: 'Security Team' },
    { id: '2', name: 'Safety Officer' },
    { id: '3', name: 'Operations Manager' },
    { id: '4', name: 'Facility Manager' },
    { id: '5', name: 'Maintenance Team' },
  ];

  const entityOptions = [
    { id: '1', name: 'Building A Management' },
    { id: '2', name: 'Building B Management' },
    { id: '3', name: 'External Vendor' },
    { id: '4', name: 'Client Representative' },
    { id: '5', name: 'Contractor Team' },
  ];

  // Handler for multi-select changes
  const handleMultiSelectChange = (field: string, value: string[]) => {
    setPermitData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
          if (result.buildings && Array.isArray(result.buildings)) {
            setBuildings(result.buildings.map((building: any) => ({
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
    setActivities(prev => [...prev, { activity: '', subActivity: '', categoryOfHazards: '' }]);
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

  const handleSubmit = () => {
    console.log('Permit Data:', permitData);
    console.log('Activities:', activities);
    toast.success('Permit request raised successfully!');
    navigate('/maintenance/permit');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/maintenance/permit')} className="mb-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <TextField
              label="Name"
              value={permitData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
              size="small"
            />
            <TextField
              label="Contact Number"
              value={permitData.contactNumber}
              onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
              size="small"
            />
            <TextField
              label="Site"
              value={permitData.site}
              onChange={(e) => handleInputChange('site', e.target.value)}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
              size="small"
            />
            <TextField
              label="Department"
              value={permitData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
              size="small"
            />
            <TextField
              label="Unit"
              value={permitData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
              size="small"
            />
          </div>
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
              label="Permit For*"
              value={permitData.permitFor}
              onChange={(e) => handleInputChange('permitFor', e.target.value)}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
              size="small"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel id="building-select-label" shrink>Building*</InputLabel>
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
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return 'Select Copy To';
                      }
                      const selectedNames = copyToOptions
                        .filter(option => selected.includes(option.id))
                        .map(option => option.name);
                      return selectedNames.join(', ');
                    }}
                  >
                    {copyToOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        <Checkbox checked={permitData.copyTo.includes(option.id)} />
                        <ListItemText primary={option.name} />
                      </MenuItem>
                    ))}
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
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return 'Select Copy To';
                        }
                        const selectedNames = copyToOptions
                          .filter(option => selected.includes(option.id))
                          .map(option => option.name);
                        return selectedNames.join(', ');
                      }}
                    >
                      {copyToOptions.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          <Checkbox checked={permitData.copyTo.includes(option.id)} />
                          <ListItemText primary={option.name} />
                        </MenuItem>
                      ))}
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
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return 'Select Entity';
                        }
                        const selectedNames = entityOptions
                          .filter(option => selected.includes(option.id))
                          .map(option => option.name);
                        return selectedNames.join(', ');
                      }}
                    >
                      {entityOptions.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          <Checkbox checked={permitData.listOfEntity.includes(option.id)} />
                          <ListItemText primary={option.name} />
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Permit Details */}
      <Card className="mb-8 shadow-sm border-0">
        <CardHeader className="bg-white border-b border-gray-100">
          <CardTitle className="flex items-center text-[#C72030] text-lg font-semibold">
            <span className="mr-3 w-2 h-2 bg-[#C72030] rounded-full"></span>
            PERMIT DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-700">Select Permit Type*</label>
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="permitType"
                    value="test"
                    checked={permitData.permitType === 'test'}
                    onChange={(e) => handleInputChange('permitType', e.target.value)}
                    className="mr-2 w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                  />
                  <span className="text-sm text-gray-700">test</span>
                </label>
              </div>
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
                    <InputLabel sx={{ color: '#6b7280', '&.Mui-focused': { color: '#C72030' } }}>Activity*</InputLabel>
                    <MuiSelect
                      label="Activity*"
                      value={activity.activity}
                      onChange={(e) => handleActivityChange(index, 'activity', e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                      MenuProps={menuProps}
                    >
                      <MenuItem value=""><em>Select Activity</em></MenuItem>
                      <MenuItem value="maintenance">Maintenance</MenuItem>
                      <MenuItem value="installation">Installation</MenuItem>
                      <MenuItem value="repair">Repair</MenuItem>
                    </MuiSelect>
                  </FormControl>

                  <FormControl fullWidth variant="outlined">
                    <InputLabel sx={{ color: '#6b7280', '&.Mui-focused': { color: '#C72030' } }}>Sub Activity*</InputLabel>
                    <MuiSelect
                      label="Sub Activity*"
                      value={activity.subActivity}
                      onChange={(e) => handleActivityChange(index, 'subActivity', e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                      MenuProps={menuProps}
                    >
                      <MenuItem value=""><em>Select Sub Activity</em></MenuItem>
                      <MenuItem value="electrical">Electrical</MenuItem>
                      <MenuItem value="plumbing">Plumbing</MenuItem>
                      <MenuItem value="hvac">HVAC</MenuItem>
                    </MuiSelect>
                  </FormControl>

                  <FormControl fullWidth variant="outlined">
                    <InputLabel sx={{ color: '#6b7280', '&.Mui-focused': { color: '#C72030' } }}>Category of Hazards*</InputLabel>
                    <MuiSelect
                      label="Category of Hazards*"
                      value={activity.categoryOfHazards}
                      onChange={(e) => handleActivityChange(index, 'categoryOfHazards', e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                      MenuProps={menuProps}
                    >
                      <MenuItem value=""><em>Select Category of Hazards</em></MenuItem>
                      <MenuItem value="low">Low Risk</MenuItem>
                      <MenuItem value="medium">Medium Risk</MenuItem>
                      <MenuItem value="high">High Risk</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>

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
              <InputLabel sx={{ color: '#6b7280', '&.Mui-focused': { color: '#C72030' } }}>Vendor</InputLabel>
              <MuiSelect
                label="Vendor"
                value={permitData.vendor}
                onChange={(e) => handleInputChange('vendor', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={menuProps}
              >
                <MenuItem value=""><em>Select Vendor</em></MenuItem>
                <MenuItem value="vendor-1">Vendor 1</MenuItem>
                <MenuItem value="vendor-2">Vendor 2</MenuItem>
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
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90 flex items-center px-8 py-2"
        >
          Raise a Request
        </Button>
      </div>
    </div>
  );
};

export default AddPermitPage;
