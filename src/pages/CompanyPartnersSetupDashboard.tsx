
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddCompanyPartnerModal } from "@/components/AddCompanyPartnerModal";

export const CompanyPartnersSetupDashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const partnersData = [
    {
      id: 1,
      companyName: "L&T",
      companyBanner: "/placeholder.svg",
      status: true
    },
    {
      id: 2,
      companyName: "Deloitte",
      companyBanner: "/placeholder.svg",
      status: true
    },
    {
      id: 3,
      companyName: "Credable.",
      companyBanner: "/placeholder.svg",
      status: true
    },
    {
      id: 4,
      companyName: "test company",
      companyBanner: "/placeholder.svg",
      status: false
    },
    {
      id: 5,
      companyName: "Vinayak T 1",
      companyBanner: "/placeholder.svg",
      status: false
    },
    {
      id: 6,
      companyName: "Test3",
      companyBanner: "/placeholder.svg",
      status: false
    }
  ];

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Settings &gt; Company Partner Setup
      </div>

      {/* Page Title and Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Company Partner Setup LIST</h1>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Add Partner
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex justify-end">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-2 border border-gray-300 rounded-md w-64"
          />
          <Button variant="outline" className="px-4">
            Go!
          </Button>
          <Button variant="outline" className="px-4">
            Reset
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Actions</TableHead>
              <TableHead className="font-semibold">Company Name</TableHead>
              <TableHead className="font-semibold">Company Banner</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partnersData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="p-1">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="p-1">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-blue-600">{item.companyName}</TableCell>
                <TableCell>
                  <img 
                    src={item.companyBanner} 
                    alt="Company Banner" 
                    className="w-16 h-12 object-cover rounded"
                  />
                </TableCell>
                <TableCell>
                  <div className={`w-6 h-6 rounded-full ${item.status ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Company Partner Modal */}
      <AddCompanyPartnerModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};
