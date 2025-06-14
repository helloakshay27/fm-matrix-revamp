
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

const UtilityWasteGenerationSetupDashboard = () => {
  const [commodityName, setCommodityName] = useState('');

  const existingCommodities = [
    { id: 1, name: 'abc' },
    { id: 2, name: 'DRY' }
  ];

  const handleAddCommodity = () => {
    if (commodityName.trim()) {
      // Add commodity logic here
      setCommodityName('');
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Waste Generation Tags</h2>
          <p className="text-muted-foreground">
            Setup and manage waste generation configuration
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>WASTE GENERATION TAGS</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="commodity" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="commodity" className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white">
                Commodity
              </TabsTrigger>
              <TabsTrigger value="category">Category</TabsTrigger>
              <TabsTrigger value="operational">Operational Name of Landlord/Tenant</TabsTrigger>
            </TabsList>
            
            <TabsContent value="commodity" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="commodity" className="text-sm font-medium">
                    Commodity*
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="commodity"
                      value={commodityName}
                      onChange={(e) => setCommodityName(e.target.value)}
                      placeholder="Enter commodity name"
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleAddCommodity}
                      className="bg-[#8B5A3C] hover:bg-[#7A4D33] text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-center mb-4">Commodity</h3>
                    <div className="space-y-2">
                      {existingCommodities.map((commodity) => (
                        <div key={commodity.id} className="bg-white p-3 rounded border">
                          {commodity.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="category" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category*
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="category"
                      placeholder="Enter category name"
                      className="flex-1"
                    />
                    <Button className="bg-[#8B5A3C] hover:bg-[#7A4D33] text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-center mb-4">Category</h3>
                    <div className="space-y-2">
                      <div className="text-center text-muted-foreground py-4">
                        No categories added yet
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="operational" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="operational" className="text-sm font-medium">
                    Operational Name*
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="operational"
                      placeholder="Enter operational name"
                      className="flex-1"
                    />
                    <Button className="bg-[#8B5A3C] hover:bg-[#7A4D33] text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-center mb-4">Operational Name</h3>
                    <div className="space-y-2">
                      <div className="text-center text-muted-foreground py-4">
                        No operational names added yet
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UtilityWasteGenerationSetupDashboard;
