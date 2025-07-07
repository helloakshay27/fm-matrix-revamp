import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Upload } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddCategoryModal } from "@/components/AddCategoryModal";
import { EditCategoryModal } from "@/components/EditCategoryModal";
import { AddDeviationStatusModal } from "@/components/AddDeviationStatusModal";
import { AddStatusModal } from "@/components/AddStatusModal";
import { Checkbox } from "@/components/ui/checkbox";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: number;
  category: string;
  amount: string;
  active: boolean;
}

interface Status {
  id: number;
  order: number;
  status: string;
  fixedState: string;
  color: string;
}

interface UploadedFile {
  id: number;
  fileName: string;
}

export const FitoutSetupDashboard = () => {
  const [activeTab, setActiveTab] = useState('Category');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isAddDeviationOpen, setIsAddDeviationOpen] = useState(false);
  const [isAddStatusOpen, setIsAddStatusOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, category: 'ho', amount: '', active: true },
    { id: 2, category: 'Furniture', amount: '', active: true },
    { id: 3, category: 'xx', amount: '', active: false }
  ]);

  const [statuses, setStatuses] = useState<Status[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const tabs = ['Category', 'Status', 'Fitout Guide', 'Deviation Status'];

  const handleAddCategory = (newCategory: { category: string; amount?: string }) => {
    const category: Category = {
      id: categories.length + 1,
      category: newCategory.category,
      amount: newCategory.amount || '',
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

    toast({
      title: "Success",
      description: "Category updated successfully!",
    });
  };

  const handleAddStatus = (newStatus: { status: string; fixedState: string; color: string; order: string }) => {
    const status: Status = {
      id: statuses.length + 1,
      order: parseInt(newStatus.order) || statuses.length + 1,
      status: newStatus.status,
      fixedState: newStatus.fixedState,
      color: newStatus.color
    };
    setStatuses([...statuses, status]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const newFile: UploadedFile = {
          id: uploadedFiles.length + 1,
          fileName: file.name
        };
        setUploadedFiles(prev => [...prev, newFile]);
      });

      toast({
        title: "Success",
        description: "File uploaded successfully!",
      });
    }
  };

  const renderCategoryTab = () => (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          onClick={() => setIsAddCategoryOpen(true)}
          className="hover:bg-[#C72030]/90 text-white"
          style={{ backgroundColor: 'rgb(199 32 48 / var(--tw-text-opacity, 1))' }}
        >
          <Plus className="w-4 h-4 mr-2 stroke-[#C72030] text-white" />
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
                  <Edit className="w-4 h-4 stroke-[#C72030] cursor-pointer" onClick={() => handleEditCategory(category)} />
                </TableCell>
                <TableCell>{category.category}</TableCell>
                <TableCell>{category.amount}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={category.active}
                    onCheckedChange={() => handleToggleActive(category.id)}
                    className="data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030] border-[#C72030]"
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
          <TextField
            placeholder="Enter status"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />
        </div>
        <div>
          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id="fixed-state-label" shrink>Fixed State</InputLabel>
            <MuiSelect
              labelId="fixed-state-label"
              label="Fixed State"
              displayEmpty
              sx={fieldStyles}
            >
              <MenuItem value=""><em>Select Fixed State</em></MenuItem>
              <MenuItem value="state1">State 1</MenuItem>
              <MenuItem value="state2">State 2</MenuItem>
            </MuiSelect>
          </FormControl>
        </div>
        <div>
          <TextField
            type="color"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />
        </div>
        <div>
          <TextField
            placeholder="Enter status order"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          onClick={() => setIsAddStatusOpen(true)}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2 stroke-[#C72030] text-white" />
          Add
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Actions</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fixed State</TableHead>
              <TableHead>Color</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statuses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              statuses.map((status) => (
                <TableRow key={status.id}>
                  <TableCell>
                    <Edit className="w-4 h-4 stroke-[#C72030] cursor-pointer" />
                  </TableCell>
                  <TableCell>{status.order}</TableCell>
                  <TableCell>{status.status}</TableCell>
                  <TableCell>{status.fixedState}</TableCell>
                  <TableCell>
                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: status.color }} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const renderFitoutGuideTab = () => (
    <div>
      <div className="mb-6">
        <div className="border-2 border-dashed rounded-lg p-8 text-center" style={{ borderColor: '#C72030' }}>
          <div className="mb-4">
            <span className="font-medium" style={{ color: '#C72030' }}>Choose File</span>
            <span className="text-gray-500 ml-2">No file chosen</span>
          </div>
          <label htmlFor="file-upload">
            <Button className="bg-[#C72030] hover:bg-[#C72030]/90 text-white cursor-pointer" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2 stroke-[#C72030] text-white" />
                Upload
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Actions</TableHead>
              <TableHead>SR No.</TableHead>
              <TableHead>File Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uploadedFiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  No files uploaded
                </TableCell>
              </TableRow>
            ) : (
              uploadedFiles.map((file, index) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <Edit className="w-4 h-4 stroke-[#C72030] cursor-pointer" />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{file.fileName}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const renderDeviationStatusTab = () => (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          onClick={() => setIsAddDeviationOpen(true)}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2 stroke-[#C72030] text-white" />
          Add
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Actions</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Active/Inactive</TableHead>
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
      case 'Category': return renderCategoryTab();
      case 'Status': return renderStatusTab();
      case 'Fitout Guide': return renderFitoutGuideTab();
      case 'Deviation Status': return renderDeviationStatusTab();
      default: return renderCategoryTab();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <span className="text-sm text-gray-600">Fitout &gt; Fitout Request</span>
      </div>

      <h1 className="text-2xl font-bold mb-6">FITOUT SETUP</h1>

      <div className="flex gap-1 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 font-medium border-b-2 whitespace-nowrap ${
              activeTab === tab
                ? 'text-[#C72030] border-[#C72030]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderTabContent()}

      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onSubmit={handleAddCategory}
        showTimings={false}
        showAmount={true}
      />

      <EditCategoryModal
        isOpen={isEditCategoryOpen}
        onClose={() => setIsEditCategoryOpen(false)}
        category={editingCategory}
        onSubmit={handleUpdateCategory}
        showTimings={false}
        showAmount={true}
      />

      <AddDeviationStatusModal
        isOpen={isAddDeviationOpen}
        onClose={() => setIsAddDeviationOpen(false)}
      />

      <AddStatusModal
        isOpen={isAddStatusOpen}
        onClose={() => setIsAddStatusOpen(false)}
        onSubmit={handleAddStatus}
      />
    </div>
  );
};

export default FitoutSetupDashboard;
