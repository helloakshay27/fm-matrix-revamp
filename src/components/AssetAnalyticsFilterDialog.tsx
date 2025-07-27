import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MaterialDatePicker } from '@/components/ui/material-date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface AssetAnalyticsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: { 
    startDate: string; 
    endDate: string; 
    assetTypes: string[];
    statusTypes: string[];
    categories: string[];
  }) => void;
}

export const AssetAnalyticsFilterDialog: React.FC<AssetAnalyticsFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilters
}) => {
  // Set default dates: last year to today
  const getDefaultDates = () => {
    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);
    
    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
    
    return {
      startDate: formatDate(lastYear),
      endDate: formatDate(today)
    };
  };

  const defaultDates = getDefaultDates();
  const [startDate, setStartDate] = useState<string>(defaultDates.startDate);
  const [endDate, setEndDate] = useState<string>(defaultDates.endDate);
  const [selectedAssetTypes, setSelectedAssetTypes] = useState<string[]>([]);
  const [selectedStatusTypes, setSelectedStatusTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const assetTypes = [
    { id: 'it', label: 'IT Assets' },
    { id: 'non-it', label: 'Non-IT Assets' },
    { id: 'furniture', label: 'Furniture & Fixtures' },
    { id: 'machinery', label: 'Machinery & Equipment' },
    { id: 'vehicles', label: 'Vehicles' },
    { id: 'tools', label: 'Tools & Instruments' }
  ];

  const statusTypes = [
    { id: 'in_use', label: 'In Use' },
    { id: 'breakdown', label: 'Breakdown' },
    { id: 'in_storage', label: 'In Storage' },
    { id: 'disposed', label: 'Disposed' },
    { id: 'under_maintenance', label: 'Under Maintenance' }
  ];

  const categories = [
    { id: 'critical', label: 'Critical Assets' },
    { id: 'high-value', label: 'High Value Assets' },
    { id: 'warranty', label: 'Under Warranty' },
    { id: 'expired-warranty', label: 'Expired Warranty' },
    { id: 'ppm-due', label: 'PPM Due' }
  ];

  const handleAssetTypeToggle = (typeId: string) => {
    setSelectedAssetTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleStatusTypeToggle = (statusId: string) => {
    setSelectedStatusTypes(prev =>
      prev.includes(statusId)
        ? prev.filter(id => id !== statusId)
        : [...prev, statusId]
    );
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = () => {
    if (startDate && endDate) {
      onApplyFilters({ 
        startDate, 
        endDate,
        assetTypes: selectedAssetTypes,
        statusTypes: selectedStatusTypes,
        categories: selectedCategories
      });
      onClose();
    }
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setSelectedAssetTypes([]);
    setSelectedStatusTypes([]);
    setSelectedCategories([]);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Filter Asset Analytics
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                Start Date
              </Label>
              <MaterialDatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="Select start date"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                End Date
              </Label>
              <MaterialDatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="Select end date"
                className="w-full"
              />
            </div>
          </div>

          {/* Asset Types */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Asset Types</Label>
            <div className="grid grid-cols-2 gap-2">
              {assetTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.id}
                    checked={selectedAssetTypes.includes(type.id)}
                    onCheckedChange={() => handleAssetTypeToggle(type.id)}
                  />
                  <label
                    htmlFor={type.id}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Status Types */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Status Types</Label>
            <div className="grid grid-cols-2 gap-2">
              {statusTypes.map((status) => (
                <div key={status.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={status.id}
                    checked={selectedStatusTypes.includes(status.id)}
                    onCheckedChange={() => handleStatusTypeToggle(status.id)}
                  />
                  <label
                    htmlFor={status.id}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {status.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Categories</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <label
                    htmlFor={category.id}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {category.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="px-4 py-2"
          >
            Reset
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!startDate || !endDate}
            className="px-4 py-2 bg-[#C72030] hover:bg-[#B71C2C] text-white"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};