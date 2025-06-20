
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubCategory {
  id: number;
  category: string;
  subCategory: string;
  description: string;
  active: boolean;
}

interface EditSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  subCategory: SubCategory | null;
  onSubmit: (subCategory: SubCategory) => void;
}

const categories = ["Breakfast", "Lunch", "Dinner", "Snacks", "Beverages"];

export const EditSubCategoryModal = ({ 
  isOpen, 
  onClose, 
  subCategory, 
  onSubmit 
}: EditSubCategoryModalProps) => {
  const [formData, setFormData] = useState({
    category: "",
    subCategory: "",
    description: ""
  });

  useEffect(() => {
    if (subCategory) {
      setFormData({
        category: subCategory.category,
        subCategory: subCategory.subCategory,
        description: subCategory.description
      });
    }
  }, [subCategory]);

  const handleSubmit = () => {
    if (subCategory) {
      const updatedSubCategory: SubCategory = {
        ...subCategory,
        category: formData.category,
        subCategory: formData.subCategory,
        description: formData.description
      };
      
      onSubmit(updatedSubCategory);
    }
    setFormData({ category: "", subCategory: "", description: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit Sub Category</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-category" className="text-sm">
              Category
            </Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-subCategory" className="text-sm">
              SubCategory
            </Label>
            <Input
              id="edit-subCategory"
              value={formData.subCategory}
              onChange={(e) => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-sm">
              Description
            </Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full h-20 resize-none"
            />
          </div>
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
