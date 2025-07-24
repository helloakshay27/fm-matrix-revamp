
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Download, Mail, Phone } from 'lucide-react';

export const TrainingRecordDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - in real app, this would be fetched based on the ID
  const trainingRecord = {
    id: '1',
    srNo: 1,
    typeOfUser: 'SSO',
    fullName: 'John Doe',
    email: 'john.doe@company.com',
    mobileNumber: '+1234567890',
    companyName: 'ABC Corp',
    empId: 'EMP001',
    function: 'Engineering',
    role: 'Safety Manager',
    cluster: 'North',
    circle: 'Circle A',
    workLocation: 'Office Building A',
    trainingName: 'Fire Safety Training',
    typeOfTraining: 'Internal',
    trainingDate: '2025-01-15',
    status: 'Completed',
    trainingDuration: '4 hours',
    instructor: 'Mr. Smith Johnson',
    completionCertificate: 'FST-2025-001',
    notes: 'Employee successfully completed all modules and passed the final assessment.'
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'In Progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'Scheduled':
        return <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/safety/training-list')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Training List
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{trainingRecord.fullName} - Training Details</h1>
          <p className="text-gray-600">Training Record #{trainingRecord.srNo}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button 
            onClick={() => navigate(`/safety/training-list/edit/${id}`)}
            className="bg-[#C72030] hover:bg-[#A01020] flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Record
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#C72030]">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="font-medium">{trainingRecord.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Employee ID</label>
                  <p className="font-medium">{trainingRecord.empId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{trainingRecord.email}</p>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Mail className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Mobile Number</label>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{trainingRecord.mobileNumber}</p>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Phone className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type of User</label>
                  <p className="font-medium">{trainingRecord.typeOfUser}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Company Name</label>
                  <p className="font-medium">{trainingRecord.companyName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#C72030]">Work Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Function</label>
                  <p className="font-medium">{trainingRecord.function}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <p className="font-medium">{trainingRecord.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Cluster</label>
                  <p className="font-medium">{trainingRecord.cluster}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Circle</label>
                  <p className="font-medium">{trainingRecord.circle}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Work Location</label>
                  <p className="font-medium">{trainingRecord.workLocation}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#C72030]">Training Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Training Name</label>
                  <p className="font-medium">{trainingRecord.trainingName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type of Training</label>
                  <Badge variant={trainingRecord.typeOfTraining === 'Internal' ? 'default' : 'secondary'}>
                    {trainingRecord.typeOfTraining}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Training Date</label>
                  <p className="font-medium">{trainingRecord.trainingDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Duration</label>
                  <p className="font-medium">{trainingRecord.trainingDuration}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Instructor</label>
                  <p className="font-medium">{trainingRecord.instructor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Certificate Number</label>
                  <p className="font-medium">{trainingRecord.completionCertificate}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <p className="font-medium">{trainingRecord.notes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Training Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Current Status</label>
                  <div className="mt-1">
                    {getStatusBadge(trainingRecord.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Serial Number</label>
                  <p className="font-medium text-lg">{trainingRecord.srNo}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Certificate
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Reminder
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Schedule Follow-up
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
