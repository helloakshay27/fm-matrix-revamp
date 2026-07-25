
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Upload } from 'lucide-react';
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

  const fieldHeightSx = {
    height: 48,
    '& .MuiInputBase-input': {
      padding: '12px 14px',
    },
    '& .MuiSelect-select': {
      padding: '12px 14px',
    },
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        User Association - {checklistName}
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: { xs: '100%', sm: '48%' } }}>
              <FormControl fullWidth>
                <InputLabel shrink id="user-type-label" sx={{ backgroundColor: 'white', px: 1 }}>
                  User Type
                </InputLabel>
                <Select
                  labelId="user-type-label"
                  value={formData.userType}
                  onChange={(e) => handleInputChange('userType', e.target.value)}
                  displayEmpty
                  sx={fieldHeightSx}
                >
                  <MenuItem value=""><em>Select User Type</em></MenuItem>
                  <MenuItem value="occupant">Occupant</MenuItem>
                  <MenuItem value="fm">FM User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ flex: '1 1 300px', minWidth: { xs: '100%', sm: '48%' } }}>
              <TextField
                label="User Name"
                placeholder="Enter User Name"
                value={formData.userName}
                onChange={(e) => handleInputChange('userName', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldHeightSx }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: { xs: '100%', sm: '48%' } }}>
              <TextField
                label="Email"
                placeholder="Enter Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldHeightSx }}
              />
            </Box>

            <Box sx={{ flex: '1 1 300px', minWidth: { xs: '100%', sm: '48%' } }}>
              <TextField
                label="Phone"
                placeholder="Enter Phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldHeightSx }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: { xs: '100%', sm: '48%' } }}>
              <FormControl fullWidth>
                <InputLabel shrink id="role-label" sx={{ backgroundColor: 'white', px: 1 }}>
                  Role
                </InputLabel>
                <Select
                  labelId="role-label"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  displayEmpty
                  sx={fieldHeightSx}
                >
                  <MenuItem value=""><em>Select Role</em></MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="technician">Technician</MenuItem>
                  <MenuItem value="supervisor">Supervisor</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ flex: '1 1 300px', minWidth: { xs: '100%', sm: '48%' } }}>
              <FormControl fullWidth>
                <InputLabel shrink id="department-label" sx={{ backgroundColor: 'white', px: 1 }}>
                  Department
                </InputLabel>
                <Select
                  labelId="department-label"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  displayEmpty
                  sx={fieldHeightSx}
                >
                  <MenuItem value=""><em>Select Department</em></MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="facility">Facility</MenuItem>
                  <MenuItem value="security">Security</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <TextField
            label="Notes"
            placeholder="Enter Notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            fullWidth
            multiline
            minRows={4}
            InputLabelProps={{ shrink: true }}
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
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleSubmit}
          className="fm-button-fix fm-button-brand h-[45px] px-5 font-medium text-[16px]"
          disableElevation
        >
          Submit
        </Button>
        <Button
          onClick={handleReset}
          className="fm-button-fix fm-button-brand h-[45px] px-5 font-medium text-[16px]"
          disableElevation
        >
          Reset
        </Button>
      </DialogActions>
    </Dialog>
  );
};
