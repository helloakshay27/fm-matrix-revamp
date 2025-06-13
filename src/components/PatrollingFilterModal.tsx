
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface PatrollingFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatrollingFilterModal = ({ isOpen, onClose }: PatrollingFilterModalProps) => {
  const [building, setBuilding] = useState('');
  const [wing, setWing] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');

  const handleSubmit = () => {
    console.log('Filter applied:', { building, wing, floor, room });
    onClose();
  };

  const handleReset = () => {
    setBuilding('');
    setWing('');
    setFloor('');
    setRoom('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-4">
          <div className="text-sm text-orange-600 font-medium mb-4">Location Details</div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="building" className="text-sm font-medium">
                Building
              </Label>
              <Select value={building} onValueChange={setBuilding}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jyoti-tower">Jyoti Tower</SelectItem>
                  <SelectItem value="nirvana-tower">Nirvana Tower</SelectItem>
                  <SelectItem value="hay">Hay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wing" className="text-sm font-medium">
                Wing
              </Label>
              <Select value={wing} onValueChange={setWing}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Wing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">A Wing</SelectItem>
                  <SelectItem value="b">B Wing</SelectItem>
                  <SelectItem value="na">NA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="floor" className="text-sm font-medium">
                Floor
              </Label>
              <Select value={floor} onValueChange={setFloor}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st">1st Floor</SelectItem>
                  <SelectItem value="2nd">2nd Floor</SelectItem>
                  <SelectItem value="na">NA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room" className="text-sm font-medium">
              Room
            </Label>
            <Select value={room} onValueChange={setRoom}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select Room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="na">NA</SelectItem>
                <SelectItem value="room1">Room 1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2"
            >
              Reset
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white px-6 py-2"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
