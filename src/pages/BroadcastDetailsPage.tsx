
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
    attachments: 0,
    sharedMembers: ['Godrej Living'],
    readBy: []
  };

  const handlePrint = () => {
    window.print();
  };

  const handleStatusChange = (newStatus: string) => {
    setBroadcastStatus(newStatus);
    console.log('Status changed to:', newStatus);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/crm/broadcast')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Broadcasts
          </Button>
        </div>
        <Button 
          onClick={handlePrint}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 text-sm"
        >
          PRINT
        </Button>
      </div>

      {/* Godrej Living Logo */}
      <div className="flex justify-center mb-6">
        <div className="text-center">
          <div className="text-pink-500 font-bold text-lg">Godrej | LIVING</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        {/* Title Header */}
        <div className="bg-cyan-400 text-white px-6 py-4 rounded-t-lg">
          <h1 className="text-xl font-bold text-center">{broadcastDetails.title}</h1>
        </div>

        <div className="p-6">
          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-700 mb-4">{broadcastDetails.description}</p>
            <div className="text-sm text-gray-600">
              <strong>Created by</strong>
              <br />
              {broadcastDetails.createdBy}
            </div>
          </div>

          {/* Status Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {broadcastDetails.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsStatusDialogOpen(true)}
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <Edit className="h-3 w-3 text-gray-500" />
                </Button>
              </div>
              <div className="text-xs text-gray-500 uppercase">STATUS TYPE</div>
            </div>

            <div className="space-y-2">
              <Badge variant="secondary" className="bg-blue-500 text-white">
                {broadcastDetails.type}
              </Badge>
              <div className="text-xs text-gray-500 uppercase">SHARE WITH</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">
                {broadcastDetails.createdOn} / {broadcastDetails.createdTime}
              </div>
              <div className="text-xs text-gray-500 uppercase">CREATED ON</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <div className="text-sm font-medium">
                {broadcastDetails.endDate} / {broadcastDetails.endTime}
              </div>
              <div className="text-xs text-gray-500 uppercase">END DATE & TIME</div>
            </div>

            <div className="space-y-2">
              <Badge variant="secondary" className="bg-green-500 text-white">
                Yes
              </Badge>
              <div className="text-xs text-gray-500 uppercase">IMPORTANT</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Attachments</span>
                <Badge variant="secondary" className="bg-blue-500 text-white text-xs">
                  {broadcastDetails.attachments}
                </Badge>
              </div>
            </div>
          </div>

          <hr className="my-6" />

          {/* Shared Members List */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Shared Members List</h3>
            <div className="text-sm text-gray-600">
              {broadcastDetails.sharedMembers.join(', ')}
            </div>
          </div>

          {/* Read By Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Read By</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Name</th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Site</th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Department</th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Designation</th>
                  </tr>
                </thead>
                <tbody>
                  {broadcastDetails.readBy.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-gray-500 text-sm">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    broadcastDetails.readBy.map((reader, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-4 text-sm">{reader}</td>
                        <td className="py-2 px-4 text-sm">-</td>
                        <td className="py-2 px-4 text-sm">-</td>
                        <td className="py-2 px-4 text-sm">-</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <hr className="my-6" />

          {/* Property Managed By */}
          <div className="text-center text-sm text-gray-600 mb-4">
            <strong>Property Managed By</strong>
          </div>

          {/* Footer branding */}
          <div className="text-center text-xs text-gray-500">
            <p>Powered by</p>
            <div className="flex items-center justify-center mt-1">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
                📍
              </div>
              <span className="font-semibold">LOCATED</span>
            </div>
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
