
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface PatrollingFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatrollingFilterModal = ({ isOpen, onClose }: PatrollingFilterModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle>FILTER BY</DialogTitle>
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
          <div>
            <Label className="text-sm font-medium text-orange-600">Location Details</Label>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="building">Building</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="building1">Building 1</SelectItem>
                  <SelectItem value="building2">Building 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="wing">Wing</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Wing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wing1">Wing A</SelectItem>
                  <SelectItem value="wing2">Wing B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="floor">Floor</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="floor1">Floor 1</SelectItem>
                  <SelectItem value="floor2">Floor 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="room">Room</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="room1">Room 1</SelectItem>
                  <SelectItem value="room2">Room 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button 
              style={{ backgroundColor: '#C72030' }}
              className="hover:bg-[#C72030]/90 text-white px-8"
              onClick={onClose}
            >
              Submit
            </Button>
            <Button 
              variant="outline" 
              className="px-8"
              onClick={onClose}
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
