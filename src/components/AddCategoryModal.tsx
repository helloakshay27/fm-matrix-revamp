
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CustomTextField } from '@/components/ui/custom-text-field';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

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
  const [errors, setErrors] = useState({
    category: "",
    timings: "",
    amount: ""
  });

  const validateForm = () => {
    const newErrors = { category: "", timings: "", amount: "" };
    let isValid = true;

    if (!formData.category.trim()) {
      newErrors.category = "Category name is required";
      isValid = false;
    }

    if (showTimings && !formData.timings.trim()) {
      newErrors.timings = "Timings are required";
      isValid = false;
    }

    if (showAmount && !formData.amount.trim()) {
      newErrors.amount = "Amount is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
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
      setErrors({ category: "", timings: "", amount: "" });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({ category: "", timings: "", amount: "" });
    setErrors({ category: "", timings: "", amount: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto p-6">
        <DialogHeader className="relative pb-4">
          <button
            onClick={handleClose}
            className="absolute -top-2 -left-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
          
          <DialogTitle className="text-lg font-semibold text-center">
            <div className="flex items-center justify-center gap-2">
              <div 
                className="w-6 h-6 rounded-sm flex items-center justify-center"
                style={{ backgroundColor: '#C72030' }}
              >
                <span className="text-white text-xs font-bold">+</span>
              </div>
              <span style={{ color: '#C72030' }} className="uppercase tracking-wide">
                ADD CATEGORY
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <CustomTextField
              label="Category Name"
              placeholder="Enter Category Name"
              value={formData.category}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, category: e.target.value }));
                if (errors.category) {
                  setErrors(prev => ({ ...prev, category: "" }));
                }
              }}
              fullWidth
              error={!!errors.category}
            />
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          {showTimings && (
            <div>
              <CustomTextField
                label="Timings"
                placeholder="Enter Timings"
                value={formData.timings}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, timings: e.target.value }));
                  if (errors.timings) {
                    setErrors(prev => ({ ...prev, timings: "" }));
                  }
                }}
                fullWidth
                error={!!errors.timings}
              />
              {errors.timings && (
                <p className="text-red-500 text-xs mt-1">{errors.timings}</p>
              )}
            </div>
          )}

          {showAmount && (
            <div>
              <CustomTextField
                label="Amount"
                placeholder="Enter Amount"
                value={formData.amount}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, amount: e.target.value }));
                  if (errors.amount) {
                    setErrors(prev => ({ ...prev, amount: "" }));
                  }
                }}
                fullWidth
                error={!!errors.amount}
              />
              {errors.amount && (
                <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-center pt-6">
          <button
            onClick={handleSubmit}
            className="bg-[#C72030] hover:bg-[#A01B28] text-white font-medium px-8 py-2.5 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:ring-opacity-50"
          >
            SUBMIT
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
