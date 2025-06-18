
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

interface UpdateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId: string;
}

export const UpdateIncidentModal: React.FC<UpdateIncidentModalProps> = ({
  isOpen,
  onClose,
  incidentId
}) => {
  const [updateData, setUpdateData] = useState({
    status: '',
    comment: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setUpdateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = () => {
    console.log('Updating incident:', incidentId, updateData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Update Status</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-auto p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={updateData.status} 
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Comment</Label>
            <Textarea
              value={updateData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              placeholder="Message"
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleUpdate}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90 px-8"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
