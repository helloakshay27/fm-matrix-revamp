import React, { useState } from 'react';
import { Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { AddCategoryModal } from '@/components/AddCategoryModal';
import { EditCategoryModal } from '@/components/EditCategoryModal';
import { AddDeviationStatusModal } from '@/components/AddDeviationStatusModal';
import { AddStatusModal } from '@/components/AddStatusModal';
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
  fixedState: string;
  color: string;
}

interface UploadedFile {
  id: number;
  fileName: string;
}

interface DeviationStatus {
  id: number;
  category: string;
  active: boolean;
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

const guideColumns: ColumnConfig[] = [
  { key: 'sr_no', label: 'SR No.', sortable: true, hideable: true, defaultVisible: true },
  { key: 'fileName', label: 'File Name', sortable: true, hideable: true, defaultVisible: true },
];

const deviationColumns: ColumnConfig[] = [
  { key: 'category', label: 'Category', sortable: true, hideable: true, defaultVisible: true },
  { key: 'status', label: 'Active/Inactive', sortable: false, hideable: true, defaultVisible: true },
];

export const FitoutSetupDashboard = () => {
  const [activeTab, setActiveTab] = useState('Category');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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
    setCurrentPage(1);
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

  const handleAddStatus = (newStatus: { status: string; fixedState: string; color: string; order: string }) => {
    const status: Status = {
      id: statuses.length + 1,
      order: parseInt(newStatus.order, 10) || statuses.length + 1,
      status: newStatus.status,
      fixedState: newStatus.fixedState,
      color: newStatus.color,
    };
    setStatuses([...statuses, status]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const newFile: UploadedFile = {
          id: uploadedFiles.length + 1,
          fileName: file.name,
        };
        setUploadedFiles((prev) => [...prev, newFile]);
      });

      toast({
        title: 'Success',
        description: 'File uploaded successfully!',
      });
    }
  };

  const renderCategoryCell = (item: Category, columnKey: string) => {
    if (columnKey === 'active') {
      return (
        <Checkbox
          checked={item.active}
          onCheckedChange={() => handleToggleActive(item.id)}
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
      className="h-8 w-8 p-0 text-black hover:bg-gray-100"
      title="Edit"
    >
      <Edit className="w-4 h-4" />
    </Button>
  );

  const addButton = (onClick: () => void, label = 'Add') => (
    <Button
      onClick={onClick}
      className="bg-brand hover:bg-brand-hover text-white h-9 px-4 text-sm font-medium whitespace-nowrap rounded-lg"
    >
      <Plus className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );

  const filteredCategories = categories.filter((item) => {
    const q = searchTerm.toLowerCase();
    return !q || item.category.toLowerCase().includes(q) || item.amount.toLowerCase().includes(q);
  });

  const filteredStatuses = statuses.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      !q ||
      item.status.toLowerCase().includes(q) ||
      item.fixedState.toLowerCase().includes(q) ||
      String(item.order).includes(q)
    );
  });

  const filteredFiles = uploadedFiles
    .map((file, index) => ({ ...file, sr_no: index + 1 }))
    .filter((item) => {
      const q = searchTerm.toLowerCase();
      return !q || item.fileName.toLowerCase().includes(q);
    });

  const filteredDeviations = deviationStatuses.filter((item) => {
    const q = searchTerm.toLowerCase();
    return !q || item.category.toLowerCase().includes(q);
  });

  const renderCategoryTab = () => (
    <div className="w-full min-w-0 max-w-full">
      <EnhancedTable
        data={filteredCategories}
        columns={categoryColumns}
        renderCell={(item: Category, columnKey: string) => {
          switch (columnKey) {
            case 'category':
              return <span className="font-medium text-gray-900">{item.category}</span>;
            case 'amount':
              return item.amount || '—';
            case 'active':
              return <Checkbox checked={item.active} onCheckedChange={() => handleToggleActive(item.id)} />;
            default:
              return '—';
          }
        }}
        renderActions={(item: Category) => renderCategoryActions(item)}
        storageKey="fitout-setup-category-table"
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        disableClientSearch
        searchPlaceholder="Search categories..."
        leftActions={addButton(() => setIsAddCategoryOpen(true))}
        hideTableExport
        emptyMessage="No categories found"
        pagination
        pageSize={15}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getItemId={(item) => String(item.id)}
      />
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

      <div className="w-full min-w-0 max-w-full">
        <EnhancedTable
          data={filteredStatuses}
          columns={statusColumns}
          renderCell={(item: Status, columnKey: string) => {
            switch (columnKey) {
              case 'order':
                return item.order;
              case 'status':
                return <span className="font-medium text-gray-900">{item.status}</span>;
              case 'fixedState':
                return item.fixedState;
              case 'color':
                return <div className="w-6 h-6 rounded border" style={{ backgroundColor: item.color }} />;
              default:
                return '—';
            }
          }}
          renderActions={() => (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-black hover:bg-gray-100"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          storageKey="fitout-setup-status-table"
          enableSearch
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          disableClientSearch
          searchPlaceholder="Search statuses..."
          leftActions={addButton(() => setIsAddStatusOpen(true))}
          hideTableExport
          emptyMessage="No data available"
          pagination
          pageSize={15}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          getItemId={(item) => String(item.id)}
        />
      </div>
    </div>
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
            <Button className="bg-brand hover:bg-brand-hover text-white h-9 px-4 cursor-pointer" asChild>
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
          data={filteredFiles}
          columns={guideColumns}
          renderCell={(item: UploadedFile & { sr_no: number }, columnKey: string) => {
            switch (columnKey) {
              case 'sr_no':
                return item.sr_no;
              case 'fileName':
                return <span className="font-medium text-gray-900">{item.fileName}</span>;
              default:
                return '—';
            }
          }}
          renderActions={() => (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-black hover:bg-gray-100"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          storageKey="fitout-setup-guide-table"
          enableSearch
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          disableClientSearch
          searchPlaceholder="Search files..."
          hideTableExport
          emptyMessage="No files uploaded"
          pagination
          pageSize={15}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          getItemId={(item) => String(item.id)}
        />
      </div>
    </div>
  );

  const renderDeviationStatusTab = () => (
    <div className="w-full min-w-0 max-w-full">
      <EnhancedTable
        data={filteredDeviations}
        columns={deviationColumns}
        renderCell={(item: DeviationStatus, columnKey: string) => {
          switch (columnKey) {
            case 'category':
              return <span className="font-medium text-gray-900">{item.category}</span>;
            case 'status':
              return <Checkbox checked={item.active} onCheckedChange={() => handleToggleDeviationActive(item.id)} />;
            default:
              return '—';
          }
        }}
        renderActions={() => (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-black hover:bg-gray-100"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}
        storageKey="fitout-setup-deviation-table"
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        disableClientSearch
        searchPlaceholder="Search deviation status..."
        leftActions={addButton(() => setIsAddDeviationOpen(true))}
        hideTableExport
        emptyMessage="No deviation status found"
        pagination
        pageSize={15}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getItemId={(item) => String(item.id)}
      />
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
