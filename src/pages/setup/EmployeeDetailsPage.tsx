import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Search, RotateCcw, FileText, Calendar } from "lucide-react";

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

export const EmployeeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Find the employee data based on the ID from URL
  const employee = employeesData.find(emp => emp.id === id);

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

  const BasicInfoTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">👤</span>
          </div>
          <h3 className="text-lg font-semibold text-orange-600">EMPLOYEE INFORMATION</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">First Name</label>
            <p className="text-sm">: {employee.firstName}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Last Name</label>
            <p className="text-sm">: {employee.lastName}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <p className="text-sm break-all">: {employee.email}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Mobile No.</label>
            <p className="text-sm">: {employee.mobile}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Desk Extension</label>
            <p className="text-sm">: {employee.deskExtension || 'Not Assigned'}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">User Type</label>
            <p className="text-sm">: {employee.userType}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <h4 className="font-semibold text-orange-600">ROSTER</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Roster Group: {employee.rosterGroup}</span>
            </div>
            <div>
              <span className="text-gray-600">Shift: {employee.shift}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <h4 className="font-semibold text-orange-600">LOGS</h4>
          </div>
          <div className="text-sm text-gray-600">
            <p>Employee details updated for {employee.firstName} {employee.lastName}.</p>
            <p className="text-xs">09 Jun, 2025, 5:19 PM</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <h4 className="font-semibold text-orange-600">LIST OF BOOKINGS</h4>
          </div>
          <div className="text-sm text-gray-600">
            <p>No bookings to display for {employee.firstName}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const FunctionalDetailsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">👤</span>
          </div>
          <h3 className="text-lg font-semibold text-orange-600">EMPLOYEE INFORMATION</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Department</label>
            <p className="text-sm">: {employee.department}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Late Coming</label>
            <p className="text-sm">: {employee.lateComing}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Designation</label>
            <p className="text-sm">: {employee.designation}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Shift</label>
            <p className="text-sm">: {employee.shift}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Employee ID</label>
            <p className="text-sm">: {employee.employeeId || 'Not Assigned'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <h4 className="font-semibold text-orange-600">ROSTER</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Roster Group: {employee.rosterGroup}</span>
            </div>
            <div>
              <span className="text-gray-600">Shift: {employee.shift}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <h4 className="font-semibold text-orange-600">LOGS</h4>
          </div>
          <div className="text-sm text-gray-600">
            <p>Employee details updated for {employee.firstName} {employee.lastName}.</p>
            <p className="text-xs">09 Jun, 2025, 5:19 PM</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <h4 className="font-semibold text-orange-600">LIST OF BOOKINGS</h4>
          </div>
          <div className="text-sm text-gray-600">
            <p>No bookings to display for {employee.firstName}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const SeatManagementTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">👤</span>
          </div>
          <h3 className="text-lg font-semibold text-orange-600">EMPLOYEE INFORMATION</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Work Type</label>
            <p className="text-sm">: {employee.workType}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Seat Type</label>
            <p className="text-sm">: {employee.seatType}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Roster Group</label>
            <p className="text-sm">: {employee.rosterGroup}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Building</label>
            <p className="text-sm">: {employee.building}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Floor</label>
            <p className="text-sm">: {employee.floor}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <h4 className="font-semibold text-orange-600">ROSTER</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Roster Group: {employee.rosterGroup}</span>
            </div>
            <div>
              <span className="text-gray-600">Shift: {employee.shift}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <h4 className="font-semibold text-orange-600">LOGS</h4>
          </div>
          <div className="text-sm text-gray-600">
            <p>Employee details updated for {employee.firstName} {employee.lastName}.</p>
            <p className="text-xs">09 Jun, 2025, 5:19 PM</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <h4 className="font-semibold text-orange-600">LIST OF BOOKINGS</h4>
          </div>
          <div className="text-sm text-gray-600">
            <p>No bookings to display for {employee.firstName}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const DocumentsTab = () => (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">👤</span>
        </div>
        <h3 className="text-lg font-semibold text-orange-600">EMPLOYEE INFORMATION - {employee.firstName} {employee.lastName}</h3>
      </div>
      
      <div className="grid grid-cols-5 gap-4">
        {[
          { title: 'On Boarding', count: '0 Items', color: 'bg-orange-100 text-orange-600' },
          { title: 'Employee Handbook', count: '0 Items', color: 'bg-orange-100 text-orange-600' },
          { title: 'Employee Compensation', count: '0 Items', color: 'bg-orange-100 text-orange-600' },
          { title: 'Employee Management & Record keeping', count: '0 Items', color: 'bg-orange-100 text-orange-600' },
          { title: 'Exit Process', count: '0 Items', color: 'bg-orange-100 text-orange-600' }
        ].map((doc, index) => (
          <div key={index} className={`p-4 rounded-lg ${doc.color}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <h4 className="font-medium text-sm">{doc.title}</h4>
            </div>
            <p className="text-sm">{doc.count}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const AttendanceTab = () => (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">👤</span>
        </div>
        <h3 className="text-lg font-semibold text-orange-600">ATTENDANCE - {employee.firstName} {employee.lastName}</h3>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search attendance records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      <div className="text-center py-8 text-gray-500">
        <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No attendance records found for {employee.firstName} {employee.lastName}</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              onClick={handleBack}
              variant="ghost" 
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <div className="text-sm text-gray-500 mb-1">Space &gt; Employees &gt; Employee Details</div>
              <h1 className="text-2xl font-bold text-gray-800">
                {employee.firstName} {employee.lastName} - Employee Details
              </h1>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="basic-info" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
            <TabsTrigger value="functional-details">Functional Details</TabsTrigger>
            <TabsTrigger value="seat-management">Seat Management</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic-info" className="mt-6">
            <BasicInfoTab />
          </TabsContent>
          
          <TabsContent value="functional-details" className="mt-6">
            <FunctionalDetailsTab />
          </TabsContent>
          
          <TabsContent value="seat-management" className="mt-6">
            <SeatManagementTab />
          </TabsContent>
          
          <TabsContent value="documents" className="mt-6">
            <DocumentsTab />
          </TabsContent>
          
          <TabsContent value="attendance" className="mt-6">
            <AttendanceTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
