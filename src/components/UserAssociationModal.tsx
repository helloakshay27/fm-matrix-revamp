
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { X, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserAssociationModalProps {
  isOpen: boolean;
  onClose: () => void;
  checklistName: string;
}

export const UserAssociationModal = ({ isOpen, onClose, checklistName }: UserAssociationModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    userType: '',
    userName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    notes: '',
    attachments: null as File | null
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, attachments: file }));
  };

  const handleSubmit = () => {
    console.log('User Association Data:', formData);
    toast({
      title: "Success",
      description: "User association completed successfully!",
    });
    onClose();
    // Reset form
    setFormData({
      userType: '',
      userName: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      notes: '',
      attachments: null
    });
  };

  const handleReset = () => {
    setFormData({
      userType: '',
      userName: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      notes: '',
      attachments: null
    });
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">
            User Association - {checklistName}
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4 py-6">
          <div className="grid grid-cols-2 gap-4">
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel id="user-type-label" shrink>User Type</InputLabel>
              <MuiSelect
                labelId="user-type-label"
                label="User Type"
                displayEmpty
                value={formData.userType}
                onChange={(e) => handleInputChange('userType', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select User Type</em></MenuItem>
                <MenuItem value="occupant">Occupant</MenuItem>
                <MenuItem value="fm">FM User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              placeholder="Enter User Name"
              value={formData.userName}
              onChange={(e) => handleInputChange('userName', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              placeholder="Enter Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              placeholder="Enter Phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel id="role-label" shrink>Role</InputLabel>
              <MuiSelect
                labelId="role-label"
                label="Role"
                displayEmpty
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Role</em></MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="technician">Technician</MenuItem>
                <MenuItem value="supervisor">Supervisor</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel id="department-label" shrink>Department</InputLabel>
              <MuiSelect
                labelId="department-label"
                label="Department"
                displayEmpty
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Department</em></MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="facility">Facility</MenuItem>
                <MenuItem value="security">Security</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="space-y-4">
            <TextField
              placeholder="Enter Notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <div className="space-y-2">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="attachment-upload"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <label htmlFor="attachment-upload" className="cursor-pointer">
                  <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <div className="text-sm text-gray-500">
                    {formData.attachments ? formData.attachments.name : 'Click to upload attachment'}
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4 border-t">
          <Button 
            onClick={handleSubmit}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
          >
            Submit
          </Button>
          <Button 
            variant="outline"
            onClick={handleReset}
            className="px-8"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
