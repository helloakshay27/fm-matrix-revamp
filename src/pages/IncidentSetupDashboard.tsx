
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from 'lucide-react';

export const IncidentSetupDashboard = () => {
  const [categoryName, setCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Category');
  const [selectedParentCategory, setSelectedParentCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    category: '',
    subCategory: '',
    subSubCategory: '',
    name: ''
  });
  
  const categories = [
    { id: 1, name: 'risks' },
    { id: 2, name: 'Risk Assessment' }
  ];

  const subCategories = [
    { id: 1, category: 'risks', subCategory: 'data' },
    { id: 2, category: 'Risk Assessment', subCategory: 'Physical Security' },
    { id: 3, category: 'Risk Assessment', subCategory: 'Integration Failure' },
    { id: 4, category: 'Risk Assessment', subCategory: 'DDoS Attack' },
    { id: 5, category: 'Risk Assessment', subCategory: 'Phishing Attacks' },
    { id: 6, category: 'Risk Assessment', subCategory: 'Access Control' },
    { id: 7, category: 'Risk Assessment', subCategory: 'Data Breached' }
  ];

  const subSubCategories = [
    { id: 1, category: 'risks', subCategory: 'data', subSubCategory: 'data I' }
  ];

  const menuItems = [
    'Category',
    'Sub Category', 
    'Sub Sub Category',
    'Sub Sub Sub Category',
    'Incidence status',
    'Incidence level',
    'Escalations',
    'Approval Setup',
    'Secondary Category',
    'Secondary Sub Category'
  ];

  const handleSubmit = () => {
    if (categoryName.trim()) {
      console.log('Adding category:', categoryName);
      setCategoryName('');
    }
  };

  const handleEdit = (item: any, type: string) => {
    setEditingItem({ ...item, type });
    setEditFormData({
      category: item.category || item.name || '',
      subCategory: item.subCategory || '',
      subSubCategory: item.subSubCategory || '',
      name: item.name || item.subCategory || item.subSubCategory || ''
    });
    setIsEditing(true);
  };

  const handleEditSubmit = () => {
    console.log('Updating item:', editFormData);
    setIsEditing(false);
    setEditingItem(null);
    setEditFormData({ category: '', subCategory: '', subSubCategory: '', name: '' });
  };

  const handleEditBack = () => {
    setIsEditing(false);
    setEditingItem(null);
    setEditFormData({ category: '', subCategory: '', subSubCategory: '', name: '' });
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Incidents Setup</h1>

      <div className="flex gap-8">
        {/* Left Side - Category Menu */}
        <div className="w-80">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <div 
                key={item}
                onClick={() => setSelectedCategory(item)}
                className={`px-4 py-3 rounded-lg font-medium cursor-pointer transition-colors ${
                  selectedCategory === item 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Form and Table */}
        <div className="flex-1">
          {isEditing ? (
            /* Edit Form */
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">Edit {editingItem?.type || 'Item'}</h2>
              
              <div className="space-y-4">
                {(selectedCategory === 'Sub Category' || selectedCategory === 'Sub Sub Category') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <Select value={editFormData.category} onValueChange={(value) => setEditFormData({...editFormData, category: value})}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {selectedCategory === 'Sub Sub Category' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sub Category
                    </label>
                    <Select value={editFormData.subCategory} onValueChange={(value) => setEditFormData({...editFormData, subCategory: value})}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Sub Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {subCategories
                          .filter(sub => sub.category === editFormData.category)
                          .map((subCategory) => (
                            <SelectItem key={subCategory.id} value={subCategory.subCategory}>
                              {subCategory.subCategory}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {selectedCategory === 'Category' ? 'Category' : 
                     selectedCategory === 'Sub Category' ? 'Sub Category' : 
                     selectedCategory === 'Sub Sub Category' ? 'Sub Sub Category' : 'Name'}
                  </label>
                  <Input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    className="w-full"
                    placeholder="Enter name"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleEditSubmit}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6"
                  >
                    Submit
                  </Button>
                  <Button 
                    onClick={handleEditBack}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6"
                  >
                    Back
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Form Section */}
              <div className="mb-6">
                <div className="flex gap-4 items-end">
                  {(selectedCategory === 'Sub Category' || selectedCategory === 'Sub Sub Category') && (
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <Select value={selectedParentCategory} onValueChange={setSelectedParentCategory}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {selectedCategory === 'Sub Sub Category' && (
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sub Category
                      </label>
                      <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Sub Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          {subCategories
                            .filter(sub => sub.category === selectedParentCategory)
                            .map((subCategory) => (
                              <SelectItem key={subCategory.id} value={subCategory.subCategory}>
                                {subCategory.subCategory}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <Input
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="w-full"
                      placeholder="Enter name"
                    />
                  </div>
                  <Button 
                    onClick={handleSubmit}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                  >
                    Submit
                  </Button>
                </div>
              </div>

              {/* Table Section */}
              <div className="bg-white rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      {selectedCategory === 'Sub Sub Category' ? (
                        <>
                          <TableHead>Category</TableHead>
                          <TableHead>Sub Category</TableHead>
                          <TableHead>Sub Sub Category</TableHead>
                          <TableHead>Action</TableHead>
                        </>
                      ) : selectedCategory === 'Sub Category' ? (
                        <>
                          <TableHead>Category</TableHead>
                          <TableHead>Sub Category</TableHead>
                          <TableHead>Action</TableHead>
                        </>
                      ) : (
                        <>
                          <TableHead>Name</TableHead>
                          <TableHead>Action</TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCategory === 'Sub Sub Category' ? (
                      subSubCategories.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.subCategory}</TableCell>
                          <TableCell>{item.subSubCategory}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleEdit(item, 'Sub Sub Category')}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : selectedCategory === 'Sub Category' ? (
                      subCategories.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.subCategory}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleEdit(item, 'Sub Category')}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>{category.name}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleEdit(category, 'Category')}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentSetupDashboard;
