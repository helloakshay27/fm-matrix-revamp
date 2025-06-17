
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export const TicketDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const ticketData = {
    id: '2189-11106',
    title: 'test',
    ticketNo: '2189-11106',
    category: 'Air Conditioner',
    subCategory: 'test',
    referenceNumber: '',
    createdOn: '16/06/2025 5:17 PM',
    status: 'Pending',
    adminPriority: 'p1',
    createdBy: 'Abhishek Sharma',
    site: 'Lockated',
    department: 'Technician',
    unit: '',
    region: 'east',
    city: 'Pune',
    state: 'Maharashtra',
    building: '',
    room: '',
    area: '',
    zone: 'Mumbai',
    district: 'Mumbai',
    address: '2nd Floor, Jyoti Tower, Opp. Versova Police Station, Andheri (W)',
    floor: '',
    wing: '',
    assignedTo: 'Vinayak Mane',
    externalPriority: '',
    receivedTracking: '',
    correctionAction: '',
    preventiveAction: '',
    impact: '',
    rootCause: '',
    taskId: '',
    notes: '',
    proactiveReactive: 'Proactive',
    serviceType: '',
    complaintMode: 'Call',
    responsiblePerson: '',
    connection: '',
    assetService: '',
    assetServiceLocation: ''
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/maintenance/ticket')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ticket List
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>Ticket</span>
            <span>&gt;</span>
            <span>Ticket Details</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">TICKET DETAILS</h1>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button 
            onClick={() => navigate(`/maintenance/ticket/${id}/feeds`)}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            Feeds
          </Button>
          <Button 
            onClick={() => navigate(`/maintenance/ticket/${id}/tag-vendor`)}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            Tag Vendor
          </Button>
          <Button 
            variant="outline"
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            Create Task
          </Button>
        </div>

        {/* Ticket Details Section */}
        <Card className="mb-6">
          <CardHeader className="bg-orange-50">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
              TICKET DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Title</label>
                <p className="text-sm mt-1">{ticketData.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Created on</label>
                <p className="text-sm mt-1">{ticketData.createdOn}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Ticket No.</label>
                <p className="text-sm mt-1">{ticketData.ticketNo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  <Badge className="bg-yellow-100 text-yellow-800">{ticketData.status}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Category</label>
                <p className="text-sm mt-1">{ticketData.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Admin Priority</label>
                <p className="text-sm mt-1">{ticketData.adminPriority}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">SubCategory</label>
                <p className="text-sm mt-1">{ticketData.subCategory}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Reference Number</label>
                <p className="text-sm mt-1">{ticketData.referenceNumber || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Creator's Information Section */}
        <Card className="mb-6">
          <CardHeader className="bg-orange-50">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
              CREATOR'S INFORMATION
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Created By</label>
                <p className="text-sm mt-1">{ticketData.createdBy}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Department</label>
                <p className="text-sm mt-1">{ticketData.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Site</label>
                <p className="text-sm mt-1">{ticketData.site}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Unit</label>
                <p className="text-sm mt-1">{ticketData.unit || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Information Section */}
        <Card className="mb-6">
          <CardHeader className="bg-orange-50">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
              LOCATION INFORMATION
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Region</label>
                <p className="text-sm mt-1">{ticketData.region}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Zone</label>
                <p className="text-sm mt-1">{ticketData.zone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">City</label>
                <p className="text-sm mt-1">{ticketData.city}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">District</label>
                <p className="text-sm mt-1">{ticketData.district}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">State</label>
                <p className="text-sm mt-1">{ticketData.state}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-sm mt-1">{ticketData.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Building</label>
                <p className="text-sm mt-1">{ticketData.building || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Floor</label>
                <p className="text-sm mt-1">{ticketData.floor || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Room</label>
                <p className="text-sm mt-1">{ticketData.room || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Wing</label>
                <p className="text-sm mt-1">{ticketData.wing || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Area</label>
                <p className="text-sm mt-1">{ticketData.area || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information Section */}
        <Card className="mb-6">
          <CardHeader className="bg-orange-50">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">4</span>
              ADDITIONAL INFORMATION
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Assigned To</label>
                <p className="text-sm mt-1">{ticketData.assignedTo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">External Priority</label>
                <p className="text-sm mt-1">{ticketData.externalPriority || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Proactive/Reactive</label>
                <p className="text-sm mt-1">{ticketData.proactiveReactive}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Received Tracking</label>
                <p className="text-sm mt-1">{ticketData.receivedTracking || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Service Type</label>
                <p className="text-sm mt-1">{ticketData.serviceType || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Correction Action</label>
                <p className="text-sm mt-1">{ticketData.correctionAction || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Complaint Mode</label>
                <p className="text-sm mt-1">{ticketData.complaintMode}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Preventive Action</label>
                <p className="text-sm mt-1">{ticketData.preventiveAction || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Responsible Person</label>
                <p className="text-sm mt-1">{ticketData.responsiblePerson || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Connection</label>
                <p className="text-sm mt-1">{ticketData.connection || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Root Cause</label>
                <p className="text-sm mt-1">{ticketData.rootCause || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Asset/Service</label>
                <p className="text-sm mt-1">{ticketData.assetService || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Impact</label>
                <p className="text-sm mt-1">{ticketData.impact || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Asset/Service Location</label>
                <p className="text-sm mt-1">{ticketData.assetServiceLocation || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Task ID</label>
                <p className="text-sm mt-1">{ticketData.taskId || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Notes</label>
                <p className="text-sm mt-1">{ticketData.notes || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attachments Section */}
        <Card className="mb-6">
          <CardHeader className="bg-orange-50">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">5</span>
              ATTACHMENTS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">0</p>
          </CardContent>
        </Card>

        {/* Cost Approval Request Section */}
        <Card>
          <CardHeader className="bg-orange-50">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">6</span>
              COST APPROVAL REQUEST
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2 text-left text-sm">Request ID</th>
                    <th className="border border-gray-300 p-2 text-left text-sm">Amount</th>
                    <th className="border border-gray-300 p-2 text-left text-sm">Comments</th>
                    <th className="border border-gray-300 p-2 text-left text-sm">Created On</th>
                    <th className="border border-gray-300 p-2 text-left text-sm">Created By</th>
                    <th className="border border-gray-300 p-2 text-left text-sm">L1</th>
                    <th className="border border-gray-300 p-2 text-left text-sm">L2</th>
                    <th className="border border-gray-300 p-2 text-left text-sm">L3</th>
                    <th className="border border-gray-300 p-2 text-left text-sm">L4</th>
                    <th className="border border-gray-300 p-2 text-left text-sm">L5</th>
                    <th className="border border-gray-300 p-2 text-left text-sm">Master Status</th>
                    <th className="border border-gray-300 p-2 text-left text-sm">Cancelled By</th>
                    <th className="border border-gray-300 p-2 text-left text-sm">Action</th>
                    <th className="border border-gray-300 p-2 text-left text-sm">Attachment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2 text-sm" colSpan={14}>
                      No data available
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
