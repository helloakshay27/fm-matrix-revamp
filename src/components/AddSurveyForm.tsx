
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, SelectChangeEvent } from '@mui/material';
import { useToast } from '@/hooks/use-toast';

interface AddSurveyFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddSurveyForm = ({ isOpen, onClose }: AddSurveyFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    surveyTitle: '',
    category: '',
  });

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFormData(prev => ({ ...prev, category: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Survey submitted:', formData);
    toast({
      title: 'Success',
      description: 'Survey added successfully!',
    });
    onClose();
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1a1a1a]">Add New Survey</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <TextField
              label="Survey Title"
              name="surveyTitle"
              value={formData.surveyTitle}
              onChange={handleInputChange}
              placeholder="Enter Survey Title"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>
          
          <div>
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel id="category-select-label" shrink>Category</InputLabel>
              <MuiSelect
                labelId="category-select-label"
                label="Category"
                value={formData.category}
                onChange={handleSelectChange}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Category</em></MenuItem>
                <MenuItem value="Feedback">Feedback</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
                <MenuItem value="Security">Security</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#C72030] text-white rounded-lg hover:bg-[#A01B28]"
            >
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
