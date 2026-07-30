import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Download, FileText } from "lucide-react";
import { AddCategoryModal } from "@/components/AddCategoryModal";
import { EditCategoryModal } from "@/components/EditCategoryModal";
import { AddDeviationStatusModal } from "@/components/AddDeviationStatusModal";
import { AddStatusModal } from "@/components/AddStatusModal";
import { Checkbox } from "@/components/ui/checkbox";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useToast } from '@/hooks/use-toast';

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
  displayName: string;
  fixedState: string;
  color: string;
}

interface UploadedFile {
  id: number;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  fileUrl: string;
}

interface DeviationStatus {
  id: number;
  category: string;
  active: boolean;
}

type GuideTableRow = UploadedFile & { sr_no: number };

const categoryColumns: ColumnConfig[] = [
  { key: "category", label: "Category", sortable: true, hideable: true, defaultVisible: true },
  { key: "amount", label: "Amount", sortable: true, hideable: true, defaultVisible: true },
  { key: "active", label: "Active/Inactive", sortable: false, hideable: true, defaultVisible: true },
];

const statusColumns: ColumnConfig[] = [
  { key: "order", label: "Order", sortable: true, hideable: true, defaultVisible: true },
  { key: "status", label: "Status", sortable: true, hideable: true, defaultVisible: true },
  { key: "displayName", label: "Display Name", sortable: true, hideable: true, defaultVisible: true },
  { key: "fixedState", label: "Fixed State", sortable: true, hideable: true, defaultVisible: true },
  { key: "color", label: "Color", sortable: false, hideable: true, defaultVisible: true },
];

const guideColumns: ColumnConfig[] = [
  { key: "sr_no", label: "Sr. No.", sortable: true, hideable: true, defaultVisible: true },
  { key: "fileName", label: "File Name", sortable: true, hideable: true, defaultVisible: true },
  { key: "fileSize", label: "File Size", sortable: true, hideable: true, defaultVisible: true },
  { key: "uploadedAt", label: "Uploaded On", sortable: true, hideable: true, defaultVisible: true },
];

const deviationColumns: ColumnConfig[] = [
  { key: "category", label: "Category", sortable: true, hideable: true, defaultVisible: true },
  { key: "active", label: "Active/Inactive", sortable: false, hideable: true, defaultVisible: true },
];

const formatFileSize = (bytes: number) => {
  if (!bytes && bytes !== 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const FitoutSetupDashboard = () => {
  const [activeTab, setActiveTab] = useState('Category');
  const [searchTerm, setSearchTerm] = useState('');
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
    { id: 3, category: 'xx', amount: '', active: false },
  ]);

  const [statuses, setStatuses] = useState<Status[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [deviationStatuses, setDeviationStatuses] = useState<DeviationStatus[]>([]);

  const tabs = ['Category', 'Status', 'Fitout Guide', 'Deviation Status'];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const handleAddCategory = (newCategory: { category: string; amount?: string }) => {
    const category: Category = {
      id: categories.length + 1,
      category: newCategory.category,
      amount: newCategory.amount || '',
      active: true,
    };
    setCategories([...categories, category]);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsEditCategoryOpen(true);
  };

  const handleUpdateCategory = (updatedCategory: Category) => {
    setCategories(categories.map((cat) =>
      cat.id === updatedCategory.id ? updatedCategory : cat
    ));
    setEditingCategory(null);
  };

  const handleToggleActive = (id: number) => {
    setCategories(categories.map((cat) =>
      cat.id === id ? { ...cat, active: !cat.active } : cat
    ));

    toast({
      title: 'Success',
      description: 'Category updated successfully!',
    });
  };

  const handleToggleDeviationActive = (id: number) => {
    setDeviationStatuses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
  };

  const handleAddStatus = (newStatus: { status: string; displayName: string; fixedState: string; color: string; order: string }) => {
    const status: Status = {
      id: statuses.length + 1,
      order: parseInt(newStatus.order, 10) || statuses.length + 1,
      status: newStatus.status,
      displayName: newStatus.displayName,
      fixedState: newStatus.fixedState,
      color: newStatus.color,
    };
    setStatuses([...statuses, status]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles((prev) => {
        const nextId = prev.length > 0 ? Math.max(...prev.map((file) => file.id)) + 1 : 1;
        const uploadedAt = new Date().toLocaleString();
        const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
          id: nextId + index,
          fileName: file.name,
          fileSize: file.size,
          uploadedAt,
          fileUrl: URL.createObjectURL(file),
        }));
        return [...prev, ...newFiles];
      });

      toast({
        title: 'Success',
        description: 'File uploaded successfully!',
      });
    }
    event.target.value = '';
  };

  const handleDownloadFile = (file: UploadedFile) => {
    const link = document.createElement('a');
    link.href = file.fileUrl;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteFile = (id: number) => {
    setUploadedFiles((prev) => {
      const fileToDelete = prev.find((file) => file.id === id);
      if (fileToDelete?.fileUrl) {
        URL.revokeObjectURL(fileToDelete.fileUrl);
      }
      return prev.filter((file) => file.id !== id);
    });

    toast({
      title: 'Success',
      description: 'File deleted successfully!',
    });
  };

  const renderCategoryTab = () => (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          onClick={() => setIsAddCategoryOpen(true)}
          className="bg-brand hover:bg-brand-hover text-white [&_svg]:!text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="w-full min-w-0 max-w-full">
        <EnhancedTable
          data={categories}
          columns={categoryColumns}
          renderCell={(item: Category, columnKey: string) => {
            switch (columnKey) {
              case "amount":
                return item.amount || "—";
              case "active":
                return (
                  <Checkbox
                    checked={item.active}
                    onCheckedChange={() => handleToggleActive(item.id)}
                    className="data-[state=checked]:bg-brand data-[state=checked]:border-brand border-brand"
                  />
                );
              default:
                return item[columnKey as keyof Category] as React.ReactNode;
            }
          }}
          renderActions={(item: Category) => (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-brand hover:bg-brand-light"
              title="Edit"
              onClick={() => handleEditCategory(item)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          storageKey="fitout-setup-category-table"
          enableSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search categories..."
          hideTableExport
          emptyMessage="No categories found"
          pagination
          pageSize={10}
          getItemId={(item) => String(item.id)}
        />
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
          className="bg-brand hover:bg-brand-hover text-white [&_svg]:!text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="w-full min-w-0 max-w-full">
        <EnhancedTable
          data={statuses}
          columns={statusColumns}
          renderCell={(item: Status, columnKey: string) => {
            if (columnKey === "color") {
              return <div className="w-6 h-6 rounded border" style={{ backgroundColor: item.color }} />;
            }
            return item[columnKey as keyof Status] as React.ReactNode;
          }}
          renderActions={() => (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-brand hover:bg-brand-light"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          storageKey="fitout-setup-status-table"
          enableSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search statuses..."
          hideTableExport
          emptyMessage="No data available"
          pagination
          pageSize={10}
          getItemId={(item) => String(item.id)}
        />
      </div>
    </div>
  );

  const renderFitoutGuideTab = () => {
    const guideData: GuideTableRow[] = uploadedFiles.map((file, index) => ({
      ...file,
      sr_no: index + 1,
    }));

    return (
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
                  <Plus className="w-4 h-4" />
                  Upload
                </span>
              </Button>
            </label>
            <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileUpload} />
          </div>
        </div>

        <div className="w-full min-w-0 max-w-full">
          <EnhancedTable
            data={guideData}
            columns={guideColumns}
            renderCell={(item: GuideTableRow, columnKey: string) => {
              switch (columnKey) {
                case 'sr_no':
                  return item.sr_no;
                case 'fileName':
                  return (
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-brand shrink-0" />
                      <span className="font-medium text-gray-900 truncate">{item.fileName}</span>
                    </div>
                  );
                case 'fileSize':
                  return formatFileSize(item.fileSize);
                case 'uploadedAt':
                  return item.uploadedAt || '—';
                default:
                  return '—';
              }
            }}
            renderActions={(item: GuideTableRow) => (
              <div className="flex items-center justify-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-brand hover:bg-brand-light"
                  title="Download"
                  onClick={() => handleDownloadFile(item)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-brand-error hover:bg-brand-error/10"
                  title="Delete"
                  onClick={() => handleDeleteFile(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
            storageKey="fitout-setup-guide-v2"
            enableSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search files..."
            hideTableExport
            emptyMessage="No files uploaded"
            pagination
            pageSize={10}
            getItemId={(item) => String(item.id)}
          />
        </div>
      </div>
    );
  };

  const renderDeviationStatusTab = () => (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          onClick={() => setIsAddDeviationOpen(true)}
          className="bg-brand hover:bg-brand-hover text-white [&_svg]:!text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="w-full min-w-0 max-w-full">
        <EnhancedTable
          data={deviationStatuses}
          columns={deviationColumns}
          renderCell={(item: DeviationStatus, columnKey: string) => {
            if (columnKey === "active") {
              return (
                <Checkbox
                  checked={item.active}
                  onCheckedChange={() => handleToggleDeviationActive(item.id)}
                  className="data-[state=checked]:bg-brand data-[state=checked]:border-brand border-brand"
                />
              );
            }
            return item[columnKey as keyof DeviationStatus] as React.ReactNode;
          }}
          renderActions={() => (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-brand hover:bg-brand-light"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          storageKey="fitout-setup-deviation-table"
          enableSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search deviation statuses..."
          hideTableExport
          emptyMessage="No deviation status found"
          pagination
          pageSize={10}
          getItemId={(item) => String(item.id)}
        />
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
      <div className="mb-4">
        <span className="text-sm text-gray-600">Fitout &gt; Fitout Request</span>
      </div>

      <h1 className="text-2xl font-bold mb-6">FITOUT SETUP</h1>

      <div className="grid w-full grid-cols-4 bg-white border border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-6 py-2 font-medium border-b-2 whitespace-nowrap ${
              activeTab === tab
                ? 'bg-[#EDEAE3] text-brand'
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
