import React, { useState, useEffect } from 'react';
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
import { API_CONFIG } from '@/config/apiConfig';
import { getToken } from '@/utils/auth';

interface CommodityData {
  id: number;
  category_name: string;
  tag_type: string;
  active: boolean;
  created_at: string;
  url: string;
}

interface CategoryData {
  id: number;
  category_name: string;
  category_type: string | null;
  parent_id: number | null;
  parent_name: string | null;
  tag_type: string;
  active: boolean;
  created_at: string;
  url: string;
}

interface LandlordData {
  id: number;
  category_name: string;
  tag_type: string;
  active: boolean;
  created_at: string;
  url: string;
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
    parent_id: '',
    category_name: '',
    category_type: ''
  });
  const [landlordInput, setLandlordInput] = useState('');

  // Data states
  const [commodities, setCommodities] = useState<CommodityData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [landlords, setLandlords] = useState<LandlordData[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load data on component mount and when tab changes
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const getApiUrl = (endpoint: string) => {
    const baseUrl = API_CONFIG.BASE_URL;
    const token = API_CONFIG.TOKEN;
    return `${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}${endpoint}`;
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const token = getToken();
      let endpoint = '';
      
      switch (activeTab) {
        case 'Commodity':
          endpoint = '/pms/generic_tags.json?q[tag_type_eq]=Commodity';
          break;
        case 'Category':
          endpoint = '/pms/generic_tags.json?q[tag_type_eq]=Category';
          break;
        case 'Operational Name of Landlord/Tenant':
          endpoint = '/pms/generic_tags.json?q[tag_type_eq]=operational_name_of_landlord';
          break;
        default:
          return;
      }

      const response = await fetch(getApiUrl(endpoint), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      
      switch (activeTab) {
        case 'Commodity':
          setCommodities(data);
          break;
        case 'Category':
          setCategories(data);
          break;
        case 'Operational Name of Landlord/Tenant':
          setLandlords(data);
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search
  const getFilteredData = () => {
    switch (activeTab) {
      case 'Commodity':
        return commodities.filter(item =>
          item.category_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'Category':
        return categories.filter(item =>
          item.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.parent_name && item.parent_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.category_type && item.category_type.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      case 'Operational Name of Landlord/Tenant':
        return landlords.filter(item =>
          item.category_name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleCommoditySubmit = async () => {
    if (!commodityInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a commodity name",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      const payload = {
        pms_generic_tag: {
          tag_type: "Commodity",
          active: "1",
          category_name: commodityInput
        }
      };

      const response = await fetch(getApiUrl('/pms/generic_tags.json'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to add commodity');
      }

      setCommodityInput('');
      setIsAddCommodityModalOpen(false);
      
      toast({
        title: "Success",
        description: "Commodity added successfully"
      });
      
      // Reload data
      loadData();
    } catch (error) {
      console.error('Error adding commodity:', error);
      toast({
        title: "Error",
        description: "Failed to add commodity",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategorySubmit = async () => {
    if (!categoryInputs.parent_id || !categoryInputs.category_name || !categoryInputs.category_type) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      const payload = {
        pms_generic_tag: {
          tag_type: "Category",
          active: "1",
          parent_id: categoryInputs.parent_id,
          category_name: categoryInputs.category_name,
          category_type: categoryInputs.category_type
        }
      };

      const response = await fetch(getApiUrl('/pms/generic_tags.json'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      setCategoryInputs({ parent_id: '', category_name: '', category_type: '' });
      setIsAddCategoryModalOpen(false);
      
      toast({
        title: "Success",
        description: "Category added successfully"
      });
      
      // Reload data
      loadData();
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLandlordSubmit = async () => {
    if (!landlordInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter landlord/tenant name",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      const payload = {
        pms_generic_tag: {
          tag_type: "operational_name_of_landlord",
          active: "1",
          category_name: landlordInput
        }
      };

      const response = await fetch(getApiUrl('/pms/generic_tags.json'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to add landlord/tenant');
      }

      setLandlordInput('');
      setIsAddLandlordModalOpen(false);
      
      toast({
        title: "Success",
        description: "Landlord/Tenant added successfully"
      });
      
      // Reload data
      loadData();
    } catch (error) {
      console.error('Error adding landlord/tenant:', error);
      toast({
        title: "Error",
        description: "Failed to add landlord/tenant",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
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
          item.id === id ? { ...item, active: !item.active } : item
        ));
        break;
      case 'Category':
        setCategories(categories.map(item =>
          item.id === id ? { ...item, active: !item.active } : item
        ));
        break;
      case 'Operational Name of Landlord/Tenant':
        setLandlords(landlords.map(item =>
          item.id === id ? { ...item, active: !item.active } : item
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
                        <TableHead className="px-4 py-3 min-w-[200px]">Commodity</TableHead>
                        <TableHead className="px-4 py-3 w-32 text-center">Status</TableHead>
                        <TableHead className="px-4 py-3 min-w-[150px]">Created On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={3} className="px-4 py-8 text-center text-gray-500">
                            Loading...
                          </TableCell>
                        </TableRow>
                      ) : (getFilteredData() as CommodityData[]).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="px-4 py-8 text-center text-gray-500">
                            No data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        (getFilteredData() as CommodityData[]).map((item) => (
                          <TableRow key={item.id} className="hover:bg-gray-50">
                            <TableCell className="px-4 py-3 font-medium">{item.category_name}</TableCell>
                            <TableCell className="px-4 py-3 text-center">
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer ${
                                  item.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}
                                onClick={() => handleStatusToggle(item.id)}
                              >
                                {item.active ? 'Active' : 'Inactive'}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">
                              {new Date(item.created_at).toLocaleDateString('en-GB')}
                            </TableCell>
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
                        <TableHead className="px-4 py-3 min-w-[150px]">Parent Commodity</TableHead>
                        <TableHead className="px-4 py-3 min-w-[150px]">Category</TableHead>
                        <TableHead className="px-4 py-3 min-w-[120px]">Category Type</TableHead>
                        <TableHead className="px-4 py-3 w-32 text-center">Status</TableHead>
                        <TableHead className="px-4 py-3 min-w-[150px]">Created On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="px-4 py-8 text-center text-gray-500">
                            Loading...
                          </TableCell>
                        </TableRow>
                      ) : (getFilteredData() as CategoryData[]).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="px-4 py-8 text-center text-gray-500">
                            No data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        (getFilteredData() as CategoryData[]).map((item) => (
                          <TableRow key={item.id} className="hover:bg-gray-50">
                            <TableCell className="px-4 py-3 font-medium">{item.parent_name || '-'}</TableCell>
                            <TableCell className="px-4 py-3 font-medium">{item.category_name}</TableCell>
                            <TableCell className="px-4 py-3 text-sm">{item.category_type || '-'}</TableCell>
                            <TableCell className="px-4 py-3 text-center">
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer ${
                                  item.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}
                                onClick={() => handleStatusToggle(item.id)}
                              >
                                {item.active ? 'Active' : 'Inactive'}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">
                              {new Date(item.created_at).toLocaleDateString('en-GB')}
                            </TableCell>
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
                        <TableHead className="px-4 py-3 min-w-[250px]">Operational Name</TableHead>
                        <TableHead className="px-4 py-3 w-32 text-center">Status</TableHead>
                        <TableHead className="px-4 py-3 min-w-[150px]">Created On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={3} className="px-4 py-8 text-center text-gray-500">
                            Loading...
                          </TableCell>
                        </TableRow>
                      ) : (getFilteredData() as LandlordData[]).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="px-4 py-8 text-center text-gray-500">
                            No data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        (getFilteredData() as LandlordData[]).map((item) => (
                          <TableRow key={item.id} className="hover:bg-gray-50">
                            <TableCell className="px-4 py-3 font-medium">{item.category_name}</TableCell>
                            <TableCell className="px-4 py-3 text-center">
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer ${
                                  item.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}
                                onClick={() => handleStatusToggle(item.id)}
                              >
                                {item.active ? 'Active' : 'Inactive'}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">
                              {new Date(item.created_at).toLocaleDateString('en-GB')}
                            </TableCell>
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
            <Button variant="outline" onClick={() => setIsAddCommodityModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleCommoditySubmit} className="bg-[#6B2C91] hover:bg-[#5A2579] text-white" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
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
              <InputLabel shrink>Parent Commodity*</InputLabel>
              <MuiSelect
                value={categoryInputs.parent_id}
                onChange={(e) => setCategoryInputs(prev => ({ ...prev, parent_id: e.target.value }))}
                label="Parent Commodity*"
                displayEmpty
              >
                <MenuItem value=""><em>Select Parent Commodity</em></MenuItem>
                {commodities.map((commodity) => (
                  <MenuItem key={commodity.id} value={commodity.id.toString()}>{commodity.category_name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <TextField
              label="Category Name*"
              placeholder="Enter category name"
              value={categoryInputs.category_name}
              onChange={(e) => setCategoryInputs(prev => ({ ...prev, category_name: e.target.value }))}
              fullWidth
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Category Type*"
              placeholder="Enter category type"
              value={categoryInputs.category_type}
              onChange={(e) => setCategoryInputs(prev => ({ ...prev, category_type: e.target.value }))}
              fullWidth
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddCategoryModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleCategorySubmit} className="bg-[#6B2C91] hover:bg-[#5A2579] text-white" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
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
            <Button variant="outline" onClick={() => setIsAddLandlordModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleLandlordSubmit} className="bg-[#6B2C91] hover:bg-[#5A2579] text-white" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
