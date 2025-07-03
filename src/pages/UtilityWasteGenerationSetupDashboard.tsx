
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

const UtilityWasteGenerationSetupDashboard = () => {
  const [commodityName, setCommodityName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryUoM, setCategoryUoM] = useState('');
  const [operationalName, setOperationalName] = useState('');

  // Sample data states
  const [commodities, setCommodities] = useState([
    { id: 1, name: 'abc' },
    { id: 2, name: 'DRY' }
  ]);
  const [categories, setCategories] = useState<Array<{id: number, name: string, uom: string}>>([]);
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
        name: categoryName.trim(),
        uom: categoryUoM
      };
      setCategories([...categories, newCategory]);
      setCategoryName('');
      setCategoryUoM('');
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
          <nav className="text-sm text-gray-600 mb-2">
            Waste Generation Tag &gt; Waste Generation Tag
          </nav>
          <h2 className="text-3xl font-bold tracking-tight">WASTE GENERATION TAGS</h2>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="commodity" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-none">
              <TabsTrigger 
                value="commodity" 
                className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white rounded-none"
              >
                Commodity
              </TabsTrigger>
              <TabsTrigger 
                value="category"
                className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white rounded-none"
              >
                Category
              </TabsTrigger>
              <TabsTrigger 
                value="operational"
                className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white rounded-none"
              >
                Operational Name of Landlord/Tenant
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="commodity" className="space-y-4 mt-0 p-6">
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
  className="flex-1 h-10 text-sm"
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
            
            <TabsContent value="category" className="space-y-4 mt-0 p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="commodity-select" className="text-sm font-medium">
                      Commodity*
                    </Label>
                    <Select>
                      <SelectTrigger className="mt-2 h-[56px]">
                        <SelectValue placeholder="Select Commodity" />
                      </SelectTrigger>
                      <SelectContent>
                        {commodities.map((commodity) => (
                          <SelectItem key={commodity.id} value={commodity.name}>
                            {commodity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-sm font-medium">
                      Category*
                    </Label>
                    <Input
                      id="category"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      className="mt-2"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                  </div>

                  <div>
                    <Label htmlFor="uom" className="text-sm font-medium">
                      UOM*
                    </Label>
                    <Select value={categoryUoM} onValueChange={setCategoryUoM}>
                      <SelectTrigger className="mt-2 h-[56px]">
                        <SelectValue placeholder="Select UOM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">KG</SelectItem>
                        <SelectItem value="tons">Tons</SelectItem>
                        <SelectItem value="liters">Liters</SelectItem>
                        <SelectItem value="pieces">Pieces</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-start">
                  <Button 
                    onClick={handleAddCategory}
                    style={{ backgroundColor: '#C72030' }}
                    className="hover:bg-[#A01B26] text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>

                <div className="mt-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <h3 className="font-medium text-center">Commodity</h3>
                      <h3 className="font-medium text-center">Category</h3>
                      <h3 className="font-medium text-center">UOM</h3>
                    </div>
                    <div className="space-y-2">
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <div key={category.id} className="bg-white p-3 rounded border grid grid-cols-3 gap-4 items-center">
                            <span className="text-center">-</span>
                            <span className="text-center">{category.name}</span>
                            <span className="text-center">{category.uom}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-800 justify-self-end col-start-3"
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
            
            <TabsContent value="operational" className="space-y-4 mt-0 p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="operational" className="text-sm font-medium">
                    Operational Name of Landlord/ Tenant*
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
                    <h3 className="font-medium text-center mb-4">Operational Name of Landlord/ Tenant</h3>
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
