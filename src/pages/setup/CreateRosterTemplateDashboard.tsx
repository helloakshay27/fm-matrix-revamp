
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
    navigate('/vas/space-management/setup/roaster');
  };

  const handleCancel = () => {
    navigate('/vas/space-management/setup/roaster');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">User Roasters &gt; Create Roster Template</div>
          <h1 className="text-2xl font-bold text-gray-800">Create Roster Template</h1>
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
                      <SelectItem value="lockated">Lockated</SelectItem>
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
                      <SelectItem value="tech">Tech</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
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
                      <SelectItem value="10-08">10:00 AM to 08:00 PM</SelectItem>
                      <SelectItem value="09-06">09:00 AM to 06:00 PM</SelectItem>
                      <SelectItem value="10-07">10:00 AM to 07:00 PM</SelectItem>
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
                    <SelectItem value="angular-ws">Angular Ws</SelectItem>
                    <SelectItem value="cubical">Cubical</SelectItem>
                    <SelectItem value="rectangle">Rectangle</SelectItem>
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
                  <Select defaultValue="17">
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
                  <Select defaultValue="6">
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
                  <Select defaultValue="2022">
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
                  <Select defaultValue="17">
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
                  <Select defaultValue="7">
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
                  <Select defaultValue="2025">
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
                    <RadioGroupItem value="Week" id="week" />
                    <Label htmlFor="week">Week</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Month" id="month" />
                    <Label htmlFor="month">Month</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Year" id="year" />
                    <Label htmlFor="year">Year</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Number of Days */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  No. of Days
                </Label>
                <Input
                  placeholder="Enter no. of days"
                  value={numberOfDays}
                  onChange={(e) => setNumberOfDays(e.target.value)}
                  className="w-48"
                />
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
