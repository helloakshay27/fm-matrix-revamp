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
  const [selectedSite, setSelectedSite] = useState<string>('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedFloor, setSelectedFloor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedSeat, setSelectedSeat] = useState<string>('');

  // Dropdown data
  const [categories, setCategories] = useState<Category[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
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

  // Fetch sites
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const url = getFullUrl('/admin/sites.json');
        const options = getAuthenticatedFetchOptions();
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error('Failed to fetch sites');
        }
        
        const data = await response.json();
        setSites(data.sites || []);
      } catch (error) {
        console.error('Error fetching sites:', error);
        toast.error('Failed to load sites');
      }
    };

    fetchSites();
  }, []);

  // Fetch buildings
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const url = getFullUrl('/admin/buildings.json');
        const options = getAuthenticatedFetchOptions();
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error('Failed to fetch buildings');
        }
        
        const data = await response.json();
        setBuildings(data.buildings || []);
      } catch (error) {
        console.error('Error fetching buildings:', error);
        toast.error('Failed to load buildings');
      }
    };

    fetchBuildings();
  }, []);

  // Fetch floors
  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const url = getFullUrl('/admin/floors.json');
        const options = getAuthenticatedFetchOptions();
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error('Failed to fetch floors');
        }
        
        const data = await response.json();
        setFloors(data.floors || []);
      } catch (error) {
        console.error('Error fetching floors:', error);
        toast.error('Failed to load floors');
      }
    };

    fetchFloors();
  }, []);

  // Fetch time slots
  useEffect(() => {
    // Default time slots
    const defaultTimeSlots: TimeSlot[] = [
      { id: 'full_day', label: 'Full Day (00:00 - 23:59)', start_time: '00:00', end_time: '23:59' },
      { id: 'morning', label: 'Morning (06:00 - 12:00)', start_time: '06:00', end_time: '12:00' },
      { id: 'afternoon', label: 'Afternoon (12:00 - 18:00)', start_time: '12:00', end_time: '18:00' },
      { id: 'evening', label: 'Evening (18:00 - 23:59)', start_time: '18:00', end_time: '23:59' },
    ];
    setTimeSlots(defaultTimeSlots);
  }, []);

  // Filter buildings based on selected site
  useEffect(() => {
    if (selectedSite) {
      const filtered = buildings.filter(building => building.site_id.toString() === selectedSite);
      setFilteredBuildings(filtered);
    } else {
      setFilteredBuildings([]);
    }
    // Reset building and floor when site changes
    setSelectedBuilding('');
    setSelectedFloor('');
    setFilteredFloors([]);
  }, [selectedSite, buildings]);

  // Filter floors based on selected building
  useEffect(() => {
    if (selectedBuilding) {
      const filtered = floors.filter(floor => floor.building_id.toString() === selectedBuilding);
      setFilteredFloors(filtered);
    } else {
      setFilteredFloors([]);
    }
    // Reset floor when building changes
    setSelectedFloor('');
  }, [selectedBuilding, floors]);

  // Fetch available seats when all required fields are selected
  useEffect(() => {
    const fetchAvailableSeats = async () => {
      if (!selectedCategory || !selectedFloor || !selectedDate || !selectedTimeSlot) {
        setAvailableSeats([]);
        return;
      }

      try {
        setLoading(true);
        const url = getFullUrl('/pms/admin/seat_configurations/available_seats');
        const options = getAuthenticatedFetchOptions();
        
        const params = new URLSearchParams({
          seat_category_id: selectedCategory,
          floor_id: selectedFloor,
          booking_date: selectedDate,
          time_slot: selectedTimeSlot
        });

        const response = await fetch(`${url}?${params.toString()}`, options);
        
        if (!response.ok) {
          throw new Error('Failed to fetch available seats');
        }
        
        const data = await response.json();
        setAvailableSeats(data.available_seats || []);
        
        if (!data.available_seats || data.available_seats.length === 0) {
          toast.info('No seats available for selected criteria');
        }
      } catch (error) {
        console.error('Error fetching available seats:', error);
        toast.error('Failed to load available seats');
        setAvailableSeats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSeats();
  }, [selectedCategory, selectedFloor, selectedDate, selectedTimeSlot]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }
    if (!selectedSite) {
      toast.error('Please select a site');
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
      const url = getFullUrl('/pms/admin/seat_bookings');
      const options = getAuthenticatedFetchOptions();

      const timeSlotData = timeSlots.find(slot => slot.id === selectedTimeSlot);

      const requestBody = {
        seat_booking: {
          user_id: parseInt(currentUserId),
          seat_configuration_id: parseInt(selectedSeat),
          booking_date: selectedDate,
          booking_schedule: selectedTimeSlot,
          booking_schedule_time: timeSlotData ? `${timeSlotData.start_time} - ${timeSlotData.end_time}` : '',
          status: 'confirmed'
        }
      };

      console.log('Creating seat booking:', requestBody);

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

      const data = await response.json();
      console.log('Booking created:', data);

      toast.success('Seat booking created successfully!');
      navigate('/vas/space-management/bookings/employee');
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
          onClick={() => navigate('/vas/space-management/bookings/employee')}
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
            {/* Row 1: Category, Site, Building */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormControl
                fullWidth
                variant="outlined"
                required
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
                  <MenuItem value="">Select category</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                variant="outlined"
                required
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Site</InputLabel>
                <Select
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                  label="Site"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">Select site</MenuItem>
                  {sites.map((site) => (
                    <MenuItem key={site.id} value={site.id.toString()}>
                      {site.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                variant="outlined"
                required
                disabled={!selectedSite || filteredBuildings.length === 0}
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
                    {!selectedSite 
                      ? "Please select a site first" 
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
            </div>

            {/* Row 2: Floor, Date, Time Slot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                disabled={!selectedDate}
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
                    {!selectedDate ? "Please select a date first" : "Select time slot"}
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
        {selectedTimeSlot && (
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
              ) : availableSeats.length > 0 ? (
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
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500">No seats available for the selected criteria</p>
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
            onClick={() => navigate('/vas/space-management/bookings/employee')}
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
