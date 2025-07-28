import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TextField } from '@mui/material';
import { X } from 'lucide-react';
const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'white',
    '& fieldset': {
      borderColor: '#e5e7eb'
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030'
    }
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    fontSize: '14px',
    '&.Mui-focused': {
      color: '#C72030'
    }
  },
  '& .MuiInputBase-input': {
    padding: '14px 16px',
    fontSize: '14px'
  }
};
interface RepairReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export const RepairReplaceModal: React.FC<RepairReplaceModalProps> = ({
  isOpen,
  onClose
}) => {
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
  return <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-md">
      <DialogHeader className="relative">
        <DialogTitle className="text-lg font-semibold text-gray-900">Asset Status Update</DialogTitle>
        <button onClick={onClose} className="absolute right-0 top-0 p-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 ">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
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
          <TextField label="Cost (In Rupees)" type="number" placeholder="" value={costInRupees} onChange={e => setCostInRupees(e.target.value)} fullWidth variant="outlined" sx={fieldStyles} InputProps={{
            startAdornment: <span className="text-gray-500 mr-2">{localStorage.getItem('currency')}</span>
          }} />
        </div>

        {/* Warranty */}
        <div className="space-y-2">
          <TextField label="Warranty (In Month)" type="number" placeholder="" value={warrantyInMonth} onChange={e => setWarrantyInMonth(e.target.value)} fullWidth variant="outlined" sx={fieldStyles} />
        </div>

        {/* In Use Reason */}
        <div className="space-y-2">
          <TextField label="In Use Reason" placeholder="" value={inUseReason} onChange={e => setInUseReason(e.target.value)} fullWidth variant="outlined" multiline rows={3} sx={fieldStyles} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSubmit} className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex-1">
            Submit
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>;
};