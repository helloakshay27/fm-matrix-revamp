import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  name: string;
  mobileNumber: string;
  emailId: string;
  password: string;
  company: string;
  role: string;
  reportsTo: string;
}

export const AddInternalUserPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    mobileNumber: '',
    emailId: '',
    password: '',
    company: '',
    role: '',
    reportsTo: '',
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

  const companyOptions = [
    'ABC Corp',
    'XYZ Ltd',
    'Tech Solutions Inc',
    'Digital Systems',
    'Innovation Labs'
  ];

  const roleOptions = [
    'Project Manager',
    'Team Lead',
    'Senior Developer',
    'Developer',
    'QA Engineer',
    'Business Analyst',
    'System Administrator'
  ];

  const reportsToOptions = [
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
    'Sarah Wilson',
    'David Brown',
    'Lisa Davis'
  ];

  const handleSubmit = async () => {
    if (!formData.name || !formData.mobileNumber || !formData.emailId || !formData.password || !formData.company || !formData.role || !formData.reportsTo) {
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
    if (!mobileRegex.test(formData.mobileNumber.replace(/\s/g, ''))) {
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
        description: "Internal user created successfully",
      });
      
      navigate('/settings/manage-users/internal-users');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create internal user",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/settings/manage-users/internal-users');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">NEW INTERNAL USER</h1>
      
      {/* Internal User Details Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Internal User Details
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Name */}
            <div>
              <TextField
                label="Name" 
                placeholder="Enter Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                fullWidth
                variant="outlined"
                required
                sx={fieldStyles}
              />
            </div>

            {/* Mobile Number */}
            <div>
              <TextField
                label="Mobile Number"
                placeholder="Enter Mobile Number"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
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

            {/* Reports To */}
            <div>
              <FormControl fullWidth variant="outlined" required sx={fieldStyles}>
                <InputLabel>Reports To</InputLabel>
                <MuiSelect
                  value={formData.reportsTo}
                  onChange={(e) => setFormData({...formData, reportsTo: e.target.value})}
                  label="Reports To *"
                >
                  {reportsToOptions.map((option) => (
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