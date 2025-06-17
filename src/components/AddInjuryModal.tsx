
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
    personName: '',
    age: '',
    gender: '',
    position: '',
    injuryType: '',
    bodyPart: '',
    severity: '',
    treatmentGiven: '',
    hospitalRequired: '',
    hospitalName: '',
    description: ''
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Injury Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Person Name*</Label>
              <Input
                value={injuryData.personName}
                onChange={(e) => handleInputChange('personName', e.target.value)}
                placeholder="Enter person's name"
              />
            </div>
            <div className="space-y-2">
              <Label>Age</Label>
              <Input
                type="number"
                value={injuryData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Enter age"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select 
                value={injuryData.gender} 
                onValueChange={(value) => handleInputChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Position/Role</Label>
              <Input
                value={injuryData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="Enter position"
              />
            </div>
          </div>

          {/* Injury Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type of Injury*</Label>
              <Select 
                value={injuryData.injuryType} 
                onValueChange={(value) => handleInputChange('injuryType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select injury type" />
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
              <Label>Body Part Affected*</Label>
              <Select 
                value={injuryData.bodyPart} 
                onValueChange={(value) => handleInputChange('bodyPart', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select body part" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="head">Head</SelectItem>
                  <SelectItem value="arm">Arm</SelectItem>
                  <SelectItem value="leg">Leg</SelectItem>
                  <SelectItem value="back">Back</SelectItem>
                  <SelectItem value="chest">Chest</SelectItem>
                  <SelectItem value="hand">Hand</SelectItem>
                  <SelectItem value="foot">Foot</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Severity*</Label>
            <Select 
              value={injuryData.severity} 
              onValueChange={(value) => handleInputChange('severity', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="serious">Serious</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Treatment */}
          <div className="space-y-2">
            <Label>Treatment Given</Label>
            <Textarea
              value={injuryData.treatmentGiven}
              onChange={(e) => handleInputChange('treatmentGiven', e.target.value)}
              placeholder="Describe treatment provided"
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Hospital Treatment Required?*</Label>
            <RadioGroup 
              value={injuryData.hospitalRequired} 
              onValueChange={(value) => handleInputChange('hospitalRequired', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="hospital-yes" />
                <Label htmlFor="hospital-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="hospital-no" />
                <Label htmlFor="hospital-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {injuryData.hospitalRequired === 'yes' && (
            <div className="space-y-2">
              <Label>Hospital Name</Label>
              <Input
                value={injuryData.hospitalName}
                onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                placeholder="Enter hospital name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Additional Description</Label>
            <Textarea
              value={injuryData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Additional details about the injury"
              className="min-h-[60px]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleAddInjury}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90 flex-1"
            >
              Add Injury
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
