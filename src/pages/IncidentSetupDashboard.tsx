
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from 'lucide-react';

export const IncidentSetupDashboard = () => {
  const [categoryName, setCategoryName] = useState('');
  
  const categories = [
    { id: 1, name: 'risks' },
    { id: 2, name: 'Risk Assessment' }
  ];

  const handleSubmit = () => {
    if (categoryName.trim()) {
      console.log('Adding category:', categoryName);
      setCategoryName('');
    }
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Incidents Setup</h1>

      <div className="flex gap-8">
        {/* Left Side - Category Menu */}
        <div className="w-80">
          <div className="space-y-1">
            <div className="bg-purple-100 text-purple-800 px-4 py-3 rounded-lg font-medium">
              Category
            </div>
            <div className="bg-gray-50 text-gray-700 px-4 py-3 rounded-lg">
              Sub Category
            </div>
            <div className="bg-gray-50 text-gray-700 px-4 py-3 rounded-lg">
              Sub Sub Category
            </div>
            <div className="bg-gray-50 text-gray-700 px-4 py-3 rounded-lg">
              Sub Sub Sub Category
            </div>
            <div className="bg-gray-50 text-gray-700 px-4 py-3 rounded-lg">
              Incidence status
            </div>
            <div className="bg-gray-50 text-gray-700 px-4 py-3 rounded-lg">
              Incidence level
            </div>
            <div className="bg-gray-50 text-gray-700 px-4 py-3 rounded-lg">
              Escalations
            </div>
            <div className="bg-gray-50 text-gray-700 px-4 py-3 rounded-lg">
              Approval Setup
            </div>
            <div className="bg-gray-50 text-gray-700 px-4 py-3 rounded-lg">
              Secondary Category
            </div>
            <div className="bg-gray-50 text-gray-700 px-4 py-3 rounded-lg">
              Secondary Sub Category
            </div>
          </div>
        </div>

        {/* Right Side - Form and Table */}
        <div className="flex-1">
          {/* Form Section */}
          <div className="mb-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full"
                  placeholder="Enter category name"
                />
              </div>
              <Button 
                onClick={handleSubmit}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8"
              >
                Submit
              </Button>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Name</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
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
    </div>
  );
};

export default IncidentSetupDashboard;
