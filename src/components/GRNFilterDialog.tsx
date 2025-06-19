
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GRNFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GRNFilterDialog: React.FC<GRNFilterDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filter GRN/SRN</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Supplier Name</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="abc">ABC</SelectItem>
                <SelectItem value="xyz">XYZ Corporation</SelectItem>
                <SelectItem value="achla">ACHLA Corporation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>PO Number</Label>
            <Input placeholder="Enter PO Number" />
          </div>
          
          <div>
            <Label>GRN Number</Label>
            <Input placeholder="Enter GRN Number" />
          </div>
          
          <div>
            <Label>Status</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Date From</Label>
            <Input type="date" />
          </div>
          
          <div>
            <Label>Date To</Label>
            <Input type="date" />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              className="flex-1 bg-[#C72030] hover:bg-[#A01020] text-white"
              onClick={() => onOpenChange(false)}
            >
              Apply Filter
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
