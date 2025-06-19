
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';

export const AddApprovalMatrixDashboard = () => {
  const [selectedFunction, setSelectedFunction] = useState('');
  const [approvalLevels, setApprovalLevels] = useState([
    { id: 1, order: '1', nameOfLevel: '', users: '', sendEmails: false }
  ]);

  const functionOptions = [
    'Select Function',
    'Custom Form',
    'Gdn',
    'Work Order',
    'Grn',
    'Work Order Invoice',
    'Purchase Order'
  ];

  const addApprovalLevel = () => {
    const newId = approvalLevels.length + 1;
    setApprovalLevels([
      ...approvalLevels,
      { id: newId, order: newId.toString(), nameOfLevel: '', users: '', sendEmails: false }
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

  const handleCreate = () => {
    console.log('Creating approval matrix:', { selectedFunction, approvalLevels });
    window.location.href = '/settings/approval-matrix';
  };

  const handleSaveAndCreateNew = () => {
    console.log('Saving and creating new:', { selectedFunction, approvalLevels });
    // Reset form for new entry
    setSelectedFunction('');
    setApprovalLevels([{ id: 1, order: '1', nameOfLevel: '', users: '', sendEmails: false }]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="function" className="text-sm font-medium">Function</Label>
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
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                !
              </div>
              <h2 className="text-lg font-semibold text-orange-600">Approval Levels</h2>
            </div>

            <div className="space-y-4">
              {approvalLevels.map((level) => (
                <div key={level.id} className="grid grid-cols-5 gap-4 items-end">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Order *</Label>
                    <Input
                      value={level.order}
                      onChange={(e) => updateApprovalLevel(level.id, 'order', e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Name of Level *</Label>
                    <Input
                      placeholder="Enter Name of Level"
                      value={level.nameOfLevel}
                      onChange={(e) => updateApprovalLevel(level.id, 'nameOfLevel', e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Users *</Label>
                    <Select
                      value={level.users}
                      onValueChange={(value) => updateApprovalLevel(level.id, 'users', value)}
                    >
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select up to 15 Options..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                        <SelectItem value="option3">Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox
                      id={`send-emails-${level.id}`}
                      checked={level.sendEmails}
                      onCheckedChange={(checked) => updateApprovalLevel(level.id, 'sendEmails', checked)}
                    />
                    <Label htmlFor={`send-emails-${level.id}`} className="text-sm">
                      Send Emails
                    </Label>
                  </div>
                  <div className="flex items-center gap-2 pt-8">
                    {approvalLevels.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeApprovalLevel(level.id)}
                        className="h-8 w-8 text-red-600 hover:bg-red-50 border-red-300"
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
              className="bg-[#C72030] text-white hover:bg-[#A01020] border-[#C72030] h-10 w-10"
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-center gap-4 pt-6">
            <Button
              onClick={handleCreate}
              className="bg-[#C72030] hover:bg-[#A01020] text-white px-8 h-10"
            >
              Create
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveAndCreateNew}
              className="px-8 h-10 border-gray-300"
            >
              Save And Create New
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
