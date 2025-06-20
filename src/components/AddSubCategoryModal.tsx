
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subCategory: { category: string; subCategory: string; description: string }) => void;
}

const categories = ["Breakfast", "Lunch", "Dinner", "Snacks", "Beverages"];

export const AddSubCategoryModal = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}: AddSubCategoryModalProps) => {
  const [formData, setFormData] = useState({
    category: "",
    subCategory: "",
    description: ""
  });

  const handleSubmit = () => {
    if (formData.category.trim() && formData.subCategory.trim()) {
      onSubmit(formData);
      setFormData({ category: "", subCategory: "", description: "" });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">ADD Category</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm">
              Category
            </Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subCategory" className="text-sm">
              SubCategory
            </Label>
            <Input
              id="subCategory"
              placeholder="Enter SubCategory"
              value={formData.subCategory}
              onChange={(e) => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full h-20 resize-none"
            />
          </div>
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
