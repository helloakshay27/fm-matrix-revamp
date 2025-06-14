
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from 'lucide-react';

const UtilityWasteGenerationSetupDashboard = () => {
  const [newCommodity, setNewCommodity] = useState('');
  const [commodities, setCommodities] = useState(['abc', 'DRY']);

  const handleAddCommodity = () => {
    if (newCommodity.trim()) {
      setCommodities([...commodities, newCommodity.trim()]);
      setNewCommodity('');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        <span>Waste Generation Tag</span> &gt; <span>Waste Generation Tag</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">WASTE GENERATION TAGS</h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="commodity" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger 
            value="commodity" 
            className="data-[state=active]:bg-[#5A1A2B] data-[state=active]:text-white"
          >
            Commodity
          </TabsTrigger>
          <TabsTrigger 
            value="category"
            className="data-[state=active]:bg-[#5A1A2B] data-[state=active]:text-white"
          >
            Category
          </TabsTrigger>
          <TabsTrigger 
            value="operational"
            className="data-[state=active]:bg-[#5A1A2B] data-[state=active]:text-white"
          >
            Operational Name of Landlord/Tenant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="commodity" className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="commodity" className="text-sm font-medium">
                  Commodity<span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="commodity"
                    placeholder="Enter commodity name"
                    value={newCommodity}
                    onChange={(e) => setNewCommodity(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAddCommodity}
                    className="bg-[#5A1A2B] hover:bg-[#6A2A3B] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Display existing commodities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Commodity</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                {commodities.map((commodity, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-md border">
                    {commodity}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category<span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="category"
                      placeholder="Enter category name"
                      className="flex-1"
                    />
                    <Button className="bg-[#5A1A2B] hover:bg-[#6A2A3B] text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Category</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-md border">
                  Recyclable
                </div>
                <div className="p-3 bg-gray-50 rounded-md border">
                  Non-Recyclable
                </div>
                <div className="p-3 bg-gray-50 rounded-md border">
                  Compostable
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="operational" className="text-sm font-medium">
                    Operational Name of Landlord/Tenant<span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="operational"
                      placeholder="Enter operational name"
                      className="flex-1"
                    />
                    <Button className="bg-[#5A1A2B] hover:bg-[#6A2A3B] text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Operational Names</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-md border">
                  Landlord
                </div>
                <div className="p-3 bg-gray-50 rounded-md border">
                  Tenant A
                </div>
                <div className="p-3 bg-gray-50 rounded-md border">
                  Tenant B
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UtilityWasteGenerationSetupDashboard;
