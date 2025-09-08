import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bike, Car } from "lucide-react";
import { toast } from 'sonner';
import { fetchBuildings, fetchFloors, fetchParkingSlotsWithStatus, fetchEntities, fetchCustomerLeases, fetchParkingDetails, updateParkingBookings, Building, Floor, ParkingCategory, Entity, CustomerLease, ParkingDetailsResponse } from '@/services/parkingConfigurationsAPI';

export const ParkingEditPage = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [parkingSlot, setParkingSlot] = useState('');
  const [clientName, setClientName] = useState('');
  const [leaser, setLeaser] = useState('');

  // New state for selected parking slots
  const [selectedTwoWheelerSlots, setSelectedTwoWheelerSlots] = useState<string[]>([]);
  const [selectedFourWheelerSlots, setSelectedFourWheelerSlots] = useState<string[]>([]);
  
  // State to show parking slots section
  const [showParkingSlots, setShowParkingSlots] = useState(false);

  // API data state
  const [parkingCategories, setParkingCategories] = useState<ParkingCategory[]>([]);
  const [loadingParkingSlots, setLoadingParkingSlots] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Dynamic dropdown data
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [customerLeases, setCustomerLeases] = useState<CustomerLease[]>([]);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingEntities, setLoadingEntities] = useState(false);
  const [loadingLeases, setLoadingLeases] = useState(false);

  // Dynamic client data based on current selection or API data
  const [clientDetails, setClientDetails] = useState<ParkingDetailsResponse | null>(null);
  const [loadingClientDetails, setLoadingClientDetails] = useState(false);
  
  const clientData = useMemo(() => ({
    clientName: clientDetails?.entity.name || clientName || "Select Client", 
    availableSlots: 0 // This will be calculated from API data
  }), [clientName, clientDetails]);

  // Fetch client details if clientId is provided (edit mode)
  useEffect(() => {
    const fetchClientDetailsData = async () => {
      if (!clientId) return;
      
      setLoadingClientDetails(true);
      try {
        const clientDetailsData = await fetchParkingDetails(clientId);
        setClientDetails(clientDetailsData);
        // Pre-populate client name if editing existing client
        setClientName(clientDetailsData.entity.name);
        
        // Also fetch and populate the leases for this client
        setLoadingLeases(true);
        try {
          const leasesData = await fetchCustomerLeases(clientDetailsData.entity.id);
          setCustomerLeases(leasesData);
          
          // Pre-select the lease if there's lease data in the parking details
          if (clientDetailsData.leases && clientDetailsData.leases.length > 0) {
            // Assuming we want to select the first lease from the parking details
            // or you could match by ID if you have the specific lease ID to select
            const firstLeaseId = clientDetailsData.leases[0].id;
            
            // Find matching lease in the customer leases and pre-select it
            const matchingLease = leasesData.find(lease => lease.id === firstLeaseId);
            if (matchingLease) {
              setLeaser(matchingLease.id.toString());
            }
          }
        } catch (error) {
          console.error('Error fetching customer leases for client details:', error);
          toast.error('Failed to fetch customer leases');
        } finally {
          setLoadingLeases(false);
        }
      } catch (error) {
        console.error('Error fetching client details:', error);
        toast.error('Failed to fetch client details');
      } finally {
        setLoadingClientDetails(false);
      }
    };

    fetchClientDetailsData();
  }, [clientId]);

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

  // Fetch entities on component mount
  useEffect(() => {
    const fetchEntitiesData = async () => {
      setLoadingEntities(true);
      try {
        const entitiesData = await fetchEntities();
        setEntities(entitiesData);
      } catch (error) {
        console.error('Error fetching entities:', error);
        toast.error('Failed to fetch client entities');
      } finally {
        setLoadingEntities(false);
      }
    };

    fetchEntitiesData();
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
    // Reset dependent dropdown
    setFloor('');
    setParkingSlot('');
  };

  // Handle floor change
  const handleFloorChange = (value: string) => {
    setFloor(value);
    // Reset dependent dropdown
    setParkingSlot('');
  };

  // Handle client name change
  const handleClientNameChange = async (value: string) => {
    setClientName(value);
    // Reset leaser when client changes
    setLeaser('');
    setCustomerLeases([]);

    // Find the selected entity and fetch its leases
    const selectedEntity = entities.find(entity => entity.name === value);
    if (selectedEntity) {
      setLoadingLeases(true);
      try {
        const leasesData = await fetchCustomerLeases(selectedEntity.id);
        setCustomerLeases(leasesData);
      } catch (error) {
        console.error('Error fetching customer leases:', error);
        toast.error('Failed to fetch customer leases');
      } finally {
        setLoadingLeases(false);
      }
    }
  };

  // Get current client and lease data for info panel
  const getCurrentClientData = () => {
    const selectedEntity = entities.find(entity => entity.name === clientName);
    if (!selectedEntity) return null;

    const selectedLease = customerLeases.find(lease => lease.id.toString() === leaser);
    return {
      entity: selectedEntity,
      lease: selectedLease
    };
  };

  // This is the handler for the "Load Parking Slots" button
  const handleLoadParkingSlots = async () => {
    if (!building || !floor || !parkingSlot || !clientName || !leaser) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Call the API to fetch parking slots
    setLoadingParkingSlots(true);
    try {
      const response = await fetchParkingSlotsWithStatus(building, floor, parkingSlot);
      setParkingCategories(response.parking_categories);
      setShowParkingSlots(true); // Show parking slots section on the page
      toast.success('Parking slots loaded successfully');
    } catch (error) {
      console.error('Error fetching parking slots:', error);
      toast.error('Failed to fetch parking slots');
    } finally {
      setLoadingParkingSlots(false);
    }
  };

  // This is the handler for the final "Submit Parking" button
  const handleSubmit = async () => {
    // Validate that slots have been selected
    const totalSelectedSlots = selectedTwoWheelerSlots.length + selectedFourWheelerSlots.length;
    if (totalSelectedSlots === 0) {
      toast.error('Please select parking slots first');
      return;
    }

    // Validate that all required fields are filled
    if (!building || !floor || !parkingSlot || !clientName || !leaser) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Get the selected entity and lease information
    const selectedEntity = entities.find(entity => entity.name === clientName);
    if (!selectedEntity) {
      toast.error('Selected client entity not found');
      return;
    }

    const selectedLease = customerLeases.find(lease => lease.id.toString() === leaser);
    if (!selectedLease) {
      toast.error('Selected lease not found');
      return;
    }

    // Combine all selected parking slots (both 2-wheeler and 4-wheeler)
    const selectedParkingSlots = [
      ...selectedTwoWheelerSlots.map(id => parseInt(id)),
      ...selectedFourWheelerSlots.map(id => parseInt(id))
    ];

    console.log("Selected 2-wheeler slots:", selectedTwoWheelerSlots);
    console.log("Selected 4-wheeler slots:", selectedFourWheelerSlots);
    console.log("Combined selected slots:", selectedParkingSlots);

    setLoadingSubmit(true);
    try {
      // Prepare data payload for API
      const apiPayload = {
        lease_id: selectedLease.id,
        building_id: parseInt(building),
        floor_id: parseInt(floor),
        entity_id: selectedEntity.id,
        selected_parking_slots: selectedParkingSlots
      };

      console.log('API Payload:', apiPayload);
      
      // Call the update parking bookings API
      const response = await updateParkingBookings(apiPayload);
      
      console.log('API Response:', response);
      
      if (response.status === 'success') {
        toast.success(response.message || 'Parking booking updated successfully');
        
        // Navigate back to parking details or main parking page
        if (clientId) {
          navigate(`/vas/parking/details/${clientId}`);
        } else {
          navigate('/vas/parking');
        }
      } else {
        toast.error('Failed to update parking booking');
      }
    } catch (error) {
      console.error('Error updating parking booking:', error);
      toast.error('Failed to update parking booking. Please try again.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleBack = () => {
    navigate('/vas/parking');
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
          <h1 className="text-2xl font-bold text-[#C72030]">
            {clientId ? 'Edit Parking Details' : 'Create Parking Booking'}
          </h1>
          {loadingClientDetails && (
            <p className="text-sm text-gray-600 mt-1">Loading client information...</p>
          )}
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="max-w-6xl mx-auto bg-white shadow-sm">
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Form Header */}
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {clientId ? `Edit Parking for: ${clientData.clientName}` : 'Create New Parking Booking'}
              </h2>
            </div>

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
                  onClick={handleLoadParkingSlots}
                  disabled={loadingParkingSlots}
                  className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2 disabled:opacity-50"
                >
                  {loadingParkingSlots ? 'Loading...' : 'Load Parking Slots'}
                </Button>
              </div>
            </div>

            {/* Second Row - Client Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="clientName" className="text-sm font-medium text-gray-900">
                  Client Name<span className="text-red-500">*</span>
                </Label>
                <Select value={clientName} onValueChange={handleClientNameChange} disabled={loadingEntities}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={
                      loadingEntities ? "Loading clients..." : 
                      "Select Client Name"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {entities.map((entity) => (
                      <SelectItem key={entity.id} value={entity.name}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="leaser" className="text-sm font-medium text-gray-900">
                  Leases<span className="text-red-500">*</span>
                </Label>
                <Select value={leaser} onValueChange={setLeaser} disabled={!clientName || loadingLeases}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={
                      loadingLeases ? "Loading leases..." :
                      !clientName ? "Select client first" : 
                      "Select Customer Lease"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {customerLeases.map((lease) => (
                      <SelectItem key={lease.id} value={lease.id.toString()}>
                        Lease {lease.id} ({lease.lease_start_date} to {lease.lease_end_date})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Free Parking:</span>
                  <span className="text-gray-600">
                    {getCurrentClientData()?.lease?.free_parking || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Paid Parking:</span>
                  <span className="text-gray-600">
                    {getCurrentClientData()?.lease?.paid_parking || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Available Slots:</span>
                  <span className="text-gray-600">
                    {parkingCategories.reduce((total, category) => total + category.vacant_slots, 0) || 'N/A'}
                  </span>
                </div>
                {getCurrentClientData()?.lease && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Lease Period:</span>
                    <span className="text-gray-600">
                      {getCurrentClientData()?.lease?.lease_start_date} to {getCurrentClientData()?.lease?.lease_end_date}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Parking Slots Selection Section - Display inline instead of modal */}
            {showParkingSlots && parkingCategories.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Parking Slots</h3>
                
                {/* Render parking categories from API */}
                {parkingCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-lg text-gray-800">
                        Floor: {category.floor_name}, Type: {category.parking_category}, Allotted: {category.booked_slots}, Vacant: {category.vacant_slots}, Reserved: {category.reserved_slots}
                      </h4>
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
                        
                        let slotClass = "flex flex-col items-center justify-center p-2 rounded-md border cursor-pointer transition-colors";
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
                
                {/* Selected slots summary */}
                {(selectedTwoWheelerSlots.length > 0 || selectedFourWheelerSlots.length > 0) && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">
                      Selected Slots Summary: {selectedTwoWheelerSlots.length + selectedFourWheelerSlots.length} total
                    </h5>
                    <div className="flex gap-4 text-sm text-blue-800">
                      {selectedTwoWheelerSlots.length > 0 && (
                        <span>Two Wheeler: {selectedTwoWheelerSlots.length}</span>
                      )}
                      {selectedFourWheelerSlots.length > 0 && (
                        <span>Four Wheeler: {selectedFourWheelerSlots.length}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Action Buttons */}
            <div className="flex justify-center gap-4 pt-6">
              <Button 
                onClick={handleBack}
                variant="outline"
                className="px-8 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              {/* This button will trigger the final submission */}
              <Button 
                onClick={handleSubmit} 
                disabled={loadingSubmit}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-12 py-3"
              >
                {loadingSubmit ? 'Submitting...' : 'Submit Parking'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParkingEditPage;