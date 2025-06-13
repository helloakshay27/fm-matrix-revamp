
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface ProjectFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectFilterModal = ({ isOpen, onClose }: ProjectFilterModalProps) => {
  const [filters, setFilters] = useState({
    category: "",
    unit: "",
    status: ""
  });

  const handleApply = () => {
    console.log("Applying filters:", filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({ category: "", unit: "", status: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select 
              value={filters.category} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="flooring">Flooring</SelectItem>
                <SelectItem value="painting">Painting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Unit</Label>
            <Select 
              value={filters.unit} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, unit: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unit-a1">Unit A1</SelectItem>
                <SelectItem value="unit-a2">Unit A2</SelectItem>
                <SelectItem value="unit-b1">Unit B1</SelectItem>
                <SelectItem value="unit-b2">Unit B2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={filters.status} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button 
            onClick={handleApply}
            className="bg-purple-700 hover:bg-purple-800 text-white px-8"
          >
            Apply
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="px-8"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
