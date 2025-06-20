import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { AddCategoryModal } from '@/components/AddCategoryModal';

interface Category {
  id: number;
  category: string;
  amount: string;
  active: boolean;
}

export const AddProjectDashboard = () => {
  const navigate = useNavigate();
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
    
    toast.success('Project created successfully!');
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
    toast.success('Category added successfully!');
  };

  const handleRemoveCategory = (id: number) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    toast.success('Category removed successfully!');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) uploaded successfully!`);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('File removed successfully!');
  };

  return (
    <div className="p-6 max-w-4xl">
      {/* Basic Details Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">🏢</span>
          </div>
          <h2 className="text-xl font-bold text-orange-500">BASIC DETAILS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div>
            <Label htmlFor="building" className="text-sm font-medium mb-2 block">
              Building <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.building} onValueChange={(value) => setFormData(prev => ({...prev, building: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Building" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="building-a">Building A</SelectItem>
                <SelectItem value="building-b">Building B</SelectItem>
                <SelectItem value="building-c">Building C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="floor" className="text-sm font-medium mb-2 block">
              Floor <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.floor} onValueChange={(value) => setFormData(prev => ({...prev, floor: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ground">Ground Floor</SelectItem>
                <SelectItem value="first">First Floor</SelectItem>
                <SelectItem value="second">Second Floor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="unit" className="text-sm font-medium mb-2 block">
              Unit <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({...prev, unit: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unit-101">Unit 101</SelectItem>
                <SelectItem value="unit-102">Unit 102</SelectItem>
                <SelectItem value="unit-103">Unit 103</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="user" className="text-sm font-medium mb-2 block">
              User <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.user} onValueChange={(value) => setFormData(prev => ({...prev, user: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Select User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john-doe">John Doe</SelectItem>
                <SelectItem value="jane-smith">Jane Smith</SelectItem>
                <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="description" className="text-sm font-medium mb-2 block">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="requestDate" className="text-sm font-medium mb-2 block">
              Request Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="requestDate"
              type="date"
              placeholder="Request Date"
              value={formData.requestDate}
              onChange={(e) => setFormData(prev => ({...prev, requestDate: e.target.value}))}
            />
          </div>

          <div>
            <Label htmlFor="vendor" className="text-sm font-medium mb-2 block">
              Vendor
            </Label>
            <Select value={formData.vendor} onValueChange={(value) => setFormData(prev => ({...prev, vendor: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vendor-a">Vendor A</SelectItem>
                <SelectItem value="vendor-b">Vendor B</SelectItem>
                <SelectItem value="vendor-c">Vendor C</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Category and Attachment Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">📂</span>
          </div>
          <h2 className="text-xl font-bold text-orange-500">CATEGORY AND ATTACHMENT</h2>
        </div>

        {/* Dynamic Categories */}
        <div className="space-y-4 mb-6">
          {categories.map((category) => (
            <div key={category.id} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label className="text-sm font-medium mb-2 block">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Input value={category.category} readOnly className="bg-gray-50" />
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium mb-2 block">Amount</Label>
                <Input value={category.amount} readOnly className="bg-gray-50" />
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
          <Label className="text-sm font-medium mb-2 block">Upload Files</Label>
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
                <Label className="text-sm font-medium">Uploaded Files:</Label>
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

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
        >
          Create
        </Button>
      </div>

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
