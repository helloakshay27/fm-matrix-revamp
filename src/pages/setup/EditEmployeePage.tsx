
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Mock employee data - this would normally come from an API
const employeesData = [
  {
    id: '220274',
    employeeId: '9556',
    firstName: 'Test',
    lastName: 'Bulk',
    email: 'aaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com',
    mobile: '9774545411',
    userType: 'User',
    deskExtension: '2189',
    department: 'Tech',
    designation: 'Software Engineer',
    lateComing: 'Not Applicable',
    shift: '10:00 AM to 08:00 PM',
    workType: 'WFO',
    seatType: 'Angular Ws',
    building: 'BBT A',
    floor: '2nd Floor',
    rosterGroup: 'Tech Group A'
  },
  {
    id: '218970',
    employeeId: '',
    firstName: 'Vinayak',
    lastName: 'test wallet',
    email: 'test200@yopmail.com',
    mobile: '8642589677',
    userType: 'User',
    deskExtension: '',
    department: 'Operations',
    designation: 'Operations Manager',
    lateComing: 'Not Applicable',
    shift: '09:00 AM to 06:00 PM',
    workType: 'Hybrid',
    seatType: 'Cubical',
    building: 'Jyoti Tower',
    floor: '3rd Floor',
    rosterGroup: 'Operations Group B'
  },
  {
    id: '212919',
    employeeId: '',
    firstName: 'sameer',
    lastName: 'kumar',
    email: '2134513211@gmail.com',
    mobile: '2134513211',
    userType: 'Admin',
    deskExtension: '1001',
    department: 'HR',
    designation: 'HR Manager',
    lateComing: 'Applicable',
    shift: '10:00 AM to 07:00 PM',
    workType: 'WFO',
    seatType: 'Rectangle',
    building: 'Lockated',
    floor: '1st Floor',
    rosterGroup: 'HR Group A'
  },
  {
    id: '208268',
    employeeId: '62376',
    firstName: 'Demo',
    lastName: 'User',
    email: 'akksjs121@akks.com',
    mobile: '4982738492',
    userType: 'User',
    deskExtension: '1234',
    department: 'Finance',
    designation: 'Financial Analyst',
    lateComing: 'Not Applicable',
    shift: '09:30 AM to 06:30 PM',
    workType: 'WFH',
    seatType: 'Circular',
    building: 'BBT A',
    floor: '4th Floor',
    rosterGroup: 'Finance Group A'
  },
  {
    id: '206726',
    employeeId: '',
    firstName: 'Test',
    lastName: '1000',
    email: 'test5999@yopmail.com',
    mobile: '8811881188',
    userType: 'Admin',
    deskExtension: '5000',
    department: 'IT',
    designation: 'System Administrator',
    lateComing: 'Applicable',
    shift: '10:00 AM to 08:00 PM',
    workType: 'WFO',
    seatType: 'Angular Ws',
    building: 'Lockated',
    floor: '5th Floor',
    rosterGroup: 'IT Group A'
  },
  {
    id: '206725',
    employeeId: '',
    firstName: 'Test',
    lastName: '999.0',
    email: 'test5998@yopmail.com',
    mobile: '4618220262',
    userType: 'User',
    deskExtension: '',
    department: 'Marketing',
    designation: 'Marketing Executive',
    lateComing: 'Not Applicable',
    shift: '09:00 AM to 06:00 PM',
    workType: 'Hybrid',
    seatType: 'Rectangle',
    building: 'Jyoti Tower',
    floor: '2nd Floor',
    rosterGroup: 'Marketing Group A'
  },
  {
    id: '206722',
    employeeId: '',
    firstName: 'Test',
    lastName: '996.',
    email: 'test5995@yopmail.com',
    mobile: '4618220259',
    userType: 'User',
    deskExtension: '2001',
    department: 'Sales',
    designation: 'Sales Representative',
    lateComing: 'Not Applicable',
    shift: '10:30 AM to 06:30 PM',
    workType: 'WFO',
    seatType: 'Cubical',
    building: 'BBT A',
    floor: '1st Floor',
    rosterGroup: 'Sales Group B'
  },
  {
    id: '206720',
    employeeId: '',
    firstName: 'Test',
    lastName: '994.0',
    email: 'test5993@yopmail.com',
    mobile: '4618220257',
    userType: 'Admin',
    deskExtension: '3001',
    department: 'Legal',
    designation: 'Legal Advisor',
    lateComing: 'Applicable',
    shift: '09:00 AM to 06:00 PM',
    workType: 'WFH',
    seatType: 'Rectangle',
    building: 'Lockated',
    floor: '3rd Floor',
    rosterGroup: 'Legal Group A'
  }
];

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  deskExtension: string;
  department: string;
  designation: string;
  shift: string;
  employeeId: string;
  lateComing: boolean;
  workType: string;
  building: string;
  floor: string;
}

export const EditEmployeePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attachments, setAttachments] = useState({
    onBoarding: null as File | null,
    employeeHandbook: null as File | null,
    employeeCompensation: null as File | null,
    employeeManagement: null as File | null,
    exitProcess: null as File | null
  });

  // Find the employee data based on the ID from URL
  const employee = employeesData.find(emp => emp.id === id);

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<EmployeeFormData>();

  // Load employee data when component mounts or employee changes
  useEffect(() => {
    if (employee) {
      reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        mobile: employee.mobile,
        deskExtension: employee.deskExtension,
        department: employee.department,
        designation: employee.designation,
        shift: employee.shift,
        employeeId: employee.employeeId,
        lateComing: employee.lateComing === 'Applicable',
        workType: employee.workType,
        building: employee.building,
        floor: employee.floor
      });
    }
  }, [employee, reset]);

  // If employee not found, show error message
  if (!employee) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Employee Not Found</h2>
          <p className="text-gray-600 mb-4">The employee with ID {id} was not found.</p>
          <Button onClick={() => navigate('/vas/space-management/setup/employees')}>
            Back to Employees
          </Button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/vas/space-management/setup/employees');
  };

  const onSubmit = (data: EmployeeFormData) => {
    console.log('Form submitted for employee:', employee.id, data);
    console.log('Attachments:', attachments);
    toast.success(`Employee ${employee.firstName} ${employee.lastName} updated successfully!`);
    // Here you would typically make an API call to update the employee
  };

  const handleFileUpload = (type: keyof typeof attachments, file: File | null) => {
    setAttachments(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const FileUploadSection = ({ 
    title, 
    type, 
    file 
  }: { 
    title: string; 
    type: keyof typeof attachments; 
    file: File | null; 
  }) => (
    <div className="border rounded-lg p-4">
      <h4 className="font-medium text-blue-600 mb-3">{title}</h4>
      <div className="flex items-center gap-2">
        <input
          type="file"
          id={type}
          className="hidden"
          onChange={(e) => handleFileUpload(type, e.target.files?.[0] || null)}
        />
        <label
          htmlFor={type}
          className="flex items-center gap-2 px-3 py-2 text-sm text-orange-600 border border-orange-200 rounded cursor-pointer hover:bg-orange-50"
        >
          Choose File
        </label>
        <span className="text-sm text-gray-500">
          {file ? file.name : 'No file chosen'}
        </span>
        {file && (
          <Button
            size="sm"
            variant="ghost"
            className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
            onClick={() => handleFileUpload(type, null)}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Button
        size="sm"
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>Employee</span>
            <span>&gt;</span>
            <span>Update Employee - {employee.firstName} {employee.lastName}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">
              UPDATE EMPLOYEE - {employee.firstName} {employee.lastName}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">1</span>
              </div>
              <h3 className="text-lg font-semibold text-orange-600">BASIC INFORMATION</h3>
            </div>
            
            <div className="grid grid-cols-5 gap-4">
              <div>
                <Label htmlFor="firstName">First Name*</Label>
                <Input
                  id="firstName"
                  {...register('firstName', { required: 'First name is required' })}
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                  <span className="text-red-500 text-sm">{errors.firstName.message}</span>
                )}
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name*</Label>
                <Input
                  id="lastName"
                  {...register('lastName', { required: 'Last name is required' })}
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                  <span className="text-red-500 text-sm">{errors.lastName.message}</span>
                )}
              </div>
              
              <div>
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email.message}</span>
                )}
              </div>
              
              <div>
                <Label htmlFor="mobile">Mobile*</Label>
                <Input
                  id="mobile"
                  {...register('mobile', { required: 'Mobile is required' })}
                  className={errors.mobile ? 'border-red-500' : ''}
                />
                {errors.mobile && (
                  <span className="text-red-500 text-sm">{errors.mobile.message}</span>
                )}
              </div>
              
              <div>
                <Label htmlFor="deskExtension">Desk Extension*</Label>
                <Input
                  id="deskExtension"
                  placeholder="Desk Extension"
                  {...register('deskExtension')}
                />
              </div>
            </div>
          </div>

          {/* Functional Details */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">2</span>
              </div>
              <h3 className="text-lg font-semibold text-orange-600">FUNCTIONAL DETAILS</h3>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="department">Department*</Label>
                <Select value={watch('department')} onValueChange={(value) => setValue('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Tech">Tech</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="designation">Designation*</Label>
                <Input
                  id="designation"
                  placeholder="Designation"
                  {...register('designation')}
                />
              </div>
              
              <div>
                <Label htmlFor="shift">Shift*</Label>
                <Select value={watch('shift')} onValueChange={(value) => setValue('shift', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00 AM to 06:00 PM">09:00 AM to 06:00 PM</SelectItem>
                    <SelectItem value="09:30 AM to 06:30 PM">09:30 AM to 06:30 PM</SelectItem>
                    <SelectItem value="10:00 AM to 07:00 PM">10:00 AM to 07:00 PM</SelectItem>
                    <SelectItem value="10:00 AM to 08:00 PM">10:00 AM to 08:00 PM</SelectItem>
                    <SelectItem value="10:30 AM to 06:30 PM">10:30 AM to 06:30 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="employeeId">Employee ID*</Label>
                <Input
                  id="employeeId"
                  {...register('employeeId')}
                />
              </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-2">
              <Checkbox
                id="lateComing"
                checked={watch('lateComing')}
                onCheckedChange={(checked) => setValue('lateComing', checked as boolean)}
              />
              <Label htmlFor="lateComing">Late Coming</Label>
              <span className="text-sm text-gray-500 ml-2">Applicable</span>
            </div>
          </div>

          {/* Seat Management */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">3</span>
              </div>
              <h3 className="text-lg font-semibold text-orange-600">Seat Management</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="workType">Work Type*</Label>
                <Select value={watch('workType')} onValueChange={(value) => setValue('workType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Work Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WFO">WFO</SelectItem>
                    <SelectItem value="WFH">WFH</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="building">Building*</Label>
                <Select value={watch('building')} onValueChange={(value) => setValue('building', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Building" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BBT A">BBT A</SelectItem>
                    <SelectItem value="Jyoti Tower">Jyoti Tower</SelectItem>
                    <SelectItem value="Lockated">Lockated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="floor">Floor*</Label>
                <Select value={watch('floor')} onValueChange={(value) => setValue('floor', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Floor">1st Floor</SelectItem>
                    <SelectItem value="2nd Floor">2nd Floor</SelectItem>
                    <SelectItem value="3rd Floor">3rd Floor</SelectItem>
                    <SelectItem value="4th Floor">4th Floor</SelectItem>
                    <SelectItem value="5th Floor">5th Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Upload className="text-white w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold text-orange-600">ATTACHMENTS</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <FileUploadSection
                title="On Boarding"
                type="onBoarding"
                file={attachments.onBoarding}
              />
              
              <FileUploadSection
                title="Employee Handbook"
                type="employeeHandbook"
                file={attachments.employeeHandbook}
              />
              
              <FileUploadSection
                title="Employee Compensation"
                type="employeeCompensation"
                file={attachments.employeeCompensation}
              />
              
              <FileUploadSection
                title="Exit Process"
                type="exitProcess"
                file={attachments.exitProcess}
              />
            </div>
            
            <div className="mt-6">
              <FileUploadSection
                title="Employee Management & Record Keeping"
                type="employeeManagement"
                file={attachments.employeeManagement}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button 
              type="submit"
              className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-2"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
