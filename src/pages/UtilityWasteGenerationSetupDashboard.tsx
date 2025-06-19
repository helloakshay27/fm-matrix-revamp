
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

const UtilityWasteGenerationSetupDashboard = () => {
  const [commodityName, setCommodityName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [operationalName, setOperationalName] = useState('');

  // Sample data states
  const [commodities, setCommodities] = useState([
    { id: 1, name: 'abc' },
    { id: 2, name: 'DRY' }
  ]);
  const [categories, setCategories] = useState<Array<{id: number, name: string}>>([]);
  const [operationalNames, setOperationalNames] = useState<Array<{id: number, name: string}>>([]);

  const handleAddCommodity = () => {
    if (commodityName.trim()) {
      const newCommodity = {
        id: commodities.length + 1,
        name: commodityName.trim()
      };
      setCommodities([...commodities, newCommodity]);
      setCommodityName('');
      console.log('Added commodity:', newCommodity);
    }
  };

  const handleAddCategory = () => {
    if (categoryName.trim()) {
      const newCategory = {
        id: categories.length + 1,
        name: categoryName.trim()
      };
      setCategories([...categories, newCategory]);
      setCategoryName('');
      console.log('Added category:', newCategory);
    }
  };

  const handleAddOperational = () => {
    if (operationalName.trim()) {
      const newOperational = {
        id: operationalNames.length + 1,
        name: operationalName.trim()
      };
      setOperationalNames([...operationalNames, newOperational]);
      setOperationalName('');
      console.log('Added operational name:', newOperational);
    }
  };

  const handleDeleteCommodity = (id: number) => {
    setCommodities(commodities.filter(commodity => commodity.id !== id));
    console.log('Deleted commodity with id:', id);
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(category => category.id !== id));
    console.log('Deleted category with id:', id);
  };

  const handleDeleteOperational = (id: number) => {
    setOperationalNames(operationalNames.filter(operational => operational.id !== id));
    console.log('Deleted operational name with id:', id);
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
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCommodity()}
                    />
                    <Button 
                      onClick={handleAddCommodity}
                      style={{ backgroundColor: '#C72030' }}
                      className="hover:bg-[#A01B26] text-white"
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
                      {commodities.map((commodity) => (
                        <div key={commodity.id} className="bg-white p-3 rounded border flex justify-between items-center">
                          <span>{commodity.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCommodity(commodity.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <Button 
                      onClick={handleAddCategory}
                      style={{ backgroundColor: '#C72030' }}
                      className="hover:bg-[#A01B26] text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-center mb-4">Category</h3>
                    <div className="space-y-2">
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <div key={category.id} className="bg-white p-3 rounded border flex justify-between items-center">
                            <span>{category.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground py-4">
                          No categories added yet
                        </div>
                      )}
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
                      value={operationalName}
                      onChange={(e) => setOperationalName(e.target.value)}
                      placeholder="Enter operational name"
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddOperational()}
                    />
                    <Button 
                      onClick={handleAddOperational}
                      style={{ backgroundColor: '#C72030' }}
                      className="hover:bg-[#A01B26] text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-center mb-4">Operational Name</h3>
                    <div className="space-y-2">
                      {operationalNames.length > 0 ? (
                        operationalNames.map((operational) => (
                          <div key={operational.id} className="bg-white p-3 rounded border flex justify-between items-center">
                            <span>{operational.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteOperational(operational.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground py-4">
                          No operational names added yet
                        </div>
                      )}
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
