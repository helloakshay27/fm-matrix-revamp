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
import { useDebounce } from '@/hooks/useDebounce';

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
  qr_code_id?: number;
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

interface ServicesApiData {
  pms_services: ServiceRecord[];
  pagination: PaginationData;
  total_services_count: number;
  active_services_count: number;
  inactive_services_count: number;
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
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadedQRCodes, setDownloadedQRCodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const filtersWithSearch = {
      ...appliedFilters,
      serviceName: appliedFilters.serviceName || debouncedSearchQuery || undefined,
    };
    dispatch(fetchServicesData({ active: activeFilter, page: currentPage, filters: filtersWithSearch }));
  }, [dispatch, activeFilter, currentPage, appliedFilters, debouncedSearchQuery]);

  const servicesData = apiData && Array.isArray(apiData.pms_services) ? apiData.pms_services : initialServiceData;
  const paginationData: PaginationData = apiData?.pagination || { current_page: 1, total_count: 0, total_pages: 1 };

  const handleAddClick = () => navigate('/maintenance/service/add');
  const handleAddSchedule = () => navigate('/maintenance/schedule/add?type=Service');
  const handleImportClick = () => {
    setShowBulkUploadModal(true);
    setShowActionPanel(false);
  };
  const handleImportLocationsClick = () => setShowImportLocationsModal(true);
  const handleFiltersClick = () => {
    setShowFilterModal(true);
    setShowActionPanel(false);
  };

  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
    setSearchQuery('');
    setCurrentPage(1);
    setShowFilterModal(false);
  };

  const handleCloseFilter = () => {
    setShowFilterModal(false);
    setSelectedItems([]);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
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

  const downloadAttachment = async (file: { attachment_id: number; document_name: string }) => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = localStorage.getItem('baseUrl');

      if (!token || !baseUrl) {
        console.error('Missing token or baseUrl');
        toast.error('Missing token or baseUrl');
        return;
      }

      const apiUrl = `https://${baseUrl}/attachfiles/${file.attachment_id}?show_file=true`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.document_name || `document_${file.attachment_id}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading file:', err);
      toast.error('Error downloading file');
    }
  };

  const handleQRDownload = async (serviceId?: string) => {
    const servicesToDownload = serviceId
      ? servicesData.filter((service) => service.id.toString() === serviceId)
      : servicesData.filter((service) => selectedItems.includes(service.id.toString()));

    for (const service of servicesToDownload) {
      if (service.qr_code && service.qr_code_id) {
        const serviceIdStr = service.id.toString();
        if (downloadedQRCodes.has(serviceIdStr)) {
          // Show toast with confirmation buttons
          const downloadPromise = new Promise<void>((resolve) => {
            toast.custom((t) => (
              <div
                className="bg-white p-5 rounded-xl shadow-none w-full max-w-sm border-0 ring-0"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-500 mt-1" />
                  <div className="flex-1 text-sm text-gray-800">
                    <p className="font-semibold mb-1">QR Code Already Downloaded</p>
                    <p className="text-sm text-gray-800">
                      QR for <span className="font-medium text-gray-900">"{service.service_name}"</span> (ID: {service.id}) already downloaded. Download again?
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-500 hover:bg-red-50"
                    onClick={() => {
                      toast.dismiss(t);
                      resolve();
                    }}
                  >
                    No
                  </Button>
                  <Button
                    className="bg-primary text-white hover:bg-primary/90"
                    size="sm"
                    onClick={async () => {
                      toast.dismiss(t);
                      await downloadAttachment({
                        attachment_id: service.qr_code_id!,
                        document_name: `${service.service_name || 'service'}_${service.id}_qr.png`,
                      });
                      setDownloadedQRCodes((prev) => new Set(prev).add(serviceIdStr));
                      resolve();
                    }}
                  >
                    Yes
                  </Button>
                </div>
              </div>
            ));

          });

          await downloadPromise;
        } else {
          await downloadAttachment({
            attachment_id: service.qr_code_id,
            document_name: `${service.service_name || 'service'}_${service.id}_qr.png`,
          });
          setDownloadedQRCodes((prev) => new Set(prev).add(serviceIdStr));
        }
      } else {
        console.warn(`QR code not available for service ID ${service.id}`);
        toast.error(`QR code not available for service ID ${service.id}`);
      }
    }
  };

  const handleViewService = (id: number) => navigate(`/maintenance/service/details/${id}`);

  const handleTotalServicesClick = () => {
    setActiveFilter(undefined);
    setSearchQuery('');
    setAppliedFilters({});
    setCurrentPage(1);
  };

  const handleActiveServicesClick = () => {
    setActiveFilter(true);
    setSearchQuery('');
    setAppliedFilters({});
    setCurrentPage(1);
  };

  const handleInactiveServicesClick = () => {
    setActiveFilter(false);
    setSearchQuery('');
    setAppliedFilters({});
    setCurrentPage(1);
  };

  const handleStatusToggle = async (id: number) => {
    if (togglingIds.has(id)) return;

    const baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
    const token = localStorage.getItem('token');

    try {
      if (!token) {
        toast.error('Authentication token missing. Please log in again.');
        navigate('/login');
        return;
      }

      if (!apiData) {
        toast.error('No service data available');
        return;
      }

      const service = servicesData.find((item) => item.id === id);
      if (!service) {
        toast.error('Service record not found');
        return;
      }

      setTogglingIds((prev) => new Set(prev).add(id));

      const updatedStatus = !service.active;
      const updatedServicesData = servicesData.map((item) =>
        item.id === id ? { ...item, active: updatedStatus } : item
      );

      dispatch(fetchServicesData.fulfilled(
        { ...apiData, pms_services: updatedServicesData },
        'fetchServicesData',
        { active: activeFilter, page: currentPage, filters: appliedFilters }
      ));
      toast.dismiss();
      toast.success(`Status ${updatedStatus ? 'Active' : 'Inactive'}`);

      const url = `https://${baseUrl}/pms/services/${id}.json`;
      const response = await axios.put(
        url,
        {
          pms_service: { active: updatedStatus },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedApiData = {
          ...apiData,
          pms_services: updatedServicesData,
          active_services_count: updatedStatus
            ? apiData.active_services_count + 1
            : apiData.active_services_count - 1,
          inactive_services_count: updatedStatus
            ? apiData.inactive_services_count - 1
            : apiData.inactive_services_count + 1,
        };
        dispatch(fetchServicesData.fulfilled(
          updatedApiData,
          'fetchServicesData',
          { active: activeFilter, page: currentPage, filters: appliedFilters }
        ));
      } else {
        dispatch(fetchServicesData.fulfilled(
          apiData,
          'fetchServicesData',
          { active: activeFilter, page: currentPage, filters: appliedFilters }
        ));
        toast.error('Failed to update service status');
      }
    } catch (error) {
      console.error('Error updating service status:', error);
      dispatch(fetchServicesData.fulfilled(
        apiData,
        'fetchServicesData',
        { active: activeFilter, page: currentPage, filters: appliedFilters }
      ));
      const errorMessage = error.response?.data?.message || 'Failed to update service status';
      toast.error(errorMessage);
    } finally {
      setTogglingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
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
      label: 'Print QR',
      icon: FileText,
      onClick: () => handleQRDownload(),
    },
  ];

  const handleSingleAmcFlag = async (serviceItem: ServiceRecord) => {
    const baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
    const token = localStorage.getItem('token');

    try {
      if (!baseUrl || !token) {
        toast.error('Missing base URL, token, or site ID');
        return;
      }

      const updatedFlag = !serviceItem.is_flagged;

      const response = await axios.put(
        `https://${baseUrl}/pms/services/${serviceItem.id}.json`,
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
        dispatch(fetchServicesData({ active: activeFilter, page: currentPage, filters: appliedFilters }));
        toast.dismiss();
        toast.success(`Flag ${updatedFlag ? 'Activated' : 'Deactivated'}`);
      } else {
        toast.error('Failed to update service flag');
      }
    } catch (error) {
      toast.error('Failed to update service flag');
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
            <div title="Flag Service">
              <Flag
                className={`w-4 h-4 cursor-pointer hover:text-[#C72030] ${item.is_flagged ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSingleAmcFlag(item);
                }}
              />
            </div>
          </div>
        );
      case 'serviceName':
        return <span>{item.service_name || '-'}</span>;
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
          <div className="flex justify-center items-center h-full w-full">
            <div
              onClick={() => !togglingIds.has(item.id) && handleStatusToggle(item.id)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${item.active ? 'bg-green-500' : 'bg-gray-400'
                } ${togglingIds.has(item.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
          <PaginationLink className='cursor-pointer' onClick={() => setCurrentPage(1)} isActive={currentPage === 1}>
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
              <PaginationLink className='cursor-pointer' onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
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
              <PaginationLink className='cursor-pointer' onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
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
                <PaginationLink className='cursor-pointer' onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
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
            <PaginationLink className='cursor-pointer' onClick={() => setCurrentPage(totalPages)} isActive={currentPage === totalPages}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink className='cursor-pointer' onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
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
      {selectedItems.length > 0 && (
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => handleQRDownload()}
        >
          <FileText className="w-4 h-4 mr-2" /> Print QR
        </Button>
      )}
    </div>
  );

  const handleExport = async () => {
    const baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
    const token = localStorage.getItem('token');
    try {
      if (!baseUrl || !token) {
        toast.error('Missing base URL, token, or site ID');
        return;
      }

      let url = `https://${baseUrl}/pms/services/export.xlsx`;
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
      {error && (
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600">Error: {error}</div>
        </div>
      )}

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
                {apiData?.total_services_count || 0}
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
                {apiData?.active_services_count || 0}
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
                {apiData?.inactive_services_count || 0}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Inactive Services</div>
            </div>
          </div>
        </div>

        {showActionPanel && (
          <SelectionPanel
            actions={[
              { label: 'Add Schedule', icon: Plus, onClick: handleAddSchedule },
            ]}
            onAdd={handleAddClick}
            onImport={handleImportClick}
            onClearSelection={() => setShowActionPanel(false)}
          />
        )}
        <EnhancedTable
          loading={loading}
          handleExport={handleExport}
          data={servicesData}
          columns={columns}
          renderCell={renderCell}
          bulkActions={bulkActions}
          showBulkActions={selectedItems.length > 0}
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
          onSearchChange={(query) => handleSearch(query)}
          searchTerm={searchQuery}
          enableSearch={true}
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

      {!loading && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, paginationData.current_page - 1))}
                  className={paginationData.current_page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(paginationData.total_pages, paginationData.current_page + 1))}
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