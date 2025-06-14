
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Edit } from "lucide-react";

interface CompanyTag {
  id: number;
  companyTagName: string;
  tagType: string;
  tagColor: string;
  mom: boolean;
  task: boolean;
  active: boolean;
}

const TagDashboard = () => {
  const [formData, setFormData] = useState({
    companyTagName: '',
    tagType: '',
    tagColor: '',
    mom: false,
    task: false
  });

  const [tags] = useState<CompanyTag[]>([
    {
      id: 10,
      companyTagName: 'FM Matrix',
      tagType: 'Product',
      tagColor: '#de0000',
      mom: true,
      task: true,
      active: true
    },
    {
      id: 11,
      companyTagName: 'GoPhygital',
      tagType: 'Client',
      tagColor: '#000000',
      mom: true,
      task: true,
      active: true
    },
    {
      id: 12,
      companyTagName: 'HiSociety',
      tagType: 'Product',
      tagColor: '#ffae00',
      mom: true,
      task: true,
      active: true
    },
    {
      id: 13,
      companyTagName: 'Snag360',
      tagType: 'Product',
      tagColor: '#146300',
      mom: true,
      task: true,
      active: true
    },
    {
      id: 17,
      companyTagName: 'Lead Infinity',
      tagType: 'Product',
      tagColor: '#146300',
      mom: true,
      task: true,
      active: true
    },
    {
      id: 23,
      companyTagName: 'Appointmentz',
      tagType: 'Product',
      tagColor: '',
      mom: true,
      task: true,
      active: true
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
        <span>Company Tag List</span>
        <span>&gt;</span>
        <span>Create Company Tag</span>
      </div>

      <Card>
        <CardHeader className="bg-orange-100">
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
              @
            </div>
            COMPANY TAGS DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyTagName">
                  Company Tag Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="companyTagName"
                  value={formData.companyTagName}
                  onChange={(e) => handleInputChange('companyTagName', e.target.value)}
                  placeholder="Enter company tag name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagType">
                  Tag Type<span className="text-red-500">*</span>
                </Label>
                <Select value={formData.tagType} onValueChange={(value) => handleInputChange('tagType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Tag Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Client">Client</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagColor">
                  Tag Colour<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tagColor"
                  type="color"
                  value={formData.tagColor}
                  onChange={(e) => handleInputChange('tagColor', e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mom"
                  checked={formData.mom}
                  onCheckedChange={(checked) => handleInputChange('mom', checked as boolean)}
                />
                <Label htmlFor="mom">MOM</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="task"
                  checked={formData.task}
                  onCheckedChange={(checked) => handleInputChange('task', checked as boolean)}
                />
                <Label htmlFor="task">Task</Label>
              </div>
            </div>

            <div className="flex justify-center">
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Actions</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Active/Inactive</TableHead>
                <TableHead>Company Tag Name</TableHead>
                <TableHead>Tag Type</TableHead>
                <TableHead>MOM</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Tag Colour</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell>{tag.id}</TableCell>
                  <TableCell>
                    <Switch checked={tag.active} />
                  </TableCell>
                  <TableCell className="text-blue-600">{tag.companyTagName}</TableCell>
                  <TableCell>{tag.tagType}</TableCell>
                  <TableCell>{tag.mom ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{tag.task ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    {tag.tagColor && (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: tag.tagColor }}
                        />
                        <span>{tag.tagColor}</span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500 mt-8">
        Powered by <span className="font-semibold">goPhygital.work</span>
      </div>
    </div>
  );
};

export default TagDashboard;
