
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm">
              Category
            </Label>
            <Input
              id="category"
              placeholder="Enter Category Name"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full"
            />
          </div>

          {showTimings && (
            <div className="space-y-2">
              <Label htmlFor="timings" className="text-sm">
                Timings
              </Label>
              <Input
                id="timings"
                placeholder="Enter Timings"
                value={formData.timings}
                onChange={(e) => setFormData(prev => ({ ...prev, timings: e.target.value }))}
                className="w-full"
              />
            </div>
          )}

          {showAmount && (
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm">
                Amount
              </Label>
              <Input
                id="amount"
                placeholder="Enter Amount"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full"
              />
            </div>
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
