import { Fragment, useEffect, useMemo, useState } from "react";
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getFullUrl, getAuthHeader, API_CONFIG } from '@/config/apiConfig';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationLink,
    PaginationEllipsis,
} from "@/components/ui/pagination";

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

const formatDateForApi = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
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
        (item.ageing !== undefined && item.ageing !== null)
            ? String(item.ageing)
            : (item.aging !== undefined && item.aging !== null)
                ? String(item.aging)
                : '-',
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
    const [currentPage, setCurrentPage] = useState(1);
    const PER_PAGE = 10;
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    // Filter modal state
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterVendor, setFilterVendor] = useState('');
    const [filterReceivedOn, setFilterReceivedOn] = useState('');
    const [filterCollectedOn, setFilterCollectedOn] = useState('');

    // Applied filters (only update when Apply is clicked)
    const [appliedFilterStatus, setAppliedFilterStatus] = useState('');
    const [appliedFilterVendor, setAppliedFilterVendor] = useState('');
    const [appliedFilterReceivedOn, setAppliedFilterReceivedOn] = useState('');
    const [appliedFilterCollectedOn, setAppliedFilterCollectedOn] = useState('');

    // Vendors from API
    const [vendors, setVendors] = useState<Array<{ id: number; name: string }>>([]);
    const [isLoadingVendors, setIsLoadingVendors] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchInboundMails = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    page: currentPage.toString(),
                    per_page: PER_PAGE.toString(),
                });

                if (appliedFilterStatus) {
                    queryParams.append('q[status_eq]', appliedFilterStatus.toLowerCase());
                }
                if (appliedFilterVendor) {
                    queryParams.append('q[delivery_vendor_id_eq]', appliedFilterVendor);
                }
                if (appliedFilterReceivedOn) {
                    queryParams.append('q[receive_date_eq]', formatDateForApi(appliedFilterReceivedOn));
                }
                if (appliedFilterCollectedOn) {
                    queryParams.append('q[collected_on_eq]', formatDateForApi(appliedFilterCollectedOn));
                }
                if (searchQuery) {
                    queryParams.append('q[search_all_fields_cont]', searchQuery);
                }

                const response = await fetch(`${getFullUrl(MAIL_INBOUND_LIST_ENDPOINT)}?${queryParams.toString()}`, {
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
                    (currentPage - 1) * PER_PAGE + mapped.length;

                const derivedTotalPages =
                    paginationInfo.total_pages ??
                    Math.max(1, Math.ceil(totalCount / PER_PAGE));

                setTotalRecords(totalCount);
                setTotalPages(derivedTotalPages);
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
    }, [toast, currentPage, appliedFilterStatus, appliedFilterVendor, appliedFilterReceivedOn, appliedFilterCollectedOn, searchQuery]);

    // Fetch vendors when filter modal opens
    useEffect(() => {
        const fetchVendors = async () => {
            if (!isFilterModalOpen) return;

            setIsLoadingVendors(true);
            try {
                const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.DELIVERY_VENDORS), {
                    method: 'GET',
                    headers: {
                        'Authorization': getAuthHeader(),
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch vendors');
                }

                const data = await response.json();
                setVendors(data.delivery_vendors || data || []);
            } catch (error) {
                console.error('Error fetching vendors:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load vendors',
                    variant: 'destructive',
                });
            } finally {
                setIsLoadingVendors(false);
            }
        };

        fetchVendors();
    }, [isFilterModalOpen, toast]);

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
        return inboundMails;
    }, [inboundMails]);

    const pageNumbers = useMemo(() => {
        const pages = new Set<number>();
        const addPage = (page: number) => {
            if (page >= 1 && page <= totalPages) {
                pages.add(page);
            }
        };

        addPage(1);
        addPage(totalPages);
        addPage(currentPage - 1);
        addPage(currentPage);
        addPage(currentPage + 1);

        return Array.from(pages).sort((a, b) => a - b);
    }, [currentPage, totalPages]);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        setCurrentPage(page);
    };

    const startRecord =
        totalRecords === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1;
    const endRecord =
        totalRecords === 0 ? 0 : startRecord + filteredInboundMails.length - 1;

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
        setAppliedFilterStatus(filterStatus);
        setAppliedFilterVendor(filterVendor);
        setAppliedFilterReceivedOn(filterReceivedOn);
        setAppliedFilterCollectedOn(filterCollectedOn);
        setIsFilterModalOpen(false);
    };

    const handleResetFilters = () => {
        setFilterStatus('');
        setFilterVendor('');
        setFilterReceivedOn('');
        setFilterCollectedOn('');
        setAppliedFilterStatus('');
        setAppliedFilterVendor('');
        setAppliedFilterReceivedOn('');
        setAppliedFilterCollectedOn('');
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
                onSearch={(query) => {
                    setSearchQuery(query);
                    setCurrentPage(1); // Reset to first page on search
                }}
                storageKey="inbound-mail-table"
                className="min-w-full"
                emptyMessage="No inbound mails available"
                leftActions={leftActions}
                enableSearch={true}
                enableSelection={false}
                hideTableExport={true}
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
                            <div className="space-y-2">
                                <Label htmlFor="receivedOn" className="text-sm font-medium">
                                    Received On
                                </Label>
                                <Input
                                    id="receivedOn"
                                    type="date"
                                    value={filterReceivedOn}
                                    onChange={(e) => setFilterReceivedOn(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="collectedOn" className="text-sm font-medium">
                                    Collected On
                                </Label>
                                <Input
                                    id="collectedOn"
                                    type="date"
                                    value={filterCollectedOn}
                                    onChange={(e) => setFilterCollectedOn(e.target.value)}
                                    className="w-full"
                                />
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
