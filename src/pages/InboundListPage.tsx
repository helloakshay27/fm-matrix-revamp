import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Plus, X, Flag, Check } from "lucide-react";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import { InboundSelectionPanel } from "@/components/InboundSelectionPanel";
import { InboundStats } from "@/components/InboundStats";
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

    // Stats state
    const [stats, setStats] = useState({ receives: 0, collected: 0, overdue: 0 });

    // Selection and action modal state
    const [selectedMails, setSelectedMails] = useState<number[]>([]);
    // const [isActionModalOpen, setIsActionModalOpen] = useState(false); // Removed in favor of panel

    // Delegate modal state
    const [isDelegateModalOpen, setIsDelegateModalOpen] = useState(false);
    const [selectedDelegateEmployee, setSelectedDelegateEmployee] = useState('');
    const [delegateReason, setDelegateReason] = useState('');
    const [delegateEmployees, setDelegateEmployees] = useState<Array<{ id: number; full_name: string }>>([]);
    const [isLoadingDelegateEmployees, setIsLoadingDelegateEmployees] = useState(false);
    const [isDelegatingPackage, setIsDelegatingPackage] = useState(false);

    // Collect modal state
    const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
    const [selectedCollectEmployee, setSelectedCollectEmployee] = useState('');
    const [passcode, setPasscode] = useState('');
    const [collectEmployees, setCollectEmployees] = useState<Array<{ id: number; full_name: string }>>([]);
    const [isLoadingCollectEmployees, setIsLoadingCollectEmployees] = useState(false);
    const [isCollectingPackage, setIsCollectingPackage] = useState(false);

    // Flag state (stored in localStorage)
    const [flaggedMails, setFlaggedMails] = useState<number[]>(() => {
        const stored = localStorage.getItem('flaggedInboundMails');
        return stored ? JSON.parse(stored) : [];
    });

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

    // Calculate stats whenever inboundMails changes
    useEffect(() => {
        const receives = inboundMails.filter(m => m.status.toLowerCase() !== 'collected').length;
        const collected = inboundMails.filter(m => m.status.toLowerCase() === 'collected').length;
        const overdue = inboundMails.filter(m => m.status.toLowerCase() === 'overdue').length;
        setStats({ receives, collected, overdue });
    }, [inboundMails]);

    // Save flagged mails to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('flaggedInboundMails', JSON.stringify(flaggedMails));
    }, [flaggedMails]);

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
            key: 'actions',
            label: 'Actions',
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
        {
            key: 'flag',
            label: 'Flag',
            sortable: false,
            draggable: false,
        },
    ];

    const renderCell = (item: InboundMail, columnKey: string) => {
        if (columnKey === 'actions') {
            return (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleViewInbound(item.id)}
                        className="text-stone-800 hover:text-[#C72030] transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <div title="Flag Mail">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFlag(item.id);
                            }}
                            className={`${flaggedMails.includes(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'} hover:text-[#C72030] transition-colors cursor-pointer`}
                        >
                            <Flag className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            );
        }

        if (columnKey === 'flag') {
            const isFlagged = flaggedMails.includes(item.id);
            return (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFlag(item.id);
                    }}
                    className={`${isFlagged ? 'text-red-500' : 'text-gray-400'} hover:scale-110 transition-transform`}
                >
                    <Flag className="w-5 h-5" fill={isFlagged ? 'currentColor' : 'none'} />
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

    // Handle flag toggle
    const handleToggleFlag = (id: number) => {
        setFlaggedMails(prev => {
            if (prev.includes(id)) {
                return prev.filter(mailId => mailId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    // Handle checkbox change
    const handleCheckboxChange = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedMails([id]); // Enforce single selection
        } else {
            setSelectedMails([]);
        }
    };

    // Fetch delegate employees
    const fetchDelegateEmployees = async () => {
        if (selectedMails.length === 0) return;
        setIsLoadingDelegateEmployees(true);
        try {
            const params = new URLSearchParams();
            params.append('id', selectedMails[0].toString());
            const response = await fetch(
                `${getFullUrl('/pms/admin/mail_inbounds/employee_list.json')}?${params.toString()}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': getAuthHeader(),
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (!response.ok) {
                throw new Error('Failed to load employees');
            }

            const data = await response.json();
            setDelegateEmployees(data.users || data || []);
        } catch (error) {
            console.error('Employee list fetch failed:', error);
            toast({
                title: 'Error',
                description: 'Unable to load employees',
                variant: 'destructive',
            });
        } finally {
            setIsLoadingDelegateEmployees(false);
        }
    };

    // Fetch collect employees
    const fetchCollectEmployees = async () => {
        if (selectedMails.length === 0) return;
        setIsLoadingCollectEmployees(true);
        try {
            const params = new URLSearchParams();
            params.append('id', selectedMails[0].toString());
            const response = await fetch(
                `${getFullUrl('/pms/admin/mail_inbounds/employee_list.json')}?${params.toString()}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': getAuthHeader(),
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (!response.ok) {
                throw new Error('Failed to load employees');
            }

            const data = await response.json();
            setCollectEmployees(data.users || data || []);
        } catch (error) {
            console.error('Employee list fetch failed:', error);
            toast({
                title: 'Error',
                description: 'Unable to load employees',
                variant: 'destructive',
            });
        } finally {
            setIsLoadingCollectEmployees(false);
        }
    };

    // Handle delegate package (from action modal)
    const handleDelegatePackageAction = () => {
        setSelectedDelegateEmployee('');
        setDelegateReason('');
        setIsDelegateModalOpen(true);
        fetchDelegateEmployees();
    };

    // Handle mark as collected (from action modal)
    const handleMarkAsCollectedAction = () => {
        setSelectedCollectEmployee('');
        setPasscode('');
        setIsCollectModalOpen(true);
        fetchCollectEmployees();
    };

    // Submit delegate package
    const handleSubmitDelegate = async () => {
        if (!selectedDelegateEmployee) {
            toast({
                title: 'Error',
                description: 'Please select an employee',
                variant: 'destructive',
            });
            return;
        }
        if (!delegateReason) {
            toast({
                title: 'Error',
                description: 'Please select a reason',
                variant: 'destructive',
            });
            return;
        }
        if (selectedMails.length === 0) {
            toast({
                title: 'Error',
                description: 'No mail selected',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsDelegatingPackage(true);
            const mailId = selectedMails[0];
            const response = await fetch(
                getFullUrl(`/pms/admin/mail_inbounds/${mailId}.json`),
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': getAuthHeader(),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        mail_inbound: {
                            delegate_id: selectedDelegateEmployee,
                            delegate_reason: delegateReason,
                        },
                    }),
                },
            );

            const responseData = await response.json().catch(() => ({}));

            if (!response.ok) {
                const message = responseData?.message || 'Failed to delegate package';
                toast({
                    title: 'Error',
                    description: message,
                    variant: 'destructive',
                });
                throw new Error(message);
            }

            toast({
                title: 'Success',
                description: responseData?.message || 'Package delegated successfully',
            });
            setIsDelegateModalOpen(false);
            setSelectedDelegateEmployee('');
            setDelegateReason('');
            setSelectedMails([]);
            // Refresh the list
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

                    if (response.ok) {
                        const data = await response.json();
                        const records = Array.isArray(data?.mail_inbounds)
                            ? data.mail_inbounds
                            : Array.isArray(data)
                                ? data
                                : data?.data || [];

                        const mapped = records.map(mapInboundRecord);
                        setInboundMails(mapped);
                    }
                } catch (error) {
                    console.error('Error fetching inbound mails:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchInboundMails();
        } catch (error) {
            console.error('Delegate package failed:', error);
        } finally {
            setIsDelegatingPackage(false);
        }
    };

    // Submit collect package
    const handleSubmitCollect = async () => {
        if (!selectedCollectEmployee) {
            toast({
                title: 'Error',
                description: 'Please select an employee',
                variant: 'destructive',
            });
            return;
        }
        const trimmedPasscode = passcode.trim();
        if (!trimmedPasscode) {
            toast({
                title: 'Error',
                description: 'Please enter passcode',
                variant: 'destructive',
            });
            return;
        }
        if (!/^\d{6}$/.test(trimmedPasscode)) {
            toast({
                title: 'Error',
                description: 'Passcode must be a 6-digit number',
                variant: 'destructive',
            });
            return;
        }
        if (selectedMails.length === 0) {
            toast({
                title: 'Error',
                description: 'No mail selected',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsCollectingPackage(true);
            const mailId = selectedMails[0];
            const response = await fetch(
                getFullUrl(`/pms/admin/mail_inbounds/${mailId}/collect_package.json`),
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': getAuthHeader(),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        collected_by_id: selectedCollectEmployee,
                        passcode: trimmedPasscode,
                    }),
                },
            );

            const responseData = await response.json().catch(() => ({}));

            if (!response.ok) {
                const message =
                    responseData?.message || 'Failed to mark as collected';
                toast({
                    title: 'Error',
                    description: message,
                    variant: 'destructive',
                });
                throw new Error(message);
            }

            if (
                responseData?.message &&
                responseData.message.toLowerCase().includes('passcode')
            ) {
                toast({
                    title: 'Error',
                    description: responseData.message,
                    variant: 'destructive',
                });
                return;
            }

            toast({
                title: 'Success',
                description: responseData?.message || 'Package marked as collected',
            });
            setIsCollectModalOpen(false);
            setPasscode('');
            setSelectedCollectEmployee('');
            setSelectedMails([]);
            // Refresh the list
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

                    if (response.ok) {
                        const data = await response.json();
                        const records = Array.isArray(data?.mail_inbounds)
                            ? data.mail_inbounds
                            : Array.isArray(data)
                                ? data
                                : data?.data || [];

                        const mapped = records.map(mapInboundRecord);
                        setInboundMails(mapped);
                    }
                } catch (error) {
                    console.error('Error fetching inbound mails:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchInboundMails();
        } catch (error) {
            console.error('Collect package failed:', error);
        } finally {
            setIsCollectingPackage(false);
        }
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
            {/* Stats Cards */}
            <InboundStats stats={stats} />

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
                enableSelection={true}
                selectable={true}
                getItemId={(item) => item.id.toString()}
                onSelectItem={(id: string, checked: boolean) => {
                    const numId = parseInt(id, 10);
                    if (checked) {
                        setSelectedMails([numId]); // Enforce single selection
                    } else {
                        setSelectedMails([]);
                    }
                }}
                selectedItems={selectedMails.map(id => id.toString())}
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

            {/* Inbound Selection Panel */}
            {selectedMails.length > 0 && (
                <InboundSelectionPanel
                    selectedCount={selectedMails.length}
                    selectedItems={inboundMails
                        .filter(mail => selectedMails.includes(mail.id))
                        .map(mail => ({ id: mail.id, name: mail.recipientName || `Package #${mail.id}` }))
                    }
                    onDelegate={handleDelegatePackageAction}
                    onCollect={handleMarkAsCollectedAction}
                    onClearSelection={() => setSelectedMails([])}
                />
            )}

            {/* Delegate Package Modal */}
            <Dialog open={isDelegateModalOpen} onOpenChange={setIsDelegateModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <DialogTitle className="text-lg font-semibold">DELEGATE PACKAGE</DialogTitle>
                        <button
                            onClick={() => setIsDelegateModalOpen(false)}
                            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </button>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="employee" className="text-sm font-medium">
                                Employee <span className="text-red-500">*</span>
                            </Label>
                            <Select value={selectedDelegateEmployee} onValueChange={setSelectedDelegateEmployee}>
                                <SelectTrigger id="employee" className="w-full">
                                    <SelectValue
                                        placeholder={
                                            isLoadingDelegateEmployees ? 'Loading employees...' : 'Select Employee'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoadingDelegateEmployees ? (
                                        <SelectItem value="loading" disabled>
                                            Loading employees...
                                        </SelectItem>
                                    ) : delegateEmployees.length ? (
                                        delegateEmployees.map((employee) => (
                                            <SelectItem key={employee.id} value={employee.id.toString()}>
                                                {employee.full_name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="no-employees" disabled>
                                            No employees available
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reason" className="text-sm font-medium">
                                Reason <span className="text-red-500">*</span>
                            </Label>
                            <Select value={delegateReason} onValueChange={setDelegateReason}>
                                <SelectTrigger id="reason" className="w-full">
                                    <SelectValue placeholder="Select Reason" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Employee left the role">Employee left the role</SelectItem>
                                    <SelectItem value="Employee is on a meeting">Employee is on a meeting</SelectItem>
                                    <SelectItem value="Employee is on leave">Employee is on leave</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSubmitDelegate}
                            className="bg-[#532D5F] hover:bg-[#532D5F]/90 text-white"
                            disabled={isDelegatingPackage}
                        >
                            <Check className="w-4 h-4 mr-2" />
                            {isDelegatingPackage ? 'Processing...' : 'Delegate Package'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Mark As Collected Modal */}
            <Dialog open={isCollectModalOpen} onOpenChange={setIsCollectModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <DialogTitle className="text-lg font-semibold">COLLECT PACKAGE</DialogTitle>
                        <button
                            onClick={() => setIsCollectModalOpen(false)}
                            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </button>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="collect-employee" className="text-sm font-medium">
                                Employee <span className="text-red-500">*</span>
                            </Label>
                            <Select value={selectedCollectEmployee} onValueChange={setSelectedCollectEmployee}>
                                <SelectTrigger id="collect-employee" className="w-full">
                                    <SelectValue
                                        placeholder={
                                            isLoadingCollectEmployees ? 'Loading employees...' : 'Select Employee'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoadingCollectEmployees ? (
                                        <SelectItem value="loading" disabled>
                                            Loading employees...
                                        </SelectItem>
                                    ) : collectEmployees.length ? (
                                        collectEmployees.map((employee) => (
                                            <SelectItem key={employee.id} value={employee.id.toString()}>
                                                {employee.full_name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="no-employees" disabled>
                                            No employees available
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="passcode" className="text-sm font-medium">
                                Passcode <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="passcode"
                                type="password"
                                placeholder="Enter Passcode"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSubmitCollect}
                            className="bg-[#532D5F] hover:bg-[#532D5F]/90 text-white"
                            disabled={isCollectingPackage}
                        >
                            <Check className="w-4 h-4 mr-2" />
                            {isCollectingPackage ? 'Processing...' : 'Mark as Collected'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
