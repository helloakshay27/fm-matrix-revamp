
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { AddInboundForm } from "@/components/AddInboundForm";
import { InboundFilterDialog } from "@/components/InboundFilterDialog";

const MailroomInboundDashboard = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  // Sample data matching the reference image
  const inboundData = [
    {
      id: 780,
      vendorName: "Magic Enterprise",
      recipientName: "Sony Bhoite",
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
      id: 779,
      vendorName: "Bluestart",
      recipientName: "Ashay Shetty",
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
    {
      id: 737,
      vendorName: "Bluestart",
      recipientName: "Vinayak Mane",
      unit: "",
      entity: "",
      type: "Mail",
      department: "Function 1",
      sender: "Ubaid",
      company: "test",
      receivedOn: "28/03/2025",
      receivedBy: "Vinayak Mane",
      status: "Collected",
      ageing: "",
      collectedOn: "28/03/2025",
      collectedBy: ""
    }
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">MAIL INBOUND LIST</h2>
          <p className="text-muted-foreground">
            Inbound > Inbound List
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>NEW INBOUND</DialogTitle>
              </DialogHeader>
              <AddInboundForm onClose={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>

          <InboundFilterDialog 
            isOpen={isFilterDialogOpen} 
            onOpenChange={setIsFilterDialogOpen}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>View</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Vendor Name</TableHead>
              <TableHead>Recipient Name</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Entity</TableHead>
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
            {inboundData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
                </TableCell>
                <TableCell>{item.id}</TableCell>
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
                  <span className={`px-2 py-1 rounded text-xs ${
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

      <div className="flex items-center justify-center space-x-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">5</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default MailroomInboundDashboard;
