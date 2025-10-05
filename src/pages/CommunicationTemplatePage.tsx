import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { toast } from 'sonner';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

interface CommunicationTemplate {
  id?: number;
  dropdown: string;
  field_value: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

const fieldStyles = {
  height: '40px',
  backgroundColor: '#fff',
  borderRadius: '4px',
  '& .MuiOutlinedInput-root': {
    height: '40px',
    fontSize: '14px',
    '& fieldset': {
      borderColor: '#ddd',
    },
    '&:hover fieldset': {
      borderColor: '#C72030',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '14px',
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
};

export const CommunicationTemplatePage = () => {
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTemplate, setNewTemplate] = useState<CommunicationTemplate>({
    dropdown: '',
    field_value: '',
    description: '',
  });

  const handleAddTemplate = async () => {
    if (!newTemplate.dropdown || !newTemplate.field_value) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const baseUrl = API_CONFIG.BASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const url = `https://${baseUrl}/communication_templates.json`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify({
          communication_template: {
            body: newTemplate.description || '',
            identifier: newTemplate.dropdown,
            identifier_action: newTemplate.field_value,
          },
        }),
      });

      if (response.ok) {
        toast.success('Template created successfully');
        setNewTemplate({ dropdown: '', field_value: '', description: '' });
      } else {
        throw new Error('Failed to create template');
      }
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
    }
  };

  return (
    <div className="p-6 bg-[#FAFAF8] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">
          Templates
        </h1>
        <p className="text-sm text-gray-600">
          Manage your templates for various purposes
        </p>
      </div>

      {/* Add New Template Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Add New Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex-1">
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>
                    Dropdown <span style={{ color: 'red' }}>*</span>
                  </InputLabel>
                  <Select
                    label="Dropdown"
                    notched
                    displayEmpty
                    value={newTemplate.dropdown}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, dropdown: e.target.value })
                    }
                    disabled={loading}
                  >
                    <MenuItem value="">Select an option</MenuItem>
                    <MenuItem value="Root Cause Analysis">Root Cause Analysis</MenuItem>
                    <MenuItem value="Preventive Action">Preventive Action</MenuItem>
                    <MenuItem value="Short-term Impact">Short-term Impact</MenuItem>
                    <MenuItem value="Corrective Action">Corrective Action</MenuItem>
                    <MenuItem value="Long-term Impact">Long-term Impact</MenuItem>
                    <MenuItem value="Responsible Person">Responsible Person</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="flex-1">
                <TextField
                  label={
                    <span>
                      Field Value <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  placeholder="Enter field value"
                  fullWidth
                  value={newTemplate.field_value}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, field_value: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <TextField
                label={
                  <span style={{ fontSize: '16px' }}>
                    Description
                  </span>
                }
                placeholder="Enter Description"
                fullWidth
                multiline
                minRows={4}
                value={newTemplate.description || ''}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, description: e.target.value })
                }
                disabled={loading}
                sx={{
                  mb: 0,
                  "& textarea": {
                    width: "100% !important",
                    resize: "both",
                    overflow: "auto",
                    boxSizing: "border-box",
                    display: "block",
                  },
                  "& textarea[aria-hidden='true']": {
                    display: "none !important",
                  },
                }}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleAddTemplate}
                className="bg-[#C72030] hover:bg-[#A01828] text-white"
                disabled={loading}
                style={{ borderRadius: 0 }}
              >
                Submit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};