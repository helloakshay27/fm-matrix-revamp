
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Edit, Circle } from "lucide-react";

const TagSetupDashboard = () => {
  const [companyTagName, setCompanyTagName] = useState('');
  const [tagType, setTagType] = useState('');
  const [tagColor, setTagColor] = useState('');
  const [isMOM, setIsMOM] = useState(false);
  const [isTask, setIsTask] = useState(false);

  const [tags, setTags] = useState([
    { id: 10, name: "FM Matrix", type: "Product", mom: "Yes", task: "Yes", color: "#e60000", active: true },
    { id: 11, name: "GoPhygital", type: "Client", mom: "Yes", task: "Yes", color: "#000000", active: true },
    { id: 12, name: "HiSociety", type: "Product", mom: "Yes", task: "Yes", color: "#ffaa00", active: true },
    { id: 13, name: "Snag360", type: "Product", mom: "Yes", task: "Yes", color: "#14d600", active: true },
    { id: 17, name: "Lead Infinity", type: "Product", mom: "Yes", task: "Yes", color: "#14d600", active: true },
    { id: 23, name: "Appointment", type: "Product", mom: "Yes", task: "Yes", color: "#14d600", active: true },
    { id: 25, name: "Engineering", type: "Product", mom: "Yes", task: "Yes", color: "#14d600", active: true },
    { id: 26, name: "PSPL", type: "Client", mom: "Yes", task: "Yes", color: "#14d600", active: true },
    { id: 27, name: "Vodafone", type: "Client", mom: "Yes", task: "Yes", color: "#14d600", active: true },
    { id: 28, name: "Godrej Living", type: "Client", mom: "Yes", task: "Yes", color: "#14d600", active: true },
    { id: 29, name: "Godrej Snag360", type: "Client", mom: "Yes", task: "Yes", color: "#14d600", active: true },
    { id: 30, name: "Runwal", type: "Client", mom: "Yes", task: "Yes", color: "#14d600", active: true },
    { id: 31, name: "Arvind", type: "Client", mom: "Yes", task: "Yes", color: "#14d600", active: true },
    { id: 32, name: "Panchshil", type: "Client", mom: "Yes", task: "Yes", color: "#14d600", active: true },
    { id: 33, name: "TRIL", type: "Client", mom: "Yes", task: "Yes", color: "#14d600", active: true },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyTagName.trim() && tagType && tagColor) {
      const newTag = {
        id: Math.max(...tags.map(t => t.id)) + 1,
        name: companyTagName,
        type: tagType,
        mom: isMOM ? "Yes" : "No",
        task: isTask ? "Yes" : "No",
        color: tagColor,
        active: true
      };
      setTags([...tags, newTag]);
      
      // Reset form
      setCompanyTagName('');
      setTagType('');
      setTagColor('');
      setIsMOM(false);
      setIsTask(false);
    }
  };

  const toggleActive = (id: number) => {
    setTags(tags.map(tag => 
      tag.id === id ? { ...tag, active: !tag.active } : tag
    ));
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <span>Company Tag List</span>
        <span>›</span>
        <span>Create Company Tag</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <Circle className="w-3 h-3 text-white fill-current" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">COMPANY TAGS DETAILS</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label htmlFor="companyTagName" className="block text-sm font-medium text-gray-700 mb-2">
              Company Tag Name<span className="text-red-500">*</span>
            </label>
            <Input
              id="companyTagName"
              type="text"
              value={companyTagName}
              onChange={(e) => setCompanyTagName(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="tagType" className="block text-sm font-medium text-gray-700 mb-2">
              Tag Type<span className="text-red-500">*</span>
            </label>
            <Select value={tagType} onValueChange={setTagType} required>
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

          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mom" 
                checked={isMOM}
                onCheckedChange={setIsMOM}
              />
              <label htmlFor="mom" className="text-sm font-medium">MOM</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="task" 
                checked={isTask}
                onCheckedChange={setIsTask}
              />
              <label htmlFor="task" className="text-sm font-medium">Task</label>
            </div>
          </div>

          <div>
            <label htmlFor="tagColor" className="block text-sm font-medium text-gray-700 mb-2">
              Tag Colour<span className="text-red-500">*</span>
            </label>
            <Input
              id="tagColor"
              type="color"
              value={tagColor}
              onChange={(e) => setTagColor(e.target.value)}
              className="w-full h-10"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-8"
          >
            Submit
          </Button>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">Actions</TableHead>
              <TableHead className="font-semibold text-gray-900">ID</TableHead>
              <TableHead className="font-semibold text-gray-900">Active/Inactive</TableHead>
              <TableHead className="font-semibold text-gray-900">Company Tag Name</TableHead>
              <TableHead className="font-semibold text-gray-900">Tag Type</TableHead>
              <TableHead className="font-semibold text-gray-900">MOM</TableHead>
              <TableHead className="font-semibold text-gray-900">Task</TableHead>
              <TableHead className="font-semibold text-gray-900">Tag Colour</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{tag.id}</TableCell>
                <TableCell>
                  <div
                    className={`w-8 h-4 rounded-full cursor-pointer ${
                      tag.active ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                    onClick={() => toggleActive(tag.id)}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                        tag.active ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </TableCell>
                <TableCell>{tag.name}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={tag.type === 'Client' ? 'text-blue-600 border-blue-600' : 'text-purple-600 border-purple-600'}
                  >
                    {tag.type}
                  </Badge>
                </TableCell>
                <TableCell>{tag.mom}</TableCell>
                <TableCell>{tag.task}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="text-sm text-gray-600">{tag.color}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TagSetupDashboard;
