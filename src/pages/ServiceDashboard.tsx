import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload, FileText, Filter, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ServiceBulkUploadModal } from '@/components/ServiceBulkUploadModal';
import { ImportLocationsModal } from '@/components/ImportLocationsModal';
import { ServiceFilterModal } from '@/components/ServiceFilterModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const [services, setServices] = useState(serviceData);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showImportLocationsModal, setShowImportLocationsModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;

  const totalPages = Math.ceil(Math.max(services.length, 6) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedServices = services.slice(startIndex, startIndex + pageSize);

  console.log('Service Pagination Debug:', {
    totalItems: services.length,
    pageSize,
    totalPages,
    currentPage,
    paginatedDataLength: paginatedServices.length
  });

  const handleStatusToggle = id => {
    const updatedServices = services.map(service => service.id === id ? {
      ...service,
      status: !service.status
    } : service);
    setServices(updatedServices);
  };

  const handleAddClick = () => navigate('/maintenance/service/add');
  const handleImportClick = () => setShowBulkUploadModal(true);
  const handleImportLocationsClick = () => setShowImportLocationsModal(true);
  const handleFiltersClick = () => setShowFilterModal(true);
  
  const handleApplyFilters = filters => {
    console.log('Applied filters:', filters);
  };

  const handleViewService = id => navigate(`/maintenance/service/details/${id}`);

  const columns = [
    { key: 'serviceName', label: 'Service Name', sortable: true },
    { key: 'id', label: 'ID', sortable: true },
    { key: 'referenceNumber', label: 'Reference Number', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'group', label: 'Group', sortable: true },
    { key: 'serviceCode', label: 'Service Code', sortable: true },
    { key: 'uom', label: 'UOM', sortable: true },
    { key: 'site', label: 'Site', sortable: true },
    { key: 'building', label: 'Building', sortable: true },
    { key: 'wing', label: 'Wing', sortable: true },
    { key: 'area', label: 'Area', sortable: true },
    { key: 'floor', label: 'Floor', sortable: true },
    { key: 'room', label: 'Room', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'createdOn', label: 'Created On', sortable: true }
  ];

  const bulkActions = [
    {
      label: 'Print QR Codes',
      icon: FileText,
      onClick: (selectedItems) => {
        selectedItems.forEach((service, index) => {
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
                link.download = `service_${service.id}_qr.png`;
                link.click();
                URL.revokeObjectURL(url);
              }
            });
          }, index * 100);
        });
        alert(`Downloading QR codes for ${selectedItems.length} services`);
      }
    }
  ];

  const renderCustomActions = () => (
    <div className="flex flex-wrap gap-3">
      <Button onClick={handleAddClick} className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Plus className="w-4 h-4 mr-2" /> Add
      </Button>
      <Button onClick={handleImportClick} className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Upload className="w-4 h-4 mr-2" /> Import
      </Button>
      <Button onClick={handleImportLocationsClick} className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Upload className="w-4 h-4 mr-2" /> Import Locations
      </Button>
      <Button onClick={handleFiltersClick} className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Filter className="w-4 h-4 mr-2" /> Filters
      </Button>
    </div>
  );

  const renderRowActions = (service) => (
    <Button variant="ghost" size="sm" onClick={() => handleViewService(service.id)}>
      <Eye className="w-4 h-4" />
    </Button>
  );

  const renderCell = (item, columnKey) => {
    if (columnKey === 'status') {
      return (
        <div className="flex items-center">
          <div 
            onClick={() => handleStatusToggle(item.id)} 
            className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
              item.status ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
              item.status ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </div>
        </div>
      );
    }
    if (columnKey === 'serviceCode') {
      return <span className="font-mono text-sm">{item[columnKey]}</span>;
    }
    return item[columnKey];
  };

  const renderPaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 7;
    
    if (showEllipsis) {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink 
            onClick={() => setCurrentPage(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis or pages 2-3
      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink 
                onClick={() => setCurrentPage(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Show current page area
      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink 
                onClick={() => setCurrentPage(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Show ellipsis or pages before last
      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find(item => item.key === i)) {
            items.push(
              <PaginationItem key={i}>
                <PaginationLink 
                  onClick={() => setCurrentPage(i)}
                  isActive={currentPage === i}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink 
              onClick={() => setCurrentPage(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <p className="text-muted-foreground mb-2">Services &gt; Service List</p>
        <h1 className="font-semibold text-lg sm:text-2xl">SERVICE LIST</h1>
      </div>

      <div className="mb-4">
        {renderCustomActions()}
      </div>

      <EnhancedTable
        data={paginatedServices}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderRowActions}
        bulkActions={bulkActions}
        showBulkActions={true}
        selectable={true}
        pagination={false}
        enableExport={true}
        exportFileName="services"
        onRowClick={handleViewService}
        storageKey="services-table"
      />

      {/* Debug Info */}
      <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
        <p>Debug: Total Items: {services.length}, Total Pages: {totalPages}, Current Page: {currentPage}</p>
        <p>Showing items {startIndex + 1} to {Math.min(startIndex + pageSize, services.length)} of {services.length}</p>
      </div>

      {/* Custom Pagination - Always show for debugging */}
      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <ServiceBulkUploadModal isOpen={showBulkUploadModal} onClose={() => setShowBulkUploadModal(false)} />
      <ImportLocationsModal isOpen={showImportLocationsModal} onClose={() => setShowImportLocationsModal(false)} />
      <ServiceFilterModal isOpen={showFilterModal} onClose={() => setShowFilterModal(false)} onApply={handleApplyFilters} />
    </div>
  );
};
