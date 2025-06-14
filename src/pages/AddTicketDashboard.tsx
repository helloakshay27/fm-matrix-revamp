
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const AddTicketDashboard = () => {
  const [ticketType, setTicketType] = useState('');
  const [createFor, setCreateFor] = useState('selected-site');

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit TICKET</h1>
        </div>

        {/* Ticket Details Section */}
        <div className="bg-orange-50 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <h2 className="text-lg font-semibold text-orange-800">TICKET DETAILS</h2>
          </div>

          {/* Requestor Details */}
          <h3 className="font-medium mb-3">Requestor Details</h3>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <Label className="text-sm">Name</Label>
              <Input defaultValue="Ankit Gupta" className="mt-1" />
            </div>
            <div>
              <Label className="text-sm">Contact Number</Label>
              <Input defaultValue="7388997281" className="mt-1" />
            </div>
            <div>
              <Label className="text-sm">Site</Label>
              <Input defaultValue="Lockated" className="mt-1" />
            </div>
            <div>
              <Label className="text-sm">Department</Label>
              <Input className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <Label className="text-sm">Unit</Label>
              <Input className="mt-1" />
            </div>
          </div>

          {/* Ticket Type */}
          <div className="mb-4">
            <Label className="text-sm font-medium">Ticket Type</Label>
            <RadioGroup value={ticketType} onValueChange={setTicketType} className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="request" id="request" />
                <Label htmlFor="request">Request</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="suggestion" id="suggestion" />
                <Label htmlFor="suggestion">Suggestion</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="complaint" id="complaint" />
                <Label htmlFor="complaint">Complaint</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Create Ticket For */}
          <div className="mb-4">
            <Label className="text-sm font-medium">Create Ticket For</Label>
            <RadioGroup value={createFor} onValueChange={setCreateFor} className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="selected-site" id="selected-site" />
                <Label htmlFor="selected-site">Selected Site</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Category and Description */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="text-sm">Category Type</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fire-system">FIRE SYSTEM</SelectItem>
                  <SelectItem value="air-conditioner">Air Conditioner</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Sub Category Type</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Sub Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fire">fire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Description*</Label>
              <Textarea placeholder="Description" className="mt-1" />
            </div>
          </div>
        </div>

        {/* Attachment Section */}
        <div className="bg-orange-50 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">📎</span>
            </div>
            <h2 className="text-lg font-semibold text-orange-800">ATTACHMENT</h2>
          </div>

          <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
            <p className="text-gray-600">
              Drag & Drop or{' '}
              <button className="text-orange-500 underline">Choose Files</button>
            </p>
            <p className="text-sm text-gray-500 mt-1">No file chosen</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-2">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
