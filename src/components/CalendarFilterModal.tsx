import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { X, CalendarIcon } from 'lucide-react';
import { MaterialDatePicker } from '@/components/ui/material-date-picker';
import { apiClient } from '@/utils/apiClient';
import { toast } from 'sonner';

interface CalendarFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: CalendarFilters) => void;
}

export interface CalendarFilters {
  dateFrom: string;
  dateTo: string;
  amc: string;
  service: string;
  status: string;
  scheduleType: string;
  priority: string;
  site: string;
  building: string;
  wing: string;
  floor: string;
  area: string;
  room: string;
}

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

// Interface definitions for API data
interface SiteItem {
  id: number;
  name: string;
}

interface BuildingItem {
  id: number;
  name: string;
}

interface WingItem {
  id: number;
  name: string;
}

interface AreaItem {
  id: number;
  name: string;
}

interface FloorItem {
  id: number;
  name: string;
}

interface RoomItem {
  id: number;
  name: string;
}

interface StatusItem {
  id: number;
  name: string;
}

interface AMCItem {
  id: number;
  name: string;
}

export const CalendarFilterModal: React.FC<CalendarFilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters
}) => {
  const [filters, setFilters] = useState<CalendarFilters>({
    dateFrom: '01/07/2025',
    dateTo: '31/07/2025',
    amc: '',
    service: '',
    status: '',
    scheduleType: '',
    priority: '',
    site: '',
    building: '',
    wing: '',
    floor: '',
    area: '',
    room: ''
  });

  // API data states
  const [sites, setSites] = useState<SiteItem[]>([]);
  const [buildings, setBuildings] = useState<BuildingItem[]>([]);
  const [wings, setWings] = useState<WingItem[]>([]);
  const [areas, setAreas] = useState<AreaItem[]>([]);
  const [floors, setFloors] = useState<FloorItem[]>([]);
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [statuses, setStatuses] = useState<StatusItem[]>([]);
  const [amcs, setAMCs] = useState<AMCItem[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSites, setLoadingSites] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Fetch sites on component mount
  useEffect(() => {
    const fetchSites = async () => {
      if (!isOpen) return;
      
      setLoadingSites(true);
      try {
        const response = await apiClient.get('/pms/sites.json');
        const sitesData = Array.isArray(response.data?.sites) ? response.data.sites : [];
        setSites(sitesData);
      } catch (error) {
        console.error('Error fetching sites:', error);
        setSites([]);
      } finally {
        setLoadingSites(false);
      }
    };

    const fetchStatuses = async () => {
      try {
        const response = await apiClient.get('/pms/admin/helpdesk_statuses.json');
        const statusesData = Array.isArray(response.data?.statuses) ? response.data.statuses : [];
        setStatuses(statusesData);
      } catch (error) {
        console.error('Error fetching statuses:', error);
        setStatuses([]);
      }
    };

    const fetchAMCs = async () => {
      try {
        const response = await apiClient.get('/pms/amc/list.json');
        const amcData = Array.isArray(response.data?.amcs) ? response.data.amcs : [];
        setAMCs(amcData);
      } catch (error) {
        console.error('Error fetching AMCs:', error);
        setAMCs([]);
      }
    };

    if (isOpen) {
      fetchSites();
      fetchStatuses();
      fetchAMCs();
    }
  }, [isOpen]);

  // Fetch buildings when site changes
  useEffect(() => {
    const fetchBuildings = async () => {
      if (!filters.site) {
        setBuildings([]);
        handleFilterChange('building', '');
        handleFilterChange('wing', '');
        handleFilterChange('area', '');
        handleFilterChange('floor', '');
        handleFilterChange('room', '');
        return;
      }

      setLoadingBuildings(true);
      try {
        const response = await apiClient.get(`/pms/sites/${filters.site}/buildings.json`);
        const buildingsData = Array.isArray(response.data?.buildings) 
          ? response.data.buildings.map((item: any) => item.building).filter(Boolean)
          : [];
        setBuildings(buildingsData);
      } catch (error) {
        console.error('Error fetching buildings:', error);
        setBuildings([]);
      } finally {
        setLoadingBuildings(false);
      }
    };

    fetchBuildings();
  }, [filters.site]);

  // Fetch wings when building changes
  useEffect(() => {
    const fetchWings = async () => {
      if (!filters.building) {
        setWings([]);
        handleFilterChange('wing', '');
        handleFilterChange('area', '');
        handleFilterChange('floor', '');
        handleFilterChange('room', '');
        return;
      }

      setLoadingWings(true);
      try {
        const response = await apiClient.get(`/pms/buildings/${filters.building}/wings.json`);
        const wingsData = Array.isArray(response.data) 
          ? response.data.map((item: any) => item.wings).filter(Boolean)
          : [];
        setWings(wingsData);
      } catch (error) {
        console.error('Error fetching wings:', error);
        setWings([]);
      } finally {
        setLoadingWings(false);
      }
    };

    fetchWings();
  }, [filters.building]);

  // Fetch areas when wing changes
  useEffect(() => {
    const fetchAreas = async () => {
      if (!filters.wing) {
        setAreas([]);
        handleFilterChange('area', '');
        handleFilterChange('floor', '');
        handleFilterChange('room', '');
        return;
      }

      setLoadingAreas(true);
      try {
        const response = await apiClient.get(`/pms/wings/${filters.wing}/areas.json`);
        const areasData = Array.isArray(response.data?.areas) ? response.data.areas : [];
        setAreas(areasData);
      } catch (error) {
        console.error('Error fetching areas:', error);
        setAreas([]);
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchAreas();
  }, [filters.wing]);

  // Fetch floors when area changes
  useEffect(() => {
    const fetchFloors = async () => {
      if (!filters.area) {
        setFloors([]);
        handleFilterChange('floor', '');
        handleFilterChange('room', '');
        return;
      }

      setLoadingFloors(true);
      try {
        const response = await apiClient.get(`/pms/areas/${filters.area}/floors.json`);
        const floorsData = Array.isArray(response.data?.floors) ? response.data.floors : [];
        setFloors(floorsData);
      } catch (error) {
        console.error('Error fetching floors:', error);
        setFloors([]);
      } finally {
        setLoadingFloors(false);
      }
    };

    fetchFloors();
  }, [filters.area]);

  // Fetch rooms when floor changes
  useEffect(() => {
    const fetchRooms = async () => {
      if (!filters.floor) {
        setRooms([]);
        handleFilterChange('room', '');
        return;
      }

      setLoadingRooms(true);
      try {
        const response = await apiClient.get(`/pms/floors/${filters.floor}/rooms.json`);
        const roomsData = Array.isArray(response.data) 
          ? response.data.map((item: any) => item.rooms).filter(Boolean)
          : [];
        setRooms(roomsData);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setRooms([]);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, [filters.floor]);

  const handleFilterChange = (key: keyof CalendarFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = async () => {
    setIsLoading(true);
    try {
      onApplyFilters(filters);
      onClose();
      toast.success('Filters applied successfully');
    } catch (error) {
      toast.error('Failed to apply filters');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    const clearedFilters: CalendarFilters = {
      dateFrom: '01/07/2025',
      dateTo: '31/07/2025',
      amc: '',
      service: '',
      status: '',
      scheduleType: '',
      priority: '',
      site: '',
      building: '',
      wing: '',
      floor: '',
      area: '',
      room: ''
    };
    setFilters(clearedFilters);
    
    // Clear dependent data arrays
    setBuildings([]);
    setWings([]);
    setAreas([]);
    setFloors([]);
    setRooms([]);
    
    onApplyFilters(clearedFilters);
    onClose();
    toast.success('Filters cleared successfully');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="calendar-filter-dialog-description">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <div id="calendar-filter-dialog-description" className="sr-only">
            Filter calendar tasks by date range, task details, and location
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Range Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Date Range</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <MaterialDatePicker
                  value={filters.dateFrom}
                  onChange={(value) => handleFilterChange('dateFrom', value)}
                  placeholder="Select from date"
                />
              </div>
              <div className="space-y-1">
                <MaterialDatePicker
                  value={filters.dateTo}
                  onChange={(value) => handleFilterChange('dateTo', value)}
                  placeholder="Select to date"
                />
              </div>
            </div>
          </div>

          {/* Task Details Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Task Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="amc-label" shrink>AMC</InputLabel>
                <MuiSelect
                  labelId="amc-label"
                  label="AMC"
                  value={filters.amc}
                  onChange={(e) => handleFilterChange('amc', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select AMC</em></MenuItem>
                  {amcs.map((amc) => (
                    <MenuItem key={amc.id} value={amc.id?.toString() || ''}>
                      {amc.name || 'Unknown AMC'}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel id="status-label" shrink>Status</InputLabel>
                <MuiSelect
                  labelId="status-label"
                  label="Status"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Status</em></MenuItem>
                  {statuses.map((status) => (
                    <MenuItem key={status.id} value={status.id?.toString() || ''}>
                      {status.name || 'Unknown Status'}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-4">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="service-label" shrink>Service</InputLabel>
                <MuiSelect
                  labelId="service-label"
                  label="Service"
                  value={filters.service}
                  onChange={(e) => handleFilterChange('service', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Service</em></MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="cleaning">Cleaning</MenuItem>
                  <MenuItem value="hvac">HVAC</MenuItem>
                  <MenuItem value="electrical">Electrical</MenuItem>
                  <MenuItem value="plumbing">Plumbing</MenuItem>
                  <MenuItem value="security">Security</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel id="schedule-type-label" shrink>Schedule Type</InputLabel>
                <MuiSelect
                  labelId="schedule-type-label"
                  label="Schedule Type"
                  value={filters.scheduleType}
                  onChange={(e) => handleFilterChange('scheduleType', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Type</em></MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="annual">Annual</MenuItem>
                  <MenuItem value="one-time">One Time</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel id="priority-label" shrink>Priority</InputLabel>
                <MuiSelect
                  labelId="priority-label"
                  label="Priority"
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Priority</em></MenuItem>
                  <MenuItem value="p1">P1 - Critical</MenuItem>
                  <MenuItem value="p2">P2 - High</MenuItem>
                  <MenuItem value="p3">P3 - Medium</MenuItem>
                  <MenuItem value="p4">P4 - Low</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Location Details Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Location Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="site-label" shrink>Site</InputLabel>
                <MuiSelect
                  labelId="site-label"
                  label="Site"
                  value={filters.site}
                  onChange={(e) => handleFilterChange('site', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingSites}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Site</em></MenuItem>
                  {sites.map((site) => (
                    <MenuItem key={site.id} value={site.id?.toString() || ''}>
                      {site.name || 'Unknown Site'}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel id="building-label" shrink>Building</InputLabel>
                <MuiSelect
                  labelId="building-label"
                  label="Building"
                  value={filters.building}
                  onChange={(e) => handleFilterChange('building', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingBuildings || !filters.site}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Building</em></MenuItem>
                  {buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id?.toString() || ''}>
                      {building.name || 'Unknown Building'}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-4">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="wing-label" shrink>Wing</InputLabel>
                <MuiSelect
                  labelId="wing-label"
                  label="Wing"
                  value={filters.wing}
                  onChange={(e) => handleFilterChange('wing', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingWings || !filters.building}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Wing</em></MenuItem>
                  {wings.map((wing) => (
                    <MenuItem key={wing.id} value={wing.id?.toString() || ''}>
                      {wing.name || 'Unknown Wing'}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel id="area-label" shrink>Area</InputLabel>
                <MuiSelect
                  labelId="area-label"
                  label="Area"
                  value={filters.area}
                  onChange={(e) => handleFilterChange('area', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingAreas || !filters.wing}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Area</em></MenuItem>
                  {areas.map((area) => (
                    <MenuItem key={area.id} value={area.id?.toString() || ''}>
                      {area.name || 'Unknown Area'}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel id="floor-label" shrink>Floor</InputLabel>
                <MuiSelect
                  labelId="floor-label"
                  label="Floor"
                  value={filters.floor}
                  onChange={(e) => handleFilterChange('floor', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingFloors || !filters.area}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Floor</em></MenuItem>
                  {floors.map((floor) => (
                    <MenuItem key={floor.id} value={floor.id?.toString() || ''}>
                      {floor.name || 'Unknown Floor'}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-4">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="room-label" shrink>Room</InputLabel>
                <MuiSelect
                  labelId="room-label"
                  label="Room"
                  value={filters.room}
                  onChange={(e) => handleFilterChange('room', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingRooms || !filters.floor}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Room</em></MenuItem>
                  {rooms.map((room) => (
                    <MenuItem key={room.id} value={room.id?.toString() || ''}>
                      {room.name || 'Unknown Room'}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button 
              onClick={handleApply} 
              disabled={isLoading} 
              className="flex-1 h-11 bg-[#C72030] hover:bg-[#A31828] text-white"
            >
              {isLoading ? 'Applying...' : 'Apply'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClear} 
              disabled={isLoading} 
              className="flex-1 h-11"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};