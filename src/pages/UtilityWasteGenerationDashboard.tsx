
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Download, Upload, Filter } from "lucide-react";

// Sample data for waste generation
const wasteGenerationData = [
  {
    id: 1,
    location: "Tower A",
    vendor: "Waste Management Co.",
    commoditySource: "Office Waste",
    category: "Dry Waste",
    operationalName: "Building A Operations",
    uom: "KG",
    generatedUnit: 150.5,
    recycledUnit: 120.2,
    agencyName: "Green Solutions",
    wasteDate: "2024-01-15",
    createdBy: "John Doe",
    createdOn: "2024-01-15 10:30"
  },
  {
    id: 2,
    location: "Tower B",
    vendor: "EcoWaste Services",
    commoditySource: "Kitchen Waste",
    category: "Wet Waste",
    operationalName: "Cafeteria Operations",
    uom: "KG",
    generatedUnit: 85.3,
    recycledUnit: 0,
    agencyName: "Bio Recyclers",
    wasteDate: "2024-01-15",
    createdBy: "Jane Smith",
    createdOn: "2024-01-15 11:45"
  },
  {
    id: 3,
    location: "Tower C",
    vendor: "Clean Earth Ltd.",
    commoditySource: "Electronic Waste",
    category: "E-Waste",
    operationalName: "IT Department",
    uom: "KG",
    generatedUnit: 25.8,
    recycledUnit: 25.8,
    agencyName: "Tech Recycling",
    wasteDate: "2024-01-15",
    createdBy: "Mike Johnson",
    createdOn: "2024-01-15 14:20"
  }
];

const UtilityWasteGenerationDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Waste Generation</span>
        <span>&gt;</span>
        <span>Waste Generation List</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">WASTE GENERATION LIST</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Import
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Update
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                <TableHead className="font-semibold text-gray-700">ID</TableHead>
                <TableHead className="font-semibold text-gray-700">Location</TableHead>
                <TableHead className="font-semibold text-gray-700">Vendor</TableHead>
                <TableHead className="font-semibold text-gray-700">Commodity/Source</TableHead>
                <TableHead className="font-semibold text-gray-700">Category</TableHead>
                <TableHead className="font-semibold text-gray-700">Operational Name of Landlord/ Tenant</TableHead>
                <TableHead className="font-semibold text-gray-700">UoM</TableHead>
                <TableHead className="font-semibold text-gray-700">Generated Unit</TableHead>
                <TableHead className="font-semibold text-gray-700">Recycled Unit</TableHead>
                <TableHead className="font-semibold text-gray-700">Agency Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Waste Date</TableHead>
                <TableHead className="font-semibold text-gray-700">Created By</TableHead>
                <TableHead className="font-semibold text-gray-700">Created On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wasteGenerationData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="p-1 text-blue-600">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1 text-green-600">
                        View
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.vendor}</TableCell>
                  <TableCell>{item.commoditySource}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.operationalName}</TableCell>
                  <TableCell>{item.uom}</TableCell>
                  <TableCell>{item.generatedUnit}</TableCell>
                  <TableCell>{item.recycledUnit}</TableCell>
                  <TableCell>{item.agencyName}</TableCell>
                  <TableCell>{item.wasteDate}</TableCell>
                  <TableCell>{item.createdBy}</TableCell>
                  <TableCell>{item.createdOn}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UtilityWasteGenerationDashboard;
