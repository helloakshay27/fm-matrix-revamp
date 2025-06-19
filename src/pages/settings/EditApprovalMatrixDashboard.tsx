
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { useParams } from 'react-router-dom';

export const EditApprovalMatrixDashboard = () => {
  const { id } = useParams();
  const [selectedFunction, setSelectedFunction] = useState('GDN');
  const [approvalLevels, setApprovalLevels] = useState([
    { id: 1, order: '1', nameOfLevel: 'level 1', users: '', active: true, sendEmails: true }
  ]);

  const functionOptions = [
    'Select Function',
    'Custom Form',
    'GDN',
    'Work Order',
    'Grn',
    'Work Order Invoice',
    'Purchase Order'
  ];

  const addApprovalLevel = () => {
    const newId = approvalLevels.length + 1;
    setApprovalLevels([
      ...approvalLevels,
      { id: newId, order: newId.toString(), nameOfLevel: '', users: '', active: false, sendEmails: false }
    ]);
  };

  const removeApprovalLevel = (id: number) => {
    if (approvalLevels.length > 1) {
      setApprovalLevels(approvalLevels.filter(level => level.id !== id));
    }
  };

  const updateApprovalLevel = (id: number, field: string, value: any) => {
    setApprovalLevels(approvalLevels.map(level => 
      level.id === id ? { ...level, [field]: value } : level
    ));
  };

  const handleUpdate = () => {
    console.log('Updating approval matrix:', { id, selectedFunction, approvalLevels });
    window.location.href = '/settings/approval-matrix';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="function">Function *</Label>
          <Select value={selectedFunction} onValueChange={setSelectedFunction}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select Function" />
            </SelectTrigger>
            <SelectContent>
              {functionOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">
              !
            </div>
            <h2 className="text-lg font-semibold text-orange-600">Approval Levels</h2>
          </div>

          <div className="space-y-4">
            {approvalLevels.map((level) => (
              <div key={level.id} className="grid grid-cols-6 gap-4 items-end">
                <div className="space-y-2">
                  <Label>Order *</Label>
                  <Input
                    value={level.order}
                    onChange={(e) => updateApprovalLevel(level.id, 'order', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Name of Level *</Label>
                  <Input
                    placeholder="Enter Name of Level"
                    value={level.nameOfLevel}
                    onChange={(e) => updateApprovalLevel(level.id, 'nameOfLevel', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Users *</Label>
                  <Select
                    value={level.users}
                    onValueChange={(value) => updateApprovalLevel(level.id, 'users', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select up to 15 Options..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`active-${level.id}`}
                    checked={level.active}
                    onCheckedChange={(checked) => updateApprovalLevel(level.id, 'active', checked)}
                  />
                  <Label htmlFor={`active-${level.id}`} className="text-sm">
                    Active
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`send-emails-${level.id}`}
                    checked={level.sendEmails}
                    onCheckedChange={(checked) => updateApprovalLevel(level.id, 'sendEmails', checked)}
                  />
                  <Label htmlFor={`send-emails-${level.id}`} className="text-sm">
                    Send Emails
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  {approvalLevels.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeApprovalLevel(level.id)}
                      className="h-8 w-8 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={addApprovalLevel}
            className="bg-[#C72030] text-white hover:bg-[#A01020]"
          >
            <Plus className="h-4 w-4 mr-2" />
          </Button>
        </div>

        <div className="flex justify-center pt-6">
          <Button
            onClick={handleUpdate}
            className="bg-[#C72030] hover:bg-[#A01020] text-white px-8"
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};
