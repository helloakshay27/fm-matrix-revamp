import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddCategoryModal } from "@/components/AddCategoryModal";
import { EditCategoryModal } from "@/components/EditCategoryModal";
import { AddDeviationStatusModal } from "@/components/AddDeviationStatusModal";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: number;
  category: string;
  amount: string;
  active: boolean;
}

export const FitoutSetupDashboard = () => {
  const [activeTab, setActiveTab] = useState('Category');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isAddDeviationOpen, setIsAddDeviationOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();
  
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, category: 'ho', amount: '', active: true },
    { id: 2, category: 'Furniture', amount: '', active: true },
    { id: 3, category: 'xx', amount: '', active: false }
  ]);

  const tabs = ['Category', 'Status', 'Fitout Guide', 'Deviation Status'];

  const handleAddCategory = (newCategory: { category: string; amount: string }) => {
    const category: Category = {
      id: categories.length + 1,
      category: newCategory.category,
      amount: newCategory.amount,
      active: true
    };
    setCategories([...categories, category]);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsEditCategoryOpen(true);
  };

  const handleUpdateCategory = (updatedCategory: Category) => {
    setCategories(categories.map(cat => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    ));
    setEditingCategory(null);
  };

  const handleToggleActive = (id: number) => {
    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, active: !cat.active } : cat
    ));
    
    // Show success toast
    toast({
      title: "Updated successfully.",
      className: "bg-green-500 text-white border-green-500",
    });
  };

  const renderCategoryTab = () => (
    <div>
      <div className="mb-6">
        <Button 
          onClick={() => setIsAddCategoryOpen(true)}
          className="bg-purple-700 hover:bg-purple-800 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Actions</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Active/Inactive</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <Edit 
                    className="w-4 h-4 text-blue-500 cursor-pointer" 
                    onClick={() => handleEditCategory(category)}
                  />
                </TableCell>
                <TableCell>{category.category}</TableCell>
                <TableCell>{category.amount}</TableCell>
                <TableCell>
                  <Checkbox 
                    checked={category.active} 
                    onCheckedChange={() => handleToggleActive(category.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const renderStatusTab = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div>
          <Label htmlFor="status" className="text-sm font-medium mb-2 block">
            Status
          </Label>
          <Input
            id="status"
            placeholder="Enter status"
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="fixedState" className="text-sm font-medium mb-2 block">
            Fixed State
          </Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Fixed State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="state1">State 1</SelectItem>
              <SelectItem value="state2">State 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="color" className="text-sm font-medium mb-2 block">
            Color
          </Label>
          <Input
            id="color"
            type="color"
            className="w-full h-10"
          />
        </div>

        <div>
          <Label htmlFor="statusOrder" className="text-sm font-medium mb-2 block">
            Status Order
          </Label>
          <Input
            id="statusOrder"
            placeholder="Enter status order"
            className="w-full"
          />
        </div>
      </div>

      <div className="mb-6">
        <Button className="bg-purple-700 hover:bg-purple-800 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Actions</TableHead>
              <TableHead className="font-semibold">Order</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Fixed State</TableHead>
              <TableHead className="font-semibold">Color</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No data available
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const renderFitoutGuideTab = () => (
    <div>
      <div className="mb-6">
        <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
          <div className="mb-4">
            <span className="text-orange-500 font-medium">Choose File</span>
            <span className="text-gray-500 ml-2">No file chosen</span>
          </div>
          <Button className="bg-purple-700 hover:bg-purple-800 text-white">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Actions</TableHead>
              <TableHead className="font-semibold">SR No.</TableHead>
              <TableHead className="font-semibold">File Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                No files uploaded
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const renderDeviationStatusTab = () => (
    <div>
      <div className="mb-6">
        <Button 
          onClick={() => setIsAddDeviationOpen(true)}
          className="bg-purple-700 hover:bg-purple-800 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Actions</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Active/Inactive</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                No deviation status found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Category':
        return renderCategoryTab();
      case 'Status':
        return renderStatusTab();
      case 'Fitout Guide':
        return renderFitoutGuideTab();
      case 'Deviation Status':
        return renderDeviationStatusTab();
      default:
        return renderCategoryTab();
    }
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">Fitout &gt; Fitout Request</span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">FITOUT SETUP</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 font-medium border-b-2 ${
              activeTab === tab
                ? 'text-orange-500 border-orange-500'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Modals */}
      <AddCategoryModal 
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onSubmit={handleAddCategory}
      />
      
      <EditCategoryModal 
        isOpen={isEditCategoryOpen}
        onClose={() => setIsEditCategoryOpen(false)}
        category={editingCategory}
        onSubmit={handleUpdateCategory}
      />
      
      <AddDeviationStatusModal 
        isOpen={isAddDeviationOpen}
        onClose={() => setIsAddDeviationOpen(false)}
      />
    </div>
  );
};
