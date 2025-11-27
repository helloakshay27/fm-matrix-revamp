import { useEffect, useMemo, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { Badge } from '@/components/ui/badge';
import { Eye, Plus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeader, getFullUrl, API_CONFIG } from '@/config/apiConfig';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface OutboundMail {
  id: number;
  senderName: string;
  unit: string;
  entity: string;
  recipientName: string;
  courierVendor: string;
  awbNumber: string;
  type: string;
  dateOfSending: string;
  statusType: string;
}

const OUTBOUND_ENDPOINT = '/pms/admin/mail_outbounds.json';
const PER_PAGE = 10;

const formatDate = (value?: string | null) => {
  if (!value) return '';
  const isoDate = new Date(value);
  if (!Number.isNaN(isoDate.getTime())) {
    return isoDate.toLocaleDateString('en-GB');
  }

  const sanitized = value.replace(/-/g, '/');
  const parts = sanitized.split('/');
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`;
  }
  return value;
};

const formatStatus = (status?: string) => {
  if (!status) return 'Pending';
  const normalized = status.trim().toLowerCase();
  if (normalized === 'collected') return 'Collected';
  if (normalized === 'pending') return 'Pending';
  if (normalized === 'overdue') return 'Overdue';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const mapOutboundRecord = (item: any): OutboundMail => ({
  id: item.id,
  senderName: item.sender_name || item.sender?.full_name || '-',
  unit: item.unit || item.unit_name || '-',
  entity: item.entity || item.entity_name || item.resource_type || '-',
  recipientName: item.recipient_name || item.user?.full_name || '-',
  courierVendor: item.delivery_vendor?.name || item.vendor_name || '-',
  awbNumber: item.awb_number || '-',
  type:
    item.type ||
    item.mail_items?.[0]?.item_type ||
    item.item_type ||
    item.packages_with_quantity?.split(' ')?.slice(1)?.join(' ') ||
    '-',
  dateOfSending: formatDate(
    item.sending_date || item.date_of_sending || item.send_date || item.receive_date,
  ),
  statusType: formatStatus(item.status),
});

export const OutboundListPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [outboundMails, setOutboundMails] = useState<OutboundMail[]>([]);
  const [loading, setLoading] = useState(false);
  const [showActionPanel, setShowActionPanel] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterVendor, setFilterVendor] = useState('');
  const [filterSender, setFilterSender] = useState('');
  const [filterCreatedDateFrom, setFilterCreatedDateFrom] = useState('');
  const [filterCreatedDateTo, setFilterCreatedDateTo] = useState('');

  // Applied filters (only update when Apply is clicked)
  const [appliedFilterStatus, setAppliedFilterStatus] = useState('');
  const [appliedFilterVendor, setAppliedFilterVendor] = useState('');
  const [appliedFilterSender, setAppliedFilterSender] = useState('');
  const [appliedFilterCreatedDateFrom, setAppliedFilterCreatedDateFrom] = useState('');
  const [appliedFilterCreatedDateTo, setAppliedFilterCreatedDateTo] = useState('');

  // API data for filters
  const [vendors, setVendors] = useState<Array<{ id: number; name: string }>>([]);
  const [senders, setSenders] = useState<Array<{ id: number; full_name: string }>>([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [isLoadingSenders, setIsLoadingSenders] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  const formatDateForApi = (dateString: string): string => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchOutboundMails = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          per_page: PER_PAGE.toString(),
        });

        if (appliedFilterStatus) {
          queryParams.append('q[status_eq]', appliedFilterStatus.toLowerCase());
        }
        if (appliedFilterSender) {
          queryParams.append('q[user_id_eq]', appliedFilterSender);
        }
        if (appliedFilterVendor) {
          queryParams.append('q[delivery_vendor_id_eq]', appliedFilterVendor);
        }
        if (appliedFilterCreatedDateFrom && appliedFilterCreatedDateTo) {
          const fromDate = formatDateForApi(appliedFilterCreatedDateFrom);
          const toDate = formatDateForApi(appliedFilterCreatedDateTo);
          queryParams.append('q[date_range]', `${fromDate} - ${toDate}`);
        }
        if (searchQuery) {
          queryParams.append('q[search_all_fields_cont]', searchQuery);
        }

        const url = queryParams.toString()
          ? `${getFullUrl(OUTBOUND_ENDPOINT)}?${queryParams.toString()}`
          : getFullUrl(OUTBOUND_ENDPOINT);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: getAuthHeader(),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch outbound mails');

        const data = await response.json();
        const records = Array.isArray(data?.mail_outbounds)
          ? data.mail_outbounds
          : Array.isArray(data)
            ? data
            : data?.data || [];

        setOutboundMails(records.map(mapOutboundRecord));

        const paginationInfo =
          data?.meta?.pagination ||
          data?.pagination ||
          data?.meta ||
          {};

        const totalCount =
          paginationInfo.total_entries ??
          paginationInfo.total_count ??
          paginationInfo.total ??
          paginationInfo.count ??
          data?.total_count ??
          (currentPage - 1) * PER_PAGE + records.length;

        const derivedTotalPages =
          paginationInfo.total_pages ??
          Math.max(1, Math.ceil(totalCount / PER_PAGE));

        setTotalRecords(totalCount);
        setTotalPages(derivedTotalPages);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Failed to load outbound mails',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOutboundMails();
  }, [toast, currentPage, appliedFilterStatus, appliedFilterSender, appliedFilterVendor, appliedFilterCreatedDateFrom, appliedFilterCreatedDateTo, searchQuery]);

  // Fetch vendors and senders when filter modal opens
  useEffect(() => {
    const fetchFilterData = async () => {
      if (!isFilterModalOpen) return;

      // Fetch vendors
      setIsLoadingVendors(true);
      try {
        const vendorResponse = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.DELIVERY_VENDORS), {
          method: 'GET',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        });

        if (vendorResponse.ok) {
          const vendorData = await vendorResponse.json();
          setVendors(vendorData.delivery_vendors || vendorData || []);
        }
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setIsLoadingVendors(false);
      }

      // Fetch senders
      setIsLoadingSenders(true);
      try {
        const senderResponse = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.ESCALATION_USERS), {
          method: 'GET',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        });

        if (senderResponse.ok) {
          const senderData = await senderResponse.json();
          setSenders(senderData.users || senderData || []);
        }
      } catch (error) {
        console.error('Error fetching senders:', error);
      } finally {
        setIsLoadingSenders(false);
      }
    };

    fetchFilterData();
  }, [isFilterModalOpen]);

  // Hardcoded status options
  const statusOptions = ['Sent', 'In Transit', 'Delivered', 'Overdue'];

  const filteredOutboundMails = useMemo(() => {
    return outboundMails;
  }, [outboundMails]);

  const pageNumbers = useMemo(() => {
    const pages = new Set<number>();
    // Always show first page
    pages.add(1);
    // Always show last page
    if (totalPages > 1) pages.add(totalPages);
    // Show current page and neighbors
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < totalPages) pages.add(i);
    }
    return Array.from(pages).sort((a, b) => a - b);
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startRecord = (currentPage - 1) * PER_PAGE + 1;
  const endRecord = Math.min(currentPage * PER_PAGE, totalRecords);

  const handleViewOutbound = (id: number) => {
    navigate(`/vas/mailroom/outbound/${id}`);
  };

  const columns: ColumnConfig[] = [
    { key: 'view', label: 'View', sortable: false, draggable: false },
    { key: 'id', label: 'ID', sortable: true, draggable: true },
    { key: 'senderName', label: 'Sender Name', sortable: true, draggable: true },
    { key: 'unit', label: 'Unit', sortable: true, draggable: true },
    { key: 'entity', label: 'Entity', sortable: true, draggable: true },
    { key: 'recipientName', label: 'Recipient Name', sortable: true, draggable: true },
    { key: 'courierVendor', label: 'Courier Vendor', sortable: true, draggable: true },
    { key: 'awbNumber', label: 'AWB Number', sortable: true, draggable: true },
    { key: 'type', label: 'Type', sortable: true, draggable: true },
    { key: 'dateOfSending', label: 'Date of Sending', sortable: true, draggable: true },
    { key: 'statusType', label: 'Status Type', sortable: true, draggable: true },
  ];

  const renderCell = (item: OutboundMail, columnKey: string) => {
    if (columnKey === 'view') {
      return (
        <button onClick={() => handleViewOutbound(item.id)} className="text-stone-800">
          <Eye className="w-5 h-5" />
        </button>
      );
    }
    if (columnKey === 'statusType') {
      const statusColors: Record<string, string> = {
        Collected: 'bg-green-100 text-green-800',
        Overdue: 'bg-red-100 text-red-800',
        Pending: 'bg-yellow-100 text-yellow-800',
      };
      return (
        <Badge className={`${statusColors[item.statusType] || 'bg-gray-100 text-gray-800'}`}>
          {item.statusType}
        </Badge>
      );
    }
    return item[columnKey as keyof OutboundMail] || '';
  };

  const leftActions = (
    <Button
      onClick={() => setShowActionPanel(true)}
      className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-md flex items-center gap-2 border-0"
    >
      <Plus className="w-4 h-4" />
      Add
    </Button>
  );

  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to first page on filter apply
    setAppliedFilterStatus(filterStatus);
    setAppliedFilterVendor(filterVendor);
    setAppliedFilterSender(filterSender);
    setAppliedFilterCreatedDateFrom(filterCreatedDateFrom);
    setAppliedFilterCreatedDateTo(filterCreatedDateTo);
    setIsFilterModalOpen(false);
  };
  const handleResetFilters = () => {
    setCurrentPage(1); // Reset to first page on filter reset
    setFilterStatus('');
    setFilterSender('');
    setFilterVendor('');
    setFilterCreatedDateFrom('');
    setFilterCreatedDateTo('');
    setAppliedFilterStatus('');
    setAppliedFilterSender('');
    setAppliedFilterVendor('');
    setAppliedFilterCreatedDateFrom('');
    setAppliedFilterCreatedDateTo('');
  };

  return (
    <div className="p-[30px]">
      {showActionPanel && (
        <SelectionPanel
          onAdd={() => navigate('/vas/mailroom/outbound/create')}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}

      <EnhancedTable
        loading={loading}
        data={filteredOutboundMails}
        columns={columns}
        renderCell={renderCell}
        onFilterClick={() => setIsFilterModalOpen(true)}
        onSearch={(query) => {
          setSearchQuery(query);
          setCurrentPage(1); // Reset to first page on search
        }}
        storageKey="outbound-mail-table"
        className="min-w-full"
        emptyMessage="No outbound mails available"
        leftActions={leftActions}
        enableSearch
        enableSelection={false}
        hideTableExport

        pagination={false} // Disable internal pagination of EnhancedTable since we use custom external pagination
      />

      {totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <span className="text-sm text-gray-600">
            Showing {startRecord}-{Math.max(startRecord, endRecord)} of {totalRecords}
          </span>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {pageNumbers.map((page, index) => {
                const prevPage = pageNumbers[index - 1];
                const needsEllipsis = prevPage && page - prevPage > 1;
                return (
                  <Fragment key={page}>
                    {needsEllipsis && (
                      <PaginationItem key={`ellipsis-${page}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  </Fragment>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
            <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
            <button
              onClick={() => setIsFilterModalOpen(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>
          <div className="py-4">
            <h3 className="text-sm font-semibold text-[#C72030] mb-4">Select Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.length ? (
                      statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-status" disabled>
                        No statuses available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender" className="text-sm font-medium">
                  Select Sender
                </Label>
                <Select value={filterSender} onValueChange={setFilterSender}>
                  <SelectTrigger id="sender" className="w-full">
                    <SelectValue placeholder={isLoadingSenders ? 'Loading senders...' : 'Select Sender'} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingSenders ? (
                      <SelectItem value="loading" disabled>
                        Loading senders...
                      </SelectItem>
                    ) : senders.length ? (
                      senders.map((sender) => (
                        <SelectItem key={sender.id} value={sender.id.toString()}>
                          {sender.full_name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-sender" disabled>
                        No senders available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor" className="text-sm font-medium">
                  Select Vendor
                </Label>
                <Select value={filterVendor} onValueChange={setFilterVendor}>
                  <SelectTrigger id="vendor" className="w-full">
                    <SelectValue placeholder={isLoadingVendors ? 'Loading vendors...' : 'Select Vendor'} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingVendors ? (
                      <SelectItem value="loading" disabled>
                        Loading vendors...
                      </SelectItem>
                    ) : vendors.length ? (
                      vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id.toString()}>
                          {vendor.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-vendor" disabled>
                        No vendors available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label className="text-sm font-medium">
                  Created Date
                </Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      id="createdDateFrom"
                      type="date"
                      placeholder="From Date"
                      value={filterCreatedDateFrom}
                      onChange={(e) => setFilterCreatedDateFrom(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <span className="text-gray-500">-</span>
                  <div className="flex-1">
                    <Input
                      id="createdDateTo"
                      type="date"
                      placeholder="To Date"
                      value={filterCreatedDateTo}
                      onChange={(e) => setFilterCreatedDateTo(e.target.value)}
                      className="w-full"
                      min={filterCreatedDateFrom}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={handleResetFilters} variant="outline" className="px-6">
              Reset
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="bg-[#532D5F] hover:bg-[#532D5F]/90 text-white px-6"
            >
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OutboundListPage;


