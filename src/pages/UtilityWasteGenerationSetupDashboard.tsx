import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface CommodityData {
  id: number;
  name: string;
  status: boolean;
  createdOn: string;
  createdBy: string;
}

interface CategoryData {
  id: number;
  commodity: string;
  category: string;
  uom: string;
  status: boolean;
  createdOn: string;
  createdBy: string;
}

interface LandlordData {
  id: number;
  name: string;
  status: boolean;
  createdOn: string;
  createdBy: string;
}

export const UtilityWasteGenerationSetupDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("Commodity");
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isAddCommodityModalOpen, setIsAddCommodityModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddLandlordModalOpen, setIsAddLandlordModalOpen] = useState(false);
  
  // Form states
  const [commodityInput, setCommodityInput] = useState('');
  const [categoryInputs, setCategoryInputs] = useState({
    commodity: '',
    category: '',
    uom: ''
  });
  const [landlordInput, setLandlordInput] = useState('');

  // Data states
  const [commodities, setCommodities] = useState<CommodityData[]>([
    { id: 1, name: "Dry Waste", status: true, createdOn: "26/11/2024", createdBy: "Admin" },
    { id: 2, name: "Organic Waste", status: true, createdOn: "26/11/2024", createdBy: "Admin" },
    { id: 3, name: "Hazardous Waste", status: true, createdOn: "26/11/2024", createdBy: "Admin" }
  ]);
  
  const [categories, setCategories] = useState<CategoryData[]>([
    { id: 1, commodity: "Organic Waste", category: "Landscape Waste", uom: "KG", status: true, createdOn: "26/11/2024", createdBy: "Admin" },
    { id: 2, commodity: "Organic Waste", category: "Food Waste", uom: "KG", status: true, createdOn: "26/11/2024", createdBy: "Admin" },
    { id: 3, commodity: "Dry Waste", category: "Plastic Waste", uom: "KG", status: true, createdOn: "26/11/2024", createdBy: "Admin" },
    { id: 4, commodity: "Dry Waste", category: "Paper Waste", uom: "KG", status: true, createdOn: "26/11/2024", createdBy: "Admin" },
    { id: 5, commodity: "Dry Waste", category: "Non Recyclable Dry Waste", uom: "KG", status: true, createdOn: "26/11/2024", createdBy: "Admin" },
    { id: 6, commodity: "Dry Waste", category: "Multi Layered Plastic Waste", uom: "KG", status: true, createdOn: "26/11/2024", createdBy: "Admin" },
    { id: 7, commodity: "Hazardous Waste", category: "Oil", uom: "Litres", status: true, createdOn: "26/11/2024", createdBy: "Admin" }
  ]);
  
  const [landlords, setLandlords] = useState<LandlordData[]>([
    { id: 1, name: "EON KHARADI INFRASTRUCTURE PVT. LTD.", status: true, createdOn: "26/11/2024", createdBy: "Admin" },
    { id: 2, name: "BALEWADI TECHPARK PRIVATE LIMITED", status: true, createdOn: "26/11/2024", createdBy: "Admin" },
    { id: 3, name: "HINJEWADI TECHPARK PRIVATE LIMITED", status: true, createdOn: "26/11/2024", createdBy: "Admin" },
    { id: 4, name: "EON-HINJEWADI INFRASTRUCTURE PVT. LTD.", status: true, createdOn: "26/11/2024", createdBy: "Admin" },
    { id: 5, name: "BALEWADI PROPERTIES LLP", status: true, createdOn: "26/11/2024", createdBy: "Admin" },
    { id: 6, name: "RVS HOSPITALITY & DEVELOPMENT PVT. LTD.", status: true, createdOn: "26/11/2024", createdBy: "Admin" },
    { id: 7, name: "ICC REALTY (INDIA) PVT. LTD.", status: true, createdOn: "26/11/2024", createdBy: "Admin" }
  ]);

  // Filter data based on search
  const getFilteredData = () => {
    switch (activeTab) {
      case 'Commodity':
        return commodities.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'Category':
        return categories.filter(item =>
          item.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.uom.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'Operational Name of Landlord/Tenant':
        return landlords.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return [];
    }
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setSearchTerm(''); // Clear search when switching tabs
  };

  const handleAddCommodity = () => {
    setIsAddCommodityModalOpen(true);
  };

  const handleAddCategory = () => {
    setIsAddCategoryModalOpen(true);
  };

  const handleAddLandlord = () => {
    setIsAddLandlordModalOpen(true);
  };

  const handleCommoditySubmit = () => {
    if (!commodityInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a commodity name",
        variant: "destructive"
      });
      return;
    }

    const newCommodity = {
      id: Math.max(...commodities.map(c => c.id), 0) + 1,
      name: commodityInput,
      status: true,
      createdOn: new Date().toLocaleDateString('en-GB'),
      createdBy: 'Current User'
    };

    setCommodities([...commodities, newCommodity]);
    setCommodityInput('');
    setIsAddCommodityModalOpen(false);
    
    toast({
      title: "Success",
      description: "Commodity added successfully"
    });
  };

  const handleCategorySubmit = () => {
    if (!categoryInputs.commodity || !categoryInputs.category || !categoryInputs.uom) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const newCategory = {
      id: Math.max(...categories.map(c => c.id), 0) + 1,
      commodity: categoryInputs.commodity,
      category: categoryInputs.category,
      uom: categoryInputs.uom,
      status: true,
      createdOn: new Date().toLocaleDateString('en-GB'),
      createdBy: 'Current User'
    };

    setCategories([...categories, newCategory]);
    setCategoryInputs({ commodity: '', category: '', uom: '' });
    setIsAddCategoryModalOpen(false);
    
    toast({
      title: "Success",
      description: "Category added successfully"
    });
  };

  const handleLandlordSubmit = () => {
    if (!landlordInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter landlord/tenant name",
        variant: "destructive"
      });
      return;
    }

    const newLandlord = {
      id: Math.max(...landlords.map(l => l.id), 0) + 1,
      name: landlordInput,
      status: true,
      createdOn: new Date().toLocaleDateString('en-GB'),
      createdBy: 'Current User'
    };

    setLandlords([...landlords, newLandlord]);
    setLandlordInput('');
    setIsAddLandlordModalOpen(false);
    
    toast({
      title: "Success",
      description: "Landlord/Tenant added successfully"
    });
  };

  const handleDelete = (id: number) => {
    switch (activeTab) {
      case 'commodity':
        setCommodities(commodities.filter(item => item.id !== id));
        break;
      case 'category':
        setCategories(categories.filter(item => item.id !== id));
        break;
      case 'landlord':
        setLandlords(landlords.filter(item => item.id !== id));
        break;
    }
    
    toast({
      title: "Success",
      description: "Item deleted successfully"
    });
  };

  const handleStatusToggle = (id: number) => {
    switch (activeTab) {
      case 'Commodity':
        setCommodities(commodities.map(item =>
          item.id === id ? { ...item, status: !item.status } : item
        ));
        break;
      case 'Category':
        setCategories(categories.map(item =>
          item.id === id ? { ...item, status: !item.status } : item
        ));
        break;
      case 'Operational Name of Landlord/Tenant':
        setLandlords(landlords.map(item =>
          item.id === id ? { ...item, status: !item.status } : item
        ));
        break;
    }
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">WASTE GENERATION TAGS</h2>
            <p className="text-muted-foreground mt-1">
              Manage waste categories, commodities, and units of measurement
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {/* Custom Tab Navigation */}
            <div className="flex border-b border-gray-200">
              {['Commodity', 'Category', 'Operational Name of Landlord/Tenant'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Commodity Tab */}
            {activeTab === 'Commodity' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Button
                    onClick={handleAddCommodity}
                    className="bg-[#6B2C91] hover:bg-[#5A2579] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Commodity
                  </Button>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E95420]"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#f6f4ee]">
                        <TableHead className="px-4 py-3 w-20">Action</TableHead>
                        <TableHead className="px-4 py-3 min-w-[200px]">Commodity</TableHead>
                        <TableHead className="px-4 py-3 w-32 text-center">Status</TableHead>
                        <TableHead className="px-4 py-3 min-w-[150px]">Created On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(getFilteredData() as CommodityData[]).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="px-4 py-8 text-center text-gray-500">
                            No data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        (getFilteredData() as CommodityData[]).map((item) => (
                          <TableRow key={item.id} className="hover:bg-gray-50">
                            <TableCell className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {}}
                                  className="p-1 hover:bg-gray-100 rounded"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                                </button>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 font-medium">{item.name}</TableCell>
                            <TableCell className="px-4 py-3 text-center">
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer ${
                                  item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}
                                onClick={() => handleStatusToggle(item.id)}
                              >
                                {item.status ? 'Active' : 'Inactive'}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">{item.createdOn}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Category Tab */}
            {activeTab === 'Category' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Button
                    onClick={handleAddCategory}
                    className="bg-[#6B2C91] hover:bg-[#5A2579] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E95420]"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#f6f4ee]">
                        <TableHead className="px-4 py-3 w-20">Action</TableHead>
                        <TableHead className="px-4 py-3 min-w-[150px]">Commodity</TableHead>
                        <TableHead className="px-4 py-3 min-w-[150px]">Category</TableHead>
                        <TableHead className="px-4 py-3 w-20">UOM</TableHead>
                        <TableHead className="px-4 py-3 w-32 text-center">Status</TableHead>
                        <TableHead className="px-4 py-3 min-w-[150px]">Created On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(getFilteredData() as CategoryData[]).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            No data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        (getFilteredData() as CategoryData[]).map((item) => (
                          <TableRow key={item.id} className="hover:bg-gray-50">
                            <TableCell className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {}}
                                  className="p-1 hover:bg-gray-100 rounded"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                                </button>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 font-medium">{item.commodity}</TableCell>
                            <TableCell className="px-4 py-3 font-medium">{item.category}</TableCell>
                            <TableCell className="px-4 py-3 text-sm">{item.uom}</TableCell>
                            <TableCell className="px-4 py-3 text-center">
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer ${
                                  item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}
                                onClick={() => handleStatusToggle(item.id)}
                              >
                                {item.status ? 'Active' : 'Inactive'}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">{item.createdOn}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Landlord Tab */}
            {activeTab === 'Operational Name of Landlord/Tenant' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Button
                    onClick={handleAddLandlord}
                    className="bg-[#6B2C91] hover:bg-[#5A2579] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Landlord/Tenant
                  </Button>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E95420]"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#f6f4ee]">
                        <TableHead className="px-4 py-3 w-20">Action</TableHead>
                        <TableHead className="px-4 py-3 min-w-[250px]">Operational Name</TableHead>
                        <TableHead className="px-4 py-3 w-32 text-center">Status</TableHead>
                        <TableHead className="px-4 py-3 min-w-[150px]">Created On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(getFilteredData() as LandlordData[]).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="px-4 py-8 text-center text-gray-500">
                            No data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        (getFilteredData() as LandlordData[]).map((item) => (
                          <TableRow key={item.id} className="hover:bg-gray-50">
                            <TableCell className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {}}
                                  className="p-1 hover:bg-gray-100 rounded"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                                </button>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 font-medium">{item.name}</TableCell>
                            <TableCell className="px-4 py-3 text-center">
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer ${
                                  item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}
                                onClick={() => handleStatusToggle(item.id)}
                              >
                                {item.status ? 'Active' : 'Inactive'}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">{item.createdOn}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Commodity Modal */}
      <Dialog open={isAddCommodityModalOpen} onOpenChange={setIsAddCommodityModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Commodity</DialogTitle>
            <DialogDescription>
              Enter commodity details below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <TextField
              label="Commodity*"
              placeholder="Enter commodity name"
              value={commodityInput}
              onChange={(e) => setCommodityInput(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddCommodityModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCommoditySubmit} className="bg-[#6B2C91] hover:bg-[#5A2579] text-white">
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Category Modal */}
      <Dialog open={isAddCategoryModalOpen} onOpenChange={setIsAddCategoryModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Enter category details below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel shrink>Commodity*</InputLabel>
              <MuiSelect
                value={categoryInputs.commodity}
                onChange={(e) => setCategoryInputs(prev => ({ ...prev, commodity: e.target.value }))}
                label="Commodity*"
                displayEmpty
              >
                <MenuItem value=""><em>Select Commodity</em></MenuItem>
                {commodities.map((commodity) => (
                  <MenuItem key={commodity.id} value={commodity.name}>{commodity.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <TextField
              label="Category*"
              placeholder="Enter category name"
              value={categoryInputs.category}
              onChange={(e) => setCategoryInputs(prev => ({ ...prev, category: e.target.value }))}
              fullWidth
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="UOM*"
              placeholder="Enter UOM"
              value={categoryInputs.uom}
              onChange={(e) => setCategoryInputs(prev => ({ ...prev, uom: e.target.value }))}
              fullWidth
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCategorySubmit} className="bg-[#6B2C91] hover:bg-[#5A2579] text-white">
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Landlord Modal */}
      <Dialog open={isAddLandlordModalOpen} onOpenChange={setIsAddLandlordModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Landlord/Tenant</DialogTitle>
            <DialogDescription>
              Enter operational name below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <TextField
              label="Operational Name of Landlord/Tenant*"
              placeholder="Enter operational name"
              value={landlordInput}
              onChange={(e) => setLandlordInput(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddLandlordModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLandlordSubmit} className="bg-[#6B2C91] hover:bg-[#5A2579] text-white">
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
