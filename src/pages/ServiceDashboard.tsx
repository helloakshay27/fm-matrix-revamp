import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload, FileText, Filter, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ServiceBulkUploadModal } from '@/components/ServiceBulkUploadModal';
import { ImportLocationsModal } from '@/components/ImportLocationsModal';
import { ServiceFilterModal } from '@/components/ServiceFilterModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchServicesData } from '@/store/slices/servicesSlice';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ServiceRecord {
  id: number;
  service_name: string;
  service_code: string;
  site: string;
  building: string;
  wing: string;
  area: string;
  floor: string;
  room: string;
  created_at: string;
}

const initialServiceData: ServiceRecord[] = [];

export const ServiceDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: apiData, loading, error } = useAppSelector((state) => state.services);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showImportLocationsModal, setShowImportLocationsModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Use API data if available, otherwise fallback to initial data
  const servicesData = apiData && Array.isArray(apiData) ? apiData : initialServiceData;

  useEffect(() => {
    dispatch(fetchServicesData());
  }, [dispatch]);

  const totalPages = Math.ceil(Math.max(servicesData.length, 6) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedServices = servicesData.slice(startIndex, startIndex + pageSize);

  console.log('Service Pagination Debug:', {
    totalItems: servicesData.length,
    pageSize,
    totalPages,
    currentPage,
    paginatedDataLength: paginatedServices.length
  });

  const handleStatusToggle = (id: number) => {
    console.log('Status toggle for service ID:', id);
    // In a real implementation, you would make an API call to update the status
  };

  const handleAddClick = () => navigate('/maintenance/service/add');
  const handleImportClick = () => setShowBulkUploadModal(true);
  const handleImportLocationsClick = () => setShowImportLocationsModal(true);
  const handleFiltersClick = () => setShowFilterModal(true);
  
  const handleApplyFilters = filters => {
    console.log('Applied filters:', filters);
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedServices.map(item => item.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };

  const handleQRDownload = () => {
    const selectedServices = paginatedServices.filter(service => 
      selectedItems.includes(service.id.toString())
    );
    
    selectedServices.forEach((service, index) => {
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
  };

  const handleViewService = (id: number) => navigate(`/maintenance/service/details/${id}`);

  const columns = [
    { key: 'actions', label: 'Actions', sortable: false },
    { key: 'serviceName', label: 'Service Name', sortable: true },
    { key: 'id', label: 'ID', sortable: true },
    { key: 'referenceNumber', label: 'Reference Number', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'group', label: 'Group', sortable: true },
    { key: 'uom', label: 'UOM', sortable: true },
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
      <Button onClick={handleFiltersClick} className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Filter className="w-4 h-4 mr-2" /> Filters
      </Button>
      {selectedItems.length > 0 && (
        <Button onClick={handleQRDownload} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <FileText className="w-4 h-4 mr-2" /> QR Download
        </Button>
      )}
    </div>
  );


  const renderCell = (item: ServiceRecord, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <Button variant="ghost" size="sm" onClick={(e) => {
            e.stopPropagation();
            handleViewService(item.id);
          }}>
            <Eye className="w-4 h-4" />
          </Button>
        );
      case 'serviceName':
        return item.service_name || '-';
      case 'id':
        return <span className="font-medium">{item.id}</span>;
      case 'referenceNumber':
        return item.service_code || '-';
      case 'category':
        return '-'; // Not available in API
      case 'group':
        return '-'; // Not available in API
      case 'uom':
        return '-'; // Not available in API
      case 'building':
        return item.building || '-';
      case 'wing':
        return item.wing || '-';
      case 'area':
        return item.area || '-';
      case 'floor':
        return item.floor || '-';
      case 'room':
        return item.room || '-';
      case 'status':
        return (
          <div className="flex items-center">
            <div 
              onClick={() => handleStatusToggle(item.id)} 
              className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors bg-green-500`}
            >
              <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform translate-x-6`} />
            </div>
          </div>
        );
      case 'createdOn':
        return item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB') : '-';
      default:
        return '-';
    }
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
        
        <h1 className="font-semibold text-lg sm:text-2xl">SERVICE LIST</h1>
      </div>


      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading services data...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600">Error: {error}</div>
        </div>
      )}

      {/* Enhanced Table */}
      {!loading && (
        <EnhancedTable
          data={paginatedServices}
          columns={columns}
          renderCell={renderCell}
          bulkActions={bulkActions}
          showBulkActions={true}
          selectable={true}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
          onSelectAll={handleSelectAll}
          pagination={false}
          enableExport={true}
          exportFileName="services"
          getItemId={(item) => item.id.toString()}
          storageKey="services-table"
          leftActions={renderCustomActions()}
        />
      )}

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
