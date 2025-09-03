import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from 'sonner';
import { fetchBuildings, fetchFloors, Building, Floor } from '@/services/parkingConfigurationsAPI';

export const ParkingCreatePage = () => {
  const navigate = useNavigate();
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [parkingSlot, setParkingSlot] = useState('');
  const [clientName, setClientName] = useState('');
  const [leaser, setLeaser] = useState('');

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

  const handleSubmit = () => {
    if (!building || !floor || !parkingSlot || !clientName || !leaser) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Prepare data with IDs for backend
    const formData = {
      building_id: parseInt(building), // Send as ID to backend
      floor_id: parseInt(floor), // Send as ID to backend
      parkingSlot,
      clientName,
      leaser
    };

    console.log('Parking created with IDs:', formData);
    toast.success('Parking booking created successfully');
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
                <Label htmlFor="parkingSlot" className="text-sm font-medium text-gray-900">
                  Parking Slot
                </Label>
                <Select value={parkingSlot} onValueChange={setParkingSlot}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Parking Slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slot1">A-001</SelectItem>
                    <SelectItem value="slot2">A-002</SelectItem>
                    <SelectItem value="slot3">B-001</SelectItem>
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
