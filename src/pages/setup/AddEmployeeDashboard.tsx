
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  FormControl as MuiFormControl,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const fieldStyles = {
  height: '40px',
  backgroundColor: '#fff',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#d1d5db',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--color-primary)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--color-primary)',
  },
  '& .MuiSelect-select': {
    fontSize: '14px',
  },
};

const selectMenuProps = {
  sx: { pointerEvents: 'auto' },
  PaperProps: {
    sx: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

interface EmployeeSelectProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

const EmployeeSelect: React.FC<EmployeeSelectProps> = ({
  label,
  placeholder,
  value,
  onChange,
  options,
}) => (
  <div>
    <Label className="text-sm font-medium text-gray-700 mb-2 block">
      {label}<span className="text-red-500">*</span>
    </Label>
    <MuiFormControl fullWidth size="small">
      <MuiSelect
        displayEmpty
        value={value}
        onChange={(event) => onChange(event.target.value)}
        renderValue={(selected) =>
          selected ? (
            options.find((option) => option.value === selected)?.label ?? selected
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )
        }
        sx={fieldStyles}
        MenuProps={selectMenuProps}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </MuiFormControl>
  </div>
);

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
          className="text-brand border-brand hover:bg-brand-selected"
        >
          Choose File
        </Button>
        <span className="text-sm text-gray-500">No file chosen</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-brand hover:bg-brand-selected p-1"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="fm-button-fix fm-button-brand px-4 py-2 mt-3"
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
              <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <h2 className="text-lg font-semibold text-brand">BASIC INFORMATION</h2>
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
              <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <h2 className="text-lg font-semibold text-brand">FUNCTIONAL DETAILS</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <EmployeeSelect
                label="Department"
                placeholder="Select Department"
                value={functionalDetails.department}
                onChange={(value) => handleFunctionalDetailsChange('department', value)}
                options={[
                  { value: 'tech', label: 'Tech' },
                  { value: 'operations', label: 'Operations' },
                  { value: 'hr', label: 'HR' },
                  { value: 'accounts', label: 'Accounts' },
                ]}
              />
              
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
              
              <EmployeeSelect
                label="Shift"
                placeholder="Select Shift"
                value={functionalDetails.shift}
                onChange={(value) => handleFunctionalDetailsChange('shift', value)}
                options={[
                  { value: '10-08', label: '10:00 AM to 08:00 PM' },
                  { value: '09-06', label: '09:00 AM to 06:00 PM' },
                  { value: '10-07', label: '10:00 AM to 07:00 PM' },
                ]}
              />
              
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
              <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <h2 className="text-lg font-semibold text-brand">Seat Management</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EmployeeSelect
                label="Work Type"
                placeholder="Select Work Type"
                value={seatManagement.workType}
                onChange={(value) => handleSeatManagementChange('workType', value)}
                options={[
                  { value: 'wfh', label: 'Work From Home' },
                  { value: 'wfo', label: 'Work From Office' },
                  { value: 'hybrid', label: 'Hybrid' },
                ]}
              />

              <EmployeeSelect
                label="Building"
                placeholder="Select Building"
                value={seatManagement.building}
                onChange={(value) => handleSeatManagementChange('building', value)}
                options={[
                  { value: 'building-a', label: 'Building A' },
                  { value: 'building-b', label: 'Building B' },
                  { value: 'building-c', label: 'Building C' },
                ]}
              />

              <EmployeeSelect
                label="Floor"
                placeholder="Select Floor"
                value={seatManagement.floor}
                onChange={(value) => handleSeatManagementChange('floor', value)}
                options={[
                  { value: '1', label: '1st Floor' },
                  { value: '2', label: '2nd Floor' },
                  { value: '3', label: '3rd Floor' },
                  { value: '4', label: '4th Floor' },
                ]}
              />
            </div>
          </div>

          {/* Attachments Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <h2 className="text-lg font-semibold text-brand">ATTACHMENTS</h2>
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
              className="!bg-[#DA7756] hover:!bg-[#C45F40] px-12 py-3 text-lg"
            >
              <span className="!text-white font-medium">Submit</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
