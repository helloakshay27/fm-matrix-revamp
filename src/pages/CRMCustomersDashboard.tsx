
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Download, Search } from 'lucide-react';

// Sample customer data based on the screenshot
const customers = [
  {
    id: 1,
    actionId: 1796,
    name: "HSBC",
    customerCode: "",
    customerType: "",
    email: "hsbc@gmail.com",
    mobile: "1234561231",
    plantCode: "",
    companyCode: "",
    leaseStartDate: "",
    leaseEndDate: "",
    freeParking: "",
    paidParking: "",
    createdAt: "",
    updatedAt: "2025-05-12 17:42:08 +0530",
    colorCode: "#FFD700"
  },
  {
    id: 2,
    actionId: 1846,
    name: "lockated",
    customerCode: "",
    customerType: "",
    email: "lockated@gmail.com",
    mobile: "11111111111",
    plantCode: "",
    companyCode: "",
    leaseStartDate: "",
    leaseEndDate: "",
    freeParking: "",
    paidParking: "",
    createdAt: "",
    updatedAt: "",
    colorCode: "#FF0000"
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
    colorCode: "#00FF00"
  },
  {
    id: 4,
    actionId: 1858,
    name: "Sohail Ansari",
    customerCode: "",
    customerType: "",
    email: "demo2@gmail.com",
    mobile: "11111111111",
    plantCode: "",
    companyCode: "",
    leaseStartDate: "",
    leaseEndDate: "",
    freeParking: "",
    paidParking: "",
    createdAt: "",
    updatedAt: "",
    colorCode: "#FF00FF"
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
    colorCode: "#0000FF"
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
    colorCode: "#800080"
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
    colorCode: "#00FFFF"
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
    colorCode: "#00FFFF"
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
    colorCode: "#808000"
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
    colorCode: "#FFD700"
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
    colorCode: "#FF00FF"
  }
];

const CRMCustomersDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.mobile.includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Customer &gt; Customer List
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-900">Customer List</h1>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <Button className="bg-purple-700 hover:bg-purple-800 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <Button className="bg-purple-700 hover:bg-purple-800 text-white">
            Go!
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-16">Sr. No.</TableHead>
              <TableHead className="w-20">Action</TableHead>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Customer Code</TableHead>
              <TableHead>Customer Type</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Plant Code</TableHead>
              <TableHead>Company Code</TableHead>
              <TableHead>Lease Start Date</TableHead>
              <TableHead>Lease End Date</TableHead>
              <TableHead>Free Parking</TableHead>
              <TableHead>Paid Parking</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Color Code</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer, index) => (
              <TableRow key={customer.id} className="hover:bg-gray-50">
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
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
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: customer.colorCode }}
                  ></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CRMCustomersDashboard;
