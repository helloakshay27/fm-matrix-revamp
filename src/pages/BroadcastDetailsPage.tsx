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
    <div className="p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">{broadcastDetails.title}</h1>
      </div>

      {/* Broadcast Details Section */}
      <div className="bg-card rounded-lg border mb-6">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-semibold text-foreground">B</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">BROADCAST DETAILS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">{broadcastDetails.id}</div>
              <div className="text-xs text-muted-foreground">Broadcast ID</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">{broadcastDetails.createdBy}</div>
              <div className="text-xs text-muted-foreground">Created by</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">{broadcastDetails.createdOn}</div>
              <div className="text-xs text-muted-foreground">Created Date</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">{broadcastDetails.description}</div>
              <div className="text-xs text-muted-foreground">Message</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">{broadcastDetails.type}</div>
              <div className="text-xs text-muted-foreground">Type</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">{broadcastDetails.endDate}</div>
              <div className="text-xs text-muted-foreground">End Date</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={broadcastStatus === 'Published' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                >
                  {broadcastStatus}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsStatusDialogOpen(true)}
                  className="h-6 w-6 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">Status</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">{broadcastDetails.shareWith}</div>
              <div className="text-xs text-muted-foreground">Share With</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">{broadcastDetails.createdTime}</div>
              <div className="text-xs text-muted-foreground">Created Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Attachments Section */}
      <div className="bg-card rounded-lg border mb-6">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-semibold text-foreground">A</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">ATTACHMENTS</h2>
          </div>

          <div className="text-center text-muted-foreground">
            {broadcastDetails.attachments.length === 0 ? (
              <p>No attachments available for this broadcast.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {broadcastDetails.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{attachment}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logs Section */}
      <div className="bg-card rounded-lg border">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-semibold text-foreground">L</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">LOGS</h2>
          </div>

          <div className="text-center text-muted-foreground">
            <p>No logs available for this broadcast.</p>
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
