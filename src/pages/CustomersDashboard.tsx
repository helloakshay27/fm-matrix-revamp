
import React, { useState } from 'react';
import { Eye, Download, Search } from 'lucide-react';
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

const customersData = [
  {
    id: 1,
    actionId: 1796,
    name: "H58C",
    customerCode: "",
    customerType: "",
    email: "h58c@gmail.com",
    mobile: "1234561231",
    plantCode: "",
    companyCode: "",
    leaseStartDate: "",
    leaseEndDate: "",
    freeParking: "",
    paidParking: "",
    createdAt: "",
    updatedAt: "2025-05-12 17:42:08 +0530",
    colorCode: "bg-yellow-400"
  },
  {
    id: 2,
    actionId: 1846,
    name: "lockated",
    customerCode: "",
    customerType: "",
    email: "lockated@gmail.com",
    mobile: "1111111111",
    plantCode: "",
    companyCode: "",
    leaseStartDate: "",
    leaseEndDate: "",
    freeParking: "",
    paidParking: "",
    createdAt: "",
    updatedAt: "2025-05-12 17:42:08 +0530",
    colorCode: "bg-red-500"
  },
  {
    id: 3,
    actionId: 1848,
    name: "demo",
    customerCode: "",
    customerType: "",
    email: "shreya@12.com",
    mobile: "",
    plantCode: "",
    companyCode: "",
    leaseStartDate: "",
    leaseEndDate: "",
    freeParking: "",
    paidParking: "",
    createdAt: "",
    updatedAt: "",
    colorCode: "bg-lime-400"
  },
  {
    id: 4,
    actionId: 1858,
    name: "Sohail Ansari",
    customerCode: "",
    customerType: "",
    email: "demo2@gmail.com",
    mobile: "1111111111",
    plantCode: "",
    companyCode: "",
    leaseStartDate: "",
    leaseEndDate: "",
    freeParking: "",
    paidParking: "",
    createdAt: "",
    updatedAt: "",
    colorCode: "bg-pink-500"
  },
  {
    id: 5,
    actionId: 1873,
    name: "Devesh Jain",
    customerCode: "",
    customerType: "",
    email: "test1@gmail.com",
    mobile: "3333333333",
    plantCode: "",
    companyCode: "",
    leaseStartDate: "",
    leaseEndDate: "",
    freeParking: "",
    paidParking: "",
    createdAt: "",
    updatedAt: "",
    colorCode: "bg-blue-500"
  },
  {
    id: 6,
    actionId: 1880,
    name: "Mahendra Lungare",
    customerCode: "",
    customerType: "",
    email: "test1@gmail.com",
    mobile: "2222222222",
    plantCode: "",
    companyCode: "",
    leaseStartDate: "",
    leaseEndDate: "",
    freeParking: "",
    paidParking: "",
    createdAt: "",
    updatedAt: "",
    colorCode: "bg-purple-500"
  },
  {
    id: 7,
    actionId: 1881,
    name: "Rajnish Patil",
    customerCode: "",
    customerType: "",
    email: "demonstration@12.com",
    mobile: "222222222",
    plantCode: "",
    companyCode: "",
    leaseStartDate: "",
    leaseEndDate: "",
    freeParking: "",
    paidParking: "",
    createdAt: "",
    updatedAt: "",
    colorCode: "bg-cyan-400"
  },
  {
    id: 8,
    actionId: 1935,
    name: "demon",
    customerCode: "",
    customerType: "",
    email: "demon@123",
    mobile: "1256894378",
    plantCode: "",
    companyCode: "",
    leaseStartDate: "",
    leaseEndDate: "",
    freeParking: "",
    paidParking: "",
    createdAt: "",
    updatedAt: "",
    colorCode: "bg-cyan-400"
  },
  {
    id: 9,
    actionId: 1937,
    name: "dooc",
    customerCode: "",
    customerType: "",
    email: "dooc@2gmail.com",
    mobile: "456123789",
    plantCode: "",
    companyCode: "",
    leaseStartDate: "",
    leaseEndDate: "",
    freeParking: "",
    paidParking: "",
    createdAt: "",
    updatedAt: "",
    colorCode: "bg-yellow-600"
  },
  {
    id: 10,
    actionId: 2124,
    name: "Vinayak Test web 1",
    customerCode: "",
    customerType: "",
    email: "Test3006@yopmail.com",
    mobile: "98765432123",
    plantCode: "",
    companyCode: "",
    leaseStartDate: "",
    leaseEndDate: "",
    freeParking: "",
    paidParking: "",
    createdAt: "",
    updatedAt: "",
    colorCode: "bg-yellow-400"
  },
  {
    id: 11,
    actionId: 2168,
    name: "Vinayak Test",
    customerCode: "",
    customerType: "",
    email: "vinayak@lockated.com",
    mobile: "2839382982",
    plantCode: "",
    companyCode: "",
    leaseStartDate: "",
    leaseEndDate: "",
    freeParking: "",
    paidParking: "",
    createdAt: "2025-04-29 15:47:27 +0530",
    updatedAt: "2025-04-29 15:47:27 +0530",
    colorCode: "bg-pink-500"
  }
];

export const CustomersDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customersData.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.mobile.includes(searchTerm)
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customer List</h2>
          <p className="text-muted-foreground">
            Customer &gt; Customer List
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button className="bg-purple-700 hover:bg-purple-800 text-white">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            Go!
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Sr. No.</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="w-[150px]">Name</TableHead>
              <TableHead className="w-[120px]">Customer Code</TableHead>
              <TableHead className="w-[120px]">Customer Type</TableHead>
              <TableHead className="w-[200px]">Email</TableHead>
              <TableHead className="w-[120px]">Mobile</TableHead>
              <TableHead className="w-[100px]">Plant Code</TableHead>
              <TableHead className="w-[120px]">Company Code</TableHead>
              <TableHead className="w-[120px]">Lease Start Date</TableHead>
              <TableHead className="w-[120px]">Lease End Date</TableHead>
              <TableHead className="w-[100px]">Free Parking</TableHead>
              <TableHead className="w-[100px]">Paid Parking</TableHead>
              <TableHead className="w-[150px]">Created At</TableHead>
              <TableHead className="w-[150px]">Updated At</TableHead>
              <TableHead className="w-[100px]">Color Code</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer, index) => (
              <TableRow key={customer.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell>{customer.actionId}</TableCell>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.customerCode}</TableCell>
                <TableCell>{customer.customerType}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.mobile}</TableCell>
                <TableCell>{customer.plantCode}</TableCell>
                <TableCell>{customer.companyCode}</TableCell>
                <TableCell>{customer.leaseStartDate}</TableCell>
                <TableCell>{customer.leaseEndDate}</TableCell>
                <TableCell>{customer.freeParking}</TableCell>
                <TableCell>{customer.paidParking}</TableCell>
                <TableCell>{customer.createdAt}</TableCell>
                <TableCell>{customer.updatedAt}</TableCell>
                <TableCell>
                  <div className={`w-6 h-6 rounded ${customer.colorCode}`}></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomersDashboard;
