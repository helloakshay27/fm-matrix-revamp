
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Upload, FileText, Filter, Search, Eye } from 'lucide-react';

const serviceData = [
  {
    id: '16706',
    serviceName: 'Test',
    referenceNumber: '',
    category: '',
    group: '',
    serviceCode: '7308bca91681074e701c',
    uom: 'Loccated',
    site: 'Tower 4',
    building: 'Wing2',
    wing: 'South',
    area: '',
    floor: '',
    room: '',
    status: true,
    createdOn: '10/05/2025'
  },
  {
    id: '16694',
    serviceName: '',
    referenceNumber: '',
    category: '',
    group: '',
    serviceCode: '9431843a6f8b3962590e',
    uom: 'Loccated',
    site: '',
    building: '',
    wing: '',
    area: '',
    floor: '',
    room: '',
    status: true,
    createdOn: '05/05/2025'
  },
  // Add more sample data as needed
];

export const ServiceDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState(serviceData);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value) {
      const filtered = serviceData.filter(service =>
        service.serviceName.toLowerCase().includes(value.toLowerCase()) ||
        service.id.toLowerCase().includes(value.toLowerCase()) ||
        service.serviceCode.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices(serviceData);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[#1a1a1a] opacity-70 mb-2">Services &gt; Service List</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">SERVICE LIST</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <Button style={{ backgroundColor: '#C72030' }} className="text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030]">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030]">
          <Upload className="w-4 h-4 mr-2" />
          Import Locations
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030]">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030]">
          <FileText className="w-4 h-4 mr-2" />
          Print QR
        </Button>
        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" className="border-[#C72030] text-[#C72030]">
            Reset
          </Button>
        </div>
      </div>

      {/* Service Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" />
              </TableHead>
              <TableHead>View</TableHead>
              <TableHead>Service Name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Reference Number</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Service Code</TableHead>
              <TableHead>Uom</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Building</TableHead>
              <TableHead>Wing</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created on</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <input type="checkbox" />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{service.serviceName}</TableCell>
                <TableCell>{service.id}</TableCell>
                <TableCell>{service.referenceNumber}</TableCell>
                <TableCell>{service.category}</TableCell>
                <TableCell>{service.group}</TableCell>
                <TableCell>{service.serviceCode}</TableCell>
                <TableCell>{service.uom}</TableCell>
                <TableCell>{service.site}</TableCell>
                <TableCell>{service.building}</TableCell>
                <TableCell>{service.wing}</TableCell>
                <TableCell>{service.area}</TableCell>
                <TableCell>{service.floor}</TableCell>
                <TableCell>{service.room}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${service.status ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                    <span className={service.status ? 'text-green-600' : 'text-gray-500'}>
                      {service.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{service.createdOn}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 p-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? "default" : "outline"}
              size="sm"
              style={page === 1 ? { backgroundColor: '#C72030' } : {}}
              className={page === 1 ? "text-white" : ""}
            >
              {page}
            </Button>
          ))}
          <Button variant="outline" size="sm">Last »</Button>
        </div>
      </div>
    </div>
  );
};
