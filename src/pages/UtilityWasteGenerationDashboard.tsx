
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Download, Upload, Filter } from "lucide-react";

const UtilityWasteGenerationDashboard = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Waste Generation List</h2>
          <p className="text-muted-foreground">
            Manage waste generation records and tracking
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>WASTE GENERATION LIST</CardTitle>
            <div className="flex items-center space-x-2">
              <Button className="bg-[#8B5A3C] hover:bg-[#7A4D33] text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
              <Button variant="outline" className="border-[#8B5A3C] text-[#8B5A3C] hover:bg-[#8B5A3C] hover:text-white">
                <Download className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" className="border-[#8B5A3C] text-[#8B5A3C] hover:bg-[#8B5A3C] hover:text-white">
                <Upload className="mr-2 h-4 w-4" />
                Update
              </Button>
              <Button variant="outline" className="border-[#8B5A3C] text-[#8B5A3C] hover:bg-[#8B5A3C] hover:text-white">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Actions</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Commodity/Source</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Operational Name of Landlord/Tenant</TableHead>
                <TableHead>UoM</TableHead>
                <TableHead>Generated Unit</TableHead>
                <TableHead>Recycled Unit</TableHead>
                <TableHead>Agency Name</TableHead>
                <TableHead>Waste Date</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={14} className="text-center text-muted-foreground py-8">
                  No waste generation records found
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UtilityWasteGenerationDashboard;
