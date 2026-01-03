import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Building2, Layers, Clock, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

interface Category {
  id: number;
  name: string;
}

interface Site {
  id: number;
  name: string;
}

interface Building {
  id: number;
  name: string;
  site_id: number;
}

interface Floor {
  id: number;
  name: string;
  building_id: number;
}

interface TimeSlot {
  id: string;
  label: string;
  start_time: string;
  end_time: string;
}

interface AvailableSeat {
  id: number;
  seat_number: string;
  is_available: boolean;
  seat_type?: string;
}

interface SeatConfiguration {
  id: number;
  name?: string;
  label?: string;
}

// Field styles for Material-UI components matching ticket page
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

const SpaceManagementBookingAddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentUserSite, setCurrentUserSite] = useState<Site | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedFloor, setSelectedFloor] = useState<string>('');
  const [selectedSeatConfig, setSelectedSeatConfig] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedSeat, setSelectedSeat] = useState<string>('');

  // Dropdown data
  const [categories, setCategories] = useState<Category[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [seatConfigurations, setSeatConfigurations] = useState<SeatConfiguration[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [availableSeats, setAvailableSeats] = useState<AvailableSeat[]>([]);

  // Filtered data
  const [filteredBuildings, setFilteredBuildings] = useState<Building[]>([]);
  const [filteredFloors, setFilteredFloors] = useState<Floor[]>([]);

  // Get current user ID from localStorage
  const getCurrentUserId = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.id ? user.id.toString() : null;
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  };

  // Get current user name from localStorage
  const getCurrentUserName = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.full_name || user.name || 'Current User';
      } catch (error) {
        console.error('Error parsing user data:', error);
        return 'Current User';
      }
    }
    return 'Current User';
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const url = getFullUrl('/pms/admin/seat_categories.json');
        const options = getAuthenticatedFetchOptions();
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data.seat_categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load seat categories');
      }
    };

    fetchCategories();
  }, []);

  // Fetch current user's site and buildings
  useEffect(() => {
    const fetchCurrentUserSite = async () => {
      try {
        const userData = localStorage.getItem('user');
        let userId = null;
        
        if (userData) {
          try {
            const user = JSON.parse(userData);
            userId = user.id || user.user_id;
          } catch (e) {
            console.error('Could not parse user data from localStorage');
          }
        }

        if (!userId) {
          toast.error('User not authenticated');
          return;
        }

        const url = getFullUrl(`/pms/sites/allowed_sites.json?user_id=${userId}`);
        const options = getAuthenticatedFetchOptions();
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user site');
        }
        
        const data = await response.json();
        if (data.selected_site) {
          setCurrentUserSite(data.selected_site);
          
          // Fetch buildings for the selected site
          const buildingsUrl = getFullUrl(`/pms/sites/buildings.json?site_id=${data.selected_site.id}`);
          const buildingsResponse = await fetch(buildingsUrl, options);
          
          if (buildingsResponse.ok) {
            const buildingsData = await buildingsResponse.json();
            const siteBuildings = buildingsData.buildings || [];
            setBuildings(siteBuildings);
            setFilteredBuildings(siteBuildings);
          }
        }
      } catch (error) {
        console.error('Error fetching user site:', error);
        toast.error('Failed to load site information');
      }
    };

    fetchCurrentUserSite();
  }, []);

  // Fetch floors based on selected building
  useEffect(() => {
    const fetchFloors = async () => {
      if (!selectedBuilding) {
        setFloors([]);
        setFilteredFloors([]);
        return;
      }

      try {
        const url = getFullUrl(`/pms/admin/seat_configurations/floors.json?building_id=${selectedBuilding}`);
        const options = getAuthenticatedFetchOptions();
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error('Failed to fetch floors');
        }
        
        const data = await response.json();
        const floorData = data.floors || [];
        setFloors(floorData);
        setFilteredFloors(floorData);
      } catch (error) {
        console.error('Error fetching floors:', error);
        toast.error('Failed to load floors');
        setFloors([]);
        setFilteredFloors([]);
      }
    };

    fetchFloors();
    // Reset dependent selections when building changes
    setSelectedFloor('');
    setSeatConfigurations([]);
    setSelectedSeatConfig('');
  }, [selectedBuilding]);

  // Fetch seat configurations when building+floor selected
  useEffect(() => {
    const fetchSeatConfigurations = async () => {
      if (!selectedBuilding || !selectedFloor) {
        setSeatConfigurations([]);
        setAvailableSeats([]);
        return;
      }

      try {
        setLoading(true);
        const baseUrl = getFullUrl('/pms/admin/seat_configurations.json');
        const options = getAuthenticatedFetchOptions();

        // Extract token from options if available
        const token = localStorage.getItem('authToken') || '';
        
        const params = new URLSearchParams({
          token: token,
          'q[building_id_eq]': selectedBuilding,
          'q[floor_id_eq]': selectedFloor,
        });

        const url = `${baseUrl}?${params.toString()}`;
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Failed to fetch seat configurations');

        const data = await response.json();
        setSeatConfigurations(data.seat_configurations || []);
        // Reset seat config selection
        setSelectedSeatConfig('');
      } catch (error) {
        console.error('Error fetching seat configurations:', error);
        toast.error('Failed to load seat configurations');
        setSeatConfigurations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSeatConfigurations();
  }, [selectedBuilding, selectedFloor]);

  // When a seat configuration is selected, fetch its details (seats)
  useEffect(() => {
    const fetchSeatConfigurationDetails = async () => {
      if (!selectedSeatConfig) {
        setAvailableSeats([]);
        return;
      }

      try {
        setLoading(true);
        const url = getFullUrl(`/pms/admin/seat_configurations/${selectedSeatConfig}.json`);
        const options = getAuthenticatedFetchOptions();
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Failed to fetch seat configuration details');

        const data = await response.json();
        const config = data.seat_configuration || data.seat_configurations || data;
        const seats = config.seats || config.available_seats || [];
        setAvailableSeats(seats);
      } catch (error) {
        console.error('Error fetching seat configuration details:', error);
        toast.error('Failed to load seat configuration details');
        setAvailableSeats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSeatConfigurationDetails();
  }, [selectedSeatConfig]);

  // When seat configuration + date changes, fetch schedules for slots
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!selectedSeatConfig || !selectedDate) {
        setTimeSlots([]);
        return;
      }

      try {
        setLoading(true);
        const formattedDate = (() => {
          const parts = selectedDate.split('-');
          if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
          return selectedDate;
        })();

        const url = getFullUrl(`/pms/admin/seat_configurations/${selectedSeatConfig}/get_schedules.json`);
        const options = getAuthenticatedFetchOptions();
        const params = new URLSearchParams({ date: formattedDate });

        const response = await fetch(`${url}?${params.toString()}`, options);
        if (!response.ok) throw new Error('Failed to fetch schedules');

        const data = await response.json();
        const schedules = data.schedules || data.time_slots || [];
        if (schedules.length > 0) {
          const mapped: TimeSlot[] = schedules.map((s: unknown) => {
            const schedule = s as Record<string, unknown>;
            return {
              id: schedule.id?.toString() ?? schedule.slot_id?.toString() ?? schedule.key?.toString() ?? '',
              label: (schedule.label || schedule.name || `${schedule.start_time || schedule.from} - ${schedule.end_time || schedule.to}`) as string,
              start_time: (schedule.start_time || schedule.from || '') as string,
              end_time: (schedule.end_time || schedule.end || schedule.to || '') as string
            };
          });
          setTimeSlots(mapped);
        } else {
          setTimeSlots([]);
        }
      } catch (error) {
        console.error('Error fetching schedules:', error);
        toast.error('Failed to load schedules');
        setTimeSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [selectedSeatConfig, selectedDate]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }
    if (!currentUserSite) {
      toast.error('Site information not available');
      return;
    }
    if (!selectedBuilding) {
      toast.error('Please select a building');
      return;
    }
    if (!selectedFloor) {
      toast.error('Please select a floor');
      return;
    }
    if (!selectedSeatConfig) {
      toast.error('Please select a seat configuration');
      return;
    }
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    if (!selectedTimeSlot) {
      toast.error('Please select a time slot');
      return;
    }
    if (!selectedSeat) {
      toast.error('Please select a seat');
      return;
    }

    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      toast.error('User not authenticated');
      return;
    }

    try {
      setSubmitting(true);
      const url = getFullUrl('/pms/seat_bookings.json');
      const options = getAuthenticatedFetchOptions();

      // API expects booking_date as DD/MM/YYYY
      const formattedDateForApi = (() => {
        const parts = selectedDate.split('-');
        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
        return selectedDate;
      })();

      const requestBody = {
        seat_booking: {
          booking_date: formattedDateForApi,
          status: 'confirmed',
          seat_configuration_id: parseInt(selectedSeatConfig)
        },
        selected_slots: [
          {
            slot_id: parseInt(selectedTimeSlot),
            seat_id: parseInt(selectedSeat),
            status: 'confirmed'
          }
        ]
      };

      const response = await fetch(url, {
        ...options,
        method: 'POST',
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      await response.json();

      toast.success('Seat booking created successfully!');
      navigate('/employee/space-management/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create seat booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/employee/space-management/bookings')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to My Bookings</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Add Seat Booking</h1>
        <p className="text-gray-600 mt-2">Book a seat for {getCurrentUserName()}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Booking Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <Users size={16} color="#C72030" />
              </span>
              Booking Details
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Row 1: Date, Building, Floor */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TextField
                type="date"
                label="Booking Date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                fullWidth
                required
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
                inputProps={{ min: getTodayDate() }}
              />

              <FormControl
                fullWidth
                variant="outlined"
                required
                disabled={!currentUserSite || filteredBuildings.length === 0}
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Building</InputLabel>
                <Select
                  value={selectedBuilding}
                  onChange={(e) => setSelectedBuilding(e.target.value)}
                  label="Building"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">
                    {!currentUserSite 
                      ? "Loading..." 
                      : filteredBuildings.length === 0 
                      ? "No buildings available" 
                      : "Select building"}
                  </MenuItem>
                  {filteredBuildings.map((building) => (
                    <MenuItem key={building.id} value={building.id.toString()}>
                      {building.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                variant="outlined"
                required
                disabled={!selectedBuilding || filteredFloors.length === 0}
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Floor</InputLabel>
                <Select
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(e.target.value)}
                  label="Floor"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">
                    {!selectedBuilding 
                      ? "Please select a building first" 
                      : filteredFloors.length === 0 
                      ? "No floors available" 
                      : "Select floor"}
                  </MenuItem>
                  {filteredFloors.map((floor) => (
                    <MenuItem key={floor.id} value={floor.id.toString()}>
                      {floor.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Row 2: Category, Time Slot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormControl
                fullWidth
                variant="outlined"
                required
                disabled={!selectedBuilding || !selectedFloor}
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">
                    {!selectedBuilding || !selectedFloor 
                      ? "Select building & floor first" 
                      : "Select category"}
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* <FormControl
                fullWidth
                variant="outlined"
                required
                disabled={!selectedBuilding || !selectedFloor || seatConfigurations.length === 0}
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Seat Configuration</InputLabel>
                <Select
                  value={selectedSeatConfig}
                  onChange={(e) => setSelectedSeatConfig(e.target.value)}
                  label="Seat Configuration"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">
                    {!selectedBuilding || !selectedFloor 
                      ? "Select building & floor first" 
                      : seatConfigurations.length === 0 
                      ? "No configurations available" 
                      : "Select configuration"}
                  </MenuItem>
                  {seatConfigurations.map((cfg) => (
                    <MenuItem key={cfg.id} value={cfg.id.toString()}>
                      {cfg.name || cfg.label || `Config ${cfg.id}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}

              <FormControl
                fullWidth
                variant="outlined"
                required
                disabled={!selectedDate || !selectedSeatConfig || timeSlots.length === 0}
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Time Slot</InputLabel>
                <Select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  label="Time Slot"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">
                    {!selectedDate || !selectedSeatConfig 
                      ? "Select configuration & date first" 
                      : timeSlots.length === 0 
                      ? "No slots available" 
                      : "Select time slot"}
                  </MenuItem>
                  {timeSlots.map((slot) => (
                    <MenuItem key={slot.id} value={slot.id}>
                      {slot.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </div>

        {/* Section 2: Seat Selection */}
        {selectedSeatConfig && availableSeats.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                  <MapPin size={16} color="#C72030" />
                </span>
                Available Seats
              </h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {availableSeats.map((seat) => (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => setSelectedSeat(seat.id.toString())}
                      disabled={!seat.is_available}
                      className={`p-4 border-2 rounded-lg text-center font-medium transition-all ${
                        selectedSeat === seat.id.toString()
                          ? 'border-[#C72030] bg-[#C72030] text-white shadow-md'
                          : seat.is_available
                          ? 'border-gray-300 hover:border-[#C72030] hover:bg-gray-50'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="font-semibold">{seat.seat_number}</div>
                      <div className="text-xs mt-1">
                        {seat.is_available ? 'Available' : 'Booked'}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/employee/space-management/bookings')}
            className="px-8 h-11"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-8 h-11 bg-[#C72030] hover:bg-[#A01020] text-white"
            disabled={submitting || loading}
          >
            {submitting ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
                Creating...
              </>
            ) : (
              'Create Booking'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SpaceManagementBookingAddEmployee;
