
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface PermitFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterData) => void;
}

interface FilterData {
  permitId: string;
  permitType: string;
  vendorName: string;
}

export const PermitFilterModal: React.FC<PermitFilterModalProps> = ({
  isOpen,
  onClose,
  onApply
}) => {
  const [filterData, setFilterData] = useState<FilterData>({
    permitId: '',
    permitType: '',
    vendorName: ''
  });

  const handleInputChange = (field: keyof FilterData, value: string) => {
    setFilterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onApply(filterData);
    onClose();
  };

  const handleReset = () => {
    setFilterData({
      permitId: '',
      permitType: '',
      vendorName: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-auto p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Permit Id</Label>
              <Input
                value={filterData.permitId}
                onChange={(e) => handleInputChange('permitId', e.target.value)}
                placeholder="Search By Permit Id"
              />
            </div>
            <div className="space-y-2">
              <Label>Permit Type</Label>
              <Input
                value={filterData.permitType}
                onChange={(e) => handleInputChange('permitType', e.target.value)}
                placeholder="Search By Permit Type"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Vendor Name</Label>
            <Input
              value={filterData.vendorName}
              onChange={(e) => handleInputChange('vendorName', e.target.value)}
              placeholder="Search By Vendor Name"
            />
          </div>

          <div className="flex justify-center gap-4 pt-6">
            <Button
              onClick={handleApply}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90 px-8"
            >
              Apply
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="px-8"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
