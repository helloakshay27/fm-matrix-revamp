import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserAssociationModal } from '@/components/UserAssociationModal';

interface SnaggingItem {
  id: number;
  checklistName: string;
  tower: string;
  floor: string;
  flat: string;
  roomType: string;
  stage: string;
  noOfQuestions: number;
}

export const SnaggingDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const item: SnaggingItem = location.state?.item || {
    id: parseInt(id || '1'),
    checklistName: 'civil point',
    tower: 'A',
    floor: '3rd',
    flat: '301',
    roomType: 'Living Room',
    stage: 'Units Snagging',
    noOfQuestions: 6
  };

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg sm:text-xl font-semibold mb-1">
          {item.tower} {item.floor} {item.flat}
        </h1>
        <h2 className="text-base sm:text-lg font-medium">
          Checklist {item.checklistName}
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Left Side - Room Info */}
        <div className="w-full md:w-1/3">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Rooms</h3>
            <Card className="bg-[#F6F4EE]">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="text-lg font-semibold">3 BHK</div>
                  <div className="text-sm text-gray-600">{item.roomType}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - User Association Button */}
        <div className="w-full md:flex-1 flex md:justify-end">
          <Button
            onClick={() => setIsUserModalOpen(true)}
            style={{ backgroundColor: '#C72030' }}
            className="hover:bg-[#C72030]/90 text-white w-full md:w-auto px-6 py-2"
          >
            Users Associated
          </Button>
        </div>
      </div>

      {/* User Association Modal */}
      <UserAssociationModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        checklistName={item.checklistName}
      />
    </div>
  );
};
