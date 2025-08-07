import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload } from 'lucide-react';

export const GatePassOutwardsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  // Sample data - in real app, this would be fetched based on the ID
  const outwardData = [
    {
      id: "850",
      type: "Fresh",
      returnableNonReturnable: "Non Returnable",
      expectedReturnDate: "",
      category: "Visitor",
      personName: "Suraj",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand,By Vehicle",
      lrNo: "",
      tripId: "7-10013",
      gateEntry: "",
      itemDetails: "Transmission - - MW - -"
    },
    {
      id: "845",
      type: "SRN",
      returnableNonReturnable: "Returnable",
      expectedReturnDate: "20/02/2023",
      category: "Visitor",
      personName: "Kshitij R",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Courier,By Vehicle",
      lrNo: "12",
      tripId: "7-10008",
      gateEntry: "55",
      itemDetails: "MW - 4 - 2 Transmission - 8 - 2"
    },
    {
      id: "844",
      type: "SRN",
      returnableNonReturnable: "Returnable",
      expectedReturnDate: "20/02/2023",
      category: "Visitor",
      personName: "Sagar Singh",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand,By Courier",
      lrNo: "123",
      tripId: "7-10007",
      gateEntry: "55",
      itemDetails: "Transmission - 12 - 55 MW - 4 - 3"
    },
    {
      id: "840",
      type: "",
      returnableNonReturnable: "Non Returnable",
      expectedReturnDate: "",
      category: "Staff",
      personName: "demo demo",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "",
      lrNo: "",
      tripId: "7-10003",
      gateEntry: "",
      itemDetails: "Transmission - 45 - 1 MW - 23 - 5"
    }
  ];

  const handleReceiveClick = (itemIndex: number) => {
    setSelectedItemIndex(itemIndex);
    setIsReceiveModalOpen(true);
  };

  const handleSubmitReceive = () => {
    // Handle submit logic here
    setIsReceiveModalOpen(false);
    setSelectedItemIndex(null);
  };

  const selectedEntry = outwardData.find(entry => entry.id === id);

  if (!selectedEntry) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Entry Not Found</h1>
          <Button onClick={() => navigate('/security/gate-pass/outwards')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Outward List
          </Button>
        </div>
      </div>
    );
  };

  // Sample item data based on the selected entry
  const itemsData = [
    {
      sNo: "01",
      itemName: "Faulty",
      itemCategory: "Materials",
      itemNameDetail: "Credit",
      unit: "10",
      quantity: "120kg",
      description: "---",
      attachment: "📎",
      updates: "Receive"
    },
    {
      sNo: "02", 
      itemName: "faulty",
      itemCategory: "Materials",
      itemNameDetail: "Debit",
      unit: "12",
      quantity: "180kg",
      description: "---",
      attachment: "📎",
      updates: "Receive"
    },
    {
      sNo: "03",
      itemName: "faulty",
      itemCategory: "Materials", 
      itemNameDetail: "Debit",
      unit: "4",
      quantity: "610kg",
      description: "---",
      attachment: "📎",
      updates: "Receive"
    },
    {
      sNo: "04",
      itemName: "faulty",
      itemCategory: "Materials",
      itemNameDetail: "Debit", 
      unit: "7",
      quantity: "8kg",
      description: "---",
      attachment: "📎",
      updates: "Receive"
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/security/gate-pass/outwards')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Outward List
        </Button>
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Goods Outwards</span>
          <span>&gt;</span>
          <span className="text-[#C72030] font-medium">Returnable</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Employee/Visitor Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Profile Section */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-yellow-600 font-bold text-xl">{selectedEntry.personName.charAt(0).toUpperCase()}</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{selectedEntry.personName}</h2>
              <p className="text-sm text-gray-600">{selectedEntry.returnableNonReturnable}</p>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Employee/Visitor Name:</span>
                  <span className="text-sm text-gray-900">{selectedEntry.personName}</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Visitor Mobile No.:</span>
                  <span className="text-sm text-gray-900">086907860</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Department:</span>
                  <span className="text-sm text-gray-900">UI/UX Designer</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Company Name:</span>
                  <span className="text-sm text-gray-900">Lovated</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Date/Time:</span>
                  <span className="text-sm text-gray-900">2 July 2025 12:45 Pm</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Mode Of Transport:</span>
                  <span className="text-sm text-gray-900">{selectedEntry.modeOfTransport || "By Hand"}</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Expected Date:</span>
                  <span className="text-sm text-gray-900">{selectedEntry.expectedReturnDate || "-"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Items Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">S No.</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item name</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item category</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item name</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Unit</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Attachment</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Updates</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemsData.map((item, index) => (
                  <TableRow key={item.sNo} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.sNo}</TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.itemName}</TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.itemCategory}</TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.itemNameDetail}</TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.unit}</TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.quantity}</TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.description}</TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.attachment}</TableCell>
                    <TableCell className="px-4 py-3 text-sm">
                      <button 
                        className="text-[#C72030] underline hover:text-[#C72030]/80 transition-colors font-medium"
                        onClick={() => handleReceiveClick(index)}
                      >
                        {item.updates}
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Receive Modal */}
      <Dialog open={isReceiveModalOpen} onOpenChange={setIsReceiveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">Return Process</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="handover" className="text-sm font-medium text-gray-700">
                Handover To
              </Label>
              <Input
                id="handover"
                placeholder="Enter handover details"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="remarks" className="text-sm font-medium text-gray-700">
                Remarks
              </Label>
              <Textarea
                id="remarks"
                placeholder="Enter remarks"
                className="w-full min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="attachment" className="text-sm font-medium text-gray-700">
                Attachment
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="attachment"
                  type="file"
                  className="w-full"
                />
                <Button size="sm" variant="outline">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleSubmitReceive}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};