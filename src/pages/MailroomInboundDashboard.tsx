import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Filter, Eye } from "lucide-react";
import AddInboundMailModal from "@/components/AddInboundMailModal";
import InboundFilterDialog from "@/components/InboundFilterDialog";

const MailroomInboundDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const mailData = [
    {
      id: 780,
      vendorName: "Magic Enterprise",
      recipientName: "Sony Bhoite",
      unit: "",
      entry: "",
      type: "Mail",
      department: "Function 3",
      sender: "Vinayak",
      company: "Test",
      receivedOn: "16/04/2025",
      receivedBy: "Vinayak Mane",
      status: "Collected",
      ageing: "",
      collectedOn: "16/04/2025",
      collectedBy: ""
    },
    {
      id: 779,
      vendorName: "Bluedart",
      recipientName: "Adhip Shetty",
      unit: "",
      entry: "",
      type: "Mail",
      department: "Operations",
      sender: "Vinayak",
      company: "Heaven",
      receivedOn: "16/04/2025",
      receivedBy: "Vinayak Mane",
      status: "Overdue",
      ageing: "58",
      collectedOn: "",
      collectedBy: ""
    },
    {
      id: 737,
      vendorName: "Bluedart",
      recipientName: "Vinayak Mane",
      unit: "",
      entry: "",
      type: "Mail",
      department: "Function 1",
      sender: "Utsed",
      company: "test",
      receivedOn: "28/03/2025",
      receivedBy: "Vinayak Mane",
      status: "Collected",
      ageing: "",
      collectedOn: "28/03/2025",
      collectedBy: ""
    },
    {
      id: 736,
      vendorName: "Bluedart",
      recipientName: "Vinayak Mane",
      unit: "",
      entry: "",
      type: "Mail",
      department: "Function 1",
      sender: "Netra",
      company: "1234567bhargd",
      receivedOn: "20/03/2025",
      receivedBy: "Vinayak Mane",
      status: "Collected",
      ageing: "",
      collectedOn: "28/03/2025",
      collectedBy: "Vinayak Mane"
    },
    {
      id: 735,
      vendorName: "Prathmesh",
      recipientName: "Vinayak Mane",
      unit: "",
      entry: "",
      type: "Consumer Goods",
      department: "Function 1",
      sender: "Sony",
      company: "Locktaad",
      receivedOn: "27/03/2025",
      receivedBy: "Vinayak Mane",
      status: "Collected",
      ageing: "",
      collectedOn: "27/03/2025",
      collectedBy: ""
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Collected':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Collected</Badge>;
      case 'Overdue':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleApplyFilters = (filters: any) => {
    console.log('Applied filters:', filters);
    // Apply filter logic here
  };

  const filteredData = mailData.filter(item =>
    item.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MAIL INBOUND LIST</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <span>Inbound</span>
            <span>›</span>
            <span>Inbound List</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button 
          variant="outline" 
          className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white"
          onClick={() => setIsFilterDialogOpen(true)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <Input
            placeholder="Search by vendor name, recipient, department, or sender..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">View</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Recipient Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Entry</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Received On</TableHead>
                <TableHead>Received By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ageing</TableHead>
                <TableHead>Collected On</TableHead>
                <TableHead>Collected By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.vendorName}</TableCell>
                  <TableCell>{item.recipientName}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.entry}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>{item.sender}</TableCell>
                  <TableCell>{item.company}</TableCell>
                  <TableCell>{item.receivedOn}</TableCell>
                  <TableCell>{item.receivedBy}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    {item.ageing && (
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        {item.ageing}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{item.collectedOn}</TableCell>
                  <TableCell>{item.collectedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between p-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="w-8 h-8 p-0">1</Button>
            <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-[#8B5CF6] text-white border-[#8B5CF6]">2</Button>
            <Button variant="outline" size="sm" className="w-8 h-8 p-0">3</Button>
            <Button variant="outline" size="sm" className="w-8 h-8 p-0">4</Button>
            <Button variant="outline" size="sm" className="w-8 h-8 p-0">5</Button>
            <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-[#8B5CF6] text-white border-[#8B5CF6]">...</Button>
            <Button variant="outline" size="sm">Last</Button>
          </div>
        </div>
      </div>

      <AddInboundMailModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <InboundFilterDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default MailroomInboundDashboard;
