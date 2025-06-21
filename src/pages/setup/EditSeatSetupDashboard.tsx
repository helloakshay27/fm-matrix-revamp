
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from 'react-router-dom';
import { CirclePlus, CircleMinus, X } from 'lucide-react';

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
  reservedSeats: string[];
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
  const [selectedSeatType, setSelectedSeatType] = useState<string>("Angular Ws");
  const [seatCountToAdd, setSeatCountToAdd] = useState<string>("");
  
  const [seatTypes, setSeatTypes] = useState<SeatTypeConfig[]>([
    { name: "Angular Ws", totalSeats: "0", reservedSeats: "0" },
    { name: "Flexi Desk", totalSeats: "4", reservedSeats: "2" },
    { name: "Cabin", totalSeats: "4", reservedSeats: "0" },
    { name: "Fixed Desk", totalSeats: "3", reservedSeats: "0" },
    { name: "IOS", totalSeats: "0", reservedSeats: "0" },
    { name: "cabin", totalSeats: "0", reservedSeats: "0" },
    { name: "circular", totalSeats: "0", reservedSeats: "0" },
    { name: "Rectangle", totalSeats: "0", reservedSeats: "0" },
    { name: "circularchair", totalSeats: "0", reservedSeats: "0" },
    { name: "Hot Desk", totalSeats: "0", reservedSeats: "0" },
    { name: "Fixed Angular Chair", totalSeats: "2", reservedSeats: "2" },
    { name: "Cubical", totalSeats: "0", reservedSeats: "0" },
    { name: "Cafe", totalSeats: "0", reservedSeats: "0" },
    { name: "Hotseat", totalSeats: "2", reservedSeats: "0" }
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

  // Seat type assignments for Tag Department
  const [seatTypeAssignments, setSeatTypeAssignments] = useState<SeatTypeAssignment[]>([
    { name: "Angular Ws", assigned: 0, total: 0, selectedSeats: [], reservedSeats: [] },
    { name: "Flexi Desk", assigned: 0, total: 4, selectedSeats: ["S1", "S2"], reservedSeats: ["S3", "S4"] },
    { name: "Cabin", assigned: 0, total: 4, selectedSeats: ["C1", "C2", "C3", "C4"], reservedSeats: [] },
    { name: "Fixed Desk", assigned: 0, total: 3, selectedSeats: ["FD1", "FD2", "FD3"], reservedSeats: [] },
    { name: "IOS", assigned: 0, total: 0, selectedSeats: [], reservedSeats: [] },
    { name: "cabin", assigned: 0, total: 0, selectedSeats: [], reservedSeats: [] },
    { name: "circular", assigned: 0, total: 0, selectedSeats: [], reservedSeats: [] },
    { name: "Rectangle", assigned: 0, total: 0, selectedSeats: [], reservedSeats: [] },
    { name: "circularchair", assigned: 0, total: 0, selectedSeats: [], reservedSeats: [] },
    { name: "Hot Desk", assigned: 0, total: 0, selectedSeats: [], reservedSeats: [] },
    { name: "Fixed Angular Chair", assigned: 0, total: 2, selectedSeats: ["FAC1", "FAC2"], reservedSeats: [] },
    { name: "Cubical", assigned: 0, total: 0, selectedSeats: [], reservedSeats: [] },
    { name: "Cafe", assigned: 0, total: 0, selectedSeats: [], reservedSeats: [] },
    { name: "Hotseat", assigned: 0, total: 2, selectedSeats: ["HS1", "HS2"], reservedSeats: [] }
  ]);

  // Mock data for existing seat setups
  const existingSeatSetups: SeatSetupData[] = [
    {
      id: 1,
      location: "BBT A",
      floor: "TA Floor 1 - TA Wing 1 - BBT A",
      seatTypes: {
        "Angular Ws": { total: 0, reserved: 0 },
        "Flexi Desk": { total: 4, reserved: 2 },
        "Cabin": { total: 4, reserved: 0 },
        "Fixed Desk": { total: 3, reserved: 0 },
        "IOS": { total: 0, reserved: 0 },
        "cabin": { total: 0, reserved: 0 },
        "circular": { total: 0, reserved: 0 },
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
          totalSeats: existingSetup.seatTypes[seatType.name]?.total.toString() || seatType.totalSeats,
          reservedSeats: existingSetup.seatTypes[seatType.name]?.reserved.toString() || seatType.reservedSeats
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

  const updateSeatTypeAssignment = (seatTypeName: string, change: number) => {
    const updated = [...seatTypeAssignments];
    const index = updated.findIndex(sta => sta.name === seatTypeName);
    if (index !== -1) {
      const newAssigned = Math.max(0, Math.min(updated[index].total, updated[index].assigned + change));
      updated[index] = { ...updated[index], assigned: newAssigned };
      setSeatTypeAssignments(updated);
    }
  };

  const handleSeatTypeClick = (seatTypeName: string) => {
    setSelectedSeatType(seatTypeName);
  };

  const handleAddSeats = () => {
    const count = parseInt(seatCountToAdd);
    if (!count || count <= 0) return;

    // Update the seat types table
    const updatedSeatTypes = seatTypes.map(seatType => {
      if (seatType.name === selectedSeatType) {
        const currentTotal = parseInt(seatType.totalSeats) || 0;
        return {
          ...seatType,
          totalSeats: (currentTotal + count).toString()
        };
      }
      return seatType;
    });
    setSeatTypes(updatedSeatTypes);

    // Update seat type assignments
    const updatedAssignments = seatTypeAssignments.map(assignment => {
      if (assignment.name === selectedSeatType) {
        const currentTotal = assignment.total;
        const newSeats = [];
        for (let i = 1; i <= count; i++) {
          newSeats.push(`S${currentTotal + i}`);
        }
        return {
          ...assignment,
          total: currentTotal + count,
          selectedSeats: [...assignment.selectedSeats, ...newSeats]
        };
      }
      return assignment;
    });
    setSeatTypeAssignments(updatedAssignments);

    // Clear the input
    setSeatCountToAdd("");
  };

  const removeSeat = (seatId: string, isReserved: boolean = false) => {
    const updatedAssignments = seatTypeAssignments.map(assignment => {
      if (assignment.name === selectedSeatType) {
        if (isReserved) {
          return {
            ...assignment,
            reservedSeats: assignment.reservedSeats.filter(seat => seat !== seatId),
            total: assignment.total - 1
          };
        } else {
          return {
            ...assignment,
            selectedSeats: assignment.selectedSeats.filter(seat => seat !== seatId),
            total: assignment.total - 1
          };
        }
      }
      return assignment;
    });
    setSeatTypeAssignments(updatedAssignments);

    // Update seat types table
    const updatedSeatTypes = seatTypes.map(seatType => {
      if (seatType.name === selectedSeatType) {
        const currentTotal = parseInt(seatType.totalSeats) || 0;
        const currentReserved = parseInt(seatType.reservedSeats) || 0;
        return {
          ...seatType,
          totalSeats: (currentTotal - 1).toString(),
          reservedSeats: isReserved ? (currentReserved - 1).toString() : seatType.reservedSeats
        };
      }
      return seatType;
    });
    setSeatTypes(updatedSeatTypes);
  };

  const getSelectedSeatTypeAssignment = () => {
    return seatTypeAssignments.find(sta => sta.name === selectedSeatType);
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
          <h1 className="text-2xl font-bold text-gray-800">Seat Group Configuration</h1>
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
                <SelectItem value="TA Floor 1 - TA Wing 1 - BBT A">TA Floor 1 - TA Wing 1 - BBT A</SelectItem>
                <SelectItem value="Ground Floor">Ground Floor</SelectItem>
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
              className="data-[state=active]:bg-[#C72030] data-[state=active]:text-white"
            >
              Seat Configuration
            </TabsTrigger>
            <TabsTrigger 
              value="tag-department"
              className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-700"
            >
              Tag Department
            </TabsTrigger>
          </TabsList>

          <TabsContent value="seat-configuration" className="mt-6">
            <div className="flex gap-6">
              {/* Left Side - Seat Configuration Form */}
              <div className="flex-1 bg-white rounded-lg border shadow-sm p-6">
                <div className="space-y-1">
                  {/* Header Row */}
                  <div className="grid grid-cols-3 gap-4 py-3 border-b-2 border-gray-300 bg-gray-50 px-4 -mx-6 mb-4">
                    <div className="font-semibold text-gray-700">Seat Type</div>
                    <div className="font-semibold text-gray-700 text-center">Total No. of Seats</div>
                    <div className="font-semibold text-gray-700 text-center">Reserved Seats</div>
                  </div>
                  
                  {seatTypes.map((seatType, index) => (
                    <div 
                      key={index} 
                      className={`grid grid-cols-3 gap-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 px-4 -mx-6 ${
                        selectedSeatType === seatType.name ? 'bg-orange-50 border-orange-300' : ''
                      }`}
                      onClick={() => handleSeatTypeClick(seatType.name)}
                    >
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700">{seatType.name}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <Input
                          placeholder="0"
                          value={seatType.totalSeats}
                          onChange={(e) => updateSeatType(index, 'totalSeats', e.target.value)}
                          className="w-20 h-8 text-center"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <Input
                          placeholder="0"
                          value={seatType.reservedSeats}
                          onChange={(e) => updateSeatType(index, 'reservedSeats', e.target.value)}
                          className="w-20 h-8 text-center"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Dynamic Seat Type Preview */}
              <div className="w-80 bg-pink-50 rounded-lg border shadow-sm p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{selectedSeatType}</h3>
                  <p className="text-sm text-gray-600">Common Seats</p>
                </div>
                
                <div className="space-y-4">
                  {/* Show existing common seats */}
                  {getSelectedSeatTypeAssignment()?.selectedSeats.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {getSelectedSeatTypeAssignment()?.selectedSeats.map((seat, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="h-10 text-xs border-gray-300 bg-white text-gray-700 relative group"
                        >
                          {seat}
                          <X 
                            className="w-3 h-3 text-red-500 absolute -top-1 -right-1 bg-red-500 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSeat(seat, false);
                            }}
                          />
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="No. of Seats"
                      value={seatCountToAdd}
                      onChange={(e) => setSeatCountToAdd(e.target.value)}
                      type="number"
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleAddSeats}
                      className="bg-purple-700 hover:bg-purple-800 text-white"
                      size="sm"
                    >
                      Add
                    </Button>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Reserved Seats</h4>
                    
                    {/* Show existing reserved seats */}
                    {getSelectedSeatTypeAssignment()?.reservedSeats.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {getSelectedSeatTypeAssignment()?.reservedSeats.map((seat, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            className="h-10 text-xs border-gray-300 bg-white text-gray-700 relative group"
                          >
                            {seat}
                            <X 
                              className="w-3 h-3 text-red-500 absolute -top-1 -right-1 bg-red-500 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSeat(seat, true);
                              }}
                            />
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="2"
                        className="flex-1"
                      />
                      <Button 
                        className="bg-purple-700 hover:bg-purple-800 text-white"
                        size="sm"
                      >
                        Add
                      </Button>
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
          </TabsContent>

          <TabsContent value="tag-department" className="mt-6">
            <div className="flex gap-6">
              {/* Left Side - Department List */}
              <div className="flex-1 bg-white rounded-lg border shadow-sm">
                <div className="bg-gray-100 p-4 rounded-t-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="font-semibold text-gray-700">Departments</div>
                    <div className="font-semibold text-gray-700 text-center">No. of Seats</div>
                  </div>
                </div>
                <div className="p-0">
                  {departments.map((department, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50">
                      <div className="text-sm text-gray-700">{department.name}</div>
                      <div className="text-sm text-gray-700 text-center">{department.seats}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Tag Department */}
              <div className="w-80 bg-blue-50 rounded-lg border shadow-sm p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Tag Department</h3>
                </div>
                
                <div className="space-y-3">
                  {seatTypeAssignments.map((seatType, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="font-medium text-gray-800 flex-1">{seatType.name}</div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
                              onClick={() => updateSeatTypeAssignment(seatType.name, 1)}
                              disabled={seatType.assigned >= seatType.total}
                            >
                              <CirclePlus className="h-4 w-4 text-green-500" />
                            </Button>
                            
                            <span className="font-medium text-lg mx-2">{seatType.assigned}</span>
                            <span className="text-red-600 text-sm">/{seatType.total}</span>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
                              onClick={() => updateSeatTypeAssignment(seatType.name, -1)}
                              disabled={seatType.assigned <= 0}
                            >
                              <CircleMinus className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
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
