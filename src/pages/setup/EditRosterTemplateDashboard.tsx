
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from 'react-router-dom';

export const EditRosterTemplateDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [templateName, setTemplateName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedSeatType, setSelectedSeatType] = useState("");
  const [periodFrom, setPeriodFrom] = useState({
    day: "18",
    month: "4",
    year: "2023"
  });
  const [periodTo, setPeriodTo] = useState({
    day: "18",
    month: "5",
    year: "2024"
  });
  const [allocationType, setAllocationType] = useState("permanent");
  const [scheduleType, setScheduleType] = useState("weekdays");
  const [weekSchedule, setWeekSchedule] = useState({
    "1st Week": true,
    "2nd Week": true,
    "3rd Week": true,
    "4th Week": true,
    "5th Week": true,
    "All": false
  });

  // Mock data for existing roster templates
  const existingRosters = [
    {
      id: 1,
      template: "Mon, Tue, Wed",
      location: "Lockated",
      department: "Tech",
      shift: "10:00 AM to 08:00 PM",
      seatType: "Angular Ws"
    },
    {
      id: 2,
      template: "MON,TUE,WED",
      location: "Lockated",
      department: "Tech",
      shift: "10:00 AM to 08:00 PM",
      seatType: "Cubical"
    }
  ];

  useEffect(() => {
    // Load existing data when component mounts
    if (id) {
      const existingRoster = existingRosters.find(roster => roster.id === parseInt(id));
      if (existingRoster) {
        setTemplateName(existingRoster.template);
        setSelectedLocation(existingRoster.location);
        setSelectedDepartment(existingRoster.department);
        setSelectedShift(existingRoster.shift);
        setSelectedSeatType(existingRoster.seatType);
      }
    }
  }, [id]);

  const handleWeekScheduleChange = (week: string, checked: boolean) => {
    setWeekSchedule(prev => ({
      ...prev,
      [week]: checked
    }));
  };

  const handleSubmit = () => {
    console.log("Submitting roster template:", {
      templateName,
      selectedLocation,
      selectedDepartment,
      selectedShift,
      selectedSeatType,
      periodFrom,
      periodTo,
      allocationType,
      scheduleType,
      weekSchedule
    });
    navigate('/vas/space-management/setup/roaster');
  };

  const handleCancel = () => {
    navigate('/vas/space-management/setup/roaster');
  };

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const years = Array.from({ length: 10 }, (_, i) => (2020 + i).toString());

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">User Roasters &gt; Edit Roster Template</div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Roster Template</h1>
        </div>

        <div className="flex gap-6">
          {/* Left Side - Form */}
          <div className="flex-1 bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <h2 className="text-lg font-semibold text-orange-500">LOCATION DETAILS</h2>
            </div>

            <div className="space-y-6">
              {/* Template Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Name the Template <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Mon, Tue, Wed"
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Lockated" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lockated">Lockated</SelectItem>
                      <SelectItem value="BBT A">BBT A</SelectItem>
                      <SelectItem value="Jyoti Tower">Jyoti Tower</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Department and Shift */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Department <span className="text-red-500">*</span>
                  </Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tech" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tech">Tech</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Shift <span className="text-red-500">*</span>
                  </Label>
                  <Select value={selectedShift} onValueChange={setSelectedShift}>
                    <SelectTrigger>
                      <SelectValue placeholder="10:00 AM to 08:00 PM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10:00 AM to 08:00 PM">10:00 AM to 08:00 PM</SelectItem>
                      <SelectItem value="09:00 AM to 06:00 PM">09:00 AM to 06:00 PM</SelectItem>
                      <SelectItem value="08:00 AM to 05:00 PM">08:00 AM to 05:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Seat Type */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Seat Type <span className="text-red-500">*</span>
                </Label>
                <Select value={selectedSeatType} onValueChange={setSelectedSeatType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Angular Ws" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Angular Ws">Angular Ws</SelectItem>
                    <SelectItem value="Cubical">Cubical</SelectItem>
                    <SelectItem value="Rectangle">Rectangle</SelectItem>
                    <SelectItem value="circular">circular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Select Period From */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Select Period From
                </Label>
                <div className="flex gap-2">
                  <Select value={periodFrom.day} onValueChange={(value) => setPeriodFrom(prev => ({ ...prev, day: value }))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={periodFrom.month} onValueChange={(value) => setPeriodFrom(prev => ({ ...prev, month: value }))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map(month => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="flex items-center">to</span>
                  <Select value={periodFrom.year} onValueChange={(value) => setPeriodFrom(prev => ({ ...prev, year: value }))}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={periodTo.day} onValueChange={(value) => setPeriodTo(prev => ({ ...prev, day: value }))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={periodTo.month} onValueChange={(value) => setPeriodTo(prev => ({ ...prev, month: value }))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map(month => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={periodTo.year} onValueChange={(value) => setPeriodTo(prev => ({ ...prev, year: value }))}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Allocation Type */}
              <div>
                <RadioGroup value={allocationType} onValueChange={setAllocationType} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="allocation" id="allocation" />
                    <Label htmlFor="allocation">Allocation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="permanent" id="permanent" />
                    <Label htmlFor="permanent">Permanent</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Schedule Type */}
              <div>
                <RadioGroup value={scheduleType} onValueChange={setScheduleType} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekdays" id="weekdays" />
                    <Label htmlFor="weekdays">Weekdays</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekends" id="weekends" />
                    <Label htmlFor="weekends">Weekends</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="recurring" id="recurring" />
                    <Label htmlFor="recurring">Recurring</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Week Schedule */}
              <div>
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">Every</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(weekSchedule).map(([week, checked]) => (
                    <div key={week} className="flex items-center space-x-2">
                      <Checkbox
                        id={week}
                        checked={checked}
                        onCheckedChange={(checked) => handleWeekScheduleChange(week, checked as boolean)}
                      />
                      <Label htmlFor={week} className="text-sm">{week}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button 
                  onClick={handleSubmit}
                  className="bg-green-500 hover:bg-green-600 text-white px-8"
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
          <div className="w-80 bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">List Of Selected Employees</h3>
            
            <div className="mb-4">
              <Input
                placeholder="Search by Employee Name"
                className="w-full"
              />
            </div>
            
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white w-full"
            >
              View List
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
