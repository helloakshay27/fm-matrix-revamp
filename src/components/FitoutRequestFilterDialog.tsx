
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface FitoutRequestFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FitoutRequestFilterDialog = ({ isOpen, onClose }: FitoutRequestFilterDialogProps) => {
  const handleApply = () => {
    console.log('Applying filters...');
    onClose();
  };

  const handleReset = () => {
    console.log('Resetting filters...');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">OPTIONS</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Category Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Type</Label>
            <RadioGroup defaultValue="ppm" className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ppm" id="fitout-ppm" className="border-red-500 text-red-500" />
                <Label htmlFor="fitout-ppm" className="text-sm font-medium">PPM</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="amc" id="fitout-amc" />
                <Label htmlFor="fitout-amc" className="text-sm font-medium">AMC</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="preparedness" id="fitout-preparedness" />
                <Label htmlFor="fitout-preparedness" className="text-sm font-medium">Preparedness</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hoto" id="fitout-hoto" />
                <Label htmlFor="fitout-hoto" className="text-sm font-medium">Hoto</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="routine" id="fitout-routine" />
                <Label htmlFor="fitout-routine" className="text-sm font-medium">Routine</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Additional Filter Options */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="renovation">Renovation</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="flooring">Flooring</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Unit</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unit-101">Unit 101</SelectItem>
                  <SelectItem value="unit-102">Unit 102</SelectItem>
                  <SelectItem value="unit-103">Unit 103</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button 
            onClick={handleApply}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
          >
            Apply
          </Button>
          <Button 
            variant="outline"
            onClick={handleReset}
            className="px-8 border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
