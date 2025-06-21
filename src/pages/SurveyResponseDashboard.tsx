
import React, { useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { SurveyResponseTable } from '../components/SurveyResponseTable';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export const SurveyResponseDashboard = () => {
  const { toast } = useToast();
  const [selectedSurvey, setSelectedSurvey] = useState('');
  const [dateRange, setDateRange] = useState('01/05/2025 - 21/06/2025');
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedWing, setSelectedWing] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  const handleSearch = () => {
    const filters = {
      selectedSurvey,
      dateRange,
      selectedSite,
      selectedBuilding,
      selectedWing,
      selectedArea,
      selectedFloor,
      selectedRoom
    };
    
    console.log('Searching with filters:', filters);
    
    toast({
      title: "Search Initiated",
      description: "Searching survey responses with applied filters",
    });
  };

  const handleReset = () => {
    setSelectedSurvey('');
    setDateRange('01/05/2025 - 21/06/2025');
    setSelectedSite('');
    setSelectedBuilding('');
    setSelectedWing('');
    setSelectedArea('');
    setSelectedFloor('');
    setSelectedRoom('');
    
    toast({
      title: "Filters Reset",
      description: "All filters have been reset to default values",
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Survey Response</h2>
          <p className="text-muted-foreground">
            Survey &gt; Survey Response
          </p>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="bg-white rounded-lg border border-[#D5DbDB] p-6 space-y-6">
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Survey</label>
            <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
              <SelectTrigger className="border-[#D5DbDB] focus:ring-[#C72030] focus:border-[#C72030]">
                <SelectValue placeholder="Select Survey" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#D5DbDB] z-50">
                <SelectItem value="customer-satisfaction">Customer Satisfaction Survey</SelectItem>
                <SelectItem value="facility-maintenance">Facility Maintenance Survey</SelectItem>
                <SelectItem value="employee-feedback">Employee Feedback Survey</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date Range</label>
            <Input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border-[#D5DbDB] focus:ring-[#C72030] focus:border-[#C72030]"
              placeholder="01/05/2025 - 21/06/2025"
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Site</label>
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger className="border-[#D5DbDB] focus:ring-[#C72030] focus:border-[#C72030]">
                <SelectValue placeholder="Select Site" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#D5DbDB] z-50">
                <SelectItem value="site-1">Lockastead Site 1</SelectItem>
                <SelectItem value="site-2">Lockastead Site 2</SelectItem>
                <SelectItem value="downtown">Downtown Office</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Building</label>
            <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
              <SelectTrigger className="border-[#D5DbDB] focus:ring-[#C72030] focus:border-[#C72030]">
                <SelectValue placeholder="Select Building" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#D5DbDB] z-50">
                <SelectItem value="building-a">Building A</SelectItem>
                <SelectItem value="building-b">Building B</SelectItem>
                <SelectItem value="main-tower">Main Tower</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Wing</label>
            <Select value={selectedWing} onValueChange={setSelectedWing}>
              <SelectTrigger className="border-[#D5DbDB] focus:ring-[#C72030] focus:border-[#C72030]">
                <SelectValue placeholder="Select Wing" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#D5DbDB] z-50">
                <SelectItem value="east-wing">East Wing</SelectItem>
                <SelectItem value="west-wing">West Wing</SelectItem>
                <SelectItem value="north-wing">North Wing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Area</label>
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="border-[#D5DbDB] focus:ring-[#C72030] focus:border-[#C72030]">
                <SelectValue placeholder="Select Area" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#D5DbDB] z-50">
                <SelectItem value="lobby">Lobby</SelectItem>
                <SelectItem value="workspace">Workspace</SelectItem>
                <SelectItem value="cafeteria">Cafeteria</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Floor</label>
            <Select value={selectedFloor} onValueChange={setSelectedFloor}>
              <SelectTrigger className="border-[#D5DbDB] focus:ring-[#C72030] focus:border-[#C72030]">
                <SelectValue placeholder="Select Floor" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#D5DbDB] z-50">
                <SelectItem value="ground">Ground Floor</SelectItem>
                <SelectItem value="first">1st Floor</SelectItem>
                <SelectItem value="second">2nd Floor</SelectItem>
                <SelectItem value="third">3rd Floor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Room</label>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger className="border-[#D5DbDB] focus:ring-[#C72030] focus:border-[#C72030]">
                <SelectValue placeholder="Select Room" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#D5DbDB] z-50">
                <SelectItem value="room-101">Room 101</SelectItem>
                <SelectItem value="room-102">Room 102</SelectItem>
                <SelectItem value="conference-a">Conference Room A</SelectItem>
                <SelectItem value="conference-b">Conference Room B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button 
            onClick={handleSearch}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2 rounded flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </Button>
          <Button 
            onClick={handleReset}
            variant="outline"
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white px-8 py-2 rounded flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>
      
      {/* Survey Response Table */}
      <SurveyResponseTable />
    </div>
  );
};
