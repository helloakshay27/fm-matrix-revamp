
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface ReferSomeoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReferSomeoneDialog = ({ open, onOpenChange }: ReferSomeoneDialogProps) => {
  const [formData, setFormData] = useState({
    project: '',
    name: '',
    phoneNumber: ''
  });

  const projects = [
    'Select Project',
    'TEst',
    'Piramal 12',
    'Piramal 11',
    'Piramal',
    'Piramal 1',
    'Piramal Test',
    'Some',
    'Piramal Aranya',
    'Piramal lockated',
    'Piramal Revanta',
    'Piramal Vaikunth',
    'Piramal Mahalaxmi'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Referral submitted:', formData);
    // Reset form
    setFormData({ project: '', name: '', phoneNumber: '' });
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset form
    setFormData({ project: '', name: '', phoneNumber: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Refer Someone
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="project" className="text-sm font-medium text-gray-700 mb-1 block">
              Select Project
            </Label>
            <Select value={formData.project} onValueChange={(value) => handleInputChange('project', value)}>
              <SelectTrigger className="w-full focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]">
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 max-h-60 overflow-y-auto">
                {projects.map((project, index) => (
                  <SelectItem 
                    key={index} 
                    value={project}
                    className={`hover:bg-blue-50 ${project === formData.project ? 'bg-blue-500 text-white' : ''}`}
                  >
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]"
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 mb-1 block">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline"
              onClick={handleCancel}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            >
              Add Referral
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
