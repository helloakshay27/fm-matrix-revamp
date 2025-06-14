
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Edit } from "lucide-react";

const TagSetupDashboard = () => {
  const [companyTagName, setCompanyTagName] = useState('');
  const [tagType, setTagType] = useState('');
  const [tagColor, setTagColor] = useState('');
  const [mom, setMom] = useState(false);
  const [task, setTask] = useState(false);

  const tagData = [
    { id: 10, companyTagName: "FM Maint", tagType: "Product", mom: "Yes", task: "Yes", tagColor: "#e6000", active: true },
    { id: 11, companyTagName: "GoPhygital", tagType: "Client", mom: "Yes", task: "Yes", tagColor: "#000000", active: true },
    { id: 12, companyTagName: "HiSociety", tagType: "Product", mom: "Yes", task: "Yes", tagColor: "#ffaa00", active: true },
    { id: 13, companyTagName: "Snag360", tagType: "Product", mom: "Yes", task: "Yes", tagColor: "#14de00", active: true },
    { id: 17, companyTagName: "Lead Infinity", tagType: "Product", mom: "Yes", task: "Yes", tagColor: "", active: true },
    { id: 23, companyTagName: "Appointmentz", tagType: "Product", mom: "Yes", task: "Yes", tagColor: "", active: true },
    { id: 25, companyTagName: "Engineering", tagType: "Product", mom: "Yes", task: "Yes", tagColor: "", active: true },
    { id: 26, companyTagName: "PSPL", tagType: "Client", mom: "Yes", task: "Yes", tagColor: "", active: true },
    { id: 27, companyTagName: "Vodafone", tagType: "Client", mom: "Yes", task: "Yes", tagColor: "", active: true },
    { id: 28, companyTagName: "Godrej Living", tagType: "Client", mom: "Yes", task: "Yes", tagColor: "", active: true },
    { id: 29, companyTagName: "Godrej Snag360", tagType: "Client", mom: "Yes", task: "Yes", tagColor: "", active: true },
    { id: 30, companyTagName: "Runwal", tagType: "Client", mom: "Yes", task: "Yes", tagColor: "", active: true },
    { id: 31, companyTagName: "Arvind", tagType: "Client", mom: "Yes", task: "Yes", tagColor: "", active: true },
    { id: 32, companyTagName: "Panchshil", tagType: "Client", mom: "Yes", task: "Yes", tagColor: "", active: true },
    { id: 33, companyTagName: "TRIL", tagType: "Client", mom: "Yes", task: "Yes", tagColor: "", active: true },
  ];

  const handleSubmit = () => {
    console.log('Tag created:', { companyTagName, tagType, tagColor, mom, task });
    // Reset form
    setCompanyTagName('');
    setTagType('');
    setTagColor('');
    setMom(false);
    setTask(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">COMPANY TAGS DETAILS</h1>
      </div>

      {/* Form Section */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <Label htmlFor="companyTagName" className="text-sm font-medium">
                Company Tag Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyTagName"
                value={companyTagName}
                onChange={(e) => setCompanyTagName(e.target.value)}
                className="mt-1"
                placeholder="Enter tag name"
              />
            </div>

            <div>
              <Label htmlFor="tagType" className="text-sm font-medium">
                Tag Type<span className="text-red-500">*</span>
              </Label>
              <Select value={tagType} onValueChange={setTagType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Tag Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="mom" 
                  checked={mom}
                  onCheckedChange={(checked) => setMom(checked as boolean)}
                />
                <Label htmlFor="mom" className="text-sm">MOM</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="task" 
                  checked={task}
                  onCheckedChange={(checked) => setTask(checked as boolean)}
                />
                <Label htmlFor="task" className="text-sm">Task</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="tagColor" className="text-sm font-medium">Tag Colour</Label>
              <Input
                id="tagColor"
                type="color"
                value={tagColor}
                onChange={(e) => setTagColor(e.target.value)}
                className="mt-1 h-10"
              />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8"
            >
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Actions</TableHead>
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Active/Inactive</TableHead>
                <TableHead className="font-semibold">Company Tag Name</TableHead>
                <TableHead className="font-semibold">Tag Type</TableHead>
                <TableHead className="font-semibold">MOM</TableHead>
                <TableHead className="font-semibold">Task</TableHead>
                <TableHead className="font-semibold">Tag Colour</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tagData.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{row.id}</TableCell>
                  <TableCell>
                    <Switch checked={row.active} />
                  </TableCell>
                  <TableCell>{row.companyTagName}</TableCell>
                  <TableCell>{row.tagType}</TableCell>
                  <TableCell>{row.mom}</TableCell>
                  <TableCell>{row.task}</TableCell>
                  <TableCell>
                    {row.tagColor && (
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: row.tagColor }}
                        />
                        <span className="text-sm">{row.tagColor}</span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TagSetupDashboard;
