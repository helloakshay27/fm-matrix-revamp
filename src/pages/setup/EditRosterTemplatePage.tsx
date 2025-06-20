
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useParams } from 'react-router-dom';

interface RoasterData {
  id: number;
  template: string;
  location: string;
  department: string;
  shift: string;
  seatType: string;
  roasterType: string;
  createdOn: string;
  createdBy: string;
}

export const EditRosterTemplatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Mock data - in real app, this would come from API based on id
  const mockData: RoasterData[] = [
    {
      id: 1,
      template: "Mon, Tue, Wed",
      location: "Lockated",
      department: "Tech",
      shift: "10:00 AM to 08:00 PM",
      seatType: "Angular Ws",
      roasterType: "Permanent",
      createdOn: "18/04/2023",
      createdBy: "Robert Day2"
    },
    {
      id: 2,
      template: "MON,TUE,WED",
      location: "Lockated",
      department: "Tech",
      shift: "10:00 AM to 08:00 PM",
      seatType: "Cubical",
      roasterType: "Permanent",
      createdOn: "13/03/2023",
      createdBy: "Robert Day2"
    },
    {
      id: 3,
      template: "Operations",
      location: "Lockated",
      department: "Operations",
      shift: "10:00 AM to 08:00 PM",
      seatType: "Angular Ws",
      roasterType: "Permanent",
      createdOn: "09/02/2023",
      createdBy: "Robert Day2"
    }
  ];

  const currentRoster = mockData.find(r => r.id === parseInt(id || '1')) || mockData[0];

  const [templateName, setTemplateName] = useState<string>(currentRoster.template);
  const [selectedLocation, setSelectedLocation] = useState<string>(currentRoster.location);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(currentRoster.department);
  const [selectedShift, setSelectedShift] = useState<string>(currentRoster.shift);
  const [selectedSeatType, setSelectedSeatType] = useState<string>(currentRoster.seatType);
  const [allocationType, setAllocationType] = useState<string>(currentRoster.roasterType);
  const [periodType, setPeriodType] = useState<string>("Weekdays");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Week checkboxes state
  const [selectedWeeks, setSelectedWeeks] = useState({
    week1: true,
    week2: true,
    week3: true,
    week4: true,
    week5: true,
    all: false
  });

  const handleWeekChange = (week: string, checked: boolean) => {
    setSelectedWeeks(prev => ({
      ...prev,
      [week]: checked
    }));
  };

  const handleAllWeeksChange = (checked: boolean) => {
    setSelectedWeeks({
      week1: checked,
      week2: checked,
      week3: checked,
      week4: checked,
      week5: checked,
      all: checked
    });
  };

  const handleSubmit = () => {
    console.log("Updating roster template...", {
      templateName,
      selectedLocation,
      selectedDepartment,
      selectedShift,
      selectedSeatType,
      allocationType,
      periodType,
      selectedWeeks
    });
    navigate('/vas/space-management/setup/roster');
  };

  const handleCancel = () => {
    navigate('/vas/space-management/setup/roster');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Roster Template</h1>
        </div>

        <div className="flex gap-6">
          {/* Left Side - Form */}
          <div className="flex-1 bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <h2 className="text-lg font-semibold text-[#FF6B35]">LOCATION DETAILS</h2>
            </div>

            <div className="space-y-6">
              {/* Template Name and Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Name the Template<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Enter Name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Location<span className="text-red-500">*</span>
                  </Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lockated">Lockated</SelectItem>
                      <SelectItem value="bbt-a">BBT A</SelectItem>
                      <SelectItem value="jyoti-tower">Jyoti Tower</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Department and Shift */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Department<span className="text-red-500">*</span>
                  </Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tech">Tech</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Shift<span className="text-red-500">*</span>
                  </Label>
                  <Select value={selectedShift} onValueChange={setSelectedShift}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Shift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10:00 AM to 08:00 PM">10:00 AM to 08:00 PM</SelectItem>
                      <SelectItem value="09:00 AM to 06:00 PM">09:00 AM to 06:00 PM</SelectItem>
                      <SelectItem value="10:00 AM to 07:00 PM">10:00 AM to 07:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Seat Type */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Seat Type<span className="text-red-500">*</span>
                </Label>
                <Select value={selectedSeatType} onValueChange={setSelectedSeatType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Seat Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Angular Ws">Angular Ws</SelectItem>
                    <SelectItem value="Cubical">Cubical</SelectItem>
                    <SelectItem value="Rectangle">Rectangle</SelectItem>
                    <SelectItem value="circular">Circular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Select Period From */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Select Period From
                </Label>
                <div className="flex gap-2">
                  <Select defaultValue="18">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select defaultValue="4">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select defaultValue="2023">
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="self-center">To</span>
                  <Select defaultValue="18">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select defaultValue="5">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select defaultValue="2024">
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Allocation Type */}
              <div>
                <RadioGroup value={allocationType} onValueChange={setAllocationType} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Allocation" id="allocation" />
                    <Label htmlFor="allocation">Allocation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Permanent" id="permanent" />
                    <Label htmlFor="permanent">Permanent</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Period Type */}
              <div>
                <RadioGroup value={periodType} onValueChange={setPeriodType} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Weekdays" id="weekdays" />
                    <Label htmlFor="weekdays">Weekdays</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Weekends" id="weekends" />
                    <Label htmlFor="weekends">Weekends</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Recurring" id="recurring" />
                    <Label htmlFor="recurring">Recurring</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Week Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Every</Label>
                <div className="flex gap-4 flex-wrap">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="week1" 
                      checked={selectedWeeks.week1}
                      onCheckedChange={(checked) => handleWeekChange('week1', checked as boolean)}
                    />
                    <Label htmlFor="week1" className="text-sm">1st Week</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="week2" 
                      checked={selectedWeeks.week2}
                      onCheckedChange={(checked) => handleWeekChange('week2', checked as boolean)}
                    />
                    <Label htmlFor="week2" className="text-sm">2nd Week</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="week3" 
                      checked={selectedWeeks.week3}
                      onCheckedChange={(checked) => handleWeekChange('week3', checked as boolean)}
                    />
                    <Label htmlFor="week3" className="text-sm">3rd Week</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="week4" 
                      checked={selectedWeeks.week4}
                      onCheckedChange={(checked) => handleWeekChange('week4', checked as boolean)}
                    />
                    <Label htmlFor="week4" className="text-sm">4th Week</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="week5" 
                      checked={selectedWeeks.week5}
                      onCheckedChange={(checked) => handleWeekChange('week5', checked as boolean)}
                    />
                    <Label htmlFor="week5" className="text-sm">5th Week</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="all" 
                      checked={selectedWeeks.all}
                      onCheckedChange={(checked) => handleAllWeeksChange(checked as boolean)}
                    />
                    <Label htmlFor="all" className="text-sm">All</Label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  Submit
                </Button>
                <Button 
                  onClick={handleCancel}
                  variant="outline" 
                  className="border-gray-300 text-gray-700 px-8"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side - Employee List */}
          <div className="w-96 bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">List Of Selected Employees</h3>
            
            <div className="mb-4">
              <Input
                placeholder="Search by Employee Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                View List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
