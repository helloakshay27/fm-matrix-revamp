
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface MSafeFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: { name: string; email: string }) => void;
}

export const MSafeFilterDialog = ({ isOpen, onClose, onApplyFilters }: MSafeFilterDialogProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Common field styles matching ticket page design
  const commonFieldStyles = "h-10 rounded-md border border-[hsl(var(--analytics-border))] bg-white";

  const handleSubmit = () => {
    const filters = { name, email };
    console.log('Applying M Safe filters:', filters);
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setName('');
    setEmail('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-xl font-bold text-[hsl(var(--analytics-text))]">Filter</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            {/* Name Filter */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-[hsl(var(--analytics-text))]">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={commonFieldStyles}
              />
            </div>

            {/* Email Filter */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-[hsl(var(--analytics-text))]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={commonFieldStyles}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleSubmit}
              className="bg-purple-700 hover:bg-purple-800 text-white flex-1"
            >
              Apply
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="text-[hsl(var(--analytics-text))] border-[hsl(var(--analytics-border))] flex-1"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
