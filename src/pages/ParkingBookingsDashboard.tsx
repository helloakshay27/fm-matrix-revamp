
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bike, Car } from "lucide-react";
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { fetchBuildings, fetchFloors, fetchParkingSlotsWithStatus, Building, Floor, ParkingCategory, ParkingBookingDetails } from '@/services/parkingConfigurationsAPI';

const ParkingBookingsDashboard = () => {
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [parkingSlot, setParkingSlot] = useState('');
  const navigate = useNavigate();

  // New state for modal visibility
  const [showParkingSelector, setShowParkingSelector] = useState(false);
  // New state for selected parking slots in the modal
  const [selectedTwoWheelerSlots, setSelectedTwoWheelerSlots] = useState<string[]>([]);
  const [selectedFourWheelerSlots, setSelectedFourWheelerSlots] = useState<string[]>([]);

  // API data state
  const [parkingCategories, setParkingCategories] = useState<ParkingCategory[]>([]);
  const [loadingParkingSlots, setLoadingParkingSlots] = useState(false);

  // Dynamic dropdown data
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
    setParkingSlot('');
  };

  // Handle floor change
  const handleFloorChange = (value: string) => {
    setFloor(value);
    // Reset dependent dropdown
    setParkingSlot('');
  };

  const handleSubmit = async () => {
    if (!building || !floor || !parkingSlot) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Call the API to fetch parking slots
    setLoadingParkingSlots(true);
    try {
      const response = await fetchParkingSlotsWithStatus(building, floor, parkingSlot);
      setParkingCategories(response.parking_categories);
      setShowParkingSelector(true); // Open the parking slot selector modal
      toast.success('Parking slots loaded successfully');
    } catch (error) {
      console.error('Error fetching parking slots:', error);
      toast.error('Failed to fetch parking slots');
    } finally {
      setLoadingParkingSlots(false);
    }
  };

  // Handle slot selection
  const handleSlotClick = (slotId: string, type: '2 Wheeler' | '4 Wheeler', currentStatus: string) => {
    if (currentStatus !== 'available') {
      toast.info('This slot is not available for selection.');
      return;
    }

    if (type === '2 Wheeler') {
      setSelectedTwoWheelerSlots(prev =>
        prev.includes(slotId) ? prev.filter(id => id !== slotId) : [...prev, slotId]
      );
    } else {
      setSelectedFourWheelerSlots(prev =>
        prev.includes(slotId) ? prev.filter(id => id !== slotId) : [...prev, slotId]
      );
    }
  };

  // Handle confirm selection
  const handleConfirmSelection = () => {
    const totalSelectedSlots = selectedTwoWheelerSlots.length + selectedFourWheelerSlots.length;
    if (totalSelectedSlots === 0) {
      toast.error('Please select at least one parking slot');
      return;
    }

    console.log('Selected 2-wheeler slots:', selectedTwoWheelerSlots);
    console.log('Selected 4-wheeler slots:', selectedFourWheelerSlots);
    
    setShowParkingSelector(false); // Close the modal
    toast.success(`${totalSelectedSlots} parking slot(s) selected successfully`);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-white">
      <div className="flex items-center mb-6">
        <Button onClick={() => navigate('/vas/parking')} variant="ghost" className="mr-4 p-2 hover:bg-[#C72030]/10">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-[#C72030]">Parking</h1>
      </div>

      <Card className="mx-auto">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-[#C72030] mb-6">Parking Create</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div>
              <Label htmlFor="building" className="text-sm font-medium text-gray-900">
                Building
              </Label>
              <Select value={building} onValueChange={handleBuildingChange} disabled={loadingBuildings}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={loadingBuildings ? "Loading buildings..." : "Select Building"} />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((buildingItem) => (
                    <SelectItem key={buildingItem.id} value={buildingItem.id.toString()}>
                      {buildingItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="floor" className="text-sm font-medium text-gray-900">
                Floor
              </Label>
              <Select value={floor} onValueChange={handleFloorChange} disabled={loadingFloors || !building}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={
                    loadingFloors ? "Loading floors..." : 
                    !building ? "Select building first" : 
                    "Select Floor"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {floors.map((floorItem) => (
                    <SelectItem key={floorItem.id} value={floorItem.id.toString()}>
                      {floorItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="parkingSlot" className="text-sm font-medium text-gray-900">
                Parking Slot
              </Label>
              <Select value={parkingSlot} onValueChange={setParkingSlot}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Parking Slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">EV</SelectItem>
                  <SelectItem value="2">Visitor</SelectItem>
                  <SelectItem value="3">All</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-start">
              <Button 
                onClick={handleSubmit} 
                disabled={loadingParkingSlots}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2 rounded-none border-none shadow-none"
              >
                {loadingParkingSlots ? 'Loading...' : 'Submit'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Parking Slots Display */}
      {(selectedTwoWheelerSlots.length > 0 || selectedFourWheelerSlots.length > 0) && (
        <Card className="mx-auto">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-[#C72030] mb-4">Selected Parking Slots</h3>
            
            <div className="space-y-4">
              {selectedTwoWheelerSlots.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <Bike className="w-4 h-4" />
                    Two Wheeler Slots ({selectedTwoWheelerSlots.length})
                  </h4>
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
                    {selectedTwoWheelerSlots.map(slotId => {
                      const slot = parkingCategories
                        .find(cat => cat.parking_category === '2 Wheeler')
                        ?.parking_slots.find(s => s.id.toString() === slotId);
                      return (
                        <div key={slotId} className="flex flex-col items-center justify-center p-2 rounded-md border bg-green-100 border-green-300">
                          <Bike className="w-6 h-6 mb-1 text-green-600" />
                          <span className="text-xs font-medium text-green-800">{slot?.name || slotId}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedFourWheelerSlots.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Four Wheeler Slots ({selectedFourWheelerSlots.length})
                  </h4>
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
                    {selectedFourWheelerSlots.map(slotId => {
                      const slot = parkingCategories
                        .find(cat => cat.parking_category === '4 Wheeler')
                        ?.parking_slots.find(s => s.id.toString() === slotId);
                      return (
                        <div key={slotId} className="flex flex-col items-center justify-center p-2 rounded-md border bg-green-100 border-green-300">
                          <Car className="w-6 h-6 mb-1 text-green-600" />
                          <span className="text-xs font-medium text-green-800">{slot?.name || slotId}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parking Slot Selector Modal */}
      <Dialog open={showParkingSelector} onOpenChange={setShowParkingSelector}>
        <DialogContent className="max-w-4xl p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold text-[#C72030]">Select Parking Slots</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-6">
            {/* Render parking categories from API */}
            {parkingCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-gray-800">
                    Floor Name - {category.floor_name}, Parking Type - {category.parking_category}, Allotted - {category.booked_slots}, Vacant - {category.vacant_slots}, Reserved - {category.reserved_slots}
                  </h3>
                  <span className="text-sm font-medium text-gray-600">
                    Available Slots: {category.vacant_slots}
                  </span>
                </div>
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-3">
                  {category.parking_slots.map(slot => {
                    const slotId = slot.id.toString();
                    const isSelected = category.parking_category === '2 Wheeler' 
                      ? selectedTwoWheelerSlots.includes(slotId)
                      : selectedFourWheelerSlots.includes(slotId);
                    const isAvailable = slot.status === 'available';
                    const isBooked = slot.status === 'booked';
                    const entityColor = slot.booking_details?.entity_color;
                    
                    let slotClass = "flex flex-col items-center justify-center p-2 rounded-md border cursor-pointer";
                    const slotStyle: React.CSSProperties = {};
                    
                    if (isBooked && entityColor) {
                      // Use entity color for booked slots
                      slotClass += " text-white border-opacity-80 cursor-not-allowed";
                      slotStyle.backgroundColor = entityColor;
                      slotStyle.borderColor = entityColor;
                    } else if (!isAvailable) {
                      // Fallback red color for unavailable slots without entity color
                      slotClass += " bg-red-600 text-white border-red-600 cursor-not-allowed";
                    } else if (isSelected) {
                      slotClass += " bg-green-500 text-white border-green-500";
                    } else {
                      slotClass += " bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200";
                    }
                    
                    return (
                      <div 
                        key={slot.id} 
                        className={slotClass}
                        style={slotStyle}
                        onClick={() => handleSlotClick(slotId, category.parking_category as '2 Wheeler' | '4 Wheeler', slot.status)}
                        title={isBooked && slot.booking_details ? 
                          `Booked by: ${slot.booking_details.entity_name}` : 
                          slot.reserved ? 'Reserved slot' : 
                          slot.stacked ? 'Stacked parking' : 
                          'Available slot'
                        }
                      >
                        {category.parking_category === '2 Wheeler' ? (
                          <Bike className="w-8 h-8 mb-1" />
                        ) : (
                          <Car className="w-8 h-8 mb-1" />
                        )}
                        <span className="text-xs font-medium">{slot.name}</span>
                        {slot.stacked && (
                          <span className="text-xs opacity-75">Stacked</span>
                        )}
                        {slot.reserved && (
                          <span className="text-xs opacity-75">Reserved</span>
                        )}
                        {isBooked && slot.booking_details && (
                          <span className="text-xs opacity-90 text-center leading-tight">
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
          <DialogFooter className="p-6 pt-0">
            <Button variant="outline" onClick={() => setShowParkingSelector(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmSelection} 
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
            >
              Confirm Slots
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParkingBookingsDashboard;
