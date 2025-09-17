import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  username: string;
  emailId: string;
  mobile: string;
  password: string;
  organisation: string;
  company: string;
  role: string;
}

export const AddExternalUserPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    emailId: '',
    mobile: '',
    password: '',
    organisation: '',
    company: '',
    role: '',
  });

  // Field styles for Material-UI components (matching VisitorFormPage)
  const fieldStyles = {
    height: "45px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    "& .MuiOutlinedInput-root": {
      height: "45px",
      "& fieldset": { borderColor: "#ddd" },
      "&:hover fieldset": { borderColor: "#C72030" },
      "&.Mui-focused fieldset": { borderColor: "#C72030" },
    },
    "& .MuiInputLabel-root": {
      "&.Mui-focused": { color: "#C72030" },
      "& .MuiInputLabel-asterisk": {
        color: "#C72030 !important",
      },
    },
    "& .MuiFormLabel-asterisk": {
      color: "#C72030 !important",
    },
  };

  const organisationOptions = [
    'Vendor Solutions',
    'Tech Contractors',
    'Freelance Network',
    'External Partners',
    'Consulting Group',
    'Service Providers'
  ];

  const companyOptions = [
    'ABC Corp',
    'XYZ Ltd',
    'Tech Solutions Inc',
    'Digital Systems',
    'Innovation Labs'
  ];

  const roleOptions = [
    'Consultant',
    'Specialist',
    'Contractor',
    'Vendor',
    'External Developer',
    'Service Provider',
    'Technical Expert'
  ];

  const handleSubmit = async () => {
    if (!formData.username || !formData.emailId || !formData.mobile || !formData.password || !formData.organisation || !formData.company || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailId)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Basic mobile number validation
    const mobileRegex = /^[+]?[0-9]{10,15}$/;
    if (!mobileRegex.test(formData.mobile.replace(/\s/g, ''))) {
      toast({
        title: "Error",
        description: "Please enter a valid mobile number",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "External user created successfully",
      });
      
      navigate('/settings/manage-users/external-users');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create external user",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/settings/manage-users/external-users');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">NEW EXTERNAL USER</h1>
      
      {/* External User Details Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            External User Details
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Username */}
            <div>
              <TextField
                label="Username" 
                placeholder="Enter Username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                fullWidth
                variant="outlined"
                required
                sx={fieldStyles}
              />
            </div>

            {/* Email Id */}
            <div>
              <TextField
                label="Email Id"
                placeholder="Enter Email Address"
                type="email"
                value={formData.emailId}
                onChange={(e) => setFormData({...formData, emailId: e.target.value})}
                fullWidth
                variant="outlined"
                required
                sx={fieldStyles}
              />
            </div>

            {/* Mobile */}
            <div>
              <TextField
                label="Mobile"
                placeholder="Enter Mobile Number"
                value={formData.mobile}
                onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                fullWidth
                variant="outlined"
                required
                sx={fieldStyles}
              />
            </div>

            {/* Password */}
            <div>
              <TextField
                label="Password"
                placeholder="Enter Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                fullWidth
                variant="outlined"
                required
                sx={fieldStyles}
              />
            </div>

            {/* Organisation */}
            <div>
              <FormControl fullWidth variant="outlined" required sx={fieldStyles}>
                <InputLabel>Organisation</InputLabel>
                <MuiSelect
                  value={formData.organisation}
                  onChange={(e) => setFormData({...formData, organisation: e.target.value})}
                  label="Organisation *"
                >
                  {organisationOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>

            {/* Company */}
            <div>
              <FormControl fullWidth variant="outlined" required sx={fieldStyles}>
                <InputLabel>Company</InputLabel>
                <MuiSelect
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  label="Company *"
                >
                  {companyOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>

            {/* Role */}
            <div>
              <FormControl fullWidth variant="outlined" required sx={fieldStyles}>
                <InputLabel>Role</InputLabel>
                <MuiSelect
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  label="Role *"
                >
                  {roleOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 pt-6 border-t">
            <Button 
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {isSubmitting ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};