import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Filter, X } from "lucide-react";
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

export const InboundListPage = () => {
    const navigate = useNavigate();
    const [inboundMails, setInboundMails] = useState<InboundMail[]>([]);
    const [showActionPanel, setShowActionPanel] = useState(false);
    const [loading, setLoading] = useState(false);

    // Filter modal state
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterVendor, setFilterVendor] = useState('');
    const [filterReceivedOn, setFilterReceivedOn] = useState('');
    const [filterCollectedOn, setFilterCollectedOn] = useState('');

    // Mock data - Replace with actual API call
    useEffect(() => {
        const fetchInboundMails = async () => {
            setLoading(true);
            try {
                // Simulating API call
                const mockData: InboundMail[] = [
                    {
                        id: 780,
                        vendorName: "Magic Enterprise",
                        recipientName: "Sony Bhoite",
                        unit: "Unit A",
                        entity: "Entity 1",
                        type: "Mail",
                        department: "Function 3",
                        sender: "Vinayak",
                        company: "Test",
                        receivedOn: "16/04/2025",
                        receivedBy: "Vinayak Mane",
                        status: "Collected",
                        ageing: "",
                        collectedOn: "16/04/2025",
                        collectedBy: "Vinayak Mane",
                        image: ""
                    },
                    {
                        id: 779,
                        vendorName: "Bluedart",
                        recipientName: "Adhip Shetty",
                        unit: "Unit B",
                        entity: "Entity 2",
                        type: "Mail",
                        department: "Operations",
                        sender: "Vinayak",
                        company: "Heaven",
                        receivedOn: "16/04/2025",
                        receivedBy: "Vinayak Mane",
                        status: "Overdue",
                        ageing: "58",
                        collectedOn: "",
                        collectedBy: "",
                        image: ""
                    },
                    {
                        id: 737,
                        vendorName: "Bluedart",
                        recipientName: "Vinayak Mane",
                        unit: "Unit A",
                        entity: "Entity 1",
                        type: "Mail",
                        department: "Function 1",
                        sender: "Utsed",
                        company: "test",
                        receivedOn: "28/03/2025",
                        receivedBy: "Vinayak Mane",
                        status: "Collected",
                        ageing: "",
                        collectedOn: "28/03/2025",
                        collectedBy: "Vinayak Mane",
                        image: ""
                    },
                    {
                        id: 736,
                        vendorName: "Bluedart",
                        recipientName: "Vinayak Mane",
                        unit: "Unit C",
                        entity: "Entity 3",
                        type: "Mail",
                        department: "Function 1",
                        sender: "Netra",
                        company: "1234567bhargd",
                        receivedOn: "20/03/2025",
                        receivedBy: "Vinayak Mane",
                        status: "Collected",
                        ageing: "",
                        collectedOn: "28/03/2025",
                        collectedBy: "Vinayak Mane",
                        image: ""
                    },
                    {
                        id: 735,
                        vendorName: "Prathmesh",
                        recipientName: "Vinayak Mane",
                        unit: "Unit A",
                        entity: "Entity 1",
                        type: "Consumer Goods",
                        department: "Function 1",
                        sender: "Sony",
                        company: "Locktaad",
                        receivedOn: "27/03/2025",
                        receivedBy: "Vinayak Mane",
                        status: "Collected",
                        ageing: "",
                        collectedOn: "27/03/2025",
                        collectedBy: "Vinayak Mane",
                        image: ""
                    }
                ];
                setInboundMails(mockData);
            } catch (error) {
                console.error('Error fetching inbound mails:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInboundMails();
    }, []);

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

        if (columnKey === 'ageing' && item.ageing) {
            return (
                <Badge variant="outline" className="text-red-600 border-red-600">
                    {item.ageing}
                </Badge>
            );
        }

        return item[columnKey as keyof InboundMail]?.toString() || '';
    };

    const handleApplyFilters = () => {
        // TODO: Implement filter logic
        console.log('Applying filters:', {
            status: filterStatus,
            vendor: filterVendor,
            receivedOn: filterReceivedOn,
            collectedOn: filterCollectedOn
        });
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
                data={inboundMails}
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
                                        <SelectItem value="collected">Collected</SelectItem>
                                        <SelectItem value="overdue">Overdue</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
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
                                        <SelectItem value="bluedart">Bluedart</SelectItem>
                                        <SelectItem value="magic">Magic Enterprise</SelectItem>
                                        <SelectItem value="prathmesh">Prathmesh</SelectItem>
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
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="yesterday">Yesterday</SelectItem>
                                        <SelectItem value="last7days">Last 7 Days</SelectItem>
                                        <SelectItem value="last30days">Last 30 Days</SelectItem>
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
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="yesterday">Yesterday</SelectItem>
                                        <SelectItem value="last7days">Last 7 Days</SelectItem>
                                        <SelectItem value="last30days">Last 30 Days</SelectItem>
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
