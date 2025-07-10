
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CustomTextField } from '@/components/ui/custom-text-field';
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">ADD Category</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <CustomTextField
            label="Category Name"
            placeholder="Enter Category Name"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            fullWidth
          />

          {showTimings && (
            <CustomTextField
              label="Timings"
              placeholder="Enter Timings"
              value={formData.timings}
              onChange={(e) => setFormData(prev => ({ ...prev, timings: e.target.value }))}
              fullWidth
            />
          )}

          {showAmount && (
            <CustomTextField
              label="Amount"
              placeholder="Enter Amount"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              fullWidth
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
