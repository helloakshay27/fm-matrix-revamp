
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface ServiceFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export const ServiceFilterModal = ({ isOpen, onClose, onApply }: ServiceFilterModalProps) => {
  const [filters, setFilters] = useState({
    serviceName: '',
    building: '',
    area: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    console.log('Applying filters:', filters);
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      serviceName: '',
      building: '',
      area: ''
    });
    onApply({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Service Details */}
          <div>
            <h3 className="text-orange-500 font-medium mb-4">Service Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Service Name</label>
                <Input
                  placeholder="Enter Service Name"
                  value={filters.serviceName}
                  onChange={(e) => handleInputChange('serviceName', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div>
            <h3 className="text-orange-500 font-medium mb-4">Location Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Building</label>
                <Select onValueChange={(value) => handleInputChange('building', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Building" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wing2">Wing2</SelectItem>
                    <SelectItem value="main-building">Main Building</SelectItem>
                    <SelectItem value="annexe">Annexe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Area</label>
                <Select onValueChange={(value) => handleInputChange('area', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lobby">Lobby</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="cafeteria">Cafeteria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-4">
            <Button 
              variant="outline"
              onClick={handleReset}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Reset
            </Button>
            <Button 
              onClick={handleApply}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
