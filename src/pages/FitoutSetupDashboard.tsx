import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Upload } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddCategoryModal } from "@/components/AddCategoryModal";
import { EditCategoryModal } from "@/components/EditCategoryModal";
import { AddDeviationStatusModal } from "@/components/AddDeviationStatusModal";
import { AddStatusModal } from "@/components/AddStatusModal";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      title: "Updated successfully.",
      className: "bg-green-500 text-white border-green-500",
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
        title: "File uploaded successfully.",
        className: "bg-green-500 text-white border-green-500",
      });
    }
  };

  const renderCategoryTab = () => (
    <div>
      <div className="mb-6">
        <Button
          onClick={() => setIsAddCategoryOpen(true)}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2 text-white stroke-white" />
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
          <Label htmlFor="status">Status</Label>
          <Input id="status" placeholder="Enter status" />
        </div>
        <div>
          <Label htmlFor="fixedState">Fixed State</Label>
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
          <Label htmlFor="color">Color</Label>
          <Input id="color" type="color" className="h-10" />
        </div>
        <div>
          <Label htmlFor="statusOrder">Status Order</Label>
          <Input id="statusOrder" placeholder="Enter status order" />
        </div>
      </div>

      <div className="mb-6">
        <Button
          onClick={() => setIsAddStatusOpen(true)}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2 text-white stroke-white" />
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
                    <Edit className="w-4 h-4 text-blue-500 cursor-pointer" />
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
        <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
          <div className="mb-4">
            <span className="text-orange-500 font-medium">Choose File</span>
            <span className="text-gray-500 ml-2">No file chosen</span>
          </div>
          <label htmlFor="file-upload">
            <Button className="bg-[#C72030] hover:bg-[#C72030]/90 text-white cursor-pointer" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
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
                    <Edit className="w-4 h-4 text-blue-500 cursor-pointer" />
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
      <div className="mb-6">
        <Button
          onClick={() => setIsAddDeviationOpen(true)}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2 text-white stroke-white" />
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

      {renderTabContent()}

      {/* Modals */}
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
