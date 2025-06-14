
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
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Appointment</span>
          <span className="mx-2">{'>'}</span>
          <span>Incidents</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Incidents Setup</h1>
      </div>

      {/* Form Section */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="grid grid-cols-12 gap-4 items-end">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
          </div>
          <div className="col-span-8">
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
          <div className="col-span-2">
            <Button 
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white w-full"
            >
              Submit
            </Button>
          </div>
        </div>

        {/* Additional Form Fields */}
        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Sub Category
            </label>
          </div>
          <div className="col-span-10"></div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Sub Sub Category
            </label>
          </div>
          <div className="col-span-10"></div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Sub Sub Sub Category
            </label>
          </div>
          <div className="col-span-10"></div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Incidence status
            </label>
          </div>
          <div className="col-span-10"></div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Incidence level
            </label>
          </div>
          <div className="col-span-10"></div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Escalations
            </label>
          </div>
          <div className="col-span-10"></div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Approval Setup
            </label>
          </div>
          <div className="col-span-10"></div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Secondary Category
            </label>
          </div>
          <div className="col-span-10"></div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Secondary Sub Category
            </label>
          </div>
          <div className="col-span-10"></div>
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
  );
};

export default IncidentSetupDashboard;
