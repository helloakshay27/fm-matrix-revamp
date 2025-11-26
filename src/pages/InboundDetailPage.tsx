import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, User, FileText, Paperclip, ChevronUp, ChevronDown, LucideIcon, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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
    delegatedTo: string;
    delegatePackageReason: string;
    awbNumber: string;
    mobile: string;
    address: string;
    image?: string;
    attachments?: Array<{
        id: number;
        url: string;
        name: string;
    }>;
}

export const InboundDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [inboundData, setInboundData] = useState<InboundMail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for expandable sections
    const [expandedSections, setExpandedSections] = useState({
        packageDetails: true,
        senderDetails: true,
        logs: true,
        attachments: true,
    });

    // Modal states
    const [isDelegateModalOpen, setIsDelegateModalOpen] = useState(false);
    const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
    const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);

    // Form states for Delegate Package
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [delegateReason, setDelegateReason] = useState('');

    // Form state for Mark As Collected
    const [passcode, setPasscode] = useState('');

    // Form state for Add Attachments
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Helper function to check if value has data
    const hasData = (value: string | undefined | null): boolean => {
        return value !== null && value !== undefined && value !== '';
    };

    useEffect(() => {
        const fetchInboundDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                // TODO: Replace with actual API call
                // Simulating API call with mock data
                const mockData: InboundMail = {
                    id: 779,
                    vendorName: 'Bluedart',
                    recipientName: 'Test1 Login1',
                    unit: '',
                    entity: '',
                    type: 'Mail',
                    department: 'Admin',
                    sender: 'Vinayak',
                    company: 'Heaven',
                    receivedOn: '16/04/2025',
                    receivedBy: 'Vinayak Mane',
                    status: 'Overdue',
                    ageing: '223 days',
                    collectedOn: 'NA',
                    collectedBy: 'NA',
                    delegatedTo: 'NA',
                    delegatePackageReason: 'NA',
                    awbNumber: '?',
                    mobile: '9876543456',
                    address: 'test , Mumbai, Maharashtra, 400017',
                    attachments: []
                };

                setInboundData(mockData);
            } catch (err) {
                setError('Failed to fetch inbound details');
                console.error('Error fetching inbound details:', err);
                toast.error('Failed to load inbound details');
            } finally {
                setLoading(false);
            }
        };

        fetchInboundDetails();
    }, [id]);

    const handleBackToList = () => {
        navigate('/vas/mailroom/inbound');
    };

    const handleAddAttachments = () => {
        setIsAttachmentModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(e.target.files);
        }
    };

    const handleSubmitAttachments = () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            toast.error('Please select at least one file');
            return;
        }

        // TODO: Implement API call to upload attachments
        toast.success('Attachments uploaded successfully');
        setIsAttachmentModalOpen(false);
        setSelectedFiles(null);
    };

    const handleDelegatePackage = () => {
        setIsDelegateModalOpen(true);
    };

    const handleMarkAsCollected = () => {
        setIsCollectModalOpen(true);
    };

    const handleSubmitDelegate = () => {
        if (!selectedEmployee) {
            toast.error('Please select an employee');
            return;
        }
        if (!delegateReason) {
            toast.error('Please select a reason');
            return;
        }

        // TODO: Implement API call to delegate package
        toast.success('Package delegated successfully');
        setIsDelegateModalOpen(false);
        setSelectedEmployee('');
        setDelegateReason('');
    };

    const handleSubmitCollect = () => {
        if (!passcode) {
            toast.error('Please enter passcode');
            return;
        }

        // TODO: Implement API call to mark as collected
        toast.success('Package marked as collected');
        setIsCollectModalOpen(false);
        setPasscode('');
    };

    if (loading) {
        return (
            <div className="p-6 bg-white min-h-screen">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading inbound details...</div>
                </div>
            </div>
        );
    }

    if (error || !inboundData) {
        return (
            <div className="p-6 bg-white min-h-screen">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-red-600">{error || 'Inbound mail not found'}</div>
                </div>
            </div>
        );
    }

    // Expandable Section Component
    const ExpandableSection = ({
        title,
        icon: Icon,
        isExpanded,
        onToggle,
        children,
        hasData = true
    }: {
        title: string;
        icon: LucideIcon;
        isExpanded: boolean;
        onToggle: () => void;
        children: React.ReactNode;
        hasData?: boolean;
    }) => (
        <div className="bg-transparent border-none shadow-none rounded-lg mb-6">
            <div
                onClick={onToggle}
                className="figma-card-header flex items-center justify-between cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div className="figma-card-icon-wrapper">
                        <Icon className="figma-card-icon" />
                    </div>
                    <h3 className="figma-card-title uppercase">
                        {title}
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    {!hasData && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">No data</span>
                    )}
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                </div>
            </div>
            {isExpanded && (
                <div className="figma-card-content">
                    {children}
                </div>
            )}
        </div>
    );

    return (
        <div className="p-6 bg-white min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <button onClick={handleBackToList} className="flex items-center gap-1 hover:text-[#C72030] transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-bold text-[#1a1a1a]">Mail Inbound List</span>
                    </button>
                    <span>›</span>
                    <span>Inbound Details</span>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a1a1a]">INBOUND DETAILS ({inboundData.id})</h1>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">No. Of Package:</span>
                                <span className="text-sm font-semibold">1</span>
                            </div>
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                {inboundData.status}
                            </Badge>
                            <span className="text-sm text-gray-600">{inboundData.ageing}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={handleAddAttachments}
                            className="bg-[#532D5F] hover:bg-[#532D5F]/90 text-white"
                        >
                            Add Attachments
                        </Button>
                        <Button
                            onClick={handleDelegatePackage}
                            className="bg-[#532D5F] hover:bg-[#532D5F]/90 text-white"
                        >
                            Delegate Package
                        </Button>
                        <Button
                            onClick={handleMarkAsCollected}
                            className="bg-white hover:bg-gray-50 text-[#1a1a1a] border border-gray-300"
                        >
                            Mark As Collected
                        </Button>
                    </div>
                </div>
            </div>

            {/* Package Details Section */}
            <ExpandableSection
                title="PACKAGE DETAILS"
                icon={Package}
                isExpanded={expandedSections.packageDetails}
                onToggle={() => toggleSection('packageDetails')}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Vendor Name</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.vendorName}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Department</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.department}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Collected On</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.collectedOn}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Delegate Package Reason</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.delegatePackageReason}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Recipient Name</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.recipientName}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Received On</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.receivedOn}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Collected By</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.collectedBy}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">AWB Number</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.awbNumber}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Received By</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.receivedBy}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Delegated To</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.delegatedTo}</span>
                        </div>
                    </div>
                </div>
            </ExpandableSection>

            {/* Sender Details Section */}
            <ExpandableSection
                title="SENDER DETAILS"
                icon={User}
                isExpanded={expandedSections.senderDetails}
                onToggle={() => toggleSection('senderDetails')}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Sender</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.sender}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Company</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.company}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Mobile</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.mobile}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Address</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.address}</span>
                        </div>
                    </div>
                </div>
            </ExpandableSection>

            {/* Logs Section */}
            <ExpandableSection
                title="LOGS"
                icon={FileText}
                isExpanded={expandedSections.logs}
                onToggle={() => toggleSection('logs')}
            >
                <div className="space-y-4">
                    <div className="bg-[#FFF9F0] border-l-4 border-[#F97316] p-4 rounded">
                        <div className="flex items-start gap-3">
                            <div className="flex-1">
                                <p className="text-sm text-gray-700">Package is marked as Overdue.</p>
                                <p className="text-xs text-gray-500 mt-1">17 Apr, 2025, 3:00 PM</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#F0F9FF] border-l-4 border-[#3B82F6] p-4 rounded">
                        <div className="flex items-start gap-3">
                            <div className="flex-1">
                                <p className="text-sm text-gray-700">Vinayak Mane created an inbound package successfully.</p>
                                <p className="text-xs text-gray-500 mt-1">16 Apr, 2025, 2:58 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ExpandableSection>

            {/* Attachments Section */}
            <ExpandableSection
                title="Attachments"
                icon={Paperclip}
                isExpanded={expandedSections.attachments}
                onToggle={() => toggleSection('attachments')}
                hasData={inboundData.attachments && inboundData.attachments.length > 0}
            >
                {inboundData.attachments && inboundData.attachments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {inboundData.attachments.map((attachment) => (
                            <div key={attachment.id} className="border rounded-lg p-4 flex items-center gap-3">
                                <FileText className="w-8 h-8 text-gray-400" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-sm text-gray-500">1 Attachment</p>
                        <div className="mt-4 border rounded-lg p-8 inline-block">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto" />
                        </div>
                    </div>
                )}
            </ExpandableSection>

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
                            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                                <SelectTrigger id="employee" className="w-full">
                                    <SelectValue placeholder="Select Employee" className="text-red-500" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="employee1">Employee 1</SelectItem>
                                    <SelectItem value="employee2">Employee 2</SelectItem>
                                    <SelectItem value="employee3">Employee 3</SelectItem>
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
                                    <SelectItem value="unavailable">Recipient Unavailable</SelectItem>
                                    <SelectItem value="authorized">Authorized Person</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSubmitDelegate}
                            className="bg-[#532D5F] hover:bg-[#532D5F]/90 text-white"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Delegate Package
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
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Mark as Collected
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add Attachments Modal */}
            <Dialog open={isAttachmentModalOpen} onOpenChange={setIsAttachmentModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <DialogTitle className="text-lg font-semibold">Add Attachments</DialogTitle>
                        <button
                            onClick={() => setIsAttachmentModalOpen(false)}
                            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </button>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="attachment" className="text-sm font-medium">
                                Attachment
                            </Label>
                            <div className="relative">
                                <Input
                                    id="attachment"
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-transparent file:text-[#C72030] hover:file:bg-gray-50"
                                />
                                {selectedFiles && selectedFiles.length > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {selectedFiles.length} file(s) selected
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSubmitAttachments}
                            className="bg-[#532D5F] hover:bg-[#532D5F]/90 text-white"
                        >
                            Submit
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
