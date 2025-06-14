
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Search, Eye } from 'lucide-react';
import { Input } from "@/components/ui/input";

const CustomerDashboard = () => {
  const customers = [
    { id: 1, actionId: 1796, name: "H58C", customerCode: "", customerType: "", email: "h58c@gmail.com", mobile: "1234561231", plantCode: "", companyCode: "", leaseStart: "", leaseEnd: "", freeParking: "", paidParking: "", createdAt: "", updatedAt: "", colorCode: "#ffff00" },
    { id: 2, actionId: 1846, name: "lockated", customerCode: "", customerType: "", email: "lockated@gmail.com", mobile: "1111111111", plantCode: "", companyCode: "", leaseStart: "", leaseEnd: "", freeParking: "", paidParking: "", createdAt: "2025-05-12 17:42:08 +0530", updatedAt: "", colorCode: "#ff0000" },
    { id: 3, actionId: 1848, name: "demo", customerCode: "", customerType: "", email: "shreya@12.com", mobile: "", plantCode: "", companyCode: "", leaseStart: "", leaseEnd: "", freeParking: "", paidParking: "", createdAt: "", updatedAt: "", colorCode: "#80ff00" },
    { id: 4, actionId: 1858, name: "Sohail Ansari", customerCode: "", customerType: "", email: "demo2@gmail.com", mobile: "1111111111", plantCode: "", companyCode: "", leaseStart: "", leaseEnd: "", freeParking: "", paidParking: "", createdAt: "", updatedAt: "", colorCode: "#ff00ff" },
    { id: 5, actionId: 1873, name: "Devesh Jain", customerCode: "", customerType: "", email: "test1@gmail.com", mobile: "3333333333", plantCode: "", companyCode: "", leaseStart: "", leaseEnd: "", freeParking: "", paidParking: "", createdAt: "", updatedAt: "", colorCode: "#0000ff" },
    { id: 6, actionId: 1880, name: "Mahendra Lungare", customerCode: "", customerType: "", email: "test1@gmail.com", mobile: "2222222222", plantCode: "", companyCode: "", leaseStart: "", leaseEnd: "", freeParking: "", paidParking: "", createdAt: "", updatedAt: "", colorCode: "#8000ff" },
    { id: 7, actionId: 1881, name: "Rajnish Patil", customerCode: "", customerType: "", email: "demonstration@12.com", mobile: "22222222", plantCode: "", companyCode: "", leaseStart: "", leaseEnd: "", freeParking: "", paidParking: "", createdAt: "", updatedAt: "", colorCode: "#00ffff" },
    { id: 8, actionId: 1935, name: "demon", customerCode: "", customerType: "", email: "demon@123", mobile: "1256894378", plantCode: "", companyCode: "", leaseStart: "", leaseEnd: "", freeParking: "", paidParking: "", createdAt: "", updatedAt: "", colorCode: "#00ffff" },
    { id: 9, actionId: 1937, name: "dooc", customerCode: "", customerType: "", email: "dooc@2gmail.com", mobile: "456123789", plantCode: "", companyCode: "", leaseStart: "", leaseEnd: "", freeParking: "", paidParking: "", createdAt: "", updatedAt: "", colorCode: "#808000" },
    { id: 10, actionId: 2124, name: "Vinayak Test web 1", customerCode: "", customerType: "", email: "Test3006@yopmail.com", mobile: "9876543123", plantCode: "", companyCode: "", leaseStart: "", leaseEnd: "", freeParking: "", paidParking: "", createdAt: "", updatedAt: "", colorCode: "#ffff00" },
    { id: 11, actionId: 2168, name: "Vinayak Test", customerCode: "", customerType: "", email: "vinayak@lockated.com", mobile: "2839382982", plantCode: "", companyCode: "", leaseStart: "", leaseEnd: "", freeParking: "", paidParking: "", createdAt: "2025-04-29 15:47:27 +0530", updatedAt: "2025-04-29 15:47:27 +0530", colorCode: "#ff00ff" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-2">
        Customer &gt; Customer List
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Customer List</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              className="w-64 pr-10"
            />
            <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Button className="bg-[#8B4B8B] hover:bg-[#7A3F7A] text-white flex items-center gap-2">
            Go!
          </Button>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-start">
        <Button variant="outline" className="bg-[#8B4B8B] text-white hover:bg-[#7A3F7A] hover:text-white flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-center font-medium">Sr. No.</TableHead>
              <TableHead className="text-center font-medium">Action</TableHead>
              <TableHead className="text-center font-medium">ID</TableHead>
              <TableHead className="text-center font-medium">Name</TableHead>
              <TableHead className="text-center font-medium">Customer Code</TableHead>
              <TableHead className="text-center font-medium">Customer Type</TableHead>
              <TableHead className="text-center font-medium">Email</TableHead>
              <TableHead className="text-center font-medium">Mobile</TableHead>
              <TableHead className="text-center font-medium">Plant Code</TableHead>
              <TableHead className="text-center font-medium">Company Code</TableHead>
              <TableHead className="text-center font-medium">Lease Start Date</TableHead>
              <TableHead className="text-center font-medium">Lease End Date</TableHead>
              <TableHead className="text-center font-medium">Free Parking</TableHead>
              <TableHead className="text-center font-medium">Paid Parking</TableHead>
              <TableHead className="text-center font-medium">Created At</TableHead>
              <TableHead className="text-center font-medium">Updated At</TableHead>
              <TableHead className="text-center font-medium">Color Code</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow key={customer.id} className="hover:bg-gray-50">
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">
                  <Eye className="w-4 h-4 text-gray-600 mx-auto cursor-pointer hover:text-gray-800" />
                </TableCell>
                <TableCell className="text-center">{customer.actionId}</TableCell>
                <TableCell className="text-center">{customer.name}</TableCell>
                <TableCell className="text-center">{customer.customerCode}</TableCell>
                <TableCell className="text-center">{customer.customerType}</TableCell>
                <TableCell className="text-center">{customer.email}</TableCell>
                <TableCell className="text-center">{customer.mobile}</TableCell>
                <TableCell className="text-center">{customer.plantCode}</TableCell>
                <TableCell className="text-center">{customer.companyCode}</TableCell>
                <TableCell className="text-center">{customer.leaseStart}</TableCell>
                <TableCell className="text-center">{customer.leaseEnd}</TableCell>
                <TableCell className="text-center">{customer.freeParking}</TableCell>
                <TableCell className="text-center">{customer.paidParking}</TableCell>
                <TableCell className="text-center text-xs">{customer.createdAt}</TableCell>
                <TableCell className="text-center text-xs">{customer.updatedAt}</TableCell>
                <TableCell className="text-center">
                  <div 
                    className="w-6 h-6 mx-auto rounded"
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

export default CustomerDashboard;
