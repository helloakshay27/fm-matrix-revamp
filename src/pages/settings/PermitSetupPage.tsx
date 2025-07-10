
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Edit, Trash2 } from 'lucide-react';

export const PermitSetupPage = () => {
  const [permitType, setPermitType] = useState('');
  const [permitTypes, setPermitTypes] = useState([{ name: 'test' }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (permitType.trim()) {
      setPermitTypes([...permitTypes, { name: permitType }]);
      setPermitType('');
    }
  };

  const handleDelete = (index: number) => {
    setPermitTypes(permitTypes.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Permit Setup</h1>
          </div>
          <Button className="bg-gray-600 hover:bg-gray-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Import Permit Tags
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="permit-type" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="permit-type" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
            Permit Type
          </TabsTrigger>
          <TabsTrigger value="permit-activity">Permit Activity</TabsTrigger>
          <TabsTrigger value="permit-sub-activity">Permit Sub Activity</TabsTrigger>
          <TabsTrigger value="permit-hazard-category">Permit Hazard Category</TabsTrigger>
          <TabsTrigger value="permit-risk">Permit Risk</TabsTrigger>
          <TabsTrigger value="permit-safety-equipment">Permit Safety Equipment</TabsTrigger>
        </TabsList>

        <TabsContent value="permit-type" className="space-y-6 mt-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={permitType}
                  onChange={(e) => setPermitType(e.target.value)}
                  className="w-full"
                  placeholder="Enter permit type name"
                />
              </div>
              <Button 
                type="submit" 
                className="bg-green-500 hover:bg-green-600 text-white px-8"
              >
                Submit
              </Button>
            </div>
          </form>

          {/* Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">Permit Type</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permitTypes.map((type, index) => (
                  <TableRow key={index}>
                    <TableCell className="py-4">{type.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(index)}
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
        </TabsContent>

        <TabsContent value="permit-activity">
          <div className="text-center py-8 text-gray-500">
            Permit Activity configuration will be available here
          </div>
        </TabsContent>

        <TabsContent value="permit-sub-activity">
          <div className="text-center py-8 text-gray-500">
            Permit Sub Activity configuration will be available here
          </div>
        </TabsContent>

        <TabsContent value="permit-hazard-category">
          <div className="text-center py-8 text-gray-500">
            Permit Hazard Category configuration will be available here
          </div>
        </TabsContent>

        <TabsContent value="permit-risk">
          <div className="text-center py-8 text-gray-500">
            Permit Risk configuration will be available here
          </div>
        </TabsContent>

        <TabsContent value="permit-safety-equipment">
          <div className="text-center py-8 text-gray-500">
            Permit Safety Equipment configuration will be available here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PermitSetupPage;
