
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';

export const CreateRosterTemplateDashboard = () => {
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedShift, setSelectedShift] = useState<string>("");
  const [selectedSeatType, setSelectedSeatType] = useState<string>("");
  const [allocationType, setAllocationType] = useState<string>("Allocation");
  const [periodType, setPeriodType] = useState<string>("Week");
  const [numberOfDays, setNumberOfDays] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSubmit = () => {
    console.log("Creating roster template...", {
      templateName,
      selectedLocation,
      selectedDepartment,
      selectedShift,
      selectedSeatType,
      allocationType,
      periodType,
      numberOfDays
    });
    navigate('/vas/space-management/setup/roster');
  };

  const handleCancel = () => {
    navigate('/vas/space-management/setup/roster');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create Roster Template</h1>
      </div>

      <div className="flex gap-6">
        {/* Left Side - Form */}
        <div className="flex-1 bg-white rounded-lg border shadow-sm p-6">
          {/* Location Details Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              3
            </div>
            <h2 className="text-lg font-semibold text-orange-500 uppercase">LOCATION DETAILS</h2>
          </div>

          <div className="space-y-4">
            {/* First Row - Template Name and Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                  Name the Template<span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter Name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="h-10"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                  Location<span className="text-red-500">*</span>
                </Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lockated">Lockated</SelectItem>
                    <SelectItem value="bbt-a">BBT A</SelectItem>
                    <SelectItem value="jyoti-tower">Jyoti Tower</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Second Row - Department and Shift */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                  Department<span className="text-red-500">*</span>
                </Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                  Shift<span className="text-red-500">*</span>
                </Label>
                <Select value={selectedShift} onValueChange={setSelectedShift}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select Shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10-08">10:00 AM to 08:00 PM</SelectItem>
                    <SelectItem value="09-06">09:00 AM to 06:00 PM</SelectItem>
                    <SelectItem value="10-07">10:00 AM to 07:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Third Row - Seat Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                  Seat Type<span className="text-red-500">*</span>
                </Label>
                <Select value={selectedSeatType} onValueChange={setSelectedSeatType}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select Seat Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="angular-ws">Angular Ws</SelectItem>
                    <SelectItem value="cubical">Cubical</SelectItem>
                    <SelectItem value="rectangle">Rectangle</SelectItem>
                    <SelectItem value="circular">Circular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Select Period From */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">
                Select Period From
              </Label>
              <div className="flex items-center gap-2">
                <Select defaultValue="20">
                  <SelectTrigger className="w-16 h-8 text-sm">
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
                <Select defaultValue="6">
                  <SelectTrigger className="w-12 h-8 text-sm">
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
                <Select defaultValue="2025">
                  <SelectTrigger className="w-20 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">To</span>
                <Select defaultValue="20">
                  <SelectTrigger className="w-16 h-8 text-sm">
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
                <Select defaultValue="7">
                  <SelectTrigger className="w-12 h-8 text-sm">
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
                <Select defaultValue="2025">
                  <SelectTrigger className="w-20 h-8 text-sm">
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

            {/* Radio Buttons */}
            <div className="space-y-4">
              {/* Allocation/Permanent */}
              <div>
                <RadioGroup value={allocationType} onValueChange={setAllocationType} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Allocation" id="allocation" />
                    <Label htmlFor="allocation" className="text-sm">Allocation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Permanent" id="permanent" />
                    <Label htmlFor="permanent" className="text-sm">Permanent</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Week/Month/Year */}
              <div>
                <RadioGroup value={periodType} onValueChange={setPeriodType} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Week" id="week" />
                    <Label htmlFor="week" className="text-sm">Week</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Month" id="month" />
                    <Label htmlFor="month" className="text-sm">Month</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Year" id="year" />
                    <Label htmlFor="year" className="text-sm">Year</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Number of Days */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">
                No. of Days
              </Label>
              <Input
                placeholder="Enter no. of days"
                value={numberOfDays}
                onChange={(e) => setNumberOfDays(e.target.value)}
                className="w-48 h-10"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button 
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-8 h-10"
              >
                Submit
              </Button>
              <Button 
                onClick={handleCancel}
                variant="outline" 
                className="border-gray-300 text-gray-700 px-8 h-10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - Employee List */}
        <div className="w-80 bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">List Of Selected Employees</h3>
          
          <div className="mb-4">
            <Input
              placeholder="Search by Employee Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10"
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-8 text-sm"
              size="sm"
            >
              View List
            </Button>
          </div>
          
          {/* Empty state for employee list */}
          <div className="mt-6 h-48 bg-gray-50 rounded border-2 border-dashed border-gray-200 flex items-center justify-center">
            <p className="text-gray-500 text-sm">No employees selected</p>
          </div>
        </div>
      </div>
    </div>
  );
};
