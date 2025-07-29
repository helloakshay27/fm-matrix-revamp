import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload, FileText, Filter, Eye, Settings, AlertCircle, Trash2, Clock, Download, X, Flag } from 'lucide-react';
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
} from '@/components/ui/pagination';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { toast } from 'sonner';
import axios from 'axios';

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
  qr_code?: string;
  group_name?: string;
  sub_group_name?: string;
  base_uom?: string;
  active?: boolean;
  is_flagged?: boolean;
}

interface PaginationData {
  current_page: number;
  total_count: number;
  total_pages: number;
}

interface ServiceActionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceRecord | null;
  onQRDownload: (serviceId: string) => void;
}

const ServiceActionPanel: React.FC<ServiceActionPanelProps> = ({ isOpen, onClose, service, onQRDownload }) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Actions for {service.service_name}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => onQRDownload(service.id.toString())}
          >
            <FileText className="w-4 h-4 mr-2" />
            Download QR Code
          </Button>
          {/* Add more actions here as needed */}
        </div>
      </div>
    </div>
  );
};

const initialServiceData: ServiceRecord[] = [];

export const ServiceDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: apiData, loading, error } = useAppSelector((state) => state.services);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showImportLocationsModal, setShowImportLocationsModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [showServiceActionPanel, setShowServiceActionPanel] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceRecord | null>(null);
  const [appliedFilters, setAppliedFilters] = useState({});

  useEffect(() => {
    const siteId = localStorage.getItem('siteId');
    if (!siteId || siteId === 'null') {
      console.warn('Invalid siteId in localStorage, setting fallback: 2189');
      localStorage.setItem('siteId', '2189');
    }
    const page = apiData?.pagination?.current_page || 1;
    console.log('Fetching services with:', { active: activeFilter, page, filters: appliedFilters });
    dispatch(fetchServicesData({ active: activeFilter, page, filters: appliedFilters }));
  }, [dispatch, activeFilter, appliedFilters]);

  const servicesData = apiData && Array.isArray(apiData.pms_services) ? apiData.pms_services : initialServiceData;
  const paginationData: PaginationData = apiData?.pagination || { current_page: 1, total_count: 0, total_pages: 1 };



  const handleAddClick = () => navigate('/maintenance/service/add');
  const handleImportClick = () => {
    setShowBulkUploadModal(true);
    setShowActionPanel(false);
  };
  const handleImportLocationsClick = () => setShowImportLocationsModal(true);
  const handleFiltersClick = () => {
    setShowFilterModal(true);
    setShowActionPanel(false);
  };

  // const handleApplyFilters = async (filters) => {
  //   const baseUrl = localStorage.getItem('baseUrl');
  //   const token = localStorage.getItem('token');
  //   const siteId = localStorage.getItem('siteId') || '2189'; // Ensure siteId is included
  //   setShowFilterModal(false);

  //   const queryParams = {};

  //   if (filters.serviceName) {
  //     queryParams['q[service_name_cont]'] = filters.serviceName;
  //   }
  //   if (filters.buildingId) {
  //     queryParams['q[building_id_eq]'] = filters.buildingId;
  //   }
  //   if (filters.areaId) {
  //     queryParams['q[area_id_eq]'] = filters.areaId;
  //   }

  //   // Include active filter and page if needed
  //   if (activeFilter !== undefined) {
  //     queryParams['q[active_eq]'] = activeFilter;
  //   }
  //   queryParams['page'] = 1; // Start from page 1 for filtered results

  //   const queryString = new URLSearchParams(queryParams).toString();
  //   const url = `https://${baseUrl}/pms/services.json${queryString ? `?${queryString}` : ''}`;

  //   try {
  //     const response = await axios.get(url, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     console.log('Filter Response:', response.data);

  //     // Dispatch the filtered data to the Redux store
  //     dispatch(fetchServicesData.fulfilled(response.data, 'fetchServicesData', { active: activeFilter, page: 1 }));

  //     // Optionally, store the applied filters to maintain them for pagination
  //     setAppliedFilters(filters); // Add a new state to store filters (see below)
  //   } catch (error) {
  //     console.error('Error fetching filtered services:', error);
  //     toast.error('Failed to fetch filtered services');
  //   }
  // };

  const handleApplyFilters = (filters: FilterState) => {
    setAppliedFilters(filters);
    setShowFilterModal(false);
  }


  const handleCloseFilter = () => {
    setShowFilterModal(false);
    setSelectedItems([]);
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(servicesData.map((item) => item.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };

  const handleQRDownload = (serviceId?: string) => {
    const servicesToDownload = serviceId
      ? servicesData.filter((service) => service.id.toString() === serviceId)
      : servicesData.filter((service) => selectedItems.includes(service.id.toString()));

    servicesToDownload.forEach((service) => {
      const qrUrl = service.qr_code;
      if (qrUrl) {
        const link = document.createElement('a');
        link.href = qrUrl;
        link.download = `${service.service_name || 'service'}_${service.id}_qr.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.warn(`QR code not available for service ID ${service.id}`);
        toast.error(`QR code not available for service ID ${service.id}`);
      }
    });
  };

  const handleViewService = (id: number) => navigate(`/maintenance/service/details/${id}`);

  const handleTotalServicesClick = () => {
    setActiveFilter(undefined);
    dispatch(fetchServicesData({ active: undefined, page: 1 }));
  };

  const handleActiveServicesClick = () => {
    setActiveFilter(true);
    dispatch(fetchServicesData({ active: true, page: 1 }));
  };

  const handleInactiveServicesClick = () => {
    setActiveFilter(false);
    dispatch(fetchServicesData({ active: false, page: 1 }));
  };

  const handleStatusToggle = async (id: number) => {
    const baseUrl = 'fm-uat-api.lockated.com';
    const token = localStorage.getItem('token');
    const siteId = localStorage.getItem('siteId') || '2189';
    try {
      if (!token) {
        toast.error('Authentication token missing. Please log in again.');
        navigate('/login');
        return;
      }

      const service = servicesData.find((item) => item.id === id);
      if (!service) {
        toast.error('Service record not found');
        return;
      }

      const updatedStatus = !service.active;
      const url = `https://${baseUrl}/pms/services/${id}.json?site_id=${siteId}`;
      const response = await axios.put(
        url,
        {
          pms_service: { active: updatedStatus }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        dispatch(fetchServicesData({ active: activeFilter, page: paginationData.current_page }));
        toast.success(`Service ID ${id} status updated`);
      } else {
        toast.error('Failed to update service status');
      }
    } catch (error) {
      console.error('Error updating service status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update service status';
      toast.error(errorMessage);
    }
  };

  const columns = [
    { key: 'actions', label: 'Actions', sortable: false },
    { key: 'serviceName', label: 'Service Name', sortable: true },
    { key: 'id', label: 'ID', sortable: true },
    { key: 'referenceNumber', label: 'Reference Number', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'group', label: 'Group', sortable: true },
    { key: 'subGroup', label: 'Sub Group', sortable: true },
    { key: 'uom', label: 'UOM', sortable: true },
    { key: 'building', label: 'Building', sortable: true },
    { key: 'wing', label: 'Wing', sortable: true },
    { key: 'area', label: 'Area', sortable: true },
    { key: 'floor', label: 'Floor', sortable: true },
    { key: 'room', label: 'Room', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'createdOn', label: 'Created On', sortable: true },
  ];

  const bulkActions = [
    {
      label: 'Print QR Codes',
      icon: FileText,
      onClick: () => handleQRDownload(),
    },
  ];

  const handleSingleAmcFlag = async (serviceItem: ServiceRecord) => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    const siteId = localStorage.getItem('siteId') || '2189'; // Ensure siteId is included
    try {
      if (!baseUrl || !token || !siteId) {
        toast.error('Missing base URL, token, or site ID');
        return;
      }

      const updatedFlag = !serviceItem.is_flagged;
      const response = await axios.put(
        `https://${baseUrl}/pms/services/${serviceItem.id}.json?site_id=${siteId}`, // Updated endpoint
        {
          pms_service: {
            is_flagged: updatedFlag,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log('Flag update response:', response.data); // Debug response
        dispatch(fetchServicesData({ active: activeFilter, page: paginationData.current_page }));
        toast.success(`Service ID ${serviceItem.id} flag updated`);
      } else {
        toast.error('Failed to update AMC flag');
      }
    } catch (error) {
      console.error('Flag update error:', error.response?.data || error.message);
      toast.error('Failed to update AMC flag');
    }
  };

  const renderCell = (item: ServiceRecord, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleViewService(item.id)}>
              <Eye className="w-4 h-4" />
            </Button>
            <div title="Flag AMC">
              <Flag
                className={`w-4 h-4 cursor-pointer hover:text-[#C72030] ${item.is_flagged ? 'text-red-500 fill-red-500' : 'text-gray-600'
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSingleAmcFlag(item);
                }}
              />
            </div>
          </div>
        );
      case 'serviceName':
        return (
          <span
            // className="cursor-pointer hover:underline"
            // onClick={() => {
            //   setSelectedService(item);
            //   setShowServiceActionPanel(true);
            // }}
          >
            {item.service_name || '-'}
          </span>
        );
      case 'id':
        return <span className="font-medium">{item.id}</span>;
      case 'referenceNumber':
        return item.service_code || '-';
      case 'category':
        return '-';
      case 'group':
        return item.group_name || '-';
      case 'uom':
        return item.base_uom || '-';
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
      case 'subGroup':
        return item.sub_group_name || '-';
      case 'status':
        return (
          <div className="flex items-center">
            <div
              onClick={() => handleStatusToggle(item.id)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${item.active ? 'bg-green-500' : 'bg-gray-400'
                }`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${item.active ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
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
    const totalPages = paginationData.total_pages;
    const currentPage = paginationData.current_page;
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => dispatch(fetchServicesData({ active: activeFilter, page: 1 }))} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );

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
              <PaginationLink onClick={() => dispatch(fetchServicesData({ active: activeFilter, page: i }))} isActive={currentPage === i}>
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink onClick={() => dispatch(fetchServicesData({ active: activeFilter, page: i }))} isActive={currentPage === i}>
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find((item) => item.key === i)) {
            items.push(
              <PaginationItem key={i}>
                <PaginationLink onClick={() => dispatch(fetchServicesData({ active: activeFilter, page: i }))} isActive={currentPage === i}>
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }

      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink onClick={() => dispatch(fetchServicesData({ active: activeFilter, page: totalPages }))} isActive={currentPage === totalPages}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => dispatch(fetchServicesData({ active: activeFilter, page: i }))} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  const handleActionClick = () => {
    setShowActionPanel(true);
  };

  const renderCustomActions = () => (
    <div className="flex flex-wrap gap-3">
      <Button onClick={handleActionClick} className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Plus className="w-4 h-4" /> Action
      </Button>
    </div>
  );

  const handleExport = async () => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    const siteId = localStorage.getItem('selectedSiteId');
    try {
      if (!baseUrl || !token || !siteId) {
        toast.error('Missing base URL, token, or site ID');
        return;
      }

      let url = `https://${baseUrl}/pms/services/export.xlsx?site_id=${siteId}`;
      if (selectedItems.length > 0) {
        const ids = selectedItems.join(',');
        url += `&ids=${ids}`;
      }

      const response = await axios.get(url, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data || response.data.size === 0) {
        toast.error('Empty file received from server');
        return;
      }

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'services.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      toast.success('Services data exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export Services data');
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading Services data...</div>
        </div>
      )}

      {error && (
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600">Error: {error}</div>
        </div>
      )}

      {!loading && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-3">
            <div
              className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer"
              onClick={handleTotalServicesClick}
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                <Settings className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                  {apiData.total_services_count}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Total Services</div>
              </div>
            </div>

            <div
              className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer"
              onClick={handleActiveServicesClick}
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                <Settings className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                  {apiData.active_services_count}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Active Services</div>
              </div>
            </div>

            <div
              className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer"
              onClick={handleInactiveServicesClick}
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                <Settings className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                  {apiData.inactive_services_count}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Inactive Services</div>
              </div>
            </div>
          </div>

          {showActionPanel && (
            <SelectionPanel
              actions={[]}
              onAdd={handleAddClick}
              onImport={handleImportClick}
              onClearSelection={() => setShowActionPanel(false)}
            />
          )}
          <EnhancedTable
            handleExport={handleExport}
            data={servicesData}
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
            searchPlaceholder="Search..."
            onFilterClick={handleFiltersClick}
          />
          <ServiceActionPanel
            isOpen={showServiceActionPanel}
            onClose={() => {
              setShowServiceActionPanel(false);
              setSelectedService(null);
            }}
            service={selectedService}
            onQRDownload={handleQRDownload}
          />
        </>
      )}

      {!loading && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => dispatch(fetchServicesData({ active: activeFilter, page: Math.max(1, paginationData.current_page - 1) }))}
                  className={paginationData.current_page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext
                  onClick={() => dispatch(fetchServicesData({ active: activeFilter, page: Math.min(paginationData.total_pages, paginationData.current_page + 1) }))}
                  className={paginationData.current_page === paginationData.total_pages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      <ServiceBulkUploadModal isOpen={showBulkUploadModal} onClose={() => setShowBulkUploadModal(false)} />
      <ImportLocationsModal isOpen={showImportLocationsModal} onClose={() => setShowImportLocationsModal(false)} />
      <ServiceFilterModal isOpen={showFilterModal} onClose={handleCloseFilter} onApply={handleApplyFilters} />
    </div>
  );
};