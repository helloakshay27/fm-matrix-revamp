
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Filter, Eye } from "lucide-react";
import { AddInboundForm } from "@/components/AddInboundForm";
import { InboundFilterDialog } from "@/components/InboundFilterDialog";

export const MailroomInboundDashboard = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  
  const [inboundData] = useState([
    {
      id: "780",
      view: true,
      vendorName: "Magic Enterprise",
      recipientName: "Sony Bhosle",
      unit: "",
      entity: "",
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
      id: "779",
      view: true,
      vendorName: "Bluedart",
      recipientName: "Adhip Shetty",
      unit: "",
      entity: "",
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
    // Add more sample data as needed
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <p className="text-[#1a1a1a] opacity-70 mb-2">Inbound &gt; Inbound List</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">MAIL INBOUND LIST</h1>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>NEW INBOUND</DialogTitle>
              </DialogHeader>
              <AddInboundForm onClose={() => setShowAddForm(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={showFilter} onOpenChange={setShowFilter}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <InboundFilterDialog onClose={() => setShowFilter(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">View</TableHead>
                <TableHead className="font-semibold text-gray-700">ID</TableHead>
                <TableHead className="font-semibold text-gray-700">Vendor Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Recipient Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Unit</TableHead>
                <TableHead className="font-semibold text-gray-700">Entity</TableHead>
                <TableHead className="font-semibold text-gray-700">Type</TableHead>
                <TableHead className="font-semibold text-gray-700">Department</TableHead>
                <TableHead className="font-semibold text-gray-700">Sender</TableHead>
                <TableHead className="font-semibold text-gray-700">Company</TableHead>
                <TableHead className="font-semibold text-gray-700">Received On</TableHead>
                <TableHead className="font-semibold text-gray-700">Received By</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Ageing</TableHead>
                <TableHead className="font-semibold text-gray-700">Collected On</TableHead>
                <TableHead className="font-semibold text-gray-700">Collected By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inboundData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.view && <Eye className="w-4 h-4 text-blue-600 cursor-pointer" />}
                  </TableCell>
                  <TableCell className="text-blue-600 font-medium">{item.id}</TableCell>
                  <TableCell>{item.vendorName}</TableCell>
                  <TableCell>{item.recipientName}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.entity}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>{item.sender}</TableCell>
                  <TableCell>{item.company}</TableCell>
                  <TableCell>{item.receivedOn}</TableCell>
                  <TableCell>{item.receivedBy}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Collected' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>{item.ageing}</TableCell>
                  <TableCell>{item.collectedOn}</TableCell>
                  <TableCell>{item.collectedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="bg-purple-600 text-white">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">4</Button>
            <Button variant="outline" size="sm">5</Button>
            <Button variant="outline" size="sm">6</Button>
            <Button variant="outline" size="sm">7</Button>
            <Button variant="outline" size="sm" className="bg-purple-600 text-white">Last</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
