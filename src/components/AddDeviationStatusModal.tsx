
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField } from '@mui/material';
import { FormSearchSelect, type FormSearchSelectOption } from '@/components/FormSearchSelect';
import { useToast } from '@/hooks/use-toast';

interface AddDeviationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddDeviationStatusModal = ({ isOpen, onClose }: AddDeviationStatusModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    status: "",
    fixedState: "",
    order: "",
    color: "#000000"
  });

  const handleSubmit = () => {
    console.log("Adding deviation status:", formData);
    toast({
      title: "Success",
      description: "Deviation status added successfully!",
    });
    onClose();
  };

  const fieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '6px',
      backgroundColor: '#FFFFFF',
      height: 45,
      '& fieldset': {
        borderColor: '#E0E0E0',
      },
      '&:hover fieldset': {
        borderColor: '#1A1A1A',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--color-primary)',
        borderWidth: 2,
      },
    },
    '& .MuiInputLabel-root': {
      color: '#1A1A1A',
      fontWeight: 500,
      '&.Mui-focused': {
        color: 'var(--color-primary)',
      },
    },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: '12px 14px',
      fontSize: '14px',
    },
  };

  const fixedStateOptions: FormSearchSelectOption[] = [
    { value: 'state1', label: 'State 1' },
    { value: 'state2', label: 'State 2' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add Deviation Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Status"
              placeholder="Enter status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />

            <div className="pt-1">
              <FormSearchSelect
                label="Fixed State"
                value={formData.fixedState}
                onChange={(value) => setFormData(prev => ({ ...prev, fixedState: value }))}
                options={fixedStateOptions}
                placeholder="Select Fixed State"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Status Order"
              placeholder="Enter status order"
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value }))}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Color</label>
              <div className="h-[45px] rounded-md border border-[#E0E0E0] px-3 flex items-center gap-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="h-8 w-12 cursor-pointer border-0 bg-transparent p-0"
                />
                <span className="text-sm text-gray-600">{formData.color.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleSubmit}
            className="bg-brand hover:bg-brand-hover text-white px-8"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
