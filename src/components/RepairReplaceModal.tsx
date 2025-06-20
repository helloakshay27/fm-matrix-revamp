
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface RepairReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RepairReplaceModal: React.FC<RepairReplaceModalProps> = ({ isOpen, onClose }) => {
  const [actionType, setActionType] = useState('repaired');
  const [costInRupees, setCostInRupees] = useState('');
  const [warrantyInMonth, setWarrantyInMonth] = useState('');
  const [inUseReason, setInUseReason] = useState('');

  const handleSubmit = () => {
    const data = {
      actionType,
      costInRupees,
      warrantyInMonth,
      inUseReason
    };
    console.log('Repair/Replace data:', data);
    onClose();
  };

  const handleReset = () => {
    setActionType('repaired');
    setCostInRupees('');
    setWarrantyInMonth('');
    setInUseReason('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">Asset Status Update</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Action Type */}
          <div>
            <RadioGroup value={actionType} onValueChange={setActionType} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="repaired" id="repaired" />
                <Label htmlFor="repaired">Repaired</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="replaced" id="replaced" />
                <Label htmlFor="replaced">Replaced</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Cost */}
          <div className="space-y-2">
            <Label htmlFor="cost" className="text-sm font-medium">Cost (In Rupees )</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <Input
                id="cost"
                type="number"
                placeholder=""
                value={costInRupees}
                onChange={(e) => setCostInRupees(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Warranty */}
          <div className="space-y-2">
            <Label htmlFor="warranty" className="text-sm font-medium">Warranty (In Month)</Label>
            <Input
              id="warranty"
              type="number"
              placeholder=""
              value={warrantyInMonth}
              onChange={(e) => setWarrantyInMonth(e.target.value)}
            />
          </div>

          {/* In Use Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">In Use Reason</Label>
            <Textarea
              id="reason"
              placeholder=""
              value={inUseReason}
              onChange={(e) => setInUseReason(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSubmit}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex-1"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
