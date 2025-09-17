import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  matrixTitle: string;
  triggerEvent: string;
  notificationType: string;
  noOfEscalations: string;
}

export const EditEscalationMatrixPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    matrixTitle: '',
    triggerEvent: '',
    notificationType: '',
    noOfEscalations: '',
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

  const notificationTypeOptions = [
    'Email',
    'SMS',
    'Push Notification',
    'In-App Notification',
    'Phone Call',
    'All Notifications'
  ];

  useEffect(() => {
    // Load existing data for editing
    const loadData = async () => {
      try {
        // Simulate API call to get escalation matrix data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data - in real app, this would come from API
        const mockData = {
          matrixTitle: 'Critical Issue Escalation',
          triggerEvent: 'System Down',
          notificationType: 'Email',
          noOfEscalations: '3',
        };
        
        setFormData(mockData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load escalation matrix data",
          variant: "destructive",
        });
        navigate('/settings/manage-users/escalation-matrix');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, navigate, toast]);

  const handleSubmit = async () => {
    if (!formData.matrixTitle || !formData.triggerEvent || !formData.notificationType || !formData.noOfEscalations) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
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
        description: "Escalation matrix updated successfully",
      });
      
      navigate('/settings/manage-users/escalation-matrix');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update escalation matrix",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/settings/manage-users/escalation-matrix');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading escalation matrix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">EDIT ESCALATION MATRIX</h1>
      
      {/* Escalation Matrix Details Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Escalation Matrix Details
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Matrix Title */}
            <div>
              <TextField
                label="Matrix Title" 
                placeholder="Enter Matrix Title"
                value={formData.matrixTitle}
                onChange={(e) => setFormData({...formData, matrixTitle: e.target.value})}
                fullWidth
                variant="outlined"
                required
                sx={fieldStyles}
              />
            </div>

            {/* Trigger Event */}
            <div>
              <TextField
                label="Trigger Event"
                placeholder="Enter Trigger Event"
                value={formData.triggerEvent}
                onChange={(e) => setFormData({...formData, triggerEvent: e.target.value})}
                fullWidth
                variant="outlined"
                required
                sx={fieldStyles}
              />
            </div>

            {/* Notification Type */}
            <div>
              <FormControl fullWidth variant="outlined" required sx={fieldStyles}>
                <InputLabel>Notification Type *</InputLabel>
                <MuiSelect
                  value={formData.notificationType}
                  onChange={(e) => setFormData({...formData, notificationType: e.target.value})}
                  label="Notification Type *"
                >
                  {notificationTypeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>

            {/* No Of Escalations */}
            <div>
              <TextField
                label="No Of Escalations"
                placeholder="Enter Number of Escalations"
                type="number"
                value={formData.noOfEscalations}
                onChange={(e) => setFormData({...formData, noOfEscalations: e.target.value})}
                fullWidth
                variant="outlined"
                required
                sx={fieldStyles}
                inputProps={{ min: 1, max: 10 }}
              />
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
              {isSubmitting ? 'Updating...' : 'Update Matrix'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};