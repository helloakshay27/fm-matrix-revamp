
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Search, RotateCcw, FileText, Calendar } from "lucide-react";

export const EmployeeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock employee data - in real app this would be fetched based on id
  const employee = {
    id: '220274',
    employeeId: '9556',
    firstName: 'Test 12',
    lastName: 'Bulk',
    email: 'aaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com',
    mobile: '977XXXX411',
    userType: 'User',
    deskExtension: '',
    department: '',
    designation: '',
    lateComing: 'Not Applicable',
    shift: '',
    workType: '',
    seatType: '',
    building: '',
    floor: '',
    rosterGroup: ''
  };

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
            <p className="text-sm">: {employee.deskExtension || ''}</p>
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
              <span className="text-gray-600">Number of Days :</span>
            </div>
            <div>
              <span className="text-gray-600">Select Dates :</span>
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
            <p>updated the Access To from 2189 to [2189].</p>
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
            <p>No bookings to display</p>
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
            <p className="text-sm">: {employee.department || ''}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Late Coming</label>
            <p className="text-sm">: {employee.lateComing}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Designation</label>
            <p className="text-sm">: {employee.designation || ''}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Shift</label>
            <p className="text-sm">: {employee.shift || ''}</p>
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
              <span className="text-gray-600">Number of Days :</span>
            </div>
            <div>
              <span className="text-gray-600">Select Dates :</span>
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
            <p>updated the Access To from 2189 to [2189].</p>
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
            <p>No bookings to display</p>
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
            <p className="text-sm">: {employee.workType || ''}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Seat Type</label>
            <p className="text-sm">: {employee.seatType || ''}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Roster Group</label>
            <p className="text-sm">: {employee.rosterGroup || ''}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Building</label>
            <p className="text-sm">: {employee.building || ''}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Floor</label>
            <p className="text-sm">: {employee.floor || ''}</p>
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
              <span className="text-gray-600">Number of Days :</span>
            </div>
            <div>
              <span className="text-gray-600">Select Dates :</span>
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
            <p>updated the Access To from 2189 to [2189].</p>
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
            <p>No bookings to display</p>
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
        <h3 className="text-lg font-semibold text-orange-600">EMPLOYEE INFORMATION</h3>
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
        <h3 className="text-lg font-semibold text-orange-600">EMPLOYEE INFORMATION</h3>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-2" />
        </Button>
        <Button variant="outline" size="sm">
          <FileText className="w-4 h-4 mr-2" />
        </Button>
        <Button variant="outline" size="sm">
          <Calendar className="w-4 h-4 mr-2" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Date</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Punched In Time</TableHead>
              <TableHead>Punched Out Time</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                No attendance data available
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
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
            <span>Employee Details</span>
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
              EMPLOYEE DETAILS (ID: {employee.id})
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="basic-info" className="space-y-6">
          <TabsList className="bg-white border rounded-lg p-1">
            <TabsTrigger 
              value="basic-info" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Basic Info
            </TabsTrigger>
            <TabsTrigger 
              value="functional-details"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Functional Details
            </TabsTrigger>
            <TabsTrigger 
              value="seat-management"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Seat Management
            </TabsTrigger>
            <TabsTrigger 
              value="documents"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Documents
            </TabsTrigger>
            <TabsTrigger 
              value="attendance"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Attendance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info">
            <BasicInfoTab />
          </TabsContent>

          <TabsContent value="functional-details">
            <FunctionalDetailsTab />
          </TabsContent>

          <TabsContent value="seat-management">
            <SeatManagementTab />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsTab />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
