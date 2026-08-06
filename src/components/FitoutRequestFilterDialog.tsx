
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormSearchSelect, type FormSearchSelectOption } from '@/components/FormSearchSelect';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';

interface FitoutRequestFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FitoutRequestFilterDialog = ({ isOpen, onClose }: FitoutRequestFilterDialogProps) => {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState('ppm');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('');
  const [status, setStatus] = useState('');

  const handleApply = () => {
    console.log('Applying filters...', { selectedType, category, unit, status });
    toast({
      title: "Success",
      description: "Filters applied successfully!",
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedType('ppm');
    setCategory('');
    setUnit('');
    setStatus('');
    console.log('Resetting filters...');
  };

  const categoryOptions: FormSearchSelectOption[] = [
    { value: 'renovation', label: 'Renovation' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'flooring', label: 'Flooring' },
  ];

  const unitOptions: FormSearchSelectOption[] = [
    { value: 'unit-101', label: 'Unit 101' },
    { value: 'unit-102', label: 'Unit 102' },
    { value: 'unit-103', label: 'Unit 103' },
  ];

  const statusOptions: FormSearchSelectOption[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">OPTIONS</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <label className="text-sm font-medium">Type</label>
            <RadioGroup value={selectedType} onValueChange={setSelectedType} className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ppm" id="fitout-ppm" className="border-red-500 text-red-500" />
                <label htmlFor="fitout-ppm" className="text-sm font-medium">PPM</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="amc" id="fitout-amc" />
                <label htmlFor="fitout-amc" className="text-sm font-medium">AMC</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="preparedness" id="fitout-preparedness" />
                <label htmlFor="fitout-preparedness" className="text-sm font-medium">Preparedness</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hoto" id="fitout-hoto" />
                <label htmlFor="fitout-hoto" className="text-sm font-medium">Hoto</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="routine" id="fitout-routine" />
                <label htmlFor="fitout-routine" className="text-sm font-medium">Routine</label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="pt-1">
              <FormSearchSelect
                label="Category"
                value={category}
                onChange={setCategory}
                options={categoryOptions}
                placeholder="Select Category"
              />
            </div>

            <div className="pt-1">
              <FormSearchSelect
                label="Unit"
                value={unit}
                onChange={setUnit}
                options={unitOptions}
                placeholder="Select Unit"
              />
            </div>

            <div className="pt-1">
              <FormSearchSelect
                label="Status"
                value={status}
                onChange={setStatus}
                options={statusOptions}
                placeholder="Select Status"
              />
            </div>

            <div className="hidden md:block" />
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button 
            onClick={handleApply}
            className="bg-brand hover:bg-brand-hover text-white px-8"
          >
            Apply
          </Button>
          <Button 
            variant="outline"
            onClick={handleReset}
            className="px-8 border-brand text-brand hover:bg-brand-selected hover:text-brand"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
