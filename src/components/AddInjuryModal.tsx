
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface AddInjuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId: string;
}

export const AddInjuryModal = ({ isOpen, onClose, incidentId }: AddInjuryModalProps) => {
  const [injuryType, setInjuryType] = useState('');
  const [whoGotInjured, setWhoGotInjured] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = () => {
    console.log('Adding injury:', { incidentId, injuryType, whoGotInjured, name, mobile, companyName });
    onClose();
  };

  const handleAddMore = () => {
    console.log('Add more clicked');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Add Injury</DialogTitle>
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
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Injury Type</Label>
            <Select value={injuryType} onValueChange={setInjuryType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minor">Minor Injury</SelectItem>
                <SelectItem value="major">Major Injury</SelectItem>
                <SelectItem value="critical">Critical Injury</SelectItem>
                <SelectItem value="fatal">Fatal Injury</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Who got injured</Label>
            <Select value={whoGotInjured} onValueChange={setWhoGotInjured}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
                <SelectItem value="visitor">Visitor</SelectItem>
                <SelectItem value="public">General Public</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Mobile</Label>
              <Input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleAddMore}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              Add More
            </Button>
            
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90 px-8 ml-auto"
            >
              submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
