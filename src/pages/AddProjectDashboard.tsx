
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export const AddProjectDashboard = () => {
  const navigate = useNavigate();
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
    // Handle form submission
    navigate('/projects');
  };

  const handleAddCategory = () => {
    console.log('Adding new category');
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
                <SelectItem value="building1">Building 1</SelectItem>
                <SelectItem value="building2">Building 2</SelectItem>
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
                <SelectItem value="floor1">Floor 1</SelectItem>
                <SelectItem value="floor2">Floor 2</SelectItem>
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
                <SelectItem value="unit1">Unit 1</SelectItem>
                <SelectItem value="unit2">Unit 2</SelectItem>
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
                <SelectItem value="user1">User 1</SelectItem>
                <SelectItem value="user2">User 2</SelectItem>
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
                <SelectItem value="vendor1">Vendor 1</SelectItem>
                <SelectItem value="vendor2">Vendor 2</SelectItem>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="category" className="text-sm font-medium mb-2 block">
              Category <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category1">Category 1</SelectItem>
                  <SelectItem value="category2">Category 2</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                variant="destructive" 
                size="icon"
                className="bg-red-500 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <Button
            type="button"
            variant="outline"
            className="bg-purple-700 text-white hover:bg-purple-800 border-purple-700"
          >
            <Upload className="w-4 h-4 mr-2" />
          </Button>
        </div>

        {/* Add Category Button */}
        <Button
          type="button"
          onClick={handleAddCategory}
          className="bg-purple-700 hover:bg-purple-800 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          className="bg-purple-700 hover:bg-purple-800 text-white px-8"
        >
          Create
        </Button>
      </div>
    </div>
  );
};
