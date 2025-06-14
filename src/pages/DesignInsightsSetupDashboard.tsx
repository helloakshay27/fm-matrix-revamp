
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

export const DesignInsightsSetupDashboard = () => {
  const [categoryInput, setCategoryInput] = useState('');

  const categories = [
    'Civil Infra',
    'Utilities, Services & Assets',
    'Inside Units',
    'Parking',
    'Club House & Amenities',
    'Security & surveillance',
    'Landscape',
    'Façade'
  ];

  const handleAddCategory = () => {
    if (categoryInput.trim()) {
      // Add logic to handle adding new category
      setCategoryInput('');
    }
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">Design Insight {'>'}  Design Insight Tag</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">DESIGN INSIGHT TAGS</h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="category" className="w-full">
        <TabsList className="grid w-fit grid-cols-2 mb-6">
          <TabsTrigger 
            value="category" 
            className="text-orange-600 data-[state=active]:text-orange-600 data-[state=active]:border-b-2 data-[state=active]:border-orange-600 data-[state=active]:bg-transparent rounded-none"
          >
            Category
          </TabsTrigger>
          <TabsTrigger 
            value="subcategory" 
            className="text-gray-500 data-[state=active]:text-orange-600 data-[state=active]:border-b-2 data-[state=active]:border-orange-600 data-[state=active]:bg-transparent rounded-none"
          >
            Sub Category
          </TabsTrigger>
        </TabsList>

        <TabsContent value="category" className="space-y-6">
          {/* Category Input Section */}
          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category*
                </label>
                <Input
                  id="category"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  placeholder="Enter category name"
                  className="w-full"
                />
              </div>
              <Button 
                onClick={handleAddCategory}
                className="bg-purple-700 hover:bg-purple-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-gray-50 rounded-lg p-6 min-h-[400px]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 text-center">Name</h3>
            </div>
            <div className="space-y-3">
              {categories.map((category, index) => (
                <div 
                  key={index}
                  className="bg-white p-3 rounded border text-center text-gray-700"
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="subcategory" className="space-y-6">
          {/* Sub Category Content */}
          <div className="bg-gray-50 rounded-lg p-6 min-h-[400px] flex items-center justify-center">
            <p className="text-gray-500">Sub Category management will be available here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesignInsightsSetupDashboard;
