import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Edit } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChangeStatusDialog } from '@/components/ChangeStatusDialog';

export const BroadcastDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [broadcastStatus, setBroadcastStatus] = useState('Published');

  // Mock data - in a real app, this would be fetched based on the ID
  const broadcastDetails = {
    id: id || '1',
    title: 'Technical issue',
    description: 'Due to some technical issue the system not work properly',
    createdBy: 'Godrej Living',
    status: broadcastStatus,
    type: 'Personal',
    shareWith: 'Personal',
    createdOn: '24-04-2023',
    createdTime: '12:55 AM',
    endDate: '25-04-2023',
    endTime: '1:45 AM',
    isImportant: true,
    attachments: ['document1.pdf', 'image1.jpg'],
    sharedMembers: ['Godrej Living'],
    readBy: []
  };

  const handleStatusChange = (newStatus: string) => {
    setBroadcastStatus(newStatus);
    console.log('Status changed to:', newStatus);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/crm/broadcast')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Broadcasts
        </Button>
      </div>

      {/* Broadcast Details Section */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
            B
          </div>
          <h2 className="text-lg font-bold text-gray-900">BROADCAST DETAILS</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-3 gap-x-8 gap-y-4">
            <div>
              <span className="text-gray-500 text-sm">Broadcast ID</span>
              <p className="text-gray-900 font-medium">{broadcastDetails.id}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Created by</span>
              <p className="text-gray-900 font-medium">{broadcastDetails.createdBy}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Type</span>
              <p className="text-gray-900 font-medium">{broadcastDetails.type}</p>
            </div>
            
            <div>
              <span className="text-gray-500 text-sm">Title</span>
              <p className="text-gray-900 font-medium">{broadcastDetails.title}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Share With</span>
              <p className="text-gray-900 font-medium">{broadcastDetails.shareWith}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Created Date</span>
              <p className="text-gray-900 font-medium">{broadcastDetails.createdOn}</p>
            </div>
            
            <div>
              <span className="text-gray-500 text-sm">Status</span>
              <div className="flex items-center gap-2">
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {broadcastDetails.status}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsStatusDialogOpen(true)}
                  className="h-6 w-6 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Created Time</span>
              <p className="text-gray-900 font-medium">{broadcastDetails.createdTime}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">End Date</span>
              <p className="text-gray-900 font-medium">{broadcastDetails.endDate}</p>
            </div>
            
            <div>
              <span className="text-gray-500 text-sm">End Time</span>
              <p className="text-gray-900 font-medium">{broadcastDetails.endTime}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Important</span>
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {broadcastDetails.isImportant ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Description</span>
              <p className="text-gray-900 font-medium">{broadcastDetails.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attachments Section */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
          <h2 className="text-lg font-bold text-gray-900">ATTACHMENTS</h2>
        </div>
        
        <div className="p-6">
          {broadcastDetails.attachments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No attachments available for this broadcast.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {broadcastDetails.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                  <Download className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-900">{attachment}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Logs Section */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
            L
          </div>
          <h2 className="text-lg font-bold text-gray-900">LOGS</h2>
        </div>
        
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            No logs available for this broadcast.
          </div>
        </div>
      </div>

      {/* Change Status Dialog */}
      <ChangeStatusDialog
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        currentStatus={broadcastStatus}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};
