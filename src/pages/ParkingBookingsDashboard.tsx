import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
// Removed Card, CardContent, Label from shadcn/ui as Material-UI alternatives are used for consistent styling
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bike, Car, MapPin } from "lucide-react"; // MapPin added for location section icon
import { toast } from 'sonner';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material'; // Importing Material-UI components
import {
  fetchBuildings, fetchFloors, fetchParkingSlotsWithStatus,
  Building, Floor, ParkingCategory
} from '@/services/parkingConfigurationsAPI';

// Field styles for Material-UI components - re-using for consistency
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

const ParkingBookingsDashboard = () => {
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [parkingSlotType, setParkingSlotType] = useState(''); // Renamed to clarify it's a type selection
  const navigate = useNavigate();

  const [showParkingSlots, setShowParkingSlots] = useState(false);

  const [parkingCategories, setParkingCategories] = useState<ParkingCategory[]>([]);
  const [loadingParkingSlots, setLoadingParkingSlots] = useState(false);

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);

  // Fetch buildings on component mount
  useEffect(() => {
    const fetchBuildingsData = async () => {
      setLoadingBuildings(true);
      try {
        const buildingsData = await fetchBuildings();
        setBuildings(buildingsData);
      } catch (error) {
        console.error('Error fetching buildings:', error);
        toast.error('Failed to fetch buildings');
      } finally {
        setLoadingBuildings(false);
      }
    };

    fetchBuildingsData();
  }, []);

  // Fetch floors when building changes
  useEffect(() => {
    const fetchFloorsData = async () => {
      if (!building) {
        setFloors([]);
        setFloor(''); // Reset floor when building changes
        return;
      }

      setLoadingFloors(true);
      try {
        const floorsData = await fetchFloors(building);
        setFloors(floorsData);
      } catch (error) {
        console.error('Error fetching floors:', error);
        toast.error('Failed to fetch floors');
      } finally {
        setLoadingFloors(false);
      }
    };

    fetchFloorsData();
  }, [building]);

  // Handle building change
  const handleBuildingChange = (value: string) => {
    setBuilding(value);
    // Reset dependent dropdowns
    setFloor('');
    setParkingSlotType('');
  };

  // Handle floor change
  const handleFloorChange = (value: string) => {
    setFloor(value);
    // Reset dependent dropdown
    setParkingSlotType('');
  };

  const handleSubmit = async () => {
    if (!building || !floor || !parkingSlotType) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Call the API to fetch parking slots
    setLoadingParkingSlots(true);
    try {
      const response = await fetchParkingSlotsWithStatus(building, floor, parkingSlotType);
      setParkingCategories(response.parking_categories);
      setShowParkingSlots(true); // Show parking slots on the page
      toast.success('Parking slots loaded successfully');
    } catch (error) {
      console.error('Error fetching parking slots:', error);
      toast.error('Failed to fetch parking slots');
    } finally {
      setLoadingParkingSlots(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center">
        <Button
          onClick={() => navigate('/vas/parking')}
          variant="ghost"
          className="mr-4 p-2 hover:bg-[#C72030]/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Parking Dashboard</h1>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
        {/* Section 1: Parking Slot Selection */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <MapPin size={16} color="#C72030" />
              </span>
              Select Parking Parameters
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormControl
                fullWidth
                variant="outlined"
                required
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Building</InputLabel>
                <MuiSelect
                  value={building}
                  onChange={(e) => handleBuildingChange(e.target.value)}
                  label="Building"
                  notched
                  displayEmpty
                  disabled={loadingBuildings}
                >
                  <MenuItem value="">
                    {loadingBuildings ? "Loading buildings..." : "Select Building"}
                  </MenuItem>
                  {buildings.map((buildingItem) => (
                    <MenuItem key={buildingItem.id} value={buildingItem.id.toString()}>
                      {buildingItem.name}
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
                <InputLabel shrink>Floor</InputLabel>
                <MuiSelect
                  value={floor}
                  onChange={(e) => handleFloorChange(e.target.value)}
                  label="Floor"
                  notched
                  displayEmpty
                  disabled={loadingFloors || !building}
                >
                  <MenuItem value="">
                    {loadingFloors ? "Loading floors..." :
                      !building ? "Select building first" :
                        "Select Floor"}
                  </MenuItem>
                  {floors.map((floorItem) => (
                    <MenuItem key={floorItem.id} value={floorItem.id.toString()}>
                      {floorItem.name}
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
                <InputLabel shrink>Parking Slot Type</InputLabel>
                <MuiSelect
                  value={parkingSlotType}
                  onChange={(e) => setParkingSlotType(e.target.value)}
                  label="Parking Slot Type"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">Select Parking Slot Type</MenuItem>
                  <MenuItem value="1">EV</MenuItem>
                  <MenuItem value="2">Visitor</MenuItem>
                  <MenuItem value="3">All</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div className="flex justify-end pt-4">
              <Button
                type="submit" // Changed to type="submit" to trigger form submission
                disabled={loadingParkingSlots || !building || !floor || !parkingSlotType}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2 disabled:opacity-50"
              >
                {loadingParkingSlots ? 'Loading Slots...' : 'Load Parking Slots'}
              </Button>
            </div>
          </div>
        </div>

        {/* Section 2: Parking Slots Information */}
        {showParkingSlots && parkingCategories.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                  <Car size={16} color="#C72030" />
                </span>
                Parking Slots Overview
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {parkingCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                    <h4 className="font-semibold text-lg text-gray-800">
                      {category.parking_category} Slots
                      <span className="text-sm font-normal text-gray-600 ml-2">
                        (Floor: {category.floor_name})
                      </span>
                    </h4>
                    <div className="flex gap-4 text-sm font-medium text-gray-700">
                      <span>Booked: <span className="text-gray-800">{category.booked_slots}</span></span>
                      <span>Vacant: <span className="text-green-600">{category.vacant_slots}</span></span>
                      <span>Reserved: <span className="text-orange-600">{category.reserved_slots}</span></span>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                    {category.parking_slots.map(slot => {
                      const isAvailable = slot.status === 'available';
                      const isBooked = slot.status === 'booked';
                      const entityColor = slot.booking_details?.entity_color;
                      const isTwoWheeler = category.parking_category === '2 Wheeler';

                      let slotClass = "flex flex-col items-center justify-center p-2 rounded-md border text-center";
                      const slotStyle: React.CSSProperties = { minHeight: '80px' };

                      if (isBooked && entityColor) {
                        slotClass += " text-white border-opacity-80";
                        slotStyle.backgroundColor = entityColor;
                        slotStyle.borderColor = entityColor;
                      } else if (isBooked) {
                        slotClass += " bg-red-600 text-white border-red-600";
                      } else if (slot.reserved) {
                        slotClass += " bg-orange-300 text-orange-900 border-orange-400";
                      } else if (!isAvailable) {
                        slotClass += " bg-gray-400 text-white border-gray-400";
                      } else {
                        slotClass += " bg-gray-100 text-gray-700 border-gray-300";
                      }

                      return (
                        <div
                          key={slot.id}
                          className={slotClass}
                          style={slotStyle}
                          title={isBooked && slot.booking_details ?
                            `Booked by: ${slot.booking_details.entity_name}` :
                            slot.reserved ? 'Reserved slot' :
                              slot.stacked ? 'Stacked parking' :
                                'Available slot'
                          }
                        >
                          {isTwoWheeler ? (
                            <Bike className="w-6 h-6 mb-1" />
                          ) : (
                            <Car className="w-6 h-6 mb-1" />
                          )}
                          <span className="text-xs font-medium truncate w-full">{slot.name}</span>
                          {slot.stacked && (
                            <span className="text-xs opacity-75">Stacked</span>
                          )}
                          {slot.reserved && (
                            <span className="text-xs opacity-75">Reserved</span>
                          )}
                          {isBooked && slot.booking_details && (
                            <span className="text-xs opacity-90 leading-tight block w-full">
                              {slot.booking_details.entity_name}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ParkingBookingsDashboard;