import { useEffect, useMemo, useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { getAuthHeader, getFullUrl } from '@/config/apiConfig';

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

const OUTBOUND_ENDPOINT = '/pms/admin/mail_inbounds.json';

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
    item.date_of_sending || item.send_date || item.receive_date || item.recieved_on,
  ),
  statusType: formatStatus(item.status),
});

export const OutboundListPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [outboundMails, setOutboundMails] = useState<OutboundMail[]>([]);
  const [loading, setLoading] = useState(false);
  const [showActionPanel, setShowActionPanel] = useState(false);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterVendor, setFilterVendor] = useState('');
  const [filterSender, setFilterSender] = useState('');

  useEffect(() => {
    const fetchOutboundMails = async () => {
      setLoading(true);
      try {
        const response = await fetch(getFullUrl(OUTBOUND_ENDPOINT), {
          method: 'GET',
          headers: {
            Authorization: getAuthHeader(),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch outbound mails');

        const data = await response.json();
        const records = Array.isArray(data?.mail_inbounds)
          ? data.mail_inbounds
          : Array.isArray(data)
            ? data
            : data?.data || [];

        setOutboundMails(records.map(mapOutboundRecord));
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
  }, [toast]);

  const statusOptions = useMemo(() => {
    const uniqueStatuses = new Set(
      outboundMails.map((mail) => mail.statusType).filter(Boolean),
    );
    if (!uniqueStatuses.size) ['Collected', 'Overdue', 'Pending'].forEach((s) => uniqueStatuses.add(s));
    return Array.from(uniqueStatuses);
  }, [outboundMails]);

  const vendorOptions = useMemo(() => {
    const uniqueVendors = new Set(
      outboundMails.map((mail) => mail.courierVendor).filter((vendor) => vendor && vendor !== '-'),
    );
    return Array.from(uniqueVendors);
  }, [outboundMails]);

  const senderOptions = useMemo(() => {
    const uniqueSenders = new Set(
      outboundMails.map((mail) => mail.senderName).filter((sender) => sender && sender !== '-'),
    );
    return Array.from(uniqueSenders);
  }, [outboundMails]);

  const filteredOutboundMails = useMemo(() => {
    return outboundMails.filter((mail) => {
      const statusMatch = filterStatus ? mail.statusType === filterStatus : true;
      const vendorMatch = filterVendor
        ? mail.courierVendor.toLowerCase() === filterVendor.toLowerCase()
        : true;
      const senderMatch = filterSender
        ? mail.senderName.toLowerCase() === filterSender.toLowerCase()
        : true;
      return statusMatch && vendorMatch && senderMatch;
    });
  }, [outboundMails, filterStatus, filterVendor, filterSender]);

  const handleViewOutbound = (id: number) => {
    navigate(`/vas/mailroom/inbound/${id}`);
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

  const handleApplyFilters = () => setIsFilterModalOpen(false);
  const handleResetFilters = () => {
    setFilterStatus('');
    setFilterSender('');
    setFilterVendor('');
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
        storageKey="outbound-mail-table"
        className="min-w-full"
        emptyMessage="No outbound mails available"
        leftActions={leftActions}
        enableSearch
        enableSelection={false}
        hideTableExport
        pagination
        pageSize={10}
      />

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
            <h3 className="text-sm font-semibold text-[#C72030] mb-4">Outbound Details</h3>
            <div className="grid grid-cols-3 gap-4">
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
                  Sender
                </Label>
                <Select value={filterSender} onValueChange={setFilterSender}>
                  <SelectTrigger id="sender" className="w-full">
                    <SelectValue placeholder="Select Sender" />
                  </SelectTrigger>
                  <SelectContent>
                    {senderOptions.length ? (
                      senderOptions.map((sender) => (
                        <SelectItem key={sender} value={sender}>
                          {sender}
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
                  Courier Vendor
                </Label>
                <Select value={filterVendor} onValueChange={setFilterVendor}>
                  <SelectTrigger id="vendor" className="w-full">
                    <SelectValue placeholder="Select Vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendorOptions.length ? (
                      vendorOptions.map((vendor) => (
                        <SelectItem key={vendor} value={vendor}>
                          {vendor}
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

