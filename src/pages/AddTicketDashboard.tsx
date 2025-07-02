import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Paperclip, FileText } from 'lucide-react';

const mockUsers = [
  { id: '1', name: 'Ankit Gupta', type: 'occupant' },
  { id: '2', name: 'Deepak Gupta', type: 'fm' },
  { id: '3', name: 'Vinayak Mane', type: 'fm' },
  { id: '4', name: 'John Doe', type: 'occupant' },
  { id: '5', name: 'Jane Smith', type: 'fm' }
];

export const AddTicketDashboard = () => {
  const navigate = useNavigate();
  const [onBehalfOf, setOnBehalfOf] = useState('self');
  const [ticketType, setTicketType] = useState('');
  const [createFor, setCreateFor] = useState('selected-site');
  const [selectedUser, setSelectedUser] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    name: 'Ankit Gupta',
    contactNumber: '7388997281',
    site: 'Lockated',
    department: '',
    unit: '',
    categoryType: '',
    subCategoryType: '',
    description: '',
    assignedTo: '',
    proactiveReactive: '',
    adminPriority: '',
    referenceNumber: '',
    mode: ''
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachedFiles(Array.from(files));
    }
  };

  const handleSubmit = () => {
    console.log('Submitting ticket:', {
      onBehalfOf,
      ticketType,
      createFor,
      selectedUser,
      formData,
      attachedFiles
    });
    alert('Ticket submitted successfully!');
    navigate('/maintenance/ticket');
  };

  const filteredUsers = onBehalfOf === 'occupant-user' 
    ? mockUsers.filter(user => user.type === 'occupant')
    : onBehalfOf === 'fm-user'
    ? mockUsers.filter(user => user.type === 'fm')
    : [];

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/maintenance/ticket')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ticket List
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>Ticket List</span>
            <span>&gt;</span>
            <span>New Ticket</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">NEW TICKET</h1>
        </div>

        {/* Ticket Details Section */}
        <div className="p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full flex items-center justify-center">
             <FileText className="w-4 h-4 text-[#C72030]" />
            </div>
            <h2 className="text-lg font-semibold text-orange-800">TICKET DETAILS</h2>
          </div>

          {/* On Behalf Of */}
          <div className="mb-4">
            <Label className="text-sm font-medium">On Behalf of</Label>
            <RadioGroup value={onBehalfOf} onValueChange={setOnBehalfOf} className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="self" id="self" />
                <Label htmlFor="self">Self</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="occupant-user" id="occupant-user" />
                <Label htmlFor="occupant-user">Occupant User</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fm-user" id="fm-user" />
                <Label htmlFor="fm-user">FM User</Label>
              </div>
            </RadioGroup>
          </div>

          {/* User Selection Dropdown */}
          {onBehalfOf !== 'self' && (
            <div className="mb-4">
              <Label className="text-sm font-medium">Select User</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select User" />
                </SelectTrigger>
                <SelectContent>
                  {filteredUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Requestor Details */}
          <h3 className="font-medium mb-3">Requestor Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Label className="text-sm">Name</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1" 
              />
            </div>
            <div>
              <Label className="text-sm">Contact Number</Label>
              <Input 
                value={formData.contactNumber} 
                onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                className="mt-1" 
              />
            </div>
            <div>
              <Label className="text-sm">Site</Label>
              <Input 
                value={formData.site} 
                onChange={(e) => setFormData({...formData, site: e.target.value})}
                className="mt-1" 
              />
            </div>
            <div>
              <Label className="text-sm">Department</Label>
              <Input 
                value={formData.department} 
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="mt-1" 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Label className="text-sm">Unit</Label>
              <Input 
                value={formData.unit} 
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                className="mt-1" 
              />
            </div>
          </div>

          {/* Ticket Type */}
          <div className="mb-4">
            <Label className="text-sm font-medium">Ticket Type</Label>
            <RadioGroup value={ticketType} onValueChange={setTicketType} className="flex flex-wrap gap-4 mt-2">
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

          {/* Category and Other Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="text-sm">Category Type*</Label>
              <Select value={formData.categoryType} onValueChange={(value) => setFormData({...formData, categoryType: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fire-system">FIRE SYSTEM</SelectItem>
                  <SelectItem value="air-conditioner">Air Conditioner</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="printer">Printer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Sub Category Type*</Label>
              <Select value={formData.subCategoryType} onValueChange={(value) => setFormData({...formData, subCategoryType: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select SubCategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fire">fire</SelectItem>
                  <SelectItem value="dentry">dentry</SelectItem>
                  <SelectItem value="test">test</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Admin Priority*</Label>
              <Select value={formData.adminPriority} onValueChange={(value) => setFormData({...formData, adminPriority: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="p1">P1</SelectItem>
                  <SelectItem value="p2">P2</SelectItem>
                  <SelectItem value="p3">P3</SelectItem>
                  <SelectItem value="p4">P4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="text-sm">Assigned To</Label>
              <Select value={formData.assignedTo} onValueChange={(value) => setFormData({...formData, assignedTo: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deepak-gupta">Deepak Gupta</SelectItem>
                  <SelectItem value="vinayak-mane">Vinayak Mane</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Proactive/ Reactive</Label>
              <Select value={formData.proactiveReactive} onValueChange={(value) => setFormData({...formData, proactiveReactive: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Proactive/Reactive" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proactive">Proactive</SelectItem>
                  <SelectItem value="reactive">Reactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Reference Number</Label>
              <Input 
                placeholder="Enter reference number"
                value={formData.referenceNumber} 
                onChange={(e) => setFormData({...formData, referenceNumber: e.target.value})}
                className="mt-1" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm">Description*</Label>
              <Textarea 
                placeholder="Description" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="mt-1" 
              />
            </div>
            <div>
              <Label className="text-sm">Mode*</Label>
              <Select value={formData.mode} onValueChange={(value) => setFormData({...formData, mode: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Complaint Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="app">App</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Attachment Section */}
        <div className="p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full flex items-center justify-center">
                 <Paperclip className="w-4 h-4 text-[#C72030]" />

            </div>
            <h2 className="text-lg font-semibold text-orange-800">ATTACHMENT</h2>
          </div>

          <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <p className="text-gray-600">
                Drag & Drop or{' '}
                <span className="text-orange-500 underline">Choose Files</span>
              </p>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              {attachedFiles.length > 0 
                ? `${attachedFiles.length} file(s) selected`
                : 'No file chosen'
              }
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button 
            onClick={handleSubmit}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90 px-8 py-2"
          >
            Submit
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/maintenance/ticket')}
            className="px-8 py-2"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};