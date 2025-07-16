import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Checkbox, FormControlLabel, Box } from '@mui/material';
import { Plus, X } from "lucide-react";

interface ApprovalLevel {
  order: number;
  name: string;
  users: string[];
  sendEmails: boolean;
}

const AddApprovalMatrixPage = () => {
  const navigate = useNavigate();
  const [selectedFunction, setSelectedFunction] = useState('');
  const [approvalLevels, setApprovalLevels] = useState<ApprovalLevel[]>([
    { order: 1, name: '', users: [], sendEmails: false }
  ]);

  // Mock data for dropdowns
  const functions = [
    'Custom Form 11372',
    'Gdn',
    'Work Order',
    'Grn', 
    'Work Order Invoice',
    'Purchase Order'
  ];

  const userOptions = [
    'Jayesh P',
    'Rajesh K',
    'Priya S',
    'Amit T',
    'Kavya R',
    'Suresh M',
    'Anita D',
    'Ravi N',
    'Sneha L',
    'Manoj B',
    'Divya A',
    'Kiran J',
    'Pooja V',
    'Arun C',
    'Meera H'
  ];

  const addApprovalLevel = () => {
    const newLevel: ApprovalLevel = {
      order: approvalLevels.length + 1,
      name: '',
      users: [],
      sendEmails: false
    };
    setApprovalLevels([...approvalLevels, newLevel]);
  };

  const removeApprovalLevel = (index: number) => {
    if (approvalLevels.length > 1) {
      const updatedLevels = approvalLevels.filter((_, i) => i !== index);
      // Reorder the remaining levels
      const reorderedLevels = updatedLevels.map((level, i) => ({
        ...level,
        order: i + 1
      }));
      setApprovalLevels(reorderedLevels);
    }
  };

  const updateApprovalLevel = (index: number, field: keyof ApprovalLevel, value: any) => {
    const updatedLevels = [...approvalLevels];
    updatedLevels[index] = { ...updatedLevels[index], [field]: value };
    setApprovalLevels(updatedLevels);
  };

  const handleCreate = () => {
    console.log('Creating approval matrix:', { selectedFunction, approvalLevels });
    navigate('/settings/approval-matrix/setup');
  };

  const handleSaveAndCreateNew = () => {
    console.log('Saving and creating new:', { selectedFunction, approvalLevels });
    setSelectedFunction('');
    setApprovalLevels([{ order: 1, name: '', users: [], sendEmails: false }]);
  };

  return (
    <div className="p-8 min-h-screen bg-transparent">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-[#1a1a1a]">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings" className="text-[#1a1a1a]">
              Settings
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings/approval-matrix" className="text-[#1a1a1a]">
              Approval Matrix
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings/approval-matrix/setup" className="text-[#1a1a1a]">
              Setup
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-[#C72030]">Add</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title */}
      <Heading level="h1" className="text-[#1a1a1a] mb-6">
        ADD APPROVAL MATRIX
      </Heading>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Function Selection */}
        <div className="mb-8">
          <FormControl fullWidth>
            <InputLabel 
              required
              sx={{ 
                color: '#1a1a1a',
                '&.Mui-focused': { color: '#C72030' }
              }}
            >
              Function
            </InputLabel>
            <MuiSelect
              value={selectedFunction}
              onChange={(e) => setSelectedFunction(e.target.value)}
              label="Function"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D5DbDB',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#C72030',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#C72030',
                },
              }}
            >
              {functions.map((func) => (
                <MenuItem key={func} value={func}>
                  {func}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        </div>

        {/* Approval Levels Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <h2 className="text-xl font-semibold text-[#C72030]">Approval Levels</h2>
          </div>

          {approvalLevels.map((level, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                {/* Order */}
                <div className="md:col-span-1">
                  <TextField
                    label="Order"
                    required
                    value={level.order}
                    type="number"
                    InputProps={{ readOnly: true }}
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#D5DbDB' },
                        '&:hover fieldset': { borderColor: '#C72030' },
                        '&.Mui-focused fieldset': { borderColor: '#C72030' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#C72030' },
                    }}
                  />
                </div>

                {/* Name of Level */}
                <div className="md:col-span-3">
                  <TextField
                    label="Name of Level"
                    required
                    placeholder="Enter Name of Level"
                    value={level.name}
                    onChange={(e) => updateApprovalLevel(index, 'name', e.target.value)}
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#D5DbDB' },
                        '&:hover fieldset': { borderColor: '#C72030' },
                        '&.Mui-focused fieldset': { borderColor: '#C72030' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#C72030' },
                    }}
                  />
                </div>

                {/* Users */}
                <div className="md:col-span-5">
                  <FormControl fullWidth size="small">
                    <InputLabel 
                      required
                      sx={{ 
                        color: '#1a1a1a',
                        '&.Mui-focused': { color: '#C72030' }
                      }}
                    >
                      Users
                    </InputLabel>
                    <MuiSelect
                      multiple
                      value={level.users}
                      onChange={(e) => updateApprovalLevel(index, 'users', e.target.value)}
                      label="Users"
                      renderValue={(selected) => 
                        selected.length === 0 
                          ? 'Select up to 15 Options...'
                          : `${selected.length} selected`
                      }
                      displayEmpty
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#D5DbDB',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#C72030',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#C72030',
                        },
                      }}
                    >
                      {userOptions.map((user) => (
                        <MenuItem key={user} value={user}>
                          <Checkbox 
                            checked={level.users.includes(user)}
                            sx={{
                              color: '#C72030',
                              '&.Mui-checked': { color: '#C72030' },
                            }}
                          />
                          {user}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </div>

                {/* Send Emails & Remove Button */}
                <div className="md:col-span-3 flex items-center gap-2">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={level.sendEmails}
                        onChange={(e) => updateApprovalLevel(index, 'sendEmails', e.target.checked)}
                        sx={{
                          color: '#C72030',
                          '&.Mui-checked': { color: '#C72030' },
                        }}
                      />
                    }
                    label="Send Emails"
                    sx={{ color: '#1a1a1a' }}
                  />
                  
                  {approvalLevels.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeApprovalLevel(index)}
                      className="bg-[#C72030] hover:bg-[#A61B28] text-white min-w-[32px] h-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add More Level Button */}
          <Button
            variant="ghost"
            onClick={addApprovalLevel}
            className="bg-[#6B2C91] hover:bg-[#5A2478] text-white w-12 h-12 rounded-lg p-0"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <Button
            onClick={handleCreate}
            className="bg-[#6B2C91] hover:bg-[#5A2478] text-white px-8"
          >
            Create
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSaveAndCreateNew}
            className="border-[#6B2C91] text-[#6B2C91] hover:bg-[#6B2C91] hover:text-white px-8"
          >
            Save And Create New
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddApprovalMatrixPage;