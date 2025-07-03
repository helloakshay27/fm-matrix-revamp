
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField } from '@mui/material';
import { useToast } from '@/hooks/use-toast';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: { category: string; timings?: string; amount?: string }) => void;
  showTimings?: boolean;
  showAmount?: boolean;
}

export const AddCategoryModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  showTimings = true, 
  showAmount = false 
}: AddCategoryModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    category: "",
    timings: "",
    amount: ""
  });

  const handleSubmit = () => {
    if (formData.category.trim()) {
      const submitData: { category: string; timings?: string; amount?: string } = {
        category: formData.category
      };
      
      if (showTimings) {
        submitData.timings = formData.timings;
      }
      
      if (showAmount) {
        submitData.amount = formData.amount;
      }
      
      onSubmit(submitData);
      toast({
        title: "Success",
        description: "Category added successfully!",
      });
      setFormData({ category: "", timings: "", amount: "" });
      onClose();
    }
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">ADD Category</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <TextField
            placeholder="Enter Category Name"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />

          {showTimings && (
            <TextField
              placeholder="Enter Timings"
              value={formData.timings}
              onChange={(e) => setFormData(prev => ({ ...prev, timings: e.target.value }))}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          )}

          {showAmount && (
            <TextField
              placeholder="Enter Amount"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          )}
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleSubmit}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
