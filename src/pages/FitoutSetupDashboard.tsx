import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
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

const categoryColumns: ColumnConfig[] = [
  { key: 'category', label: 'Category', sortable: true, hideable: true, defaultVisible: true },
  { key: 'amount', label: 'Amount', sortable: true, hideable: true, defaultVisible: true },
  { key: 'active', label: 'Active/Inactive', sortable: true, hideable: true, defaultVisible: true },
];

const statusColumns: ColumnConfig[] = [
  { key: 'order', label: 'Order', sortable: true, hideable: true, defaultVisible: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, defaultVisible: true },
  { key: 'fixedState', label: 'Fixed State', sortable: true, hideable: true, defaultVisible: true },
  { key: 'color', label: 'Color', sortable: false, hideable: true, defaultVisible: true },
];

const fitoutGuideColumns: ColumnConfig[] = [
  { key: 'srNo', label: 'SR No.', sortable: false, hideable: true, defaultVisible: true },
  { key: 'fileName', label: 'File Name', sortable: true, hideable: true, defaultVisible: true },
];

const deviationStatusColumns: ColumnConfig[] = [
  { key: 'category', label: 'Category', sortable: true, hideable: true, defaultVisible: true },
  { key: 'active', label: 'Active/Inactive', sortable: true, hideable: true, defaultVisible: true },
];

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

  const renderCategoryCell = (item: Category, columnKey: string) => {
    if (columnKey === 'active') {
      return (
        <Checkbox
          checked={item.active}
          onCheckedChange={() => handleToggleActive(item.id)}
          className="data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030] border-[#C72030]"
        />
      );
    }
    return item[columnKey as keyof Category];
  };

  const renderCategoryActions = (item: Category) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleEditCategory(item)}
      className="h-8 w-8 p-0 text-black hover:bg-gray-100 [&_svg]:!text-black [&_svg]:!stroke-black"
      title="Edit"
    >
      <Edit className="w-4 h-4" />
    </Button>
  );

  const renderCategoryTab = () => (
    <div>
      <EnhancedTable
        data={categories}
        columns={categoryColumns}
        renderCell={renderCategoryCell}
        renderActions={renderCategoryActions}
        storageKey="fitout-setup-category-table"
        enableSearch={true}
        searchPlaceholder="Search categories..."
        onFilterClick={() => {}}
        leftActions={
          <Button
            onClick={() => setIsAddCategoryOpen(true)}
            className="!bg-[#DA7756] !text-white hover:!bg-[#DA7756]/90"
          >
            <Plus className="w-4 h-4 mr-2 !text-white" />
            Add
          </Button>
        }
        pagination={true}
        pageSize={10}
        emptyMessage="No categories found"
      />
    </div>
  );

  const renderStatusCell = (item: Status, columnKey: string) => {
    if (columnKey === 'color') {
      return <div className="w-6 h-6 rounded border" style={{ backgroundColor: item.color }} />;
    }
    return item[columnKey as keyof Status];
  };

  const renderStatusActions = () => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 text-black hover:bg-gray-100 [&_svg]:!text-black [&_svg]:!stroke-black"
      title="Edit"
    >
      <Edit className="w-4 h-4" />
    </Button>
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

      <EnhancedTable
        data={statuses}
        columns={statusColumns}
        renderCell={renderStatusCell}
        renderActions={renderStatusActions}
        storageKey="fitout-setup-status-table"
        enableSearch={true}
        searchPlaceholder="Search statuses..."
        onFilterClick={() => {}}
        leftActions={
          <Button
            onClick={() => setIsAddStatusOpen(true)}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2 stroke-[#C72030] text-white" />
            Add
          </Button>
        }
        pagination={true}
        pageSize={10}
        emptyMessage="No data available"
      />
    </div>
  );

  const renderFitoutGuideCell = (item: UploadedFile, columnKey: string, index: number) => {
    if (columnKey === 'srNo') {
      return index + 1;
    }
    return item[columnKey as keyof UploadedFile];
  };

  const renderFitoutGuideActions = () => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 text-black hover:bg-gray-100 [&_svg]:!text-black [&_svg]:!stroke-black"
      title="Edit"
    >
      <Edit className="w-4 h-4" />
    </Button>
  );

  const renderFitoutGuideTab = () => (
    <div>
      <div className="mb-6">
        <div className="border-2 border-dashed border-brand rounded-lg p-8 text-center">
          <div className="mb-4">
            <span className="font-medium text-brand">Choose File</span>
            <span className="text-gray-500 ml-2">No file chosen</span>
          </div>
          <label htmlFor="file-upload">
            <Button className="bg-brand hover:bg-brand-hover text-white cursor-pointer [&_svg]:!text-white" asChild>
              <span className="inline-flex items-center justify-center gap-2">
                <Plus className="w-4 h-4 !text-white" />
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

      <EnhancedTable
        data={uploadedFiles}
        columns={fitoutGuideColumns}
        renderCell={(item, columnKey) => renderFitoutGuideCell(item, columnKey, uploadedFiles.indexOf(item))}
        renderActions={renderFitoutGuideActions}
        storageKey="fitout-setup-guide-table"
        enableSearch={true}
        searchPlaceholder="Search files..."
        onFilterClick={() => {}}
        pagination={true}
        pageSize={10}
        emptyMessage="No files uploaded"
      />
    </div>
  );

  const renderDeviationStatusTab = () => (
    <div>
      <EnhancedTable
        data={[]}
        columns={deviationStatusColumns}
        renderActions={() => null}
        storageKey="fitout-setup-deviation-table"
        enableSearch={true}
        searchPlaceholder="Search deviation status..."
        onFilterClick={() => {}}
        leftActions={
          <Button
            onClick={() => setIsAddDeviationOpen(true)}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2 stroke-[#C72030] text-white" />
            Add
          </Button>
        }
        pagination={true}
        pageSize={10}
        emptyMessage="No deviation status found"
      />
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

      <div className="grid w-full grid-cols-4 bg-white border border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center justify-center gap-2 px-6 py-2 font-semibold border-none whitespace-nowrap ${
              activeTab === tab
                ? 'bg-[#EDEAE3] text-[#C72030]'
                : 'bg-white text-black'
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
        onSave={handleAddStatus}
      />
    </div>
  );
};

export default FitoutSetupDashboard;
