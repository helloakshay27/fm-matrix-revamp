
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CustomTextField } from '@/components/ui/custom-text-field';
import { useToast } from '@/hooks/use-toast';
import { X, Plus } from 'lucide-react';

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
      <DialogContent className="max-w-4xl w-full mx-auto p-0 bg-white rounded-none border-0">
        {/* Header with close button */}
        <div className="relative bg-white p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-6 left-6 p-0 bg-transparent border-0 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center ml-8">
            <div className="bg-[#C72030] text-white p-2 mr-3">
              <Plus size={16} />
            </div>
            <h2 className="text-[#C72030] text-xl font-semibold">ADD Category</h2>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-12 pb-12 space-y-6">
          {/* Category Dropdown */}
          <div className="w-full">
            <select className="w-full h-12 px-4 text-gray-600 bg-white border border-gray-300 rounded-md appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 4 5\"><path fill=\"%23666\" d=\"M2 0L0 2h4zm0 5L0 3h4z\"/></svg>')] bg-no-repeat bg-right bg-[length:12px] pr-8 focus:outline-none focus:border-[#C72030]">
              <option value="">Category</option>
            </select>
          </div>

          {/* SubCategory Input */}
          <div className="w-full">
            <input
              type="text"
              placeholder="SubCategory"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full h-12 px-4 text-gray-600 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-[#C72030] placeholder-gray-600"
            />
          </div>

          {/* Description Textarea */}
          <div className="w-full">
            <textarea
              placeholder="Description"
              rows={6}
              className="w-full px-4 py-3 text-gray-600 bg-white border border-gray-300 rounded-md resize-none focus:outline-none focus:border-[#C72030] placeholder-gray-600"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <Button 
              onClick={handleSubmit}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-12 py-3 text-base font-medium rounded-none border-0"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
