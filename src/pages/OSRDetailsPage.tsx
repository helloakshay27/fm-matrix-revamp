import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { ScheduleSecondVisitDialog } from '@/components/ScheduleSecondVisitDialog';
import { CancelOSRDialog } from '@/components/CancelOSRDialog';
import { EditOSRDialog } from '@/components/EditOSRDialog';
import { CloseOSRDialog } from '@/components/CloseOSRDialog';

export const OSRDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  // Sample data - in real app this would come from API based on ID
  const osrDetails = {
    id: '1244',
    status: 'Work Pending',
    placedOn: '23/06/2025 6:32 PM',
    placedBy: 'Godrej Living / FM - Office',
    category: 'Mosquito Mesh Starts from (per sq. ft.)',
    subCategory: 'Residential Apartments',
    flatNumber: 'FM - Office',
    assignedTo: 'Test Test',
    scheduleDate: '24/06/2025',
    scheduleSlot: '17:00 to 18:00',
    paymentMethod: 'Payment pending',
    amountPaid: '',
    paymentStatus: 'Payment Pending',
    transactionId: '',
    logs: [
      {
        user: 'Godrej Hisociety',
        action: 'made below changes',
        timestamp: '23/06/2025/ 8:03 PM',
        status: 'Work Pending',
        assignedTo: 'Test Test',
        comment: 'test'
      }
    ]
  };

  const handleScheduleSecondVisit = (data: any) => {
    console.log('Schedule second visit:', data);
    setShowScheduleDialog(false);
  };

  const handleCancel = (reason: string) => {
    console.log('Cancel OSR:', reason);
    setShowCancelDialog(false);
  };

  const handleEdit = (data: any) => {
    console.log('Edit OSR:', data);
    setShowEditDialog(false);
  };

  const handleCloseOSR = () => {
    console.log('OSR closed successfully');
    navigate('/vas/osr');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/vas/osr')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to OSR Dashboard
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button onClick={() => setShowCloseDialog(true)}>
            Close OSR
          </Button>
          <Button 
            onClick={() => setShowScheduleDialog(true)}
            className="bg-[#17a2b8] hover:bg-[#17a2b8]/90"
          >
            Schedule Second Visit
          </Button>
          <Button 
            onClick={() => setShowCancelDialog(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => setShowEditDialog(true)}
            className="bg-orange-500 hover:bg-orange-600 ml-auto"
          >
            Edit
          </Button>
        </div>

        {/* OSR Details Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge className="bg-orange-100 text-orange-800">
                    {osrDetails.status}
                  </Badge>
                </div>

                <div>
                  <span className="text-sm text-gray-600">ID:</span>
                  <p className="font-medium">{osrDetails.id}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Placed on</span>
                  <p className="font-medium">{osrDetails.placedOn}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Category:</span>
                  <p className="font-medium text-blue-600">{osrDetails.category}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Sub-Category:</span>
                  <p className="font-medium">{osrDetails.subCategory}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Schedule Date:</span>
                  <p className="font-medium">{osrDetails.scheduleDate}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Schedule Slot:</span>
                  <p className="font-medium">{osrDetails.scheduleSlot}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Amount Paid</span>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Payment Status</span>
                  <p className="font-medium">{osrDetails.paymentStatus}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Transaction Id</span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-600">Placed by:</span>
                  <p className="font-medium">{osrDetails.placedBy}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Flat Number:</span>
                  <p className="font-medium">{osrDetails.flatNumber}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Assigned To:</span>
                  <p className="font-medium">{osrDetails.assignedTo}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <p className="font-medium">{osrDetails.paymentMethod}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs Section */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Logs</h3>
            {osrDetails.logs.map((log, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{log.user} {log.action}</p>
                    <div className="mt-2 space-y-1">
                      <p><span className="font-medium">Status</span> - {log.status}</p>
                      <p><span className="font-medium">Assigned to</span> - {log.assignedTo}</p>
                      <p><span className="font-medium">Comment</span></p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{log.timestamp}</span>
                </div>
                <div className="mt-2 bg-gray-100 p-2 rounded text-sm">
                  {log.comment}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-600">
            Powered by <span className="font-semibold">LOCKATED</span>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ScheduleSecondVisitDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        onSubmit={handleScheduleSecondVisit}
      />

      <CancelOSRDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onSubmit={handleCancel}
      />

      <EditOSRDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        osrDetails={osrDetails}
        onSubmit={handleEdit}
      />

      <CloseOSRDialog
        isOpen={showCloseDialog}
        onClose={() => setShowCloseDialog(false)}
        onConfirm={handleCloseOSR}
      />
    </div>
  );
};
