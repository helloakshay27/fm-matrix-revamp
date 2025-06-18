
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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
    priority: '',
    assignedTo: '',
    comments: ''
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
        <DialogHeader>
          <DialogTitle>Update Incident Status</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={updateData.status} 
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
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
            <Label>Priority</Label>
            <Select 
              value={updateData.priority} 
              onValueChange={(value) => handleInputChange('priority', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Assign To</Label>
            <Select 
              value={updateData.assignedTo} 
              onValueChange={(value) => handleInputChange('assignedTo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john-doe">John Doe</SelectItem>
                <SelectItem value="jane-smith">Jane Smith</SelectItem>
                <SelectItem value="safety-team">Safety Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Comments</Label>
            <Textarea
              value={updateData.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              placeholder="Add update comments..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90 flex-1"
            >
              Update
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
