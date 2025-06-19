
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WOFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WOFilterDialog: React.FC<WOFilterDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Work Order</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>WO Number</Label>
            <Input placeholder="Enter WO Number" />
          </div>
          
          <div>
            <Label>Reference Number</Label>
            <Input placeholder="Enter Reference Number" />
          </div>
          
          <div>
            <Label>Supplier Name</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="abc">ABC</SelectItem>
                <SelectItem value="xyz">XYZ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Status</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Created By</Label>
            <Input placeholder="Enter Name" />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              className="flex-1 bg-[#C72030] hover:bg-[#A01020] text-white"
              onClick={() => onOpenChange(false)}
            >
              Apply
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
