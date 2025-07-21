
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, FileText, Paperclip, Download, Eye } from 'lucide-react';

export const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBackToList = () => {
    navigate('/maintenance/ticket');
  };

  const handleFeeds = () => {
    navigate(`/maintenance/ticket/${id}/feeds`);
  };

  const handleTagVendor = () => {
    navigate(`/maintenance/ticket/${id}/tag-vendor`);
  };

  const handleCreateTask = () => {
    console.log('Create task clicked');
  };

  // Enhanced ticket data with all required fields
  const ticketData = {
    id: id || '2189-11106',
    title: 'test',
    status: 'Pending',
    createdOn: '16/06/2025 5:17 PM',
    category: 'Air Conditioner',
    adminPriority: 'p1',
    subCategory: 'test',
    referenceNumber: '-',
    createdBy: 'Abhishek Sharma',
    department: 'Technician',
    site: 'Lockated',
    
    // Location Information
    locationInfo: {
      site: 'Lockated',
      city: 'Mumbai',
      state: 'Maharashtra',
      building: 'Tower A',
      district: 'Andheri West',
      address: '123 Main Street, Andheri West',
      floor: '10th Floor',
      wing: 'A Wing',
      room: 'A-1001'
    },
    
    // Survey Information
    surveyInfo: {
      name: 'Customer Satisfaction Survey',
      surveyType: 'Post Resolution',
      surveyStatus: 'Pending',
      assignedTo: 'Survey Team'
    },
    
    // Additional Information
    additionalInfo: {
      assignedTo: 'John Doe',
      externalPriority: 'High',
      serviceFrequency: 'Monthly',
      paymentFrequency: 'Quarterly',
      preventiveAction: 'Regular maintenance check',
      responsiblePerson: 'Maintenance Team',
      rootCause: 'Equipment aging',
      assetService: 'HVAC Maintenance',
      taskId: 'TSK-2189-001',
      vendor: 'ABC Services Ltd',
      assetServiceLocation: 'Building A - 10th Floor'
    }
  };

  // Mock attachments data
  const attachments = [
    { id: 1, name: 'ticket_image_1.jpg', size: '2.5 MB', type: 'image', uploadedBy: 'Abhishek Sharma', uploadedOn: '16/06/2025 5:20 PM' },
    { id: 2, name: 'maintenance_report.pdf', size: '1.8 MB', type: 'pdf', uploadedBy: 'Abhishek Sharma', uploadedOn: '16/06/2025 5:25 PM' },
    { id: 3, name: 'invoice_copy.pdf', size: '980 KB', type: 'pdf', uploadedBy: 'John Doe', uploadedOn: '16/06/2025 6:00 PM' }
  ];

  // Mock cost approval data
  const costApprovalData = [
    {
      requestId: 'CAR-2189-001',
      amount: '₹15,000',
      comments: 'Replacement of AC compressor',
      createdOn: '16/06/2025 5:30 PM',
      createdBy: 'Abhishek Sharma',
      l1: 'Approved',
      l2: 'Approved',
      l3: 'Pending',
      l4: '-',
      l5: '-',
      masterStatus: 'In Progress',
      cancelledBy: '-',
      attachment: 'quotation.pdf'
    },
    {
      requestId: 'CAR-2189-002',
      amount: '₹8,500',
      comments: 'Additional spare parts',
      createdOn: '17/06/2025 10:15 AM',
      createdBy: 'John Doe',
      l1: 'Approved',
      l2: 'Pending',
      l3: '-',
      l4: '-',
      l5: '-',
      masterStatus: 'Pending',
      cancelledBy: '-',
      attachment: 'parts_list.pdf'
    }
  ];

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button onClick={handleBackToList} className="flex items-center gap-1 hover:text-[#C72030] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Ticket List</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Ticket</span>
          <span>&gt;</span>
          <span>Ticket Details</span>
        </div>
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">TICKET DETAILS</h1>
          <div className="flex gap-3">
            <Button onClick={handleFeeds} style={{ backgroundColor: '#C72030' }} className="text-white hover:bg-[#C72030]/90">
              Feeds
            </Button>
            <Button onClick={handleTagVendor} style={{ backgroundColor: '#C72030' }} className="text-white hover:bg-[#C72030]/90">
              Tag Vendor
            </Button>
            <Button onClick={handleCreateTask} style={{ backgroundColor: '#C72030' }} className="text-white hover:bg-[#C72030]/90">
              Create Task
            </Button>
          </div>
        </div>
      </div>

      {/* Section 1: Ticket Details */}
      <Card className="mb-6">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#C72030' }}>1</div>
            TICKET DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Title</label>
                <p className="font-medium">{ticketData.title}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Status</label>
                <Badge className="bg-yellow-100 text-yellow-700">{ticketData.status}</Badge>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">SubCategory</label>
                <p className="font-medium">{ticketData.subCategory}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Created on</label>
                <p className="font-medium">{ticketData.createdOn}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Category</label>
                <p className="font-medium">{ticketData.category}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Reference Number</label>
                <p className="font-medium">{ticketData.referenceNumber}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Ticket No.</label>
                <p className="font-medium">{ticketData.id}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Admin Priority</label>
                <p className="font-medium">{ticketData.adminPriority}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Creator's Information */}
      <Card className="mb-6">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#C72030' }}>2</div>
            CREATOR'S INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Created By</label>
              <p className="font-medium">{ticketData.createdBy}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Department</label>
              <p className="font-medium">{ticketData.department}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Site</label>
              <p className="font-medium">{ticketData.site}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Location Information */}
      <Card className="mb-6">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#C72030' }}>3</div>
            LOCATION INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Site</label>
                <p className="font-medium">{ticketData.locationInfo.site}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Building</label>
                <p className="font-medium">{ticketData.locationInfo.building}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Floor</label>
                <p className="font-medium">{ticketData.locationInfo.floor}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">City</label>
                <p className="font-medium">{ticketData.locationInfo.city}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">District</label>
                <p className="font-medium">{ticketData.locationInfo.district}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Wing</label>
                <p className="font-medium">{ticketData.locationInfo.wing}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">State</label>
                <p className="font-medium">{ticketData.locationInfo.state}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Address</label>
                <p className="font-medium">{ticketData.locationInfo.address}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Room</label>
                <p className="font-medium">{ticketData.locationInfo.room}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Survey Information */}
      <Card className="mb-6">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#C72030' }}>4</div>
            SURVEY INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Name</label>
              <p className="font-medium">{ticketData.surveyInfo.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Survey Type</label>
              <p className="font-medium">{ticketData.surveyInfo.surveyType}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Status</label>
              <Badge className="bg-yellow-100 text-yellow-700">{ticketData.surveyInfo.surveyStatus}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Additional Information */}
      <Card className="mb-6">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#C72030' }}>5</div>
            ADDITIONAL INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Assigned To</label>
                <p className="font-medium">{ticketData.additionalInfo.assignedTo}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Service Frequency</label>
                <p className="font-medium">{ticketData.additionalInfo.serviceFrequency}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Preventive Action</label>
                <p className="font-medium">{ticketData.additionalInfo.preventiveAction}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Root Cause</label>
                <p className="font-medium">{ticketData.additionalInfo.rootCause}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">External Priority</label>
                <p className="font-medium">{ticketData.additionalInfo.externalPriority}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Payment Frequency</label>
                <p className="font-medium">{ticketData.additionalInfo.paymentFrequency}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Responsible Person</label>
                <p className="font-medium">{ticketData.additionalInfo.responsiblePerson}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Asset Service</label>
                <p className="font-medium">{ticketData.additionalInfo.assetService}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Task ID</label>
                <p className="font-medium">{ticketData.additionalInfo.taskId}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Vendor</label>
                <p className="font-medium">{ticketData.additionalInfo.vendor}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Asset/Service Location</label>
                <p className="font-medium">{ticketData.additionalInfo.assetServiceLocation}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Attachments */}
      <Card className="mb-6">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#C72030' }}>6</div>
            ATTACHMENTS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {attachments.length > 0 ? (
            <div className="space-y-3">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Paperclip className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-sm">{attachment.name}</p>
                      <p className="text-xs text-gray-500">
                        {attachment.size} • Uploaded by {attachment.uploadedBy} on {attachment.uploadedOn}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No attachments found</p>
          )}
        </CardContent>
      </Card>

      {/* Section 7: Cost Approval Request */}
      <Card>
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#C72030' }}>7</div>
            COST APPROVAL REQUEST
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>L1</TableHead>
                  <TableHead>L2</TableHead>
                  <TableHead>L3</TableHead>
                  <TableHead>L4</TableHead>
                  <TableHead>L5</TableHead>
                  <TableHead>Master Status</TableHead>
                  <TableHead>Cancelled By</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Attachment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costApprovalData.map((request, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{request.requestId}</TableCell>
                    <TableCell>{request.amount}</TableCell>
                    <TableCell>{request.comments}</TableCell>
                    <TableCell>{request.createdOn}</TableCell>
                    <TableCell>{request.createdBy}</TableCell>
                    <TableCell>
                      <Badge className={request.l1 === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                        {request.l1}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={request.l2 === 'Approved' ? 'bg-green-100 text-green-700' : request.l2 === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}>
                        {request.l2}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={request.l3 === 'Approved' ? 'bg-green-100 text-green-700' : request.l3 === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}>
                        {request.l3}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.l4}</TableCell>
                    <TableCell>{request.l5}</TableCell>
                    <TableCell>
                      <Badge className={request.masterStatus === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                        {request.masterStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.cancelledBy}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-1" />
                        {request.attachment}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
