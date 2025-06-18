
import React, { useState } from 'react';
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

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EmployeeFormData>({
    defaultValues: {
      firstName: 'Test 12',
      lastName: 'Bulk',
      email: 'aaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com',
      mobile: '9774545411',
      deskExtension: '',
      department: '',
      designation: '',
      shift: '',
      employeeId: '9556',
      lateComing: false,
      workType: '',
      building: '',
      floor: ''
    }
  });

  const handleBack = () => {
    navigate('/vas/space-management/setup/employees');
  };

  const onSubmit = (data: EmployeeFormData) => {
    console.log('Form submitted:', data);
    console.log('Attachments:', attachments);
    toast.success('Employee updated successfully!');
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
            <span>Update Employee</span>
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
              UPDATE EMPLOYEE
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
                <Select onValueChange={(value) => setValue('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
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
                <Select onValueChange={(value) => setValue('shift', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
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
                <Select onValueChange={(value) => setValue('workType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Work Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="building">Building*</Label>
                <Select onValueChange={(value) => setValue('building', value)}>
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
                <Label htmlFor="floor">Floor*</Label>
                <Select onValueChange={(value) => setValue('floor', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ground">Ground Floor</SelectItem>
                    <SelectItem value="first">First Floor</SelectItem>
                    <SelectItem value="second">Second Floor</SelectItem>
                    <SelectItem value="third">Third Floor</SelectItem>
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
