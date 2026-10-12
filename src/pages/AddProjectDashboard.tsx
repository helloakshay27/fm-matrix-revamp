import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, Plus, Building2, FolderOpen, Paperclip } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { AddCategoryModal } from '@/components/AddCategoryModal';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useToast } from '@/hooks/use-toast';
import { FormSection, FormActionBar, assetFieldStyles } from '@/components/common/FormSection';
import { AttachmentUpload } from '@/components/common/AttachmentUpload';

interface Category {
  id: number;
  category: string;
  amount: string;
  active: boolean;
}

const requiredLabel = (text: string) => (
  <span>
    {text}
    <span className="fm-required-mark">*</span>
  </span>
);

const textareaSx = {
  "& .MuiOutlinedInput-root": { height: "auto !important", padding: "2px !important" },
};

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

  const handleFileUpload = (newFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...newFiles]);
    showToast({
      title: "Success",
      description: `${newFiles.length} file(s) uploaded successfully!`,
    });
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
    <div className="p-4 sm:p-6 max-w-full mx-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
          <button
            type="button"
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
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">NEW PROJECT</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Basic Details */}
        <FormSection title="BASIC DETAILS" icon={Building2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>{requiredLabel('Building')}</InputLabel>
              <MuiSelect
                label="Building*"
                notched
                displayEmpty
                value={formData.building}
                onChange={(e) => setFormData(prev => ({...prev, building: e.target.value}))}
                sx={assetFieldStyles}
              >
                <MenuItem value="">Select Building</MenuItem>
                <MenuItem value="building-a">Building A</MenuItem>
                <MenuItem value="building-b">Building B</MenuItem>
                <MenuItem value="building-c">Building C</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>{requiredLabel('Floor')}</InputLabel>
              <MuiSelect
                label="Floor*"
                notched
                displayEmpty
                value={formData.floor}
                onChange={(e) => setFormData(prev => ({...prev, floor: e.target.value}))}
                sx={assetFieldStyles}
              >
                <MenuItem value="">Select Floor</MenuItem>
                <MenuItem value="ground">Ground Floor</MenuItem>
                <MenuItem value="first">First Floor</MenuItem>
                <MenuItem value="second">Second Floor</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>{requiredLabel('Unit')}</InputLabel>
              <MuiSelect
                label="Unit*"
                notched
                displayEmpty
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({...prev, unit: e.target.value}))}
                sx={assetFieldStyles}
              >
                <MenuItem value="">Select Unit</MenuItem>
                <MenuItem value="unit-101">Unit 101</MenuItem>
                <MenuItem value="unit-102">Unit 102</MenuItem>
                <MenuItem value="unit-103">Unit 103</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>{requiredLabel('User')}</InputLabel>
              <MuiSelect
                label="User*"
                notched
                displayEmpty
                value={formData.user}
                onChange={(e) => setFormData(prev => ({...prev, user: e.target.value}))}
                sx={assetFieldStyles}
              >
                <MenuItem value="">Select User</MenuItem>
                <MenuItem value="john-doe">John Doe</MenuItem>
                <MenuItem value="jane-smith">Jane Smith</MenuItem>
                <MenuItem value="mike-johnson">Mike Johnson</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              label="Request Date"
              type="date"
              value={formData.requestDate}
              onChange={(e) => setFormData(prev => ({...prev, requestDate: e.target.value}))}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: assetFieldStyles }}
            />

            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Vendor</InputLabel>
              <MuiSelect
                label="Vendor"
                notched
                displayEmpty
                value={formData.vendor}
                onChange={(e) => setFormData(prev => ({...prev, vendor: e.target.value}))}
                sx={assetFieldStyles}
              >
                <MenuItem value="">Select Vendor</MenuItem>
                <MenuItem value="vendor-a">Vendor A</MenuItem>
                <MenuItem value="vendor-b">Vendor B</MenuItem>
                <MenuItem value="vendor-c">Vendor C</MenuItem>
              </MuiSelect>
            </FormControl>

            <div className="sm:col-span-2 lg:col-span-3">
              <TextField
                label="Description"
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={textareaSx}
              />
            </div>
          </div>
        </FormSection>

        {/* Category */}
        <FormSection
          title="CATEGORY"
          icon={FolderOpen}
          headerActions={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddCategoryModal(true)}
              className="text-brand border-brand hover:bg-brand-light"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Category
            </Button>
          }
        >
          {categories.length === 0 ? (
            <p className="text-sm text-gray-500">No categories added yet.</p>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="flex gap-4 items-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                    <TextField
                      label="Category"
                      value={category.category}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ readOnly: true, sx: assetFieldStyles }}
                    />
                    <TextField
                      label="Amount"
                      value={category.amount}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ readOnly: true, sx: assetFieldStyles }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(category.id)}
                    className="flex items-center justify-center w-8 h-8 rounded-md text-brand hover:bg-brand-light transition-colors shrink-0"
                    aria-label="Remove category"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </FormSection>

        {/* Attachments */}
        <FormSection title="ATTACHMENTS" icon={Paperclip}>
          <AttachmentUpload
            chooseText="Choose File"
            uploadText="Upload File"
            emptyText="No file chosen"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            multiple
            files={uploadedFiles}
            onFilesSelected={handleFileUpload}
            onRemove={handleRemoveFile}
          />
        </FormSection>

        <FormActionBar
          onCancel={handleCancel}
          submitLabel="Create"
          submitAsFormSubmit
        />
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
