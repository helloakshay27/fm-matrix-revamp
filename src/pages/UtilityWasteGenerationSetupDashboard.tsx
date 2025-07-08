import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  height: { xs: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px 14px', md: '12px 14px' },
  },
  '& .MuiInputLabel-root': {
    color: '#999999',
    fontSize: '16px',
    '&.Mui-focused': {
      color: '#C72030'
    }
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E0E0E0'
    },
    '&:hover fieldset': {
      borderColor: '#1A1A1A'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
      borderWidth: 2
    }
  }
};

const multilineFieldStyles = {
  ...fieldStyles,
  '& .MuiOutlinedInput-root': {
    ...fieldStyles['& .MuiOutlinedInput-root'],
    height: 'auto',
    alignItems: 'flex-start'
  }
};

export const UtilityWasteGenerationSetupDashboard = () => {
  const [activeTab, setActiveTab] = useState("waste-category");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [wasteCategoryForm, setWasteCategoryForm] = useState({
    category: '',
    categoryCode: '',
    description: '',
    status: 'active'
  });

  const [commodityForm, setCommodityForm] = useState({
    commodity: '',
    commodityCode: '',
    category: '',
    description: '',
    status: 'active'
  });

  const [uomForm, setUomForm] = useState({
    uom: '',
    uomCode: '',
    description: '',
    status: 'active'
  });

  // Sample data
  const wasteCategories = [
    { id: 1, category: "Recyclable", code: "REC001", description: "Materials that can be recycled", status: "Active" },
    { id: 2, category: "Non-Recyclable", code: "NRC001", description: "Materials that cannot be recycled", status: "Active" },
    { id: 3, category: "Hazardous", code: "HAZ001", description: "Dangerous waste materials", status: "Inactive" }
  ];

  const commodities = [
    { id: 1, commodity: "Paper", code: "PAP001", category: "Recyclable", description: "All paper materials", status: "Active" },
    { id: 2, commodity: "Plastic", code: "PLA001", category: "Recyclable", description: "Plastic containers and bottles", status: "Active" },
    { id: 3, commodity: "Metal", code: "MET001", category: "Recyclable", description: "Metal scraps and containers", status: "Active" }
  ];

  const uoms = [
    { id: 1, uom: "Kilogram", code: "KG", description: "Weight in kilograms", status: "Active" },
    { id: 2, uom: "Ton", code: "TON", description: "Weight in tons", status: "Active" },
    { id: 3, uom: "Liter", code: "LTR", description: "Volume in liters", status: "Active" }
  ];

  const handleWasteCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Waste Category Form:', wasteCategoryForm);
    // Reset form
    setWasteCategoryForm({
      category: '',
      categoryCode: '',
      description: '',
      status: 'active'
    });
  };

  const handleCommoditySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Commodity Form:', commodityForm);
    // Reset form
    setCommodityForm({
      commodity: '',
      commodityCode: '',
      category: '',
      description: '',
      status: 'active'
    });
  };

  const handleUomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('UOM Form:', uomForm);
    // Reset form
    setUomForm({
      uom: '',
      uomCode: '',
      description: '',
      status: 'active'
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">UTILITY WASTE GENERATION SETUP</h2>
          <p className="text-muted-foreground">
            Manage waste categories, commodities, and units of measurement
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="waste-category">Waste Category</TabsTrigger>
          <TabsTrigger value="commodity">Commodity</TabsTrigger>
          <TabsTrigger value="uom">UOM</TabsTrigger>
        </TabsList>

        {/* Waste Category Tab */}
        <TabsContent value="waste-category" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Waste Category</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWasteCategorySubmit} className="space-y-4">
                  <TextField
                    label="Category Name*"
                    placeholder="Enter category name"
                    value={wasteCategoryForm.category}
                    onChange={(e) =>
                      setWasteCategoryForm((prev) => ({ ...prev, category: e.target.value }))
                    }
                    required
                    fullWidth
                    variant="outlined"
                    sx={fieldStyles}
                  />

                  <TextField
                    label="Category Code*"
                    placeholder="Enter category code"
                    value={wasteCategoryForm.categoryCode}
                    onChange={(e) =>
                      setWasteCategoryForm((prev) => ({
                        ...prev,
                        categoryCode: e.target.value,
                      }))
                    }
                    required
                    fullWidth
                    variant="outlined"
                    sx={fieldStyles}
                  />

                  <TextField
                    label="Description"
                    placeholder="Enter description"
                    value={wasteCategoryForm.description}
                    onChange={(e) =>
                      setWasteCategoryForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    fullWidth
                    variant="outlined"
                    multiline
                    minRows={3}
                    sx={multilineFieldStyles}
                  />

                  <FormControl fullWidth variant="outlined">
                    <InputLabel sx={{
                      color: '#999999',
                      fontSize: '16px',
                      '&.Mui-focused': {
                        color: '#C72030'
                      }
                    }}>Status</InputLabel>
                    <MuiSelect
                      value={wasteCategoryForm.status}
                      onChange={(e) => setWasteCategoryForm(prev => ({ ...prev, status: e.target.value }))}
                      label="Status"
                      sx={fieldStyles}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  
                  <Button type="submit" className="w-full" style={{ backgroundColor: '#C72030' }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Waste Categories
                  <div className="flex items-center space-x-2">
                    <TextField
                      placeholder="Find categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      size="small"
                      InputProps={{
                        startAdornment: <Search className="w-4 h-4 mr-2 text-gray-400" />,
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          height: 40, 
                          '& fieldset': {
                            borderColor: '#E0E0E0'
                          },
                          '&:hover fieldset': {
                            borderColor: '#1A1A1A'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#C72030'
                          }
                        }
                      }}
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {wasteCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{category.category}</h4>
                          <Badge variant={category.status === 'Active' ? 'default' : 'secondary'}>
                            {category.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{category.code}</p>
                        <p className="text-sm text-gray-500">{category.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Commodity Tab */}
        <TabsContent value="commodity" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Commodity</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCommoditySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="commodity">Commodity Name*</Label>
                    <TextField
                      id="commodity"
                      placeholder="Enter commodity name"
                      value={commodityForm.commodity}
                      onChange={(e) => setCommodityForm(prev => ({ ...prev, commodity: e.target.value }))}
                      required
                      fullWidth
                      variant="outlined"
                      sx={fieldStyles}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="commodityCode">Commodity Code*</Label>
                    <TextField
                      id="commodityCode"
                      placeholder="Enter commodity code"
                      value={commodityForm.commodityCode}
                      onChange={(e) => setCommodityForm(prev => ({ ...prev, commodityCode: e.target.value }))}
                      required
                      fullWidth
                      variant="outlined"
                      sx={fieldStyles}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="commodityCategory">Category*</Label>
                    <FormControl fullWidth variant="outlined">
                      <MuiSelect
                        id="commodityCategory"
                        displayEmpty
                        value={commodityForm.category}
                        onChange={(e) => setCommodityForm(prev => ({ ...prev, category: e.target.value }))}
                        sx={fieldStyles}
                      >
                        <MenuItem value=""><em>Select Category</em></MenuItem>
                        <MenuItem value="recyclable">Recyclable</MenuItem>
                        <MenuItem value="non-recyclable">Non-Recyclable</MenuItem>
                        <MenuItem value="hazardous">Hazardous</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="commodityDescription">Description</Label>
                    <TextField
                      id="commodityDescription"
                      placeholder="Enter description"
                      value={commodityForm.description}
                      onChange={(e) => setCommodityForm(prev => ({ ...prev, description: e.target.value }))}
                      fullWidth
                      variant="outlined"
                      multiline
                      minRows={3}
                      sx={multilineFieldStyles}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="commodityStatus">Status</Label>
                    <FormControl fullWidth variant="outlined">
                      <MuiSelect
                        id="commodityStatus"
                        value={commodityForm.status}
                        onChange={(e) => setCommodityForm(prev => ({ ...prev, status: e.target.value }))}
                        sx={fieldStyles}
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
                  
                  <Button type="submit" className="w-full" style={{ backgroundColor: '#C72030' }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Commodity
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Commodities
                  <div className="flex items-center space-x-2">
                    <TextField
                      placeholder="Find commodities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      size="small"
                      InputProps={{
                        startAdornment: <Search className="w-4 h-4 mr-2 text-gray-400" />,
                        sx: { height: 40, padding: '8px 14px' }
                      }}
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {commodities.map((commodity) => (
                    <div key={commodity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{commodity.commodity}</h4>
                          <Badge variant={commodity.status === 'Active' ? 'default' : 'secondary'}>
                            {commodity.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{commodity.code} • {commodity.category}</p>
                        <p className="text-sm text-gray-500">{commodity.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* UOM Tab */}
        <TabsContent value="uom" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add New UOM</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUomSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="uom">UOM Name*</Label>
                    <TextField
                      id="uom"
                      placeholder="Enter UOM name"
                      value={uomForm.uom}
                      onChange={(e) => setUomForm(prev => ({ ...prev, uom: e.target.value }))}
                      required
                      fullWidth
                      variant="outlined"
                      sx={fieldStyles}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="uomCode">UOM Code*</Label>
                    <TextField
                      id="uomCode"
                      placeholder="Enter UOM code"
                      value={uomForm.uomCode}
                      onChange={(e) => setUomForm(prev => ({ ...prev, uomCode: e.target.value }))}
                      required
                      fullWidth
                      variant="outlined"
                      sx={fieldStyles}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="uomDescription">Description</Label>
                    <TextField
                      id="uomDescription"
                      placeholder="Enter description"
                      value={uomForm.description}
                      onChange={(e) => setUomForm(prev => ({ ...prev, description: e.target.value }))}
                      fullWidth
                      variant="outlined"
                      multiline
                      minRows={3}
                      sx={multilineFieldStyles}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="uomStatus">Status</Label>
                    <FormControl fullWidth variant="outlined">
                      <MuiSelect
                        id="uomStatus"
                        value={uomForm.status}
                        onChange={(e) => setUomForm(prev => ({ ...prev, status: e.target.value }))}
                        sx={fieldStyles}
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
                  
                  <Button type="submit" className="w-full" style={{ backgroundColor: '#C72030' }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add UOM
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Unit of Measurements
                  <div className="flex items-center space-x-2">
                    <TextField
                      placeholder="Find UOMs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      size="small"
                      InputProps={{
                        startAdornment: <Search className="w-4 h-4 mr-2 text-gray-400" />,
                        sx: { height: 40, padding: '8px 14px' }
                      }}
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uoms.map((uom) => (
                    <div key={uom.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{uom.uom}</h4>
                          <Badge variant={uom.status === 'Active' ? 'default' : 'secondary'}>
                            {uom.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{uom.code}</p>
                        <p className="text-sm text-gray-500">{uom.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
