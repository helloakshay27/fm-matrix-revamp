
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const categoryData = [
  { id: 1, srNo: 1, category: "Print & Media" },
  { id: 2, srNo: 2, category: "AC Repairing" },
  { id: 3, srNo: 3, category: "Electricity" },
  { id: 4, srNo: 4, category: "Laptop Repairer" },
  { id: 5, srNo: 5, category: "Internet Services" },
  { id: 6, srNo: 6, category: "Drinking Water Supplier" },
  { id: 7, srNo: 7, category: "Furniture" },
  { id: 8, srNo: 8, category: "Plumber" },
  { id: 9, srNo: 9, category: "Stationary" }
];

export const BusinessSetupDashboard = () => {
  const [categories, setCategories] = useState(categoryData);

  const handleEdit = (id: number) => {
    console.log("Edit category:", id);
  };

  const handleDelete = (id: number) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>BUSINESS DIRECTORY</span>
        <span>{">"}</span>
        <span className="text-gray-900 font-medium">SETUP</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">BUSINESS DIRECTORY SETUP</h1>
      </div>

      {/* Category Tab */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button className="px-6 py-3 text-sm font-medium text-purple-700 border-b-2 border-purple-700 bg-purple-50">
              Category
            </button>
            <button className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
              Sub Category
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Category Management</h2>
            <Button className="bg-purple-700 hover:bg-purple-800 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sr.No</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.srNo}</TableCell>
                  <TableCell className="font-medium">{category.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(category.id)}
                        className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
