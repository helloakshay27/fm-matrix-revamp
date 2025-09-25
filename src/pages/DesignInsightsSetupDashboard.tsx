import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { getToken, getBaseUrl } from '@/utils/auth';

export const DesignInsightsSetupDashboard = () => {
  const [categoryInput, setCategoryInput] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [subCategoryInput, setSubCategoryInput] = useState('');
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  const [subCategories, setSubCategories] = useState<{ category: string; subCategory: string }[]>([]);

  const getAuthConfig = () => {
    const token = getToken();
    const baseUrl = getBaseUrl();

    if (!token || !baseUrl) {
      throw new Error('Authentication token or base URL not found');
    }

    return {
      baseUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };
  };

  const fetchCategories = async () => {
    try {
      const { baseUrl, headers } = getAuthConfig();

      const response = await axios.get(
        `${baseUrl}/pms/design_input_tags.json`,
        { headers }
      );

      const data = response.data.data;

      const designInputCategories = data
        .filter((item: any) => item.tag_type === 'DesignInputCategory')
        .map((item: any) => ({
          id: item.id,
          name: item.name,
        }));

      const designSubCategories = data
        .filter((item: any) => item.tag_type === 'DesignInputsSubCategory' && item.parent_id)
        .map((item: any) => ({
          category: designInputCategories.find((cat) => cat.id === item.parent_id)?.name || 'Unknown',
          subCategory: item.name,
        }));

      setCategories(designInputCategories);
      setSubCategories(designSubCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async () => {
    if (categoryInput.trim()) {
      try {
        const { baseUrl, headers } = getAuthConfig();

        const payload = {
          incidence_tag: {
            tag_type: 'DesignInputCategory',
            active: true,
            name: categoryInput.trim(),
          },
        };

        await axios.post(
          `${baseUrl}/pms/design_input_tags.json`,
          payload,
          { headers }
        );

        setCategoryInput('');
        fetchCategories();
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  const handleAddSubCategory = async () => {
    if (selectedCategoryId && subCategoryInput.trim()) {
      try {
        const { baseUrl, headers } = getAuthConfig();

        const payload = {
          incidence_tag: {
            tag_type: 'DesignInputsSubCategory',
            active: true,
            parent_id: selectedCategoryId,
            name: subCategoryInput.trim(),
          },
        };

        await axios.post(
          `${baseUrl}/pms/design_input_tags.json`,
          payload,
          { headers }
        );

        setSubCategoryInput('');
        fetchCategories(); // Refresh subcategories
      } catch (error) {
        console.error('Error adding subcategory:', error);
      }
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    const selected = categories.find((cat) => cat.id === Number(event.target.value));
    if (selected) {
      setSelectedCategoryId(selected.id);
      setSelectedCategoryName(selected.name);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">DESIGN INSIGHT TAGS</h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="category" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 mb-6">
          <TabsTrigger
            value="category"
            className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] font-semibold"
          >
            Category
          </TabsTrigger>
          <TabsTrigger
            value="subcategory"
            className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] font-semibold"
          >
            Sub Category
          </TabsTrigger>
        </TabsList>

        {/* === CATEGORY TAB === */}
        <TabsContent value="category" className="space-y-6 mt-5">
          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category*
                </label>
                <Input
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
              <Button
                onClick={handleAddCategory}
                className="bg-purple-700 hover:bg-purple-800 text-white"
              >
                {/* <Plus className="w-4 h-4 mr-2" /> */}
                Submit
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 min-h-[400px]">
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-4">Name</h3>
            <div className="space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white p-3 rounded border text-center text-gray-700"
                >
                  {cat.name}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* === SUB CATEGORY TAB === */}
        <TabsContent value="subcategory" className="space-y-6 mt-5">
          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <FormControl fullWidth size="small">
                  <InputLabel id="category-select-label">Category*</InputLabel>
                  <Select
                    labelId="category-select-label"
                    value={selectedCategoryId?.toString() || ''}
                    label="Category*"
                    onChange={handleCategoryChange}
                  >
                    <MenuItem value="">
                      <em>Select Category</em>
                    </MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Category Name*
                </label>
                <Input
                  value={subCategoryInput}
                  onChange={(e) => setSubCategoryInput(e.target.value)}
                  placeholder="Enter sub category name"
                />
              </div>
              <Button
                onClick={handleAddSubCategory}
                className="bg-purple-700 hover:bg-purple-800 text-white"
              >
                {/* <Plus className="w-4 h-4 mr-2" /> */}
                Submit
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 min-h-[400px]">
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4 font-semibold text-gray-900 text-center bg-white py-3 rounded border">
                <div>Category</div>
                <div>Sub Category</div>
              </div>
            </div>
            <div className="space-y-2">
              {subCategories.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-4 bg-white p-3 rounded border text-center text-gray-700"
                >
                  <div>{item.category}</div>
                  <div>{item.subCategory}</div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesignInsightsSetupDashboard;
