
import React, { useState } from 'react';
import { Plus, Filter, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const MailroomInboundDashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const mockData = [
    {
      id: 780,
      vendorName: 'Magic Enterprise',
      recipientName: 'Sony Bhoite',
      unit: '',
      entity: '',
      type: 'Mail',
      department: 'Function 3',
      sender: 'Vinayak',
      company: 'Test',
      receivedOn: '16/04/2025',
      receivedBy: 'Vinayak Mane',
      status: 'Collected',
      ageing: '',
      collectedOn: '16/04/2025',
      collectedBy: ''
    },
    {
      id: 779,
      vendorName: 'Bluedart',
      recipientName: 'Adhip Shetty',
      unit: '',
      entity: '',
      type: 'Mail',
      department: 'Operations',
      sender: 'Vinayak',
      company: 'Heaven',
      receivedOn: '16/04/2025',
      receivedBy: 'Vinayak Mane',
      status: 'Overdue',
      ageing: '58',
      collectedOn: '',
      collectedBy: ''
    },
    // Add more mock data entries...
  ];

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Inbound</span>
          <span>&gt;</span>
          <span>Inbound List</span>
        </div>
        
        <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-6">MAIL INBOUND LIST</h1>
        
        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
          
          <Button 
            onClick={() => setIsFilterOpen(true)}
            variant="outline" 
            className="px-4 py-2 rounded flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">View</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Vendor Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Recipient Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Unit</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Entity</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Department</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Sender</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Received On</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Received By</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Ageing</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Collected On</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Collected By</th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 border-r">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                    <td className="px-4 py-3 border-r text-sm">{item.id}</td>
                    <td className="px-4 py-3 border-r text-sm">{item.vendorName}</td>
                    <td className="px-4 py-3 border-r text-sm">{item.recipientName}</td>
                    <td className="px-4 py-3 border-r text-sm">{item.unit}</td>
                    <td className="px-4 py-3 border-r text-sm">{item.entity}</td>
                    <td className="px-4 py-3 border-r text-sm">{item.type}</td>
                    <td className="px-4 py-3 border-r text-sm">{item.department}</td>
                    <td className="px-4 py-3 border-r text-sm">{item.sender}</td>
                    <td className="px-4 py-3 border-r text-sm">{item.company}</td>
                    <td className="px-4 py-3 border-r text-sm">{item.receivedOn}</td>
                    <td className="px-4 py-3 border-r text-sm">{item.receivedBy}</td>
                    <td className="px-4 py-3 border-r">
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.status === 'Collected' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-r text-sm">{item.ageing}</td>
                    <td className="px-4 py-3 border-r text-sm">{item.collectedOn}</td>
                    <td className="px-4 py-3 text-sm">{item.collectedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">1</Button>
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">2</Button>
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">3</Button>
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">4</Button>
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">5</Button>
          <span className="text-sm text-gray-500">Last</span>
        </div>
      </div>

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>NEW INBOUND</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Details */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <h3 className="text-lg font-semibold text-red-600">BASIC DETAILS</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendor">Vendor *</Label>
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="magic">Magic Enterprise</SelectItem>
                        <SelectItem value="bluedart">Bluedart</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">Add Vendor</Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="dateReceiving">Date of Receiving</Label>
                  <Input placeholder="Select Date" />
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <h3 className="text-lg font-semibold text-red-600">PACKAGE DETAILS</h3>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <Label htmlFor="recipient">Recipient *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sony">Sony Bhoite</SelectItem>
                      <SelectItem value="adhip">Adhip Shetty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="sender">Sender</Label>
                  <Input placeholder="Enter Sender's Name" />
                </div>
                
                <div>
                  <Label htmlFor="mobile">Mobile</Label>
                  <Input placeholder="Enter Sender's Mobile" />
                </div>
                
                <div>
                  <Label htmlFor="awb">AWB Number</Label>
                  <Input placeholder="Enter AWB Number" />
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <Label htmlFor="company">Company *</Label>
                  <Input placeholder="Enter Company's Name" />
                </div>
                
                <div>
                  <Label htmlFor="address1">Company's Address Line 1 *</Label>
                  <Input placeholder="Enter Company's Address Line 1" />
                </div>
                
                <div>
                  <Label htmlFor="address2">Company's Address Line 2</Label>
                  <Input placeholder="Enter Company's Address Line 2" />
                </div>
                
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input placeholder="Enter City" />
                </div>
                
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input placeholder="Enter Pincode" />
                </div>
                
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mail">Mail</SelectItem>
                      <SelectItem value="package">Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="attachments">Attachments *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Button variant="outline" size="sm">Choose file</Button>
                  <span className="ml-2 text-sm text-gray-500">No file chosen</span>
                </div>
              </div>
              
              <Button className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white mt-4">
                + Package
              </Button>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button 
              className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white"
            >
              Create Package
            </Button>
            <Button variant="outline">
              Save And Create New Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>FILTER BY</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Asset Details</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="collected">Collected</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="vendor">Select Vendor</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="magic">Magic Enterprise</SelectItem>
                      <SelectItem value="bluedart">Bluedart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="receivedOn">Received On</Label>
                  <Input placeholder="Select Received On" />
                </div>
                
                <div>
                  <Label htmlFor="collectedOn">Collected On</Label>
                  <Input placeholder="Select Collected On" />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white">
              Apply
            </Button>
            <Button variant="outline">
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
