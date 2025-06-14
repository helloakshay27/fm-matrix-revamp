
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Upload, Filter, Eye, Edit } from 'lucide-react';

const UtilityWasteGenerationDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data matching the table structure from the image
  const wasteData = [
    {
      id: 'WG001',
      location: 'Building A',
      vendor: 'EcoWaste Solutions',
      commodity: 'Paper',
      category: 'Recyclable',
      operationalName: 'Tenant A',
      uom: 'KG',
      generatedUnit: 150,
      recycledUnit: 120,
      agencyName: 'Green Agency',
      wasteDate: '2024-01-15',
      createdBy: 'Admin',
      createdOn: '2024-01-15 10:30'
    },
    {
      id: 'WG002',
      location: 'Building B',
      vendor: 'Waste Management Corp',
      commodity: 'Plastic',
      category: 'Non-Recyclable',
      operationalName: 'Landlord',
      uom: 'KG',
      generatedUnit: 80,
      recycledUnit: 60,
      agencyName: 'Clean Earth',
      wasteDate: '2024-01-14',
      createdBy: 'User1',
      createdOn: '2024-01-14 14:20'
    },
    {
      id: 'WG003',
      location: 'Building C',
      vendor: 'Zero Waste Ltd',
      commodity: 'Organic',
      category: 'Compostable',
      operationalName: 'Tenant B',
      uom: 'KG',
      generatedUnit: 200,
      recycledUnit: 180,
      agencyName: 'Bio Solutions',
      wasteDate: '2024-01-13',
      createdBy: 'Admin',
      createdOn: '2024-01-13 09:15'
    }
  ];

  const filteredData = wasteData.filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        <span>Waste Generation</span> &gt; <span>Waste Generation List</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">WASTE GENERATION LIST</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button className="bg-[#5A1A2B] hover:bg-[#6A2A3B] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button variant="outline" className="border-[#5A1A2B] text-[#5A1A2B] hover:bg-[#5A1A2B] hover:text-white">
          <Download className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" className="border-[#5A1A2B] text-[#5A1A2B] hover:bg-[#5A1A2B] hover:text-white">
          <Upload className="w-4 h-4 mr-2" />
          Update
        </Button>
        <Button variant="outline" className="border-[#5A1A2B] text-[#5A1A2B] hover:bg-[#5A1A2B] hover:text-white">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Search */}
      <div className="w-full max-w-md">
        <Input
          placeholder="Search waste generation records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Actions</TableHead>
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Location</TableHead>
                  <TableHead className="font-semibold">Vendor</TableHead>
                  <TableHead className="font-semibold">Commodity/Source</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Operational Name of Landlord/Tenant</TableHead>
                  <TableHead className="font-semibold">UoM</TableHead>
                  <TableHead className="font-semibold">Generated Unit</TableHead>
                  <TableHead className="font-semibold">Recycled Unit</TableHead>
                  <TableHead className="font-semibold">Agency Name</TableHead>
                  <TableHead className="font-semibold">Waste Date</TableHead>
                  <TableHead className="font-semibold">Created By</TableHead>
                  <TableHead className="font-semibold">Created On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.vendor}</TableCell>
                    <TableCell>{item.commodity}</TableCell>
                    <TableCell>
                      <Badge variant={item.category === 'Recyclable' ? 'default' : 'secondary'}>
                        {item.category}
                      </Badge>
                    </TableCell>
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
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {filteredData.length} of {wasteData.length} entries
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Previous</Button>
          <Button variant="outline" size="sm" className="bg-[#5A1A2B] text-white">1</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default UtilityWasteGenerationDashboard;
