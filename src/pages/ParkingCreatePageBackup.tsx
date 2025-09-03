import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from 'sonner';
import { fetchBuildings, fetchFloors, fetchParkingSlots, Building, Floor, ParkingSlotLayout, ParkingSlot } from '@/services/parkingConfigurationsAPI';

export const ParkingCreatePage = () => {
  const navigate = useNavigate();
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [parkingSlot, setParkingSlot] = useState('');
  const [parkingType, setParkingType] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [clientName, setClientName] = useState('');
  const [leaser, setLeaser] = useState('');

  // Dynamic dropdown data
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [parkingLayout, setParkingLayout] = useState<ParkingSlotLayout | null>(null);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingParkingSlots, setLoadingParkingSlots] = useState(false);
  const [showParkingLayout, setShowParkingLayout] = useState(false);

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
    setParkingType('');
    setSelectedSlots([]);
    setShowParkingLayout(false);
    setParkingLayout(null);
  };

  // Handle floor change
  const handleFloorChange = (value: string) => {
    setFloor(value);
    // Reset dependent dropdowns
    setParkingSlot('');
    setParkingType('');
    setSelectedSlots([]);
    setShowParkingLayout(false);
    setParkingLayout(null);
  };

  // Handle parking type change
  const handleParkingTypeChange = (value: string) => {
    setParkingType(value);
    setSelectedSlots([]);
    if (building && floor && value) {
      fetchParkingSlotsData(building, floor, value);
    }
  };

  // Fetch parking slots when building, floor, and parking type are selected
  const fetchParkingSlotsData = async (buildingId: string, floorId: string, parkingType: string) => {
    setLoadingParkingSlots(true);
    try {
      const slotsData = await fetchParkingSlots(buildingId, floorId, parkingType);
      setParkingLayout(slotsData);
      setShowParkingLayout(true);
    } catch (error) {
      console.error('Error fetching parking slots:', error);
      toast.error('Failed to fetch parking slots');
    } finally {
      setLoadingParkingSlots(false);
    }
  };

  // Handle parking slot selection
  const handleSlotSelection = (slotId: string) => {
    setSelectedSlots(prev => {
      if (prev.includes(slotId)) {
        return prev.filter(id => id !== slotId);
      } else {
        return [...prev, slotId];
      }
    });
  };

  const handleSubmit = () => {
    if (!building || !floor || !parkingType || !clientName || !leaser) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedSlots.length === 0) {
      toast.error('Please select at least one parking slot');
      return;
    }

    // Prepare data with IDs for backend
    const formData = {
      building_id: parseInt(building), // Send as ID to backend
      floor_id: parseInt(floor), // Send as ID to backend
      parking_type: parkingType,
      selected_slots: selectedSlots,
      clientName,
      leaser
    };

    console.log('New parking created with IDs and selected slots:', formData);
    toast.success(`Parking booking created successfully with ${selectedSlots.length} slots selected`);
    navigate('/vas/parking');
  };

  const handleBack = () => {
    navigate('/vas/parking');
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button 
          onClick={handleBack}
          variant="ghost" 
          className="mr-4 p-2 hover:bg-[#C72030]/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <div className="text-sm text-gray-600">Parking</div>
          <h1 className="text-2xl font-bold text-[#C72030]">Parking Create</h1>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="max-w-6xl mx-auto bg-white shadow-sm">
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* First Row - Location Selection */}
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
                <Label htmlFor="parkingType" className="text-sm font-medium text-gray-900">
                  Parking Type
                </Label>
                <Select value={parkingType} onValueChange={handleParkingTypeChange} disabled={!building || !floor}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={
                      !building || !floor ? "Select building and floor first" : "Select Parking Type"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="two_wheeler">2 Wheeler</SelectItem>
                    <SelectItem value="four_wheeler">4 Wheeler</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-start">
                <Button 
                  onClick={handleSubmit} 
                  className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2"
                >
                  Submit
                </Button>
              </div>
            </div>

            {/* Parking Slot Visual Selection */}
            {showParkingLayout && parkingLayout && (
              <div className="space-y-6">
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Select Parking Slots - Floor: Ground Floor, Parking Type: {parkingType === 'two_wheeler' ? '2 Wheeler' : parkingType === 'four_wheeler' ? '4 Wheeler' : 'All'}
                    </h3>
                    <div className="text-sm text-gray-600">
                      Alloted: {parkingLayout.layout_info.alloted_slots}, 
                      Vacant: {parkingLayout.layout_info.vacant_slots}, 
                      Reserved: {parkingLayout.layout_info.reserved_slots}
                    </div>
                  </div>

                  {loadingParkingSlots ? (
                    <div className="flex justify-center py-8">
                      <div className="text-gray-500">Loading parking slots...</div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Two Wheeler Slots */}
                      {(parkingType === 'two_wheeler' || parkingType === 'all') && parkingLayout.two_wheeler_slots.length > 0 && (
                        <div>
                          <h4 className="text-md font-medium text-gray-800 mb-3">
                            Floor Name - Ground Floor, Parking Type - 2 Wheeler, 
                            Alloted - {parkingLayout.two_wheeler_slots.filter(slot => slot.status === 'occupied').length}, 
                            Vacant - {parkingLayout.two_wheeler_slots.filter(slot => slot.status === 'available').length}, 
                            Reserved - {parkingLayout.two_wheeler_slots.filter(slot => slot.status === 'reserved').length}
                          </h4>
                          <div className="grid grid-cols-12 gap-2">
                            {parkingLayout.two_wheeler_slots.map((slot) => (
                              <div
                                key={slot.id}
                                onClick={() => slot.status === 'available' ? handleSlotSelection(slot.id) : null}
                                className={`
                                  relative w-16 h-20 rounded-lg border-2 flex items-center justify-center text-xs font-medium cursor-pointer transition-all
                                  ${slot.status === 'available' 
                                    ? selectedSlots.includes(slot.id)
                                      ? 'bg-blue-500 border-blue-600 text-white shadow-lg'
                                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                                    : slot.status === 'occupied'
                                      ? 'bg-red-500 border-red-600 text-white cursor-not-allowed'
                                      : slot.status === 'reserved'
                                        ? 'bg-yellow-500 border-yellow-600 text-white cursor-not-allowed'
                                        : 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed'
                                  }
                                `}
                              >
                                <div className="flex flex-col items-center">
                                  <svg className="w-8 h-8 mb-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
                                  </svg>
                                  <span className="text-xs">{slot.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Four Wheeler Slots */}
                      {(parkingType === 'four_wheeler' || parkingType === 'all') && parkingLayout.four_wheeler_slots.length > 0 && (
                        <div>
                          <h4 className="text-md font-medium text-gray-800 mb-3">
                            Floor Name - Ground Floor, Parking Type - 4 Wheeler, 
                            Alloted - {parkingLayout.four_wheeler_slots.filter(slot => slot.status === 'occupied').length}, 
                            Vacant - {parkingLayout.four_wheeler_slots.filter(slot => slot.status === 'available').length}, 
                            Reserved - {parkingLayout.four_wheeler_slots.filter(slot => slot.status === 'reserved').length}
                          </h4>
                          <div className="grid grid-cols-6 gap-4">
                            {parkingLayout.four_wheeler_slots.map((slot) => (
                              <div
                                key={slot.id}
                                onClick={() => slot.status === 'available' ? handleSlotSelection(slot.id) : null}
                                className={`
                                  relative w-20 h-28 rounded-lg border-2 flex items-center justify-center text-sm font-medium cursor-pointer transition-all
                                  ${slot.status === 'available' 
                                    ? selectedSlots.includes(slot.id)
                                      ? 'bg-blue-500 border-blue-600 text-white shadow-lg'
                                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                                    : slot.status === 'occupied'
                                      ? 'bg-red-500 border-red-600 text-white cursor-not-allowed'
                                      : slot.status === 'reserved'
                                        ? 'bg-yellow-500 border-yellow-600 text-white cursor-not-allowed'
                                        : 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed'
                                  }
                                `}
                              >
                                <div className="flex flex-col items-center">
                                  <svg className="w-10 h-10 mb-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z" />
                                  </svg>
                                  <span className="text-sm">{slot.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Selected Slots Summary */}
                      {selectedSlots.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-blue-800 mb-2">
                            Selected Parking Slots ({selectedSlots.length}):
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedSlots.map(slotId => (
                              <span key={slotId} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {slotId}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

              <div className="flex justify-start">
                <Button 
                  onClick={handleSubmit} 
                  className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2"
                >
                  Submit
                </Button>
              </div>
            </div>

            </div>
              </div>
            )}

            {/* Second Row - Client Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="clientName" className="text-sm font-medium text-gray-900">
                  Client Name<span className="text-red-500">*</span>
                </Label>
                <Select value={clientName} onValueChange={setClientName}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Client Name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client1">HSBC</SelectItem>
                    <SelectItem value="client2">Localized</SelectItem>
                    <SelectItem value="client3">Demo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="leaser" className="text-sm font-medium text-gray-900">
                  Leases<span className="text-red-500">*</span>
                </Label>
                <Select value={leaser} onValueChange={setLeaser}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Customer Lease" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lease1">Lease Agreement 1</SelectItem>
                    <SelectItem value="lease2">Lease Agreement 2</SelectItem>
                    <SelectItem value="lease3">Lease Agreement 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Free Parking:</span>
                  <span className="text-gray-600">N/A</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Paid Parking:</span>
                  <span className="text-gray-600">N/A</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Available Slots:</span>
                  <span className="text-gray-600">N/A</span>
                </div>
              </div>
            </div>

            {/* Bottom Submit Button */}
            <div className="flex justify-center pt-6">
              <Button 
                onClick={handleSubmit}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-12 py-3"
              >
                Submit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParkingCreatePage;
