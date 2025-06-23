
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Upload } from "lucide-react";

const AddNewBillDashboard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Bill Booking &gt; Add Bill
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-[#1a1a1a]">ADD BILL</h1>

      {/* Form */}
      <Card className="max-w-4xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="billNumber">Bill Number*</Label>
                  <Input id="billNumber" placeholder="Enter bill number" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="billDate">Bill Date*</Label>
                  <div className="relative mt-1">
                    <Input id="billDate" type="date" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="supplier">Supplier*</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supplier1">Supplier 1</SelectItem>
                      <SelectItem value="supplier2">Supplier 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount">Amount*</Label>
                  <Input id="amount" type="number" placeholder="0.00" className="mt-1" />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Category*</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Enter description" 
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="attachment">Attachment</Label>
                  <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <input
                        type="file"
                        id="attachment"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      <label
                        htmlFor="attachment"
                        className="cursor-pointer text-blue-600 hover:text-blue-500"
                      >
                        Click to upload
                      </label>
                      <p className="text-gray-500">or drag and drop</p>
                    </div>
                    {selectedFile && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Submit Bill
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddNewBillDashboard;
