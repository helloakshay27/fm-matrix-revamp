
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddTestimonialModal } from "@/components/AddTestimonialModal";

export const TestimonialsSetupDashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const testimonialsData = [
    {
      id: 1,
      site: "Lockated",
      testimonialName: "Aman Gupta",
      designation: "Ceo",
      companyName: "Godrej",
      description: "This is test text...",
      profileImage: "/placeholder.svg",
      status: true
    },
    {
      id: 2,
      site: "Lockated", 
      testimonialName: "Ankit Sharma",
      designation: "CEO",
      companyName: "Godrej",
      description: "The flexibility a...",
      profileImage: "/placeholder.svg",
      status: true
    },
    {
      id: 3,
      site: "Lockated",
      testimonialName: "Sanjay Sharma", 
      designation: "Director",
      companyName: "Godrej",
      description: "Lockated is a Mul...",
      profileImage: "/placeholder.svg",
      status: true
    }
  ];

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Settings &gt; Testimonials
      </div>

      {/* Page Title and Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Testimonial LIST</h1>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
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
              <TableHead className="font-semibold">Site</TableHead>
              <TableHead className="font-semibold">Testimonial Name</TableHead>
              <TableHead className="font-semibold">Designation</TableHead>
              <TableHead className="font-semibold">Company Name</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold">Profile Image</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonialsData.map((item) => (
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
                <TableCell>{item.site}</TableCell>
                <TableCell className="text-blue-600">{item.testimonialName}</TableCell>
                <TableCell>{item.designation}</TableCell>
                <TableCell>{item.companyName}</TableCell>
                <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                <TableCell>
                  <img 
                    src={item.profileImage} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell>
                  <div className={`w-6 h-6 rounded-full ${item.status ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Testimonial Modal */}
      <AddTestimonialModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};
