
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { AssetTableDisplay } from '@/components/AssetTableDisplay';
import { MovementToSection } from '@/components/MovementToSection';
import { AllocateToSection } from '@/components/AllocateToSection';

interface MoveAssetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAssets: any[];
}

export const MoveAssetDialog: React.FC<MoveAssetDialogProps> = ({
  isOpen,
  onClose,
  selectedAssets
}) => {
  const [allocateTo, setAllocateTo] = useState('department');
  const [site, setSite] = useState('');
  const [building, setBuilding] = useState('');
  const [wing, setWing] = useState('');
  const [area, setArea] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [department, setDepartment] = useState('');

  const handleSubmit = () => {
    console.log('Moving assets:', selectedAssets);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[75vw] 2xl:max-w-[70vw] max-h-[90vh] flex flex-col">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
              MOVE ASSET
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <AssetTableDisplay selectedAssets={selectedAssets} />
          
          <MovementToSection
            site={site}
            setSite={setSite}
            building={building}
            setBuilding={setBuilding}
            wing={wing}
            setWing={setWing}
            area={area}
            setArea={setArea}
            floor={floor}
            setFloor={setFloor}
            room={room}
            setRoom={setRoom}
          />

          <AllocateToSection
            allocateTo={allocateTo}
            setAllocateTo={setAllocateTo}
            department={department}
            setDepartment={setDepartment}
          />

          {/* Attachment Section */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Attachment</h3>
            <div className="flex items-center">
              <input
                type="file"
                id="attachment"
                className="hidden"
              />
              <label
                htmlFor="attachment"
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded cursor-pointer text-sm"
              >
                Choose File
              </label>
              <span className="ml-3 text-sm text-gray-500">No file chosen</span>
            </div>
          </div>

          {/* Remarks Section */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Remarks</h3>
            <textarea
              placeholder="Add Remarks"
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Submit Button - Fixed at bottom */}
        <div className="border-t border-gray-200 px-4 sm:px-6 py-4 flex justify-center flex-shrink-0 bg-white">
          <Button 
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700 text-white px-8 sm:px-12 py-2 text-sm font-medium rounded-none w-full sm:w-auto"
          >
            SUBMIT
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
