import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Keeping shadcn/ui Select for now
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bike, Car, MapPin, User, FileText } from "lucide-react";
import { toast } from 'sonner';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material'; // Importing Material-UI components
import {
  fetchBuildings, fetchFloors, fetchParkingSlotsWithStatus, fetchEntities,
  fetchCustomerLeases, fetchParkingDetails, updateParkingBookings,
  Building, Floor, ParkingCategory, Entity, CustomerLease, ParkingDetailsResponse
} from '@/services/parkingConfigurationsAPI';

// Field styles for Material-UI components - re-using from AddTicketDashboard
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

export const ParkingEditPage = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [parkingSlotType, setParkingSlotType] = useState(''); // Renamed to avoid confusion with actual slots
  const [clientName, setClientName] = useState('');
  const [leaser, setLeaser] = useState('');

  const [selectedTwoWheelerSlots, setSelectedTwoWheelerSlots] = useState<string[]>([]);
  const [selectedFourWheelerSlots, setSelectedFourWheelerSlots] = useState<string[]>([]);

  const [showParkingSlots, setShowParkingSlots] = useState(false);

  const [parkingCategories, setParkingCategories] = useState<ParkingCategory[]>([]);
  const [loadingParkingSlots, setLoadingParkingSlots] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [customerLeases, setCustomerLeases] = useState<CustomerLease[]>([]);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingEntities, setLoadingEntities] = useState(false);
  const [loadingLeases, setLoadingLeases] = useState(false);

  const [clientDetails, setClientDetails] = useState<ParkingDetailsResponse | null>(null);
  const [loadingClientDetails, setLoadingClientDetails] = useState(false);

  // Memoized client data for info panel, if needed more dynamically
  const clientData = useMemo(() => ({
    clientName: clientDetails?.entity?.name || clientName || "Select Client",
    availableSlots: 0 // This would be calculated from parkingCategories
  }), [clientName, clientDetails]);

  // Fetch client details if clientId is provided (edit mode)
  useEffect(() => {
    const fetchClientDetailsData = async () => {
      if (!clientId) return;

      setLoadingClientDetails(true);
      try {
        const clientDetailsData = await fetchParkingDetails(clientId);
        setClientDetails(clientDetailsData);
        setClientName(clientDetailsData.entity.name);

        setLoadingLeases(true);
        try {
          const leasesData = await fetchCustomerLeases(clientDetailsData.entity.id);
          setCustomerLeases(leasesData);

          if (clientDetailsData.leases && clientDetailsData.leases.length > 0) {
            const firstLeaseId = clientDetailsData.leases[0].id;
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
        setFloor('');
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

  const handleBuildingChange = (value: string) => {
    setBuilding(value);
    setFloor('');
    setParkingSlotType('');
  };

  const handleFloorChange = (value: string) => {
    setFloor(value);
    setParkingSlotType('');
  };

  const handleClientNameChange = async (value: string) => {
    setClientName(value);
    setLeaser('');
    setCustomerLeases([]);

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

  const getCurrentClientData = () => {
    const selectedEntity = entities.find(entity => entity.name === clientName);
    if (!selectedEntity) return null;

    const selectedLease = customerLeases.find(lease => lease.id.toString() === leaser);
    return {
      entity: selectedEntity,
      lease: selectedLease
    };
  };

  const handleLoadParkingSlots = async () => {
    if (!building || !floor || !parkingSlotType || !clientName || !leaser) {
      toast.error('Please fill in all required fields to load parking slots');
      return;
    }

    setLoadingParkingSlots(true);
    try {
      const response = await fetchParkingSlotsWithStatus(building, floor, parkingSlotType);
      setParkingCategories(response.parking_categories);
      setShowParkingSlots(true);
      toast.success('Parking slots loaded successfully');
    } catch (error) {
      console.error('Error fetching parking slots:', error);
      toast.error('Failed to fetch parking slots');
    } finally {
      setLoadingParkingSlots(false);
    }
  };

  const handleSubmit = async () => {
    const totalSelectedSlots = selectedTwoWheelerSlots.length + selectedFourWheelerSlots.length;
    if (totalSelectedSlots === 0) {
      toast.error('Please select parking slots first');
      return;
    }

    if (!building || !floor || !parkingSlotType || !clientName || !leaser) {
      toast.error('Please fill in all required fields before submitting');
      return;
    }

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

    const selectedParkingSlots = [
      ...selectedTwoWheelerSlots.map(id => parseInt(id)),
      ...selectedFourWheelerSlots.map(id => parseInt(id))
    ];

    setLoadingSubmit(true);
    try {
      const apiPayload = {
        lease_id: selectedLease.id,
        building_id: parseInt(building),
        floor_id: parseInt(floor),
        entity_id: selectedEntity.id,
        selected_parking_slots: selectedParkingSlots
      };

      const response = await updateParkingBookings(apiPayload);

      if (response.status === 'success') {
        toast.success(response.message || 'Parking booking updated successfully');
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="mr-4 p-2 hover:bg-[#C72030]/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {clientId ? 'Edit Parking Details' : 'Create Parking Booking'}
          </h1>
          {loadingClientDetails && (
            <p className="text-sm text-gray-600 mt-1">Loading client information...</p>
          )}
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
        {/* Section 1: Location Details */}
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
                type="button"
                onClick={handleLoadParkingSlots}
                disabled={loadingParkingSlots || !building || !floor || !parkingSlotType}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2 disabled:opacity-50"
              >
                {loadingParkingSlots ? 'Loading Slots...' : 'Load Parking Slots'}
              </Button>
            </div>
          </div>
        </div>

        {/* Section 2: Client & Lease Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <User size={16} color="#C72030" />
              </span>
              Client & Lease Details
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormControl
                fullWidth
                variant="outlined"
                required
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Client Name</InputLabel>
                <MuiSelect
                  value={clientName}
                  onChange={(e) => handleClientNameChange(e.target.value)}
                  label="Client Name"
                  notched
                  displayEmpty
                  disabled={loadingEntities}
                >
                  <MenuItem value="">
                    {loadingEntities ? "Loading clients..." : "Select Client Name"}
                  </MenuItem>
                  {entities.map((entity) => (
                    <MenuItem key={entity.id} value={entity.name}>
                      {entity.name}
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
                <InputLabel shrink>Lease</InputLabel>
                <MuiSelect
                  value={leaser}
                  onChange={(e) => setLeaser(e.target.value)}
                  label="Lease"
                  notched
                  displayEmpty
                  disabled={!clientName || loadingLeases}
                >
                  <MenuItem value="">
                    {loadingLeases ? "Loading leases..." :
                      !clientName ? "Select client first" :
                        "Select Customer Lease"}
                  </MenuItem>
                  {customerLeases.map((lease) => (
                    <MenuItem key={lease.id} value={lease.id.toString()}>
                      Lease {lease.id} ({lease.lease_start_date} to {lease.lease_end_date})
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>

            {/* Lease Info Summary */}
            <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800">Lease Overview:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
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
          </div>
        </div>

        {/* Section 3: Parking Slot Selection */}
        {showParkingSlots && parkingCategories.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                  <Car size={16} color="#C72030" />
                </span>
                Select Parking Slots
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
                      const slotId = slot.id.toString();
                      const isTwoWheeler = category.parking_category === '2 Wheeler';
                      const isSelected = isTwoWheeler
                        ? selectedTwoWheelerSlots.includes(slotId)
                        : selectedFourWheelerSlots.includes(slotId);
                      const isAvailable = slot.status === 'available';
                      const isBooked = slot.status === 'booked';
                      const entityColor = slot.booking_details?.entity_color;

                      let slotClass = "flex flex-col items-center justify-center p-2 rounded-md border cursor-pointer transition-colors text-center";
                      const slotStyle: React.CSSProperties = { minHeight: '80px' }; // Ensure consistent height

                      if (isBooked && entityColor) {
                        slotClass += " text-white border-opacity-80 cursor-not-allowed";
                        slotStyle.backgroundColor = entityColor;
                        slotStyle.borderColor = entityColor;
                      } else if (isBooked) {
                        slotClass += " bg-red-600 text-white border-red-600 cursor-not-allowed";
                      } else if (slot.reserved) {
                        slotClass += " bg-orange-300 text-orange-900 border-orange-400 cursor-not-allowed";
                      } else if (!isAvailable) {
                        slotClass += " bg-gray-400 text-white border-gray-400 cursor-not-allowed";
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

              {/* Selected slots summary */}
              {(selectedTwoWheelerSlots.length > 0 || selectedFourWheelerSlots.length > 0) && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 text-blue-900">
                  <h5 className="font-medium mb-2">
                    Selected Slots: {selectedTwoWheelerSlots.length + selectedFourWheelerSlots.length} total
                  </h5>
                  <div className="flex gap-4 text-sm">
                    {selectedTwoWheelerSlots.length > 0 && (
                      <span>Two Wheeler: <span className="font-semibold">{selectedTwoWheelerSlots.length}</span></span>
                    )}
                    {selectedFourWheelerSlots.length > 0 && (
                      <span>Four Wheeler: <span className="font-semibold">{selectedFourWheelerSlots.length}</span></span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loadingSubmit || (!showParkingSlots && (!building || !floor || !parkingSlotType || !clientName || !leaser))} // Disable if not ready to load or no slots shown
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-12 py-3"
          >
            {loadingSubmit ? 'Submitting...' : 'Submit Parking'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ParkingEditPage;