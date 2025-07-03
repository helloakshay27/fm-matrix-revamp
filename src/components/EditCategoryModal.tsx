
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField } from '@mui/material';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: number;
  category: string;
  timings?: string;
  amount?: string;
  active: boolean;
}

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSubmit: (category: Category) => void;
  showTimings?: boolean;
  showAmount?: boolean;
}

export const EditCategoryModal = ({ 
  isOpen, 
  onClose, 
  category, 
  onSubmit, 
  showTimings = true, 
  showAmount = false 
}: EditCategoryModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    category: "",
    timings: "",
    amount: ""
  });

  useEffect(() => {
    if (category) {
      setFormData({
        category: category.category,
        timings: category.timings || "",
        amount: category.amount || ""
      });
    }
  }, [category]);

  const handleSubmit = () => {
    if (category) {
      const updatedCategory: Category = {
        ...category,
        category: formData.category
      };
      
      if (showTimings) {
        updatedCategory.timings = formData.timings;
      }
      
      if (showAmount) {
        updatedCategory.amount = formData.amount;
      }
      
      onSubmit(updatedCategory);
      toast({
        title: "Success",
        description: "Category updated successfully!",
      });
    }
    setFormData({ category: "", timings: "", amount: "" });
    onClose();
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
          <DialogTitle className="text-lg font-semibold">Edit Status</DialogTitle>
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
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
