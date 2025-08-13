import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkTypeData {
  id: string;
  staffType: string;
  workType: string;
  status: boolean;
  createdOn: string;
  createdBy: string;
}

interface EditWorkTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  workTypeData?: WorkTypeData;
  onUpdate: (data: WorkTypeData) => void;
}

export const EditWorkTypeModal = ({ isOpen, onClose, workTypeData, onUpdate }: EditWorkTypeModalProps) => {
  const [staffType, setStaffType] = useState('');
  const [workType, setWorkType] = useState('');
  const [status, setStatus] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (workTypeData && isOpen) {
      setStaffType(workTypeData.staffType);
      setWorkType(workTypeData.workType);
      setStatus(workTypeData.status);
    }
  }, [workTypeData, isOpen]);

  const handleSubmit = () => {
    if (!staffType || !workType.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (workTypeData) {
      const updatedData = {
        ...workTypeData,
        staffType,
        workType: workType.trim(),
        status
      };
      onUpdate(updatedData);
      toast({
        title: "Success",
        description: "Work type updated successfully",
      });
      onClose();
    }
  };

  const handleClose = () => {
    setStaffType('');
    setWorkType('');
    setStatus(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium text-gray-900">Edit Work Type</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="px-6 py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="staffType" className="text-sm font-medium text-gray-700">
              Staff Type
            </Label>
            <Select value={staffType} onValueChange={setStaffType}>
              <SelectTrigger>
                <SelectValue placeholder="Select staff type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Permanent Staff">Permanent Staff</SelectItem>
                <SelectItem value="Contract Staff">Contract Staff</SelectItem>
                <SelectItem value="Vendor Staff">Vendor Staff</SelectItem>
                <SelectItem value="Temporary Staff">Temporary Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workType" className="text-sm font-medium text-gray-700">
              Work Type
            </Label>
            <Input
              id="workType"
              placeholder="Enter work type"
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={status}
              onCheckedChange={setStatus}
            />
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
              Active
            </Label>
          </div>
        </div>

        <div className="flex justify-center px-6 py-4 border-t border-gray-200">
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-8"
            disabled={!staffType || !workType.trim()}
          >
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};