
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface BusinessFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BusinessFilterModal = ({ isOpen, onClose }: BusinessFilterModalProps) => {
  const [filters, setFilters] = useState({
    category: "",
    subCategory: ""
  });

  const handleApply = () => {
    console.log("Applying filters:", filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({ category: "", subCategory: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
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

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Category</Label>
            <Select 
              value={filters.category} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internet-services">Internet Services</SelectItem>
                <SelectItem value="electricity">Electricity</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="laptop-repairer">Laptop Repairer</SelectItem>
                <SelectItem value="print-media">Print & Media</SelectItem>
                <SelectItem value="ac-repairing">AC Repairing</SelectItem>
                <SelectItem value="drinking-water">Drinking Water Supplier</SelectItem>
                <SelectItem value="plumber">Plumber</SelectItem>
                <SelectItem value="stationary">Stationary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Sub Category</Label>
            <Select 
              value={filters.subCategory} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, subCategory: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Sub Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sub1">Sub Category 1</SelectItem>
                <SelectItem value="sub2">Sub Category 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button 
            onClick={handleApply}
            className="bg-purple-700 hover:bg-purple-800 text-white px-6"
          >
            Apply
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="px-6"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
