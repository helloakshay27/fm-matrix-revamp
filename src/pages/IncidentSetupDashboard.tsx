
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";

const IncidentSetupDashboard = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([
    { name: 'risks' },
    { name: 'Risk Assessment' }
  ]);

  const handleSubmit = () => {
    if (categoryName.trim()) {
      setCategories([...categories, { name: categoryName }]);
      setCategoryName('');
    }
  };

  const handleDelete = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 bg-[#fafafa] min-h-screen">
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">
          Appointment &gt; Incidents
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Incidents Setup</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Form */}
        <div className="space-y-6">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-purple-100 p-4 rounded-md">
                  <Label className="text-purple-700 font-medium">Category</Label>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-md">
                  <Label className="text-gray-700">Sub Category</Label>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-md">
                  <Label className="text-gray-700">Sub Sub Category</Label>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-md">
                  <Label className="text-gray-700">Sub Sub Sub Category</Label>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-md">
                  <Label className="text-gray-700">Incidence status</Label>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-md">
                  <Label className="text-gray-700">Incidence level</Label>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-md">
                  <Label className="text-gray-700">Escalations</Label>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-md">
                  <Label className="text-gray-700">Approval Setup</Label>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-md">
                  <Label className="text-gray-700">Secondary Category</Label>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-md">
                  <Label className="text-gray-700">Secondary Sub Category</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Input and Table */}
        <div className="space-y-6">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryName" className="text-gray-700 font-medium">Name</Label>
                  <Input
                    id="categoryName"
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="mt-1"
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
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4 text-gray-700">{category.name}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button className="text-blue-500 hover:text-blue-700">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDelete(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IncidentSetupDashboard;
