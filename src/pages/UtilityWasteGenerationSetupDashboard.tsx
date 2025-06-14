
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

// Sample data for commodities
const commodityData = [
  { id: 1, name: "abc" },
  { id: 2, name: "DRY" }
];

const UtilityWasteGenerationSetupDashboard = () => {
  const [activeTab, setActiveTab] = useState("commodity");
  const [commodityValue, setCommodityValue] = useState("");

  const handleAddCommodity = () => {
    if (commodityValue.trim()) {
      // Add commodity logic here
      console.log("Adding commodity:", commodityValue);
      setCommodityValue("");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Waste Generation Tag</span>
        <span>&gt;</span>
        <span>Waste Generation Tag</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">WASTE GENERATION TAGS</h1>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="commodity" className="text-orange-600 data-[state=active]:text-orange-600">
            Commodity
          </TabsTrigger>
          <TabsTrigger value="category">Category</TabsTrigger>
          <TabsTrigger value="operational">Operational Name of Landlord/ Tenant</TabsTrigger>
        </TabsList>

        <TabsContent value="commodity" className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="commodity" className="text-sm font-medium">
                  Commodity<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="commodity"
                  value={commodityValue}
                  onChange={(e) => setCommodityValue(e.target.value)}
                  placeholder="Enter commodity"
                  className="w-full"
                />
              </div>
              
              <Button 
                onClick={handleAddCommodity}
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </CardContent>
          </Card>

          {/* Commodity List */}
          <Card>
            <CardContent className="p-0">
              <div className="bg-gray-50 p-4 border-b">
                <h3 className="font-medium text-gray-900">Commodity</h3>
              </div>
              <div className="p-4 space-y-2">
                {commodityData.map((item) => (
                  <div key={item.id} className="text-gray-700">
                    {item.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-500">Category configuration will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-500">Operational Name configuration will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UtilityWasteGenerationSetupDashboard;
