
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export const AddEmployeeDashboard = () => {
  const navigate = useNavigate();
  
  // Basic Information State
  const [basicInfo, setBasicInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    deskExtension: ''
  });

  // Functional Details State
  const [functionalDetails, setFunctionalDetails] = useState({
    department: '',
    designation: '',
    shift: '',
    employeeId: '',
    lateComingApplicable: false
  });

  // Seat Management State
  const [seatManagement, setSeatManagement] = useState({
    workType: '',
    building: '',
    floor: ''
  });

  // File upload states
  const [attachments, setAttachments] = useState({
    onBoarding: null,
    employeeHandbook: null,
    employeeCompensation: null,
    exitProcess: null,
    employeeManagement: null
  });

  const handleBasicInfoChange = (field: string, value: string) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleFunctionalDetailsChange = (field: string, value: string | boolean) => {
    setFunctionalDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSeatManagementChange = (field: string, value: string) => {
    setSeatManagement(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Employee data:', {
      basicInfo,
      functionalDetails,
      seatManagement,
      attachments
    });
    navigate('/vas/space-management/setup/employees');
  };

  const handleCancel = () => {
    navigate('/vas/space-management/setup/employees');
  };

  const FileUploadSection = ({ title, fieldKey }: { title: string; fieldKey: string }) => (
    <div className="border border-gray-200 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 border-red-300 hover:bg-red-50"
        >
          Choose File
        </Button>
        <span className="text-sm text-gray-500">No file chosen</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:bg-red-50 p-1"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <Button
        size="sm"
        className="bg-blue-600 hover:bg-blue-700 text-white mt-3"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Employees &gt; NEW Employee</div>
          <h1 className="text-2xl font-bold text-gray-800">NEW EMPLOYEE</h1>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          {/* Basic Information Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <h2 className="text-lg font-semibold text-[#FF6B35]">BASIC INFORMATION</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  First Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="First Name"
                  value={basicInfo.firstName}
                  onChange={(e) => handleBasicInfoChange('firstName', e.target.value)}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Last Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Last Name"
                  value={basicInfo.lastName}
                  onChange={(e) => handleBasicInfoChange('lastName', e.target.value)}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Email<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="Email"
                  value={basicInfo.email}
                  onChange={(e) => handleBasicInfoChange('email', e.target.value)}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Mobile<span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Mobile No."
                  value={basicInfo.mobile}
                  onChange={(e) => handleBasicInfoChange('mobile', e.target.value)}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Desk Extension<span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Desk Extension"
                  value={basicInfo.deskExtension}
                  onChange={(e) => handleBasicInfoChange('deskExtension', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Functional Details Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <h2 className="text-lg font-semibold text-[#FF6B35]">FUNCTIONAL DETAILS</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Department<span className="text-red-500">*</span>
                </Label>
                <Select value={functionalDetails.department} onValueChange={(value) => handleFunctionalDetailsChange('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="accounts">Accounts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Designation<span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Designation"
                  value={functionalDetails.designation}
                  onChange={(e) => handleFunctionalDetailsChange('designation', e.target.value)}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Shift<span className="text-red-500">*</span>
                </Label>
                <Select value={functionalDetails.shift} onValueChange={(value) => handleFunctionalDetailsChange('shift', value)}>
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
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Employee ID<span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Employee ID"
                  value={functionalDetails.employeeId}
                  onChange={(e) => handleFunctionalDetailsChange('employeeId', e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="lateComingApplicable"
                checked={functionalDetails.lateComingApplicable}
                onCheckedChange={(checked) => handleFunctionalDetailsChange('lateComingApplicable', checked)}
              />
              <Label htmlFor="lateComingApplicable" className="text-sm font-medium text-gray-700">
                Late Coming Applicable
              </Label>
            </div>
          </div>

          {/* Seat Management Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <h2 className="text-lg font-semibold text-[#FF6B35]">Seat Management</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Work Type<span className="text-red-500">*</span>
                </Label>
                <Select value={seatManagement.workType} onValueChange={(value) => handleSeatManagementChange('workType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Work Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wfh">Work From Home</SelectItem>
                    <SelectItem value="wfo">Work From Office</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Building<span className="text-red-500">*</span>
                </Label>
                <Select value={seatManagement.building} onValueChange={(value) => handleSeatManagementChange('building', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Building" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="building-a">Building A</SelectItem>
                    <SelectItem value="building-b">Building B</SelectItem>
                    <SelectItem value="building-c">Building C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Floor<span className="text-red-500">*</span>
                </Label>
                <Select value={seatManagement.floor} onValueChange={(value) => handleSeatManagementChange('floor', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Floor</SelectItem>
                    <SelectItem value="2">2nd Floor</SelectItem>
                    <SelectItem value="3">3rd Floor</SelectItem>
                    <SelectItem value="4">4th Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <h2 className="text-lg font-semibold text-[#FF6B35]">ATTACHMENTS</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploadSection title="On Boarding" fieldKey="onBoarding" />
              <FileUploadSection title="Employee Handbook" fieldKey="employeeHandbook" />
              <FileUploadSection title="Employee Compensation" fieldKey="employeeCompensation" />
              <FileUploadSection title="Exit Process" fieldKey="exitProcess" />
              <div className="md:col-span-2">
                <FileUploadSection title="Employee Management & Record Keeping" fieldKey="employeeManagement" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white px-12 py-3 text-lg"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
