import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Plus, X } from "lucide-react";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import { Badge } from "@/components/ui/badge";
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
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';

interface InboundMail {
    id: number;
    vendorName: string;
    recipientName: string;
    unit: string;
    entity: string;
    type: string;
    department: string;
    sender: string;
    company: string;
    receivedOn: string;
    receivedBy: string;
    status: string;
    ageing: string;
    collectedOn: string;
    collectedBy: string;
    image?: string;
}

const MAIL_INBOUND_LIST_ENDPOINT = '/pms/admin/mail_inbounds.json';

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

const mapInboundRecord = (item: any): InboundMail => ({
    id: item.id,
    vendorName: item.delivery_vendor?.name || item.vendor_name || '-',
    recipientName: item.user?.full_name || item.recipient_name || '-',
    unit:
        item.unit ||
        item.unit_name ||
        item.unit_label ||
        item.unit_number ||
        '-',
    entity:
        item.entity ||
        item.entity_name ||
        item.entity_label ||
        item.resource_type ||
        '-',
    type:
        item.type ||
        item.mail_items?.[0]?.item_type ||
        item.item_type ||
        item.packages_with_quantity?.split(' ')?.slice(1)?.join(' ') ||
        '-',
    department: item.department || item.department_name || '-',
    sender: item.sender_name || '-',
    company: item.sender_company || '-',
    receivedOn: formatDate(item.receive_date || item.recieved_on),
    receivedBy: item.received_by || item.recieved_by || item.received_by_name || '-',
    status: formatStatus(item.status),
    ageing:
        item.ageing !== undefined
            ? String(item.ageing)
            : item.aging !== undefined
                ? String(item.aging)
                : '',
    collectedOn: formatDate(item.collected_on),
    collectedBy: item.collected_by || item.collected_by_name || '',
    image: item.attachments?.[0]?.document_url || item.attachments?.[0]?.document?.url,
});

export const InboundListPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [inboundMails, setInboundMails] = useState<InboundMail[]>([]);
    const [showActionPanel, setShowActionPanel] = useState(false);
    const [loading, setLoading] = useState(false);

    // Filter modal state
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterVendor, setFilterVendor] = useState('');
    const [filterReceivedOn, setFilterReceivedOn] = useState('');
    const [filterCollectedOn, setFilterCollectedOn] = useState('');

    useEffect(() => {
        const fetchInboundMails = async () => {
            setLoading(true);
            try {
                const response = await fetch(getFullUrl(MAIL_INBOUND_LIST_ENDPOINT), {
                    method: 'GET',
                    headers: {
                        'Authorization': getAuthHeader(),
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch inbound mails');
                }

                const data = await response.json();
                const records = Array.isArray(data?.mail_inbounds)
                    ? data.mail_inbounds
                    : Array.isArray(data)
                        ? data
                        : data?.data || [];

                const mapped = records.map(mapInboundRecord);
                setInboundMails(mapped);
            } catch (error) {
                console.error('Error fetching inbound mails:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load inbound mails',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };
        fetchInboundMails();
    }, [toast]);

    const statusOptions = useMemo(() => {
        const uniqueStatuses = new Set(
            inboundMails
                .map(mail => mail.status)
                .filter((status): status is string => Boolean(status))
        );

        if (!uniqueStatuses.size) {
            ['Collected', 'Overdue', 'Pending'].forEach(status => uniqueStatuses.add(status));
        }

        return Array.from(uniqueStatuses);
    }, [inboundMails]);

    const vendorOptions = useMemo(() => {
        const uniqueVendors = new Set(
            inboundMails
                .map(mail => mail.vendorName)
                .filter((vendor): vendor is string => Boolean(vendor && vendor !== '-'))
        );
        return Array.from(uniqueVendors);
    }, [inboundMails]);

    const receivedDateOptions = useMemo(() => {
        const uniqueDates = new Set(
            inboundMails
                .map(mail => mail.receivedOn)
                .filter((date): date is string => Boolean(date))
        );
        return Array.from(uniqueDates);
    }, [inboundMails]);

    const collectedDateOptions = useMemo(() => {
        const uniqueDates = new Set(
            inboundMails
                .map(mail => mail.collectedOn)
                .filter((date): date is string => Boolean(date))
        );
        return Array.from(uniqueDates);
    }, [inboundMails]);

    const filteredInboundMails = useMemo(() => {
        return inboundMails.filter(mail => {
            const matchesStatus = filterStatus
                ? mail.status.toLowerCase() === filterStatus.toLowerCase()
                : true;
            const matchesVendor = filterVendor
                ? mail.vendorName.toLowerCase() === filterVendor.toLowerCase()
                : true;
            const matchesReceivedOn = filterReceivedOn
                ? mail.receivedOn === filterReceivedOn
                : true;
            const matchesCollectedOn = filterCollectedOn
                ? mail.collectedOn === filterCollectedOn
                : true;

            return matchesStatus && matchesVendor && matchesReceivedOn && matchesCollectedOn;
        });
    }, [inboundMails, filterStatus, filterVendor, filterReceivedOn, filterCollectedOn]);

    const handleViewInbound = (id: number) => {
        // Navigate to view/edit page
        navigate(`/vas/mailroom/inbound/${id}`);
    };

    const columns: ColumnConfig[] = [
        {
            key: 'view',
            label: 'View',
            sortable: false,
            draggable: false,
        },
        {
            key: 'id',
            label: 'ID',
            sortable: true,
            draggable: true,
        },
        {
            key: 'vendorName',
            label: 'Vendor Name',
            sortable: true,
            draggable: true,
        },
        {
            key: 'recipientName',
            label: 'Recipient Name',
            sortable: true,
            draggable: true,
        },
        {
            key: 'unit',
            label: 'Unit',
            sortable: true,
            draggable: true,
        },
        {
            key: 'entity',
            label: 'Entity',
            sortable: true,
            draggable: true,
        },
        {
            key: 'type',
            label: 'Type',
            sortable: true,
            draggable: true,
        },
        {
            key: 'department',
            label: 'Department',
            sortable: true,
            draggable: true,
        },
        {
            key: 'sender',
            label: 'Sender',
            sortable: true,
            draggable: true,
        },
        {
            key: 'company',
            label: 'Company',
            sortable: true,
            draggable: true,
        },
        {
            key: 'receivedOn',
            label: 'Received On',
            sortable: true,
            draggable: true,
        },
        {
            key: 'receivedBy',
            label: 'Received By',
            sortable: true,
            draggable: true,
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            draggable: true,
        },
        {
            key: 'ageing',
            label: 'Ageing',
            sortable: true,
            draggable: true,
        },
        {
            key: 'collectedOn',
            label: 'Collected On',
            sortable: true,
            draggable: true,
        },
        {
            key: 'collectedBy',
            label: 'Collected By',
            sortable: true,
            draggable: true,
        },
    ];

    const renderCell = (item: InboundMail, columnKey: string) => {
        if (columnKey === 'view') {
            return (
                <button
                    onClick={() => handleViewInbound(item.id)}
                    className="text-stone-800"
                >
                    <Eye className="w-5 h-5" />
                </button>
            );
        }

        if (columnKey === 'status') {
            const statusColors: { [key: string]: string } = {
                'Collected': 'bg-green-100 text-green-800',
                'Overdue': 'bg-red-100 text-red-800',
                'Pending': 'bg-yellow-100 text-yellow-800',
            };

            return (
                <Badge className={`${statusColors[item.status] || 'bg-gray-100 text-gray-800'} hover:${statusColors[item.status] || 'bg-gray-100'}`}>
                    {item.status}
                </Badge>
            );
        }

        if (columnKey === 'ageing') {
            return item.ageing || '';
        }

        return item[columnKey as keyof InboundMail]?.toString() || '';
    };

    const handleApplyFilters = () => {
        setIsFilterModalOpen(false);
    };

    const handleResetFilters = () => {
        setFilterStatus('');
        setFilterVendor('');
        setFilterReceivedOn('');
        setFilterCollectedOn('');
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

    return (
        <div className="p-[30px]">
            {showActionPanel && (
                <SelectionPanel
                    onAdd={() => navigate("/vas/mailroom/inbound/create")}
                    onClearSelection={() => setShowActionPanel(false)}
                />
            )}

            <EnhancedTable
                loading={loading}
                data={filteredInboundMails}
                columns={columns}
                renderCell={renderCell}
                onFilterClick={() => setIsFilterModalOpen(true)}
                storageKey="inbound-mail-table"
                className="min-w-full"
                emptyMessage="No inbound mails available"
                leftActions={leftActions}
                enableSearch={true}
                enableSelection={false}
                hideTableExport={true}
                pagination={true}
                pageSize={10}
            />

            {/* Filter Modal */}
            <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
                        <button
                            onClick={() => setIsFilterModalOpen(false)}
                            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </button>
                    </DialogHeader>
                    <div className="py-4">
                        <h3 className="text-sm font-semibold text-[#C72030] mb-4">Asset Details</h3>
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
                                <Label htmlFor="vendor" className="text-sm font-medium">
                                    Select Vendor
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
                            <div className="space-y-2">
                                <Label htmlFor="receivedOn" className="text-sm font-medium">
                                    Received On
                                </Label>
                                <Select value={filterReceivedOn} onValueChange={setFilterReceivedOn}>
                                    <SelectTrigger id="receivedOn" className="w-full">
                                        <SelectValue placeholder="Select Received On" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {receivedDateOptions.length ? (
                                            receivedDateOptions.map((date) => (
                                                <SelectItem key={date} value={date}>
                                                    {date}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="no-received-date" disabled>
                                                No dates available
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="collectedOn" className="text-sm font-medium">
                                    Collected On
                                </Label>
                                <Select value={filterCollectedOn} onValueChange={setFilterCollectedOn}>
                                    <SelectTrigger id="collectedOn" className="w-full">
                                        <SelectValue placeholder="Select Received On" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {collectedDateOptions.length ? (
                                            collectedDateOptions.map((date) => (
                                                <SelectItem key={date} value={date}>
                                                    {date}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="no-collected-date" disabled>
                                                No dates available
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            onClick={handleResetFilters}
                            variant="outline"
                            className="px-6"
                        >
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
