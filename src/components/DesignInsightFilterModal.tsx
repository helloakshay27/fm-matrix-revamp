import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ResponsiveDatePicker } from "@/components/ui/responsive-date-picker";
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { X } from 'lucide-react';

interface DesignInsightFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: FilterState) => void;
}

interface FilterState {
  dateRange: string;
  zone: string;
  category: string;
  subCategory: string;
  mustHave: string;
  createdBy: string;
}

export const DesignInsightFilterModal: React.FC<DesignInsightFilterModalProps> = ({ 
  isOpen, 
  onClose, 
  onApplyFilters 
}) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterState>({
    dateRange: '',
    zone: '',
    category: '',
    subCategory: '',
    mustHave: '',
    createdBy: ''
  });

  // Sample data for suggestions - in real app this would come from API/props
  const zoneSuggestions = ['Mumbai', 'NCR', 'Bangalore', 'Chennai', 'Delhi'];
  const categorySuggestions = ['Landscape', 'Façade', 'Security & surveillance', 'Inside Units', 'Electrical', 'Plumbing'];
  const subCategorySuggestions = ['Access Control', 'CCTV', 'Bedroom', 'Entry-Exit', 'Kitchen', 'Bathroom'];
  const createdBySuggestions = ['Sony Bhosle', 'Robert Day2', 'Sanket Patil', 'Devesh Jain', 'Admin User'];

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    console.log(`Filter ${field} changed to:`, value);
  };

  const handleDateChange = (date: Date) => {
    const formattedDate = format(date, 'dd/MM/yyyy');
    handleFilterChange('dateRange', formattedDate);
  };

  const handleApply = () => {
    console.log('Applying filters:', filters);
    
    // Check if any filters are selected
    const hasActiveFilters = Object.values(filters).some(value => value !== '');
    
    if (!hasActiveFilters) {
      toast({
        title: "No filters selected",
        description: "Please select at least one filter to apply.",
        variant: "destructive"
      });
      return;
    }

    // Call the callback function to apply filters
    if (onApplyFilters) {
      onApplyFilters(filters);
    }

    toast({
      title: "Success",
      description: "Filters applied successfully!",
    });
    
    onClose();
  };

  const handleReset = () => {
    setFilters({
      dateRange: '',
      zone: '',
      category: '',
      subCategory: '',
      mustHave: '',
      createdBy: ''
    });
    
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Filter Design Insights</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="dateRange">Date Range</Label>
            <ResponsiveDatePicker
              value={filters.dateRange ? new Date(filters.dateRange.split('/').reverse().join('-')) : undefined}
              onChange={handleDateChange}
              placeholder="Select Date Range"
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zone">Zone</Label>
            <Select value={filters.zone} onValueChange={(value) => handleFilterChange('zone', value)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select Zone" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-md z-50">
                {zoneSuggestions.map((zone) => (
                  <SelectItem key={zone} value={zone.toLowerCase()}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-md z-50">
                {categorySuggestions.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subCategory">Sub-category</Label>
            <Select value={filters.subCategory} onValueChange={(value) => handleFilterChange('subCategory', value)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select Sub Category" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-md z-50">
                {subCategorySuggestions.map((subCategory) => (
                  <SelectItem key={subCategory} value={subCategory.toLowerCase()}>
                    {subCategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mustHave">Must have</Label>
            <Select value={filters.mustHave} onValueChange={(value) => handleFilterChange('mustHave', value)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-md z-50">
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="createdBy">Created by</Label>
            <Select value={filters.createdBy} onValueChange={(value) => handleFilterChange('createdBy', value)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-md z-50">
                {createdBySuggestions.map((creator) => (
                  <SelectItem key={creator} value={creator.toLowerCase()}>
                    {creator}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button 
            variant="outline"
            onClick={handleReset}
            className="px-6"
          >
            Reset
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white px-8"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
