
import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

const mockMappingData = [
  {
    id: 1,
    serviceId: "12345",
    serviceName: "Survey Title 123",
    site: "Lockated",
    building: "Tower A",
    wing: "Wing A",
    area: "Area A",
    floor: "Basement",
    room: "EV Room",
    status: true,
    createdOn: "01/07/2025",
    qrCode: "QR001"
  },
  {
    id: 2,
    serviceId: "12345",
    serviceName: "Survey Title 123", 
    site: "Panchashil",
    building: "Tower A",
    wing: "Wing A",
    area: "Area A",
    floor: "Third",
    room: "EV Room",
    status: true,
    createdOn: "01/07/2025",
    qrCode: "QR002"
  },
  {
    id: 3,
    serviceId: "12345",
    serviceName: "Survey Title 123",
    site: "Lockated",
    building: "Tower A",
    wing: "Wing A",
    area: "Area A",
    floor: "Basement",
    room: "EV Room",
    status: true,
    createdOn: "01/07/2025",
    qrCode: "QR003"
  },
  {
    id: 4,
    serviceId: "12345",
    serviceName: "Survey Title 123",
    site: "Panchashil",
    building: "Tower A",
    wing: "Wing A",
    area: "Area A",
    floor: "First",
    room: "EV Room",
    status: true,
    createdOn: "01/07/2025",
    qrCode: "QR004"
  },
  {
    id: 5,
    serviceId: "12345",
    serviceName: "Survey Title 123",
    site: "Panchashil",
    building: "Tower A",
    wing: "Wing A",
    area: "Area A",
    floor: "Basement",
    room: "EV Room",
    status: true,
    createdOn: "01/07/2025",
    qrCode: "QR005"
  },
  {
    id: 6,
    serviceId: "12345",
    serviceName: "Survey Title 123",
    site: "Lockated",
    building: "Tower A",
    wing: "Wing A",
    area: "Area A",
    floor: "Second",
    room: "EV Room",
    status: true,
    createdOn: "01/07/2025",
    qrCode: "QR006"
  },
  {
    id: 7,
    serviceId: "12345",
    serviceName: "Survey Title 123",
    site: "Lockated",
    building: "Tower A",
    wing: "Wing A",
    area: "Area A",
    floor: "Basement",
    room: "EV Room",
    status: true,
    createdOn: "01/07/2025",
    qrCode: "QR007"
  },
  {
    id: 8,
    serviceId: "12345",
    serviceName: "Survey Title 123",
    site: "Panchashil",
    building: "Tower A",
    wing: "Wing A",
    area: "Area A",
    floor: "Third",
    room: "EV Room",
    status: true,
    createdOn: "01/07/2025",
    qrCode: "QR008"
  }
];

interface SurveyMappingTableProps {
  searchTerm: string;
}

export const SurveyMappingTable: React.FC<SurveyMappingTableProps> = ({ searchTerm }) => {
  const [mappings, setMappings] = useState(mockMappingData);

  const handleStatusToggle = (mappingId: number) => {
    console.log(`Toggling status for Survey Mapping ${mappingId}`);
    setMappings(prev => prev.map(mapping => 
      mapping.id === mappingId 
        ? { ...mapping, status: !mapping.status }
        : mapping
    ));
  };

  const filteredMappings = mappings.filter(mapping =>
    mapping.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.wing.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.floor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="bg-white rounded-lg border border-[#D5DbDB]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" className="rounded" />
              </TableHead>
              <TableHead className="w-16">View</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Service Name</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Building</TableHead>
              <TableHead>Wing</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created On</TableHead>
              <TableHead>QR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMappings.map(mapping => (
              <TableRow key={mapping.id}>
                <TableCell>
                  <input type="checkbox" className="rounded" />
                </TableCell>
                <TableCell>
                  <button className="text-gray-600 hover:text-gray-800">
                    <Eye className="w-4 h-4" />
                  </button>
                </TableCell>
                <TableCell className="font-medium">{mapping.serviceId}</TableCell>
                <TableCell>{mapping.serviceName}</TableCell>
                <TableCell>{mapping.site}</TableCell>
                <TableCell>{mapping.building}</TableCell>
                <TableCell>{mapping.wing}</TableCell>
                <TableCell>{mapping.area}</TableCell>
                <TableCell>{mapping.floor}</TableCell>
                <TableCell>{mapping.room}</TableCell>
                <TableCell>
                  <Switch
                    checked={mapping.status}
                    onCheckedChange={() => handleStatusToggle(mapping.id)}
                  />
                </TableCell>
                <TableCell>{mapping.createdOn}</TableCell>
                <TableCell>
                  <div className="w-8 h-8 bg-black flex items-center justify-center">
                    <div className="w-6 h-6 bg-white grid grid-cols-3 gap-px">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="bg-black" style={{ 
                          backgroundColor: Math.random() > 0.5 ? 'black' : 'white' 
                        }}></div>
                      ))}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
