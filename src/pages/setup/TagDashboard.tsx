
import React, { useState } from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, ToggleLeft, ToggleRight } from 'lucide-react';

export const TagDashboard = () => {
  const [formData, setFormData] = useState({
    companyTagName: '',
    tagType: '',
    mom: false,
    task: false,
    tagColour: '#000000'
  });

  const existingTags = [
    { id: 10, name: 'FM Matrix', type: 'Product', mom: 'Yes', task: 'Yes', colour: '#da0000', active: true },
    { id: 11, name: 'GoPhygital', type: 'Client', mom: 'Yes', task: 'Yes', colour: '#000000', active: true },
    { id: 12, name: 'HiSociety', type: 'Product', mom: 'Yes', task: 'Yes', colour: '#ffaa00', active: true },
    { id: 13, name: 'Snag360', type: 'Product', mom: 'Yes', task: 'Yes', colour: '#146400', active: true },
    { id: 17, name: 'Lead Infinity', type: 'Product', mom: 'Yes', task: 'Yes', colour: '', active: true },
    { id: 23, name: 'Appointmentz', type: 'Product', mom: 'Yes', task: 'Yes', colour: '', active: true },
    { id: 25, name: 'Engineering', type: 'Product', mom: 'Yes', task: 'Yes', colour: '', active: true },
    { id: 26, name: 'PSPL', type: 'Client', mom: 'Yes', task: 'Yes', colour: '', active: true },
    { id: 27, name: 'Vodafone', type: 'Client', mom: 'Yes', task: 'Yes', colour: '', active: true },
    { id: 28, name: 'Godrej Living', type: 'Client', mom: 'Yes', task: 'Yes', colour: '', active: true },
    { id: 29, name: 'Godrej Snag360', type: 'Client', mom: 'Yes', task: 'Yes', colour: '', active: true },
    { id: 30, name: 'Runwal', type: 'Client', mom: 'Yes', task: 'Yes', colour: '', active: true }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleActive = (id: number) => {
    console.log('Toggle active for ID:', id);
    // Handle toggle active/inactive
  };

  return (
    <SetupLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600">
          <span>Company Tag List</span>
          <span className="mx-2">{'>'}</span>
          <span className="text-orange-600">Create Company Tag</span>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader className="bg-orange-50 border-b">
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm">
                A
              </div>
              COMPANY TAGS DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyTagName">
                    Company Tag Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyTagName"
                    value={formData.companyTagName}
                    onChange={(e) => handleInputChange('companyTagName', e.target.value)}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagType">
                    Tag Type <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.tagType} onValueChange={(value) => handleInputChange('tagType', value)}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Select Tag Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mom"
                      checked={formData.mom}
                      onCheckedChange={(checked) => handleInputChange('mom', checked)}
                    />
                    <Label htmlFor="mom">MOM</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="task"
                      checked={formData.task}
                      onCheckedChange={(checked) => handleInputChange('task', checked)}
                    />
                    <Label htmlFor="task">Task</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagColour">
                    Tag Colour <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="tagColour"
                      value={formData.tagColour}
                      onChange={(e) => handleInputChange('tagColour', e.target.value)}
                      className="w-12 h-10 p-1 border-gray-300"
                    />
                    <Input
                      type="text"
                      value={formData.tagColour}
                      onChange={(e) => handleInputChange('tagColour', e.target.value)}
                      className="flex-1 border-gray-300"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-center">Actions</TableHead>
                    <TableHead className="text-center">ID</TableHead>
                    <TableHead className="text-center">Active/Inactive</TableHead>
                    <TableHead className="text-center">Company Tag Name</TableHead>
                    <TableHead className="text-center">Tag Type</TableHead>
                    <TableHead className="text-center text-blue-600">MOM</TableHead>
                    <TableHead className="text-center">Task</TableHead>
                    <TableHead className="text-center">Tag Colour</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {existingTags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-center text-blue-600">{tag.id}</TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleActive(tag.id)}
                          className="text-orange-500"
                        >
                          {tag.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">{tag.name}</TableCell>
                      <TableCell className="text-center">{tag.type}</TableCell>
                      <TableCell className="text-center">{tag.mom}</TableCell>
                      <TableCell className="text-center">{tag.task}</TableCell>
                      <TableCell className="text-center">
                        {tag.colour && (
                          <div 
                            className="w-6 h-6 rounded mx-auto border"
                            style={{ backgroundColor: tag.colour }}
                          />
                        )}
                        <span className="text-xs">{tag.colour}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </SetupLayout>
  );
};
