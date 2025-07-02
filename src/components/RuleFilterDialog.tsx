
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface RuleFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RuleFilterDialog = ({ open, onOpenChange }: RuleFilterDialogProps) => {
  const [masterAttribute, setMasterAttribute] = useState('');
  const [subAttribute, setSubAttribute] = useState('');

  const handleSubmit = () => {
    console.log('Filter submitted:', { masterAttribute, subAttribute });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setMasterAttribute('');
    setSubAttribute('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-200">
          <DialogTitle className="text-lg font-medium text-gray-900">Filter By</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Attributes Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Attributes</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Master Attribute */}
              <div className="space-y-2">
                <Label htmlFor="masterAttribute" className="text-sm font-medium text-gray-700">
                  Master Attribute<span className="text-red-500">*</span>
                </Label>
                <Select value={masterAttribute} onValueChange={setMasterAttribute}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Master Attribute" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase-amount">Purchase Amount</SelectItem>
                    <SelectItem value="customer-tier">Customer Tier</SelectItem>
                    <SelectItem value="product-category">Product Category</SelectItem>
                    <SelectItem value="frequency">Purchase Frequency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sub Attribute */}
              <div className="space-y-2">
                <Label htmlFor="subAttribute" className="text-sm font-medium text-gray-700">
                  Sub Attribute<span className="text-red-500">*</span>
                </Label>
                <Select value={subAttribute} onValueChange={setSubAttribute}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Sub Attribute" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimum-spend">Minimum Spend</SelectItem>
                    <SelectItem value="maximum-spend">Maximum Spend</SelectItem>
                    <SelectItem value="gold-tier">Gold Tier</SelectItem>
                    <SelectItem value="silver-tier">Silver Tier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <Button
              onClick={handleSubmit}
              className="bg-[#8B4B6B] hover:bg-[#7A4260] text-white px-8 py-2 rounded-md"
            >
              Submit
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2 rounded-md"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
