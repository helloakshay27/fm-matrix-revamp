
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export const ScheduleExportPage = () => {
  const [masterChecklist, setMasterChecklist] = useState('');
  const [site, setSite] = useState('');
  const [scheduleFor, setScheduleFor] = useState('asset');
  const [asset, setAsset] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [emailTriggerRule, setEmailTriggerRule] = useState('');
  const [supplier, setSupplier] = useState('');
  const [supervisors, setSupervisors] = useState('');

  const handleExport = () => {
    console.log('Exporting schedule with data:', {
      masterChecklist,
      site,
      scheduleFor,
      asset,
      assignTo,
      emailTriggerRule,
      supplier,
      supervisors
    });
    
    // Create sample export data
    const exportData = [
      'Schedule ID,Activity Name,Type,Schedule Type,Valid From,Valid Till,Category,Active',
      '11878,meter reading,PPM,Asset,01/05/2025,31/05/2025,Technical,Active',
      '11372,All task types 123,Routine,Service,14/08/2024,31/08/2025,Non Technical,Active'
    ].join('\n');
    
    const blob = new Blob([exportData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schedule-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    alert('Schedule data exported successfully!');
  };

  const handleReset = () => {
    setMasterChecklist('');
    setSite('');
    setScheduleFor('asset');
    setAsset('');
    setAssignTo('');
    setEmailTriggerRule('');
    setSupplier('');
    setSupervisors('');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded mb-4">
          Export IDs
        </div>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Master Checklist */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Master Checklist</Label>
          <Select value={masterChecklist} onValueChange={setMasterChecklist}>
            <SelectTrigger>
              <SelectValue placeholder="Select Master Checklist" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="checklist1">Master Checklist 1</SelectItem>
              <SelectItem value="checklist2">Master Checklist 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Site */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Site</Label>
          <Select value={site} onValueChange={setSite}>
            <SelectTrigger>
              <SelectValue placeholder="Select Here" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="site1">Site 1</SelectItem>
              <SelectItem value="site2">Site 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Schedule For */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Schedule For</Label>
          <RadioGroup value={scheduleFor} onValueChange={setScheduleFor} className="flex gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="asset" id="asset" />
              <Label htmlFor="asset">Asset</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="service" id="service" />
              <Label htmlFor="service">Service</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Checklist Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Checklist Type</Label>
          <RadioGroup defaultValue="individual" className="flex gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual">Individual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="assetGroup" id="assetGroup" />
              <Label htmlFor="assetGroup">Asset Group</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Asset */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Asset</Label>
          <Select value={asset} onValueChange={setAsset}>
            <SelectTrigger>
              <SelectValue placeholder="Select Asset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asset1">Asset 1</SelectItem>
              <SelectItem value="asset2">Asset 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Assign To */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Assign To</Label>
          <Select value={assignTo} onValueChange={setAssignTo}>
            <SelectTrigger>
              <SelectValue placeholder="Select Assign To" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user1">User 1</SelectItem>
              <SelectItem value="user2">User 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Email Trigger Rule */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Email Trigger Rule</Label>
          <Select value={emailTriggerRule} onValueChange={setEmailTriggerRule}>
            <SelectTrigger>
              <SelectValue placeholder="Select Email Trigger Rule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rule1">Rule 1</SelectItem>
              <SelectItem value="rule2">Rule 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Supplier */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Supplier</Label>
          <Select value={supplier} onValueChange={setSupplier}>
            <SelectTrigger>
              <SelectValue placeholder="Select Suppliers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="supplier1">Supplier 1</SelectItem>
              <SelectItem value="supplier2">Supplier 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Supervisors */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Supervisors</Label>
          <Select value={supervisors} onValueChange={setSupervisors}>
            <SelectTrigger>
              <SelectValue placeholder="Select Supervisors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="supervisor1">Supervisor 1</SelectItem>
              <SelectItem value="supervisor2">Supervisor 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button 
            onClick={handleReset}
            variant="outline"
            className="px-8"
          >
            Reset
          </Button>
          <Button 
            onClick={handleExport}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90 px-8"
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};
