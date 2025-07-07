
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus } from 'lucide-react';

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
    // Handle create task functionality
    console.log('Create task clicked');
  };

  // Mock ticket data - in real app this would come from API
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
    site: 'Lockated'
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button 
            onClick={handleBackToList}
            className="flex items-center gap-1 hover:text-[#C72030] transition-colors"
          >
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
            <Button 
              onClick={handleFeeds}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              Feeds
            </Button>
            <Button 
              onClick={handleTagVendor}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              Tag Vendor
            </Button>
            <Button 
              onClick={handleCreateTask}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              Create Task
            </Button>
          </div>
        </div>
      </div>

      {/* Ticket Details Section */}
      <Card className="mb-6">
        <CardHeader className="bg-orange-50 border-b">
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

      {/* Creator's Information Section */}
      <Card>
        <CardHeader className="bg-orange-50 border-b">
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
    </div>
  );
};
