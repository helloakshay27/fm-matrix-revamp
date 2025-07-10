
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from 'lucide-react';

export const IncidentSetupPage = () => {
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
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">Incidents Setup</h1>
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

        {/* Form Fields Grid */}
        <div className="grid grid-cols-12 gap-4 mt-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Sub Category
            </label>
          </div>
          <div className="col-span-10">
            <Input type="text" className="w-full" placeholder="Enter sub category" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Sub Sub Category
            </label>
          </div>
          <div className="col-span-10">
            <Input type="text" className="w-full" placeholder="Enter sub sub category" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Sub Sub Sub Category
            </label>
          </div>
          <div className="col-span-10">
            <Input type="text" className="w-full" placeholder="Enter sub sub sub category" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Incidence status
            </label>
          </div>
          <div className="col-span-10">
            <Input type="text" className="w-full" placeholder="Enter incidence status" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Incidence level
            </label>
          </div>
          <div className="col-span-10">
            <Input type="text" className="w-full" placeholder="Enter incidence level" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Escalations
            </label>
          </div>
          <div className="col-span-10">
            <Input type="text" className="w-full" placeholder="Enter escalations" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Approval Setup
            </label>
          </div>
          <div className="col-span-10">
            <Input type="text" className="w-full" placeholder="Enter approval setup" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Secondary Category
            </label>
          </div>
          <div className="col-span-10">
            <Input type="text" className="w-full" placeholder="Enter secondary category" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Secondary Sub Category
            </label>
          </div>
          <div className="col-span-10">
            <Input type="text" className="w-full" placeholder="Enter secondary sub category" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Secondary Sub Sub Category
            </label>
          </div>
          <div className="col-span-10">
            <Input type="text" className="w-full" placeholder="Enter secondary sub sub category" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Secondary Sub Sub Sub Category
            </label>
          </div>
          <div className="col-span-10">
            <Input type="text" className="w-full" placeholder="Enter secondary sub sub sub category" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Who got injured
            </label>
          </div>
          <div className="col-span-10">
            <Input type="text" className="w-full" placeholder="Enter who got injured" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Property Damage Category
            </label>
          </div>
          <div className="col-span-10">
            <Input type="text" className="w-full" placeholder="Enter property damage category" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              RCA Category
            </label>
          </div>
          <div className="col-span-10">
            <Input type="text" className="w-full" placeholder="Enter RCA category" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Incident Disclaimer
            </label>
          </div>
          <div className="col-span-10">
            <textarea 
              className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter incident disclaimer"
            />
          </div>
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

export default IncidentSetupPage;
