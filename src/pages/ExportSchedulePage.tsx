
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExportSchedulePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    masterChecklist: '',
    site: '',
    scheduleFor: 'Asset',
    checklistType: 'Individual',
    asset: '',
    assignTo: '',
    emailTriggerRule: '',
    supplier: '',
    supervisors: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExport = () => {
    console.log('Exporting with data:', formData);
    // Handle export functionality
  };

  const handleReset = () => {
    setFormData({
      masterChecklist: '',
      site: '',
      scheduleFor: 'Asset',
      checklistType: 'Individual',
      asset: '',
      assignTo: '',
      emailTriggerRule: '',
      supplier: '',
      supervisors: ''
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/maintenance/schedule')}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <div className="text-sm text-gray-600 mb-1">Export IDs</div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl space-y-6">
        <div>
          <Label>Master Checklist</Label>
          <Select value={formData.masterChecklist} onValueChange={(value) => handleInputChange('masterChecklist', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Master Checklist" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="checklist1">Master Checklist 1</SelectItem>
              <SelectItem value="checklist2">Master Checklist 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Site</Label>
          <Select value={formData.site} onValueChange={(value) => handleInputChange('site', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Here" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="site1">Site 1</SelectItem>
              <SelectItem value="site2">Site 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Schedule For</Label>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <input 
                type="radio" 
                id="asset-export" 
                name="scheduleForExport" 
                value="Asset"
                checked={formData.scheduleFor === 'Asset'}
                onChange={(e) => handleInputChange('scheduleFor', e.target.value)}
              />
              <Label htmlFor="asset-export">Asset</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="radio" 
                id="service-export" 
                name="scheduleForExport" 
                value="Service"
                checked={formData.scheduleFor === 'Service'}
                onChange={(e) => handleInputChange('scheduleFor', e.target.value)}
              />
              <Label htmlFor="service-export">Service</Label>
            </div>
          </div>
        </div>

        <div>
          <Label>Checklist Type</Label>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <input 
                type="radio" 
                id="individual-export" 
                name="checklistTypeExport" 
                value="Individual"
                checked={formData.checklistType === 'Individual'}
                onChange={(e) => handleInputChange('checklistType', e.target.value)}
              />
              <Label htmlFor="individual-export">Individual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="radio" 
                id="asset-group-export" 
                name="checklistTypeExport" 
                value="Asset Group"
                checked={formData.checklistType === 'Asset Group'}
                onChange={(e) => handleInputChange('checklistType', e.target.value)}
              />
              <Label htmlFor="asset-group-export">Asset Group</Label>
            </div>
          </div>
        </div>

        <div>
          <Label>Asset</Label>
          <Select value={formData.asset} onValueChange={(value) => handleInputChange('asset', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Asset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asset1">Asset 1</SelectItem>
              <SelectItem value="asset2">Asset 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Assign To</Label>
          <Select value={formData.assignTo} onValueChange={(value) => handleInputChange('assignTo', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Assign To" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user1">User 1</SelectItem>
              <SelectItem value="user2">User 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Email Trigger Rule</Label>
          <Select value={formData.emailTriggerRule} onValueChange={(value) => handleInputChange('emailTriggerRule', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Email Trigger Rule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Supplier</Label>
          <Select value={formData.supplier} onValueChange={(value) => handleInputChange('supplier', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Suppliers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="supplier1">Supplier 1</SelectItem>
              <SelectItem value="supplier2">Supplier 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Supervisors</Label>
          <Select value={formData.supervisors} onValueChange={(value) => handleInputChange('supervisors', value)}>
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
        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button 
            onClick={handleExport}
            style={{ backgroundColor: '#C72030' }}
            className="text-white"
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};
