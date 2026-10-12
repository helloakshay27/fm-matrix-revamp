import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Download, FileText, ListChecks } from "lucide-react";
import { FormSection, assetFieldStyles } from "@/components/common/FormSection";
import { AddCategoryModal } from "@/components/AddCategoryModal";
import { EditCategoryModal } from "@/components/EditCategoryModal";
import { AddDeviationStatusModal } from "@/components/AddDeviationStatusModal";
import { AddStatusModal } from "@/components/AddStatusModal";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttachmentUpload } from "@/components/common/AttachmentUpload";
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


  const [categories, setCategories] = useState<Category[]>([
    { id: 1, category: 'ho', amount: '', active: true },
    { id: 2, category: 'Furniture', amount: '', active: true },
    { id: 3, category: 'xx', amount: '', active: false },
  ]);

  const [statuses, setStatuses] = useState<Status[]>([]);
  // Status Details fields — abhi sirf UI state, kisi API se jude nahi hain (pehle bhi nahi the)
  const [statusForm, setStatusForm] = useState({
    status: '',
    fixedState: '',
    color: '#ffffff',
    order: '',
  });
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

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setUploadedFiles((prev) => {
        const nextId = prev.length > 0 ? Math.max(...prev.map((file) => file.id)) + 1 : 1;
        const uploadedAt = new Date().toLocaleString();
        const newFiles: UploadedFile[] = files.map((file, index) => ({
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
          leftActions={
            <Button
              onClick={() => setIsAddCategoryOpen(true)}
              className="bg-brand hover:bg-brand-hover text-white"
            >
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          }
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
    <div className="space-y-4 sm:space-y-6">
      <FormSection title="STATUS DETAILS" icon={ListChecks}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TextField
            label="Status"
            placeholder="Enter status"
            value={statusForm.status}
            onChange={(e) => setStatusForm((prev) => ({ ...prev, status: e.target.value }))}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: assetFieldStyles }}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel id="fixed-state-label" shrink>Fixed State</InputLabel>
            <MuiSelect
              labelId="fixed-state-label"
              label="Fixed State"
              notched
              displayEmpty
              value={statusForm.fixedState}
              onChange={(e) => setStatusForm((prev) => ({ ...prev, fixedState: e.target.value }))}
              sx={assetFieldStyles}
            >
              <MenuItem value="">Select Fixed State</MenuItem>
              <MenuItem value="state1">State 1</MenuItem>
              <MenuItem value="state2">State 2</MenuItem>
            </MuiSelect>
          </FormControl>
          <TextField
            label="Color"
            value={statusForm.color}
            onChange={(e) => setStatusForm((prev) => ({ ...prev, color: e.target.value }))}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              sx: assetFieldStyles,
              startAdornment: (
                <label
                  className="relative mr-2 h-6 w-6 shrink-0 cursor-pointer overflow-hidden rounded border border-gray-300"
                  style={{ backgroundColor: statusForm.color }}
                  title="Pick color"
                >
                  <input
                    type="color"
                    value={statusForm.color}
                    onChange={(e) => setStatusForm((prev) => ({ ...prev, color: e.target.value }))}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </label>
              ),
            }}
          />
          <TextField
            label="Order"
            type="number"
            placeholder="Enter status order"
            value={statusForm.order}
            onChange={(e) => setStatusForm((prev) => ({ ...prev, order: e.target.value }))}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: assetFieldStyles }}
          />
        </div>
      </FormSection>

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
          leftActions={
            <Button
              onClick={() => setIsAddStatusOpen(true)}
              className="bg-brand hover:bg-brand-hover text-white"
            >
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          }
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
          <AttachmentUpload
            label="Fitout Guide"
            chooseText="Choose File"
            uploadText="Upload"
            emptyText="No file chosen"
            multiple
            files={[]}
            onFilesSelected={handleFileUpload}
          />
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
          leftActions={
            <Button
              onClick={() => setIsAddDeviationOpen(true)}
              className="bg-brand hover:bg-brand-hover text-white"
            >
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          }
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

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">
          Fitout &gt; Fitout Setup
        </p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Fitout Setup
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-brand data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="Category" className="pt-4">
          {renderCategoryTab()}
        </TabsContent>
        <TabsContent value="Status" className="pt-4">
          {renderStatusTab()}
        </TabsContent>
        <TabsContent value="Fitout Guide" className="pt-4">
          {renderFitoutGuideTab()}
        </TabsContent>
        <TabsContent value="Deviation Status" className="pt-4">
          {renderDeviationStatusTab()}
        </TabsContent>
      </Tabs>

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
