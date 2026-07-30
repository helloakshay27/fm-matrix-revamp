import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, X, Plus, Building2, FolderOpen } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { AddCategoryModal } from '@/components/AddCategoryModal';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: number;
  category: string;
  amount: string;
  active: boolean;
}

export const AddProjectDashboard = () => {
  const navigate = useNavigate();
  const { toast: showToast } = useToast();
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    building: '',
    floor: '',
    unit: '',
    user: '',
    description: '',
    requestDate: '',
    vendor: '',
    category: ''
  });

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
    '& .MuiInputBase-inputMultiline': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating project:', formData);
    console.log('Categories:', categories);
    console.log('Uploaded files:', uploadedFiles);
    
    // Add the new project data to localStorage for the Fitout Request List
    const existingProjects = JSON.parse(localStorage.getItem('fitoutProjects') || '[]');
    const newProject = {
      id: Date.now(),
      user: formData.user || 'New User',
      category: formData.category || 'General',
      description: formData.description || 'No description',
      tower: formData.building || 'Building A',
      unit: formData.unit || 'Unit 101',
      supplier: formData.vendor || 'Default Vendor',
      masterStatus: 'Pending',
      createdOn: new Date().toLocaleDateString()
    };
    
    existingProjects.push(newProject);
    localStorage.setItem('fitoutProjects', JSON.stringify(existingProjects));
    
    showToast({
      title: "Success",
      description: "Project created successfully!",
    });
    navigate('/transitioning/fitout/request');
  };

  const handleAddCategory = (categoryData: { category: string; amount?: string }) => {
    const newCategory: Category = {
      id: Date.now(),
      category: categoryData.category,
      amount: categoryData.amount || '',
      active: true
    };
    setCategories(prev => [...prev, newCategory]);
    showToast({
      title: "Success",
      description: "Category added successfully!",
    });
  };

  const handleRemoveCategory = (id: number) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    showToast({
      title: "Success",
      description: "Category removed successfully!",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      showToast({
        title: "Success",
        description: `${newFiles.length} file(s) uploaded successfully!`,
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    showToast({
      title: "Success",
      description: "File removed successfully!",
    });
  };

  const handleGoBack = () => {
    navigate('/transitioning/fitout/request');
  };

  const handleCancel = () => {
    navigate('/transitioning/fitout/request');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span>Fitout Request List</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">Create New Project</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">NEW PROJECT</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <Building2 size={16} color="#C72030" />
              </span>
              Basic Details
            </h2>
          </div>
          <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel id="building-label" shrink>Building*</InputLabel>
              <MuiSelect
                labelId="building-label"
                label="Building*"
                displayEmpty
                value={formData.building}
                onChange={(e) => setFormData(prev => ({...prev, building: e.target.value}))}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Building</em></MenuItem>
                <MenuItem value="building-a">Building A</MenuItem>
                <MenuItem value="building-b">Building B</MenuItem>
                <MenuItem value="building-c">Building C</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div>
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel id="floor-label" shrink>Floor*</InputLabel>
              <MuiSelect
                labelId="floor-label"
                label="Floor*"
                displayEmpty
                value={formData.floor}
                onChange={(e) => setFormData(prev => ({...prev, floor: e.target.value}))}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Floor</em></MenuItem>
                <MenuItem value="ground">Ground Floor</MenuItem>
                <MenuItem value="first">First Floor</MenuItem>
                <MenuItem value="second">Second Floor</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div>
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel id="unit-label" shrink>Unit*</InputLabel>
              <MuiSelect
                labelId="unit-label"
                label="Unit*"
                displayEmpty
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({...prev, unit: e.target.value}))}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Unit</em></MenuItem>
                <MenuItem value="unit-101">Unit 101</MenuItem>
                <MenuItem value="unit-102">Unit 102</MenuItem>
                <MenuItem value="unit-103">Unit 103</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div>
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel id="user-label" shrink>User*</InputLabel>
              <MuiSelect
                labelId="user-label"
                label="User*"
                displayEmpty
                value={formData.user}
                onChange={(e) => setFormData(prev => ({...prev, user: e.target.value}))}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select User</em></MenuItem>
                <MenuItem value="john-doe">John Doe</MenuItem>
                <MenuItem value="jane-smith">Jane Smith</MenuItem>
                <MenuItem value="mike-johnson">Mike Johnson</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 relative w-full">
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              rows={3}
              placeholder=" "
              className="peer block w-full appearance-none rounded border border-gray-300 bg-white px-3 pt-6 pb-2 text-base text-gray-900 placeholder-transparent
      focus:outline-none
      focus:border-[2px]
      focus:border-[rgb(25,118,210)]
      resize-vertical"
            />

            <label
              htmlFor="description"
              className="absolute left-3 -top-[10px] bg-white px-1 text-sm text-gray-500 z-[1] transition-all duration-200
      peer-placeholder-shown:top-4
      peer-placeholder-shown:text-base
      peer-placeholder-shown:text-gray-400
      peer-focus:-top-[10px]
      peer-focus:text-sm
      peer-focus:text-[rgb(25,118,210)]"
            >
              Description
            </label>
          </div>

          <div className="md:col-span-1">
            <TextField
              label="Request Date"
              type="date"
              value={formData.requestDate}
              onChange={(e) => setFormData(prev => ({...prev, requestDate: e.target.value}))}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>

          <div className="md:col-span-1">
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel id="vendor-label" shrink>Vendor</InputLabel>
              <MuiSelect
                labelId="vendor-label"
                label="Vendor"
                displayEmpty
                value={formData.vendor}
                onChange={(e) => setFormData(prev => ({...prev, vendor: e.target.value}))}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Vendor</em></MenuItem>
                <MenuItem value="vendor-a">Vendor A</MenuItem>
                <MenuItem value="vendor-b">Vendor B</MenuItem>
                <MenuItem value="vendor-c">Vendor C</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>
        </div>
          </div>
        </div>

        {/* Section 2: Category and Attachment */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <FolderOpen size={16} color="#C72030" />
              </span>
              Category and Attachment
            </h2>
          </div>
          <div className="p-6 space-y-6">
        {/* Dynamic Categories */}
        <div className="space-y-4 mb-6">
          {categories.map((category) => (
            <div key={category.id} className="flex gap-2 items-end">
              <div className="flex-1">
                <TextField
                  value={category.category}
                  fullWidth
                  variant="outlined"
                  InputProps={{ readOnly: true, sx: { ...fieldStyles, backgroundColor: '#f9fafb' } }}
                  sx={{ mt: 1 }}
                />
              </div>
              <div className="flex-1">
                <TextField
                  value={category.amount}
                  fullWidth
                  variant="outlined"
                  InputProps={{ readOnly: true, sx: { ...fieldStyles, backgroundColor: '#f9fafb' } }}
                  sx={{ mt: 1 }}
                />
              </div>
              <Button 
                type="button" 
                variant="destructive" 
                size="icon"
                className="bg-[#C72030] hover:bg-[#C72030]/90"
                onClick={() => handleRemoveCategory(category.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* File Upload Section */}
        <div className="mb-6">
          <div className="space-y-4">
            <div>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="bg-[#C72030] text-white hover:bg-[#C72030]/90 border-[#C72030]"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </div>
            
            {/* Display uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Category Button */}
        <Button
          type="button"
          onClick={() => setShowAddCategoryModal(true)}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-6">
          <Button
            type="submit"
            variant="ghost"
            className="fm-button-fix fm-button-brand px-8 py-2"
          >
            Create
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="fm-button-fix border-brand text-brand hover:bg-brand-selected px-8 py-2"
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onSubmit={handleAddCategory}
        showTimings={false}
        showAmount={true}
      />
    </div>
  );
};
