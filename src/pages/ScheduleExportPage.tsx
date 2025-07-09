import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TextField, Select, MenuItem, FormControl, InputLabel, Radio, RadioGroup, FormControlLabel } from '@mui/material';
const muiFieldStyles = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    height: {
      xs: '36px',
      md: '45px'
    },
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    '& fieldset': {
      borderColor: '#E0E0E0'
    },
    '&:hover fieldset': {
      borderColor: '#1A1A1A'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
      borderWidth: 2
    }
  },
  '& .MuiInputLabel-root': {
    color: '#999999',
    fontSize: '16px',
    '&.Mui-focused': {
      color: '#C72030'
    },
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
      backgroundColor: '#FFFFFF',
      padding: '0 4px'
    }
  },
  '& .MuiOutlinedInput-input, & .MuiSelect-select': {
    color: '#1A1A1A',
    fontSize: '16px',
    padding: {
      xs: '8px 14px',
      md: '12px 14px'
    },
    height: 'auto',
    '&::placeholder': {
      color: '#999999',
      opacity: 1
    }
  }
};
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
    const exportData = ['Schedule ID,Activity Name,Type,Schedule Type,Valid From,Valid Till,Category,Active', '11878,meter reading,PPM,Asset,01/05/2025,31/05/2025,Technical,Active', '11372,All task types 123,Routine,Service,14/08/2024,31/08/2025,Non Technical,Active'].join('\n');
    const blob = new Blob([exportData], {
      type: 'text/csv'
    });
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
  return <div className="p-6">
      <div className="mb-6">
        <div className="bg-[#F6F4EE] text-[#C72030] px-4 py-2 rounded mb-4">
          Export IDs
        </div>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Master Checklist */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Master Checklist</Label>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Select Master Checklist</InputLabel>
            <Select value={masterChecklist} label="Select Master Checklist" onChange={e => setMasterChecklist(e.target.value)} sx={muiFieldStyles}>
              <MenuItem value="checklist1">Master Checklist 1</MenuItem>
              <MenuItem value="checklist2">Master Checklist 2</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Site */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Site</Label>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Select Here</InputLabel>
            <Select value={site} label="Select Here" onChange={e => setSite(e.target.value)} sx={muiFieldStyles}>
              <MenuItem value="site1">Site 1</MenuItem>
              <MenuItem value="site2">Site 2</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Schedule For */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Schedule For</Label>
          <RadioGroup value={scheduleFor} onChange={e => setScheduleFor(e.target.value)} row sx={{
          gap: 3,
          flexWrap: 'wrap'
        }}>
            <FormControlLabel value="asset" control={<Radio sx={{
            color: '#C72030',
            '&.Mui-checked': {
              color: '#C72030'
            }
          }} />} label="Asset" />
            <FormControlLabel value="service" control={<Radio sx={{
            color: '#C72030',
            '&.Mui-checked': {
              color: '#C72030'
            }
          }} />} label="Service" />
          </RadioGroup>
        </div>

        {/* Checklist Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Checklist Type</Label>
          <RadioGroup defaultValue="individual" row sx={{
          gap: 3,
          flexWrap: 'wrap'
        }}>
            <FormControlLabel value="individual" control={<Radio sx={{
            color: '#C72030',
            '&.Mui-checked': {
              color: '#C72030'
            }
          }} />} label="Individual" />
            <FormControlLabel value="assetGroup" control={<Radio sx={{
            color: '#C72030',
            '&.Mui-checked': {
              color: '#C72030'
            }
          }} />} label="Asset Group" />
          </RadioGroup>
        </div>

        {/* Asset */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Asset</Label>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Select Asset</InputLabel>
            <Select value={asset} label="Select Asset" onChange={e => setAsset(e.target.value)} sx={muiFieldStyles}>
              <MenuItem value="asset1">Asset 1</MenuItem>
              <MenuItem value="asset2">Asset 2</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Assign To */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Assign To</Label>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Select Assign To</InputLabel>
            <Select value={assignTo} label="Select Assign To" onChange={e => setAssignTo(e.target.value)} sx={muiFieldStyles}>
              <MenuItem value="user1">User 1</MenuItem>
              <MenuItem value="user2">User 2</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Email Trigger Rule */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Email Trigger Rule</Label>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Select Email Trigger Rule</InputLabel>
            <Select value={emailTriggerRule} label="Select Email Trigger Rule" onChange={e => setEmailTriggerRule(e.target.value)} sx={muiFieldStyles}>
              <MenuItem value="rule1">Rule 1</MenuItem>
              <MenuItem value="rule2">Rule 2</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Supplier */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Supplier</Label>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Select Suppliers</InputLabel>
            <Select value={supplier} label="Select Suppliers" onChange={e => setSupplier(e.target.value)} sx={muiFieldStyles}>
              <MenuItem value="supplier1">Supplier 1</MenuItem>
              <MenuItem value="supplier2">Supplier 2</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Supervisors */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Supervisors</Label>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Select Supervisors</InputLabel>
            <Select value={supervisors} label="Select Supervisors" onChange={e => setSupervisors(e.target.value)} sx={muiFieldStyles}>
              <MenuItem value="supervisor1">Supervisor 1</MenuItem>
              <MenuItem value="supervisor2">Supervisor 2</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button onClick={handleReset} variant="outline" className="px-8">
            Reset
          </Button>
          <Button onClick={handleExport} style={{
          backgroundColor: '#C72030'
        }} className="text-white hover:bg-[#C72030]/90 px-8">
            Export
          </Button>
        </div>
      </div>
    </div>;
};