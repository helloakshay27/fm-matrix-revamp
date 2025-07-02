
import React, { useState } from 'react';
import { Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockMappingData = [
  {
    id: 1,
    title: "Building A Survey",
    site: "Main Campus",
    building: "Building A",
    wing: "North Wing",
    area: "Reception",
    floor: "Ground Floor",
    room: "Room 101",
    status: "Active",
    active: true,
    qrCode: "QR001"
  },
  {
    id: 2,
    title: "Cafeteria Survey",
    site: "Main Campus",
    building: "Building B",
    wing: "South Wing",
    area: "Food Court",
    floor: "First Floor",
    room: "Cafeteria",
    status: "Active",
    active: true,
    qrCode: "QR002"
  }
];

export const SurveyMappingTable = () => {
  const [mappings, setMappings] = useState(mockMappingData);

  const handleStatusToggle = (mappingId: number) => {
    console.log(`Toggling status for Survey Mapping ${mappingId}`);
    
    setMappings(prev => 
      prev.map(mapping => 
        mapping.id === mappingId 
          ? { ...mapping, status: mapping.status === 'Active' ? 'Inactive' : 'Active' }
          : mapping
      )
    );
  };

  const handleActiveToggle = (mappingId: number) => {
    console.log(`Toggling active status for Survey Mapping ${mappingId}`);
    
    setMappings(prev => 
      prev.map(mapping => 
        mapping.id === mappingId 
          ? { ...mapping, active: !mapping.active }
          : mapping
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 bg-[#C72030] text-white px-4 py-2 rounded-lg hover:bg-[#A01B28] transition-colors">
          <Download className="w-4 h-4" />
          Download QR Code
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#D5DbDB]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <input type="checkbox" className="rounded" />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Building</TableHead>
              <TableHead>Wing</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>QR Code</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mappings.map((mapping) => (
              <TableRow key={mapping.id}>
                <TableCell>
                  <input type="checkbox" className="rounded" />
                </TableCell>
                <TableCell className="font-medium">{mapping.title}</TableCell>
                <TableCell>{mapping.site}</TableCell>
                <TableCell>{mapping.building}</TableCell>
                <TableCell>{mapping.wing}</TableCell>
                <TableCell>{mapping.area}</TableCell>
                <TableCell>{mapping.floor}</TableCell>
                <TableCell>{mapping.room}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div
                      className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                        mapping.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      onClick={() => handleStatusToggle(mapping.id)}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          mapping.status === 'Active' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div
                      className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                        mapping.active ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      onClick={() => handleActiveToggle(mapping.id)}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          mapping.active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>{mapping.qrCode}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
