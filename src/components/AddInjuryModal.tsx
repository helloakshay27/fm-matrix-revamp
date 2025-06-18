
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface AddInjuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId: string;
}

export const AddInjuryModal: React.FC<AddInjuryModalProps> = ({
  isOpen,
  onClose,
  incidentId
}) => {
  const [injuryData, setInjuryData] = useState({
    injuryType: '',
    whoGotInjured: '',
    name: '',
    mobile: '',
    companyName: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setInjuryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddInjury = () => {
    console.log('Adding injury for incident:', incidentId, injuryData);
    onClose();
  };

  const handleAddMore = () => {
    console.log('Add more functionality');
    // This would typically add another row or expand the form
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Add Injury</DialogTitle>
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
          <div className="space-y-2">
            <Label>Injury Type</Label>
            <Select 
              value={injuryData.injuryType} 
              onValueChange={(value) => handleInputChange('injuryType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cut">Cut</SelectItem>
                <SelectItem value="bruise">Bruise</SelectItem>
                <SelectItem value="fracture">Fracture</SelectItem>
                <SelectItem value="burn">Burn</SelectItem>
                <SelectItem value="sprain">Sprain</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Who got injured</Label>
            <Select 
              value={injuryData.whoGotInjured} 
              onValueChange={(value) => handleInputChange('whoGotInjured', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="visitor">Visitor</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={injuryData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder=""
              />
            </div>
            <div className="space-y-2">
              <Label>Mobile</Label>
              <Input
                value={injuryData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                placeholder=""
              />
            </div>
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={injuryData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder=""
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button
              onClick={handleAddMore}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90"
            >
              Add More
            </Button>
            
            <Button
              onClick={handleAddInjury}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90 px-8"
            >
              submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
