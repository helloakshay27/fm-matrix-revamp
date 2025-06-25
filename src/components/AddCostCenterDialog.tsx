
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface AddCostCenterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddCostCenterDialog = ({ open, onOpenChange }: AddCostCenterDialogProps) => {
  const [formData, setFormData] = useState({
    costCentreName: '',
    budget: '',
    budgetStart: '',
    budgetEnd: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Cost Center data:', formData);
    // Handle form submission here
    onOpenChange(false);
    // Reset form
    setFormData({
      costCentreName: '',
      budget: '',
      budgetStart: '',
      budgetEnd: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        {/* Header with cyan background */}
        <DialogHeader className="bg-cyan-400 text-white p-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-white font-medium">New Account</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-white hover:bg-cyan-500 p-1 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        {/* Form content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="costCentreName" className="text-sm font-medium text-gray-700">
              Cost Centre Name
            </Label>
            <Input
              id="costCentreName"
              type="text"
              value={formData.costCentreName}
              onChange={(e) => handleInputChange('costCentreName', e.target.value)}
              className="w-full border-gray-300 focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget" className="text-sm font-medium text-gray-700">
              Budget
            </Label>
            <Input
              id="budget"
              type="text"
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className="w-full border-gray-300 focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetStart" className="text-sm font-medium text-gray-700">
              Budget Start
            </Label>
            <Input
              id="budgetStart"
              type="date"
              value={formData.budgetStart}
              onChange={(e) => handleInputChange('budgetStart', e.target.value)}
              className="w-full border-gray-300 focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetEnd" className="text-sm font-medium text-gray-700">
              Budget End
            </Label>
            <Input
              id="budgetEnd"
              type="date"
              value={formData.budgetEnd}
              onChange={(e) => handleInputChange('budgetEnd', e.target.value)}
              className="w-full border-gray-300 focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
