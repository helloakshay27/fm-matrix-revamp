import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Upload, FileText, Filter, Search, Eye, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ServiceBulkUploadModal } from '@/components/ServiceBulkUploadModal';
import { ImportLocationsModal } from '@/components/ImportLocationsModal';
import { ServiceFilterModal } from '@/components/ServiceFilterModal';
const serviceData = [{
  id: '16706',
  serviceName: 'test',
  referenceNumber: '',
  category: '',
  group: '',
  serviceCode: '7308bcd91b8107aa7e1c',
  uom: 'Loccated',
  site: 'Tower 4',
  building: 'Wing2',
  wing: 'South',
  area: '',
  floor: '',
  room: '',
  status: true,
  createdOn: '10/06/2025'
}, {
  id: '16694',
  serviceName: 'u',
  referenceNumber: '',
  category: '',
  group: '',
  serviceCode: '94a1a94aada9b2f6259e',
  uom: 'Loccated',
  site: '',
  building: '',
  wing: '',
  area: '',
  floor: '',
  room: '',
  status: true,
  createdOn: '05/06/2025'
}, {
  id: '16693',
  serviceName: 'ews',
  referenceNumber: '',
  category: '',
  group: '',
  serviceCode: '6f136b262945d13570c6',
  uom: 'Loccated',
  site: 'sebc',
  building: '',
  wing: '',
  area: '',
  floor: '',
  room: '',
  status: true,
  createdOn: '05/06/2025'
}, {
  id: '16692',
  serviceName: 'ews',
  referenceNumber: '',
  category: '',
  group: '',
  serviceCode: 'feeba741171911667a82',
  uom: 'Loccated',
  site: 'sebc',
  building: '',
  wing: '',
  area: '',
  floor: '',
  room: '',
  status: true,
  createdOn: '05/06/2025'
}, {
  id: '16691',
  serviceName: 'ews',
  referenceNumber: '',
  category: '',
  group: '',
  serviceCode: '9265b6752ebde97ce115',
  uom: 'Loccated',
  site: '',
  building: '',
  wing: '',
  area: '',
  floor: '',
  room: '',
  status: true,
  createdOn: '05/06/2025'
}, {
  id: '16690',
  serviceName: 'sfdyfdy',
  referenceNumber: '',
  category: '',
  group: '',
  serviceCode: '08559192e3e2130b068b',
  uom: 'Loccated',
  site: 'Hay',
  building: '',
  wing: '',
  area: '',
  floor: '',
  room: '',
  status: true,
  createdOn: '05/06/2025'
}];
export const ServiceDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState(serviceData);
  const [filteredServices, setFilteredServices] = useState(serviceData);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showImportLocationsModal, setShowImportLocationsModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const handleSearch = value => {
    setSearchTerm(value);
    if (value) {
      const filtered = services.filter(service => service.serviceName.toLowerCase().includes(value.toLowerCase()) || service.id.toLowerCase().includes(value.toLowerCase()) || service.serviceCode.toLowerCase().includes(value.toLowerCase()));
      setFilteredServices(filtered);
    } else {
      setFilteredServices(services);
    }
  };
  const handleStatusToggle = id => {
    const updatedServices = services.map(service => service.id === id ? {
      ...service,
      status: !service.status
    } : service);
    setServices(updatedServices);
    const updatedFiltered = filteredServices.map(service => service.id === id ? {
      ...service,
      status: !service.status
    } : service);
    setFilteredServices(updatedFiltered);
  };
  const handleReset = () => {
    setSearchTerm('');
    setFilteredServices(services);
  };
  const handleAddClick = () => navigate('/maintenance/service/add');
  const handleImportClick = () => setShowBulkUploadModal(true);
  const handleImportLocationsClick = () => setShowImportLocationsModal(true);
  const handleFiltersClick = () => setShowFilterModal(true);
  const handleApplyFilters = filters => {
    let filtered = services;
    if (filters.serviceName) {
      filtered = filtered.filter(service => service.serviceName.toLowerCase().includes(filters.serviceName.toLowerCase()));
    }
    if (filters.building) {
      filtered = filtered.filter(service => service.building.toLowerCase().includes(filters.building.toLowerCase()));
    }
    if (filters.area) {
      filtered = filtered.filter(service => service.area.toLowerCase().includes(filters.area.toLowerCase()));
    }
    setFilteredServices(filtered);
  };
  const handlePrintQR = () => {
    const serviceIds = filteredServices.map(service => service.id);
    serviceIds.forEach((id, index) => {
      setTimeout(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 200;
        if (ctx) {
          ctx.fillStyle = '#000';
          for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
              if (Math.random() > 0.5) ctx.fillRect(i * 10, j * 10, 10, 10);
            }
          }
        }
        canvas.toBlob(blob => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `service_${id}_qr.png`;
            link.click();
            URL.revokeObjectURL(url);
          }
        });
      }, index * 100);
    });
    alert(`Downloading QR codes for ${serviceIds.length} services`);
  };
  const handleViewService = id => navigate(`/maintenance/service/details/${id}`);
  return <div className="p-4 sm:p-6">
      <div className="mb-6">
        <p className="text-[#1a1a1a] opacity-70 mb-2">Services &gt; Service List</p>
        <h1 className="font-semibold text-lg sm:text-2xl text-[#1a1a1a]">SERVICE LIST</h1>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Button onClick={handleAddClick} style={{
        backgroundColor: '#C72030'
      }} className="text-white hover:bg-[#C72030]/90">
          <Plus className="w-4 h-4 mr-2" /> Add
        </Button>
        <Button onClick={handleImportClick} style={{
        backgroundColor: '#C72030'
      }} className="text-white hover:bg-[#C72030]/90">
          <Upload className="w-4 h-4 mr-2" /> Import
        </Button>
        <Button onClick={handleImportLocationsClick} style={{
        backgroundColor: '#C72030'
      }} className="text-white hover:bg-[#C72030]/90">
          <Upload className="w-4 h-4 mr-2" /> Import Locations
        </Button>
        <Button onClick={handleFiltersClick} style={{
        backgroundColor: '#C72030'
      }} className="text-white hover:bg-[#C72030]/90">
          <Filter className="w-4 h-4 mr-2" /> Filters
        </Button>
        <Button onClick={handlePrintQR} style={{
        backgroundColor: '#C72030'
      }} className="text-white hover:bg-[#C72030]/90">
          <FileText className="w-4 h-4 mr-2" /> Print QR
        </Button>

        <div className="flex-grow sm:flex-grow-0 flex items-center gap-3 ml-auto mt-3 sm:mt-0">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search services..." value={searchTerm} onChange={e => handleSearch(e.target.value)} className="pl-10 w-full bg-white" />
          </div>
          <Button variant="outline" className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 whitespace-nowrap" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <div className="min-w-[1200px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"><input type="checkbox" className="rounded border-gray-300" /></TableHead>
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
              {filteredServices.map(service => <TableRow key={service.id}>
                  <TableCell><input type="checkbox" className="rounded border-gray-300" /></TableCell>
                  <TableCell><Button variant="ghost" size="sm" onClick={() => handleViewService(service.id)}><Eye className="w-4 h-4" /></Button></TableCell>
                  <TableCell className="font-medium">{service.serviceName}</TableCell>
                  <TableCell>{service.id}</TableCell>
                  <TableCell>{service.referenceNumber}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>{service.group}</TableCell>
                  <TableCell className="font-mono text-sm">{service.serviceCode}</TableCell>
                  <TableCell>{service.uom}</TableCell>
                  <TableCell>{service.site}</TableCell>
                  <TableCell>{service.building}</TableCell>
                  <TableCell>{service.wing}</TableCell>
                  <TableCell>{service.area}</TableCell>
                  <TableCell>{service.floor}</TableCell>
                  <TableCell>{service.room}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div onClick={() => handleStatusToggle(service.id)} className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${service.status ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${service.status ? 'translate-x-6' : 'translate-x-1'}`} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{service.createdOn}</TableCell>
                </TableRow>)}
              {filteredServices.length === 0 && <TableRow>
                  <TableCell colSpan={17} className="text-center py-8 text-gray-500">No service records found</TableCell>
                </TableRow>}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-center">
          <div className="text-sm text-[#1a1a1a] opacity-70">
            Powered by <span className="font-semibold">go</span><span className="text-[#C72030]">Phygital</span><span className="font-semibold">.work</span>
          </div>
        </div>
      </div>

      <ServiceBulkUploadModal isOpen={showBulkUploadModal} onClose={() => setShowBulkUploadModal(false)} />
      <ImportLocationsModal isOpen={showImportLocationsModal} onClose={() => setShowImportLocationsModal(false)} />
      <ServiceFilterModal isOpen={showFilterModal} onClose={() => setShowFilterModal(false)} onApply={handleApplyFilters} />
    </div>;
};