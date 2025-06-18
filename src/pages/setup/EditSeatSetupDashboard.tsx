import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from 'react-router-dom';
import { CirclePlus, CircleMinus } from 'lucide-react';

interface SeatTypeConfig {
  name: string;
  totalSeats: string;
  reservedSeats: string;
}

interface Department {
  name: string;
  seats: number;
}

interface SeatTypeAssignment {
  name: string;
  assigned: number;
  total: number;
  selectedSeats: string[];
}

interface SeatSetupData {
  id: number;
  location: string;
  floor: string;
  seatTypes: {
    [key: string]: {
      total: number;
      reserved: number;
    };
  };
}

export const EditSeatSetupDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedFloor, setSelectedFloor] = useState<string>("");
  const [activeTab, setActiveTab] = useState("seat-configuration");
  
  const [seatTypes, setSeatTypes] = useState<SeatTypeConfig[]>([
    { name: "Angular Ws", totalSeats: "", reservedSeats: "" },
    { name: "Flexi Desk", totalSeats: "", reservedSeats: "" },
    { name: "Cabin", totalSeats: "", reservedSeats: "" },
    { name: "Fixed Desk", totalSeats: "", reservedSeats: "" },
    { name: "IOS", totalSeats: "", reservedSeats: "" },
    { name: "cabin", totalSeats: "", reservedSeats: "" },
    { name: "circular", totalSeats: "", reservedSeats: "" },
    { name: "Rectangle", totalSeats: "", reservedSeats: "" },
    { name: "circularchair", totalSeats: "", reservedSeats: "" },
    { name: "Hot Desk", totalSeats: "", reservedSeats: "" },
    { name: "Fixed Angular Chair", totalSeats: "", reservedSeats: "" },
    { name: "Cubical", totalSeats: "", reservedSeats: "" },
    { name: "Cafe", totalSeats: "", reservedSeats: "" },
    { name: "Hotseat", totalSeats: "", reservedSeats: "" }
  ]);

  // Department data
  const [departments, setDepartments] = useState<Department[]>([
    { name: "Sales", seats: 0 },
    { name: "HR", seats: 0 },
    { name: "Operations", seats: 0 },
    { name: "IR", seats: 0 },
    { name: "Tech", seats: 0 },
    { name: "Accounts", seats: 0 },
    { name: "RM", seats: 0 },
    { name: "BMS", seats: 0 },
    { name: "Electrical", seats: 0 },
    { name: "IBMS", seats: 0 },
    { name: "Housekeeping", seats: 0 },
    { name: "kitchen", seats: 0 },
    { name: "Finance", seats: 0 },
    { name: "Marketing", seats: 0 },
    { name: "IOS", seats: 0 },
    { name: "staff", seats: 0 },
    { name: "Cook", seats: 0 },
    { name: "ACCOUNTS", seats: 0 },
    { name: "Technician", seats: 0 },
    { name: "Store Manager", seats: 0 },
    { name: "Carpenting", seats: 0 },
    { name: "Plumbing", seats: 0 },
    { name: "Admin", seats: 0 },
    { name: "CLUB HOUSE", seats: 0 },
    { name: "Security A", seats: 0 },
    { name: "Technical A", seats: 0 },
    { name: "Housekeeping A", seats: 0 },
    { name: "Staff", seats: 0 },
    { name: "BB Admin", seats: 0 },
    { name: "BB FM", seats: 0 },
    { name: "BB FM Accounts", seats: 0 },
    { name: "BB Electrical", seats: 0 },
    { name: "BB HVAC", seats: 0 },
    { name: "Operation", seats: 0 },
    { name: "BB FM", seats: 0 },
    { name: "UI/UX", seats: 0 },
    { name: "Soft Service", seats: 0 },
    { name: "admin", seats: 0 },
    { name: "Function 1", seats: 0 },
    { name: "Function 2", seats: 0 },
    { name: "Function 3", seats: 0 },
    { name: "Function 4", seats: 0 },
    { name: "Frontend", seats: 0 },
    { name: "Backend", seats: 0 },
    { name: "DevOps", seats: 0 },
    { name: "Support", seats: 0 }
  ]);

  // Seat type assignments with visual layout support
  const [seatTypeAssignments, setSeatTypeAssignments] = useState<SeatTypeAssignment[]>([
    { name: "Angular Ws", assigned: 0, total: 4, selectedSeats: [] },
    { name: "Flexi Desk", assigned: 0, total: 4, selectedSeats: [] },
    { name: "Cabin", assigned: 0, total: 4, selectedSeats: ["S1", "S2", "S3", "S4"] },
    { name: "Fixed Desk", assigned: 0, total: 0, selectedSeats: [] },
    { name: "IOS", assigned: 0, total: 0, selectedSeats: [] },
    { name: "cabin", assigned: 0, total: 0, selectedSeats: [] },
    { name: "circular", assigned: 0, total: 0, selectedSeats: [] },
    { name: "Rectangle", assigned: 0, total: 2, selectedSeats: [] },
    { name: "circularchair", assigned: 0, total: 0, selectedSeats: [] },
    { name: "Hot Desk", assigned: 0, total: 0, selectedSeats: [] },
    { name: "Fixed Angular Chair", assigned: 0, total: 0, selectedSeats: [] },
    { name: "Cubical", assigned: 0, total: 0, selectedSeats: [] },
    { name: "Cafe", assigned: 0, total: 0, selectedSeats: [] },
    { name: "Hotseat", assigned: 0, total: 0, selectedSeats: [] }
  ]);

  // Mock data for existing seat setups
  const existingSeatSetups: SeatSetupData[] = [
    {
      id: 1,
      location: "BBT A",
      floor: "TA Floor 1",
      seatTypes: {
        "Angular Ws": { total: 0, reserved: 0 },
        "Flexi Desk": { total: 4, reserved: 0 },
        "Cabin": { total: 0, reserved: 0 },
        "Fixed Desk": { total: 0, reserved: 0 },
        "IOS": { total: 0, reserved: 0 },
        "cabin": { total: 0, reserved: 0 },
        "circular": { total: 0, reserved: 0 },
        "Rectangle": { total: 2, reserved: 0 }
      }
    },
    {
      id: 2,
      location: "test",
      floor: "Ground Floor",
      seatTypes: {
        "Angular Ws": { total: 0, reserved: 0 },
        "Flexi Desk": { total: 4, reserved: 0 },
        "Cabin": { total: 0, reserved: 0 },
        "Fixed Desk": { total: 0, reserved: 0 },
        "IOS": { total: 0, reserved: 0 },
        "cabin": { total: 0, reserved: 0 },
        "circular": { total: 0, reserved: 0 },
        "Rectangle": { total: 0, reserved: 0 }
      }
    },
    {
      id: 3,
      location: "Jyoti Tower",
      floor: "Ground Floor",
      seatTypes: {
        "Angular Ws": { total: 5, reserved: 0 },
        "Flexi Desk": { total: 4, reserved: 0 },
        "Cabin": { total: 0, reserved: 0 },
        "Fixed Desk": { total: 5, reserved: 0 },
        "IOS": { total: 0, reserved: 0 },
        "cabin": { total: 0, reserved: 0 },
        "circular": { total: 0, reserved: 0 },
        "Rectangle": { total: 0, reserved: 0 }
      }
    },
    {
      id: 4,
      location: "Gophygital",
      floor: "2",
      seatTypes: {
        "Angular Ws": { total: 0, reserved: 0 },
        "Flexi Desk": { total: 4, reserved: 0 },
        "Cabin": { total: 0, reserved: 0 },
        "Fixed Desk": { total: 0, reserved: 0 },
        "IOS": { total: 0, reserved: 0 },
        "cabin": { total: 0, reserved: 0 },
        "circular": { total: 5, reserved: 0 },
        "Rectangle": { total: 0, reserved: 0 }
      }
    }
  ];

  useEffect(() => {
    // Load existing data when component mounts
    if (id) {
      const existingSetup = existingSeatSetups.find(setup => setup.id === parseInt(id));
      if (existingSetup) {
        setSelectedLocation(existingSetup.location);
        setSelectedFloor(existingSetup.floor);
        
        // Update seat types with existing data
        const updatedSeatTypes = seatTypes.map(seatType => ({
          ...seatType,
          totalSeats: existingSetup.seatTypes[seatType.name]?.total.toString() || "",
          reservedSeats: existingSetup.seatTypes[seatType.name]?.reserved.toString() || ""
        }));
        setSeatTypes(updatedSeatTypes);
      }
    }
  }, [id]);

  const updateSeatType = (index: number, field: keyof SeatTypeConfig, value: string) => {
    const updated = [...seatTypes];
    updated[index] = { ...updated[index], [field]: value };
    setSeatTypes(updated);
  };

  const updateDepartmentSeats = (index: number, seats: number) => {
    const updated = [...departments];
    updated[index] = { ...updated[index], seats };
    setDepartments(updated);
  };

  const updateSeatTypeAssignment = (index: number, change: number) => {
    const updated = [...seatTypeAssignments];
    const newAssigned = Math.max(0, Math.min(updated[index].total, updated[index].assigned + change));
    updated[index] = { ...updated[index], assigned: newAssigned };
    setSeatTypeAssignments(updated);
  };

  const generateSeatGrid = (seatType: SeatTypeAssignment) => {
    if (seatType.total === 0) return null;
    
    // For Cabin type, show labeled seats
    if (seatType.name === "Cabin" && seatType.selectedSeats.length > 0) {
      return (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {seatType.selectedSeats.map((seat, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              className="h-8 text-xs border-gray-300"
            >
              {seat}
            </Button>
          ))}
        </div>
      );
    }
    
    // For other types, show generic seat layout
    const seatCount = seatType.total;
    const rows = Math.ceil(seatCount / 4);
    
    return (
      <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 min-h-24">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(seatCount, 4)}, 1fr)` }}>
          {Array.from({ length: seatCount }, (_, idx) => (
            <div
              key={idx}
              className="w-6 h-6 bg-gray-300 rounded border"
            />
          ))}
        </div>
      </div>
    );
  };

  const handleProceed = () => {
    console.log("Updating seat setup...", { id, selectedLocation, selectedFloor, seatTypes, departments, seatTypeAssignments });
    navigate('/vas/space-management/setup/seat-setup');
  };

  const handleCancel = () => {
    navigate('/vas/space-management/setup/seat-setup');
  };

  const handleSubmit = () => {
    console.log("Submitting tag department configuration...", { departments, seatTypeAssignments });
    // Handle submit logic here
  };

  const handleBack = () => {
    setActiveTab("seat-configuration");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Seat Group Configuration</h1>
        </div>

        {/* Location and Floor Selection */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BBT A">BBT A</SelectItem>
                <SelectItem value="test">test</SelectItem>
                <SelectItem value="Jyoti Tower">Jyoti Tower</SelectItem>
                <SelectItem value="Gophygital">Gophygital</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
            <Select value={selectedFloor} onValueChange={setSelectedFloor}>
              <SelectTrigger>
                <SelectValue placeholder="Select Floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ground Floor">Ground Floor</SelectItem>
                <SelectItem value="TA Floor 1">TA Floor 1</SelectItem>
                <SelectItem value="2">2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="seat-configuration" 
              className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-700"
            >
              Seat Configuration
            </TabsTrigger>
            <TabsTrigger 
              value="tag-department"
              className="data-[state=active]:bg-[#C72030] data-[state=active]:text-white"
            >
              Tag Department
            </TabsTrigger>
          </TabsList>

          <TabsContent value="seat-configuration" className="mt-6">
            <div className="flex gap-6">
              {/* Left Side - Seat Configuration Form */}
              <div className="flex-1 bg-white rounded-lg border shadow-sm p-6">
                <div className="space-y-4">
                  {seatTypes.map((seatType, index) => (
                    <div key={index} className="flex items-center gap-4 py-2 border-b border-gray-100">
                      <div className="w-40">
                        <span className="text-sm font-medium text-gray-700">{seatType.name}</span>
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Total No. of Seats"
                          value={seatType.totalSeats}
                          onChange={(e) => updateSeatType(index, 'totalSeats', e.target.value)}
                          className="w-32"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Reserved Seats"
                          value={seatType.reservedSeats}
                          onChange={(e) => updateSeatType(index, 'reservedSeats', e.target.value)}
                          className="w-32"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Angular Ws Preview */}
              <div className="w-80 bg-white rounded-lg border shadow-sm p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Angular Ws</h3>
                  <p className="text-sm text-gray-600">Common Seats</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Button 
                      className="bg-[#C72030] hover:bg-[#C72030]/90 text-white w-full"
                      size="sm"
                    >
                      No. of Seats Add
                    </Button>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Reserved Seats</h4>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <div className="space-y-2">
                        <div className="text-gray-400">Drop seats here</div>
                        <Button 
                          className="bg-[#C72030] hover:bg-[#C7030]/90 text-white"
                          size="sm"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floor Map Section */}
            <div className="mt-8 bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Floor Map</h3>
              <div className="border border-gray-300 rounded-lg p-4">
                <input 
                  type="file" 
                  id="floor-map-edit" 
                  className="hidden" 
                  accept="image/*"
                />
                <label 
                  htmlFor="floor-map-edit" 
                  className="text-[#C72030] cursor-pointer hover:underline"
                >
                  Choose File
                </label>
                <span className="ml-2 text-gray-500">No file chosen</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <Button 
                onClick={handleProceed}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
              >
                Proceed
              </Button>
              <Button 
                onClick={handleCancel}
                variant="outline" 
                className="border-gray-300 text-gray-700 px-8"
              >
                Cancel
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="tag-department" className="mt-6">
            <div className="flex gap-6">
              {/* Left Side - Departments */}
              <div className="flex-1 bg-white rounded-lg border shadow-sm">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">Departments</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4 font-semibold text-gray-700 border-b pb-2">
                    <div>Departments</div>
                    <div className="text-center">No. of Seats</div>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {departments.map((dept, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                        <div className="text-sm text-gray-700">{dept.name}</div>
                        <div className="text-center">
                          <Input
                            type="number"
                            value={dept.seats}
                            onChange={(e) => updateDepartmentSeats(index, parseInt(e.target.value) || 0)}
                            className="w-16 text-center mx-auto"
                            min="0"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Visual Seat Layout */}
              <div className="w-96 bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-blue-50">
                  <h3 className="text-lg font-semibold text-gray-800 text-center">Tag Department</h3>
                </div>
                <div className="p-4 space-y-6 max-h-96 overflow-y-auto">
                  {seatTypeAssignments
                    .filter(seatType => seatType.total > 0)
                    .map((seatType, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-800">{seatType.name}</h4>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 w-6 p-0 rounded-full border-red-400 text-red-600"
                            onClick={() => updateSeatTypeAssignment(index, -1)}
                            disabled={seatType.assigned <= 0}
                          >
                            <CircleMinus className="h-3 w-3" />
                          </Button>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="font-medium">{seatType.assigned}</span>
                            <span className="text-red-600">/{seatType.total}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 w-6 p-0 rounded-full border-red-400 text-red-600"
                            onClick={() => updateSeatTypeAssignment(index, 1)}
                            disabled={seatType.assigned >= seatType.total}
                          >
                            <CirclePlus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {generateSeatGrid(seatType)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <Button 
                onClick={handleSubmit}
                className="bg-[#6B3FA0] hover:bg-[#6B3FA0]/90 text-white px-8"
              >
                Submit
              </Button>
              <Button 
                onClick={handleBack}
                variant="outline" 
                className="border-gray-300 text-gray-700 px-8"
              >
                Back
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
