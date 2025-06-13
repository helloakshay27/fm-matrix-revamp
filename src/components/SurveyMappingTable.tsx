
import React from 'react';
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
            {mockMappingData.map((mapping) => (
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    mapping.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {mapping.status}
                  </span>
                </TableCell>
                <TableCell>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mapping.active}
                      className="sr-only peer"
                      onChange={() => {}}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C72030]"></div>
                  </label>
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
