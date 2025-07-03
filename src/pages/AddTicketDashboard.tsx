
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Paperclip, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const mockUsers = [
  { id: '1', name: 'Ankit Gupta', type: 'occupant' },
  { id: '2', name: 'Deepak Gupta', type: 'fm' },
  { id: '3', name: 'Vinayak Mane', type: 'fm' },
  { id: '4', name: 'John Doe', type: 'occupant' },
  { id: '5', name: 'Jane Smith', type: 'fm' }
];

export const AddTicketDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [onBehalfOf, setOnBehalfOf] = useState('self');
  const [ticketType, setTicketType] = useState('');
  const [createFor, setCreateFor] = useState('selected-site');
  const [selectedUser, setSelectedUser] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    name: 'Ankit Gupta',
    contactNumber: '7388997281',
    site: 'Lockated',
    department: '',
    unit: '',
    categoryType: '',
    subCategoryType: '',
    description: '',
    assignedTo: '',
    proactiveReactive: '',
    adminPriority: '',
    referenceNumber: '',
    mode: ''
  });

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
      fontSize: { xs: '12px', sm: '13px', md: '14px' },
    },
    '& .MuiInputLabel-root': {
      fontSize: { xs: '12px', sm: '13px', md: '14px' },
    },
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachedFiles(Array.from(files));
    }
  };

  const handleSubmit = () => {
    console.log('Submitting ticket:', {
      onBehalfOf,
      ticketType,
      createFor,
      selectedUser,
      formData,
      attachedFiles
    });
    
    toast({
      title: "Success",
      description: "Ticket submitted successfully!",
    });
    
    navigate('/maintenance/ticket');
  };

  const filteredUsers = onBehalfOf === 'occupant-user' 
    ? mockUsers.filter(user => user.type === 'occupant')
    : onBehalfOf === 'fm-user'
    ? mockUsers.filter(user => user.type === 'fm')
    : [];

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/maintenance/ticket')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ticket List
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>Ticket List</span>
            <span>&gt;</span>
            <span>New Ticket</span>
          </div>
          <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">NEW TICKET</h1>
        </div>

        {/* Ticket Details Section */}
        <div className="p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full flex items-center justify-center">
             <FileText className="w-4 h-4 text-[#C72030]" />
            </div>
            <h2 className="text-lg font-semibold text-orange-800">TICKET DETAILS</h2>
          </div>

          {/* On Behalf Of */}
          <div className="mb-4">
            <Label className="text-sm font-medium">On Behalf of</Label>
            <RadioGroup value={onBehalfOf} onValueChange={setOnBehalfOf} className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="self" id="self" />
                <Label htmlFor="self">Self</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="occupant-user" id="occupant-user" />
                <Label htmlFor="occupant-user">Occupant User</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fm-user" id="fm-user" />
                <Label htmlFor="fm-user">FM User</Label>
              </div>
            </RadioGroup>
          </div>

          {/* User Selection Dropdown */}
          {onBehalfOf !== 'self' && (
            <div className="mb-4">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="user-select-label" shrink>Select User</InputLabel>
                <MuiSelect
                  labelId="user-select-label"
                  label="Select User"
                  displayEmpty
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select User</em></MenuItem>
                  {filteredUsers.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
          )}

          {/* Requestor Details */}
          <h3 className="font-medium mb-3">Requestor Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <TextField
                label="Name"
                placeholder="Enter name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
            <div>
              <TextField
                label="Contact Number"
                placeholder="Enter contact number"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
            <div>
              <TextField
                label="Site"
                placeholder="Enter site"
                value={formData.site}
                onChange={(e) => handleInputChange('site', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
            <div>
              <TextField
                label="Department"
                placeholder="Enter department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <TextField
                label="Unit"
                placeholder="Enter unit"
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
          </div>

          {/* Ticket Type */}
          <div className="mb-4">
            <Label className="text-sm font-medium">Ticket Type</Label>
            <RadioGroup value={ticketType} onValueChange={setTicketType} className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="request" id="request" />
                <Label htmlFor="request">Request</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="suggestion" id="suggestion" />
                <Label htmlFor="suggestion">Suggestion</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="complaint" id="complaint" />
                <Label htmlFor="complaint">Complaint</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Category and Other Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="category-select-label" shrink>Category Type*</InputLabel>
                <MuiSelect
                  labelId="category-select-label"
                  label="Category Type*"
                  displayEmpty
                  value={formData.categoryType}
                  onChange={(e) => handleInputChange('categoryType', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Category</em></MenuItem>
                  <MenuItem value="fire-system">FIRE SYSTEM</MenuItem>
                  <MenuItem value="air-conditioner">Air Conditioner</MenuItem>
                  <MenuItem value="cleaning">Cleaning</MenuItem>
                  <MenuItem value="electrical">Electrical</MenuItem>
                  <MenuItem value="printer">Printer</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="subcategory-select-label" shrink>Sub Category Type*</InputLabel>
                <MuiSelect
                  labelId="subcategory-select-label"
                  label="Sub Category Type*"
                  displayEmpty
                  value={formData.subCategoryType}
                  onChange={(e) => handleInputChange('subCategoryType', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select SubCategory</em></MenuItem>
                  <MenuItem value="fire">fire</MenuItem>
                  <MenuItem value="dentry">dentry</MenuItem>
                  <MenuItem value="test">test</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="priority-select-label" shrink>Admin Priority*</InputLabel>
                <MuiSelect
                  labelId="priority-select-label"
                  label="Admin Priority*"
                  displayEmpty
                  value={formData.adminPriority}
                  onChange={(e) => handleInputChange('adminPriority', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Priority</em></MenuItem>
                  <MenuItem value="p1">P1</MenuItem>
                  <MenuItem value="p2">P2</MenuItem>
                  <MenuItem value="p3">P3</MenuItem>
                  <MenuItem value="p4">P4</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="assigned-select-label" shrink>Assigned To</InputLabel>
                <MuiSelect
                  labelId="assigned-select-label"
                  label="Assigned To"
                  displayEmpty
                  value={formData.assignedTo}
                  onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Assignee</em></MenuItem>
                  <MenuItem value="deepak-gupta">Deepak Gupta</MenuItem>
                  <MenuItem value="vinayak-mane">Vinayak Mane</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="proactive-select-label" shrink>Proactive/ Reactive</InputLabel>
                <MuiSelect
                  labelId="proactive-select-label"
                  label="Proactive/ Reactive"
                  displayEmpty
                  value={formData.proactiveReactive}
                  onChange={(e) => handleInputChange('proactiveReactive', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Proactive/Reactive</em></MenuItem>
                  <MenuItem value="proactive">Proactive</MenuItem>
                  <MenuItem value="reactive">Reactive</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <TextField
                label="Reference Number"
                placeholder="Enter reference number"
                value={formData.referenceNumber}
                onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <TextField
                label="Description*"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="mode-select-label" shrink>Mode*</InputLabel>
                <MuiSelect
                  labelId="mode-select-label"
                  label="Mode*"
                  displayEmpty
                  value={formData.mode}
                  onChange={(e) => handleInputChange('mode', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Complaint Mode</em></MenuItem>
                  <MenuItem value="call">Call</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="web">Web</MenuItem>
                  <MenuItem value="app">App</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>
        </div>

        {/* Attachment Section */}
        <div className="p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full flex items-center justify-center">
                 <Paperclip className="w-4 h-4 text-[#C72030]" />
            </div>
            <h2 className="text-lg font-semibold text-orange-800">ATTACHMENT</h2>
          </div>

          <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <p className="text-gray-600">
                Drag & Drop or{' '}
                <span className="text-orange-500 underline">Choose Files</span>
              </p>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              {attachedFiles.length > 0 
                ? `${attachedFiles.length} file(s) selected`
                : 'No file chosen'
              }
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button 
            onClick={handleSubmit}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90 px-8 py-2"
          >
            Submit
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/maintenance/ticket')}
            className="px-8 py-2"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};
