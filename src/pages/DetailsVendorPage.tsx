import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vendorService } from '@/services/vendorService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TextField, Grid } from '@mui/material';
import { Building, FileText, Landmark, ShieldCheck, User, ArrowLeft } from 'lucide-react';

// Define the types for the vendor data based on the provided JSON
interface Contact {
    name: string;
    email: string;
    phone: string;
}

interface BankInformation {
    account_name: string;
    bank_name: string;
    account_number: string;
    ifsc_code: string;
}

interface AuditScore {
    report_id: string;
    vendor_name: string;
    audit_name: string;
    date_time: string;
    conducted_by: string;
    total_score: number;
    evaluation_score: string;
    percentage: number;
}

interface Attachment {
    document_name: string;
    document_submitted: string;
    status: string;
    upload_date: string;
    comments: string;
    file_url: string;
    // Added a category to distinguish different attachment types
    category: string; 
}

interface Vendor {
    id: number;
    first_name: string | null;
    last_name: string | null;
    company_name: string;
    email: string;
    mobile1: string;
    mobile2: string;
    secondary_emails: string | null;
    secondary_phone: string | null;
    pan_number: string;
    gstin_number: string;
    supplier_type: string | null;
    country: string;
    state: string;
    city: string;
    pincode: string;
    address: string;
    address2: string;
    service_description: string | null;
    signed_on_contract: string | null;
    account_name: string;
    account_number: string;
    bank_branch_name: string;
    ifsc_code: string;
    services: { id: number; service_name: string; service_id: number }[];
    contacts: Contact[];
    audit_scores: AuditScore[];
    attachments: Attachment[];
    tan_attachments: Attachment[];
    pan_attachments: Attachment[];
    gst_attachments: Attachment[];
    kyc_attachments: Attachment[];
    other_attachments: Attachment[];
    compliance_attachments: Attachment[];
    cancle_checque: Attachment[];
    financial_summary: {
        po_total_amount: number;
        po_paid_amount: number;
        po_outstanding_amount: number;
        grn_total_amount: number;
        grn_paid_amount: number;
        grn_outstanding_amount: number;
        wo_total_amount: string;
        wo_paid_amount: number;
        wo_outstanding_amount: string;
        wo_invoice_total_amount: number;
        wo_invoice_paid_amount: number;
        wo_invoice_outstanding_amount: number;
        bills_total_amount: number;
        bills_paid_amount: number;
        bills_outstanding_amount: number;
        total_amount_all: string;
        total_paid_amount_all: number;
        total_outstanding_amount_all: string;
    };
    approval_info: {
        applicable_approval_present: boolean;
        approval_levels: Array<{
            id: number;
            name: string;
            order: number;
            approval_history: {
                status_text: string;
            };
        }>;
        all_level_approved: boolean;
    };
    average_rating: number | null;
}


const DetailsVendorPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [allAttachments, setAllAttachments] = useState<Attachment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("basic");

    useEffect(() => {
        const fetchVendorDetails = async () => {
            if (!id) return;
            setLoading(true);
            try {
                console.log(`Fetching details for vendor ID: ${id}, ${vendorService.getVendorById(id)}`);

                const data = await vendorService.getVendorById(id);
                console.log("Fetched vendor data:", data, JSON.stringify(data));

                const vendorData = data as Vendor;
                console.log(`Fetched vendor details: ${JSON.stringify(vendorData)}`, vendorData);

                setVendor(vendorData);

                // Consolidate all attachments into a single array
                const consolidatedAttachments: Attachment[] = [];
                const attachmentFields: (keyof Vendor)[] = [
                    'attachments', 'tan_attachments', 'pan_attachments', 
                    'gst_attachments', 'kyc_attachments', 'other_attachments', 
                    'compliance_attachments', 'cancle_checque'
                ];

                attachmentFields.forEach(field => {
                    const attachments = vendorData[field] as Attachment[];
                    if (attachments && attachments.length > 0) {
                        consolidatedAttachments.push(...attachments.map(att => ({...att, category: field.replace('_attachments', '').replace('_', ' ') })));
                    }
                });
                setAllAttachments(consolidatedAttachments);

            } catch (err) {
                setError('Failed to fetch vendor details.');
            } finally {
                setLoading(false);
            }
        };

        fetchVendorDetails();
    }, [id]);

    console.log("vendor:-",vendor);
    

    const renderDetailField = (label: string, value: any) => (
        <Grid item xs={12} sm={6} md={4}>
            <TextField
                label={label}
                value={value || 'N/A'}
                InputProps={{ readOnly: true, disableUnderline: true }}
                variant="standard"
                fullWidth
                InputLabelProps={{ shrink: true }}
            />
        </Grid>
    );

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    if (!vendor) {
        return <div className="p-6">No vendor details found.</div>;
    }

    return (
        <div className="p-4 sm:p-6 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 hover:text-gray-800 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Vendor List
                </button>

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                                {vendor?.company_name}
                            </h1>
                        </div>
                        <div className="text-sm text-gray-600">
                            Vendor ID: {vendor?.id} • PAN: {vendor?.pan_number || '--'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <Tabs defaultValue="basic" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch">
                        <TabsTrigger
                            value="basic"
                            className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                        >
                            Basic Information
                        </TabsTrigger>

                        <TabsTrigger
                            value="contacts"
                            className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                        >
                            Contact Persons
                        </TabsTrigger>

                        <TabsTrigger
                            value="bank"
                            className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                        >
                            Bank Information
                        </TabsTrigger>

                        <TabsTrigger
                            value="audits"
                            className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                        >
                            Audits
                        </TabsTrigger>

                        <TabsTrigger
                            value="attachments"
                            className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                        >
                            Attachments
                        </TabsTrigger>

                        <TabsTrigger
                            value="financial"
                            className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                        >
                            Financial Summary
                        </TabsTrigger>

                        <TabsTrigger
                            value="approval"
                            className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                        >
                            Approval Status
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="p-4 sm:p-6">
                        {/* Basic Information */}
                        <Card className="w-full">
                            <CardHeader className="pb-4 lg:pb-6">
                                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                                        <Building className="w-6 h-6" style={{ color: '#C72030' }} />
                                    </div>
                                    <span className="uppercase tracking-wide">Basic Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Company Name</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.company_name || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Contact Person</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.first_name && vendor?.last_name ? `${vendor.first_name} ${vendor.last_name}` : vendor?.first_name || vendor?.last_name || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Primary Email</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.email || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Primary Phone</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.mobile1 || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Secondary Phone</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.mobile2 || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Secondary Email</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.secondary_emails || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">PAN</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.pan_number || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">GST</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.gstin_number || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Supplier Type</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.supplier_type || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Country</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.country || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">State</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.state || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">City</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.city || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Pincode</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.pincode || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Average Rating</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.average_rating ? `${vendor.average_rating}/5` : 'Not Rated'}</span>
                                    </div>
                                    <div className="flex items-start col-span-2">
                                        <span className="text-gray-500 min-w-[140px]">Address Line 1</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.address || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start col-span-2">
                                        <span className="text-gray-500 min-w-[140px]">Address Line 2</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.address2 || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start col-span-2">
                                        <span className="text-gray-500 min-w-[140px]">Service Description</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.service_description || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Service</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.services?.map(s => s.service_name).join(', ') || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Signed On Contract</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.signed_on_contract ? new Date(vendor.signed_on_contract).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contacts" className="p-4 sm:p-6">
                        {/* Contact Persons */}
                        <Card className="w-full">
                            <CardHeader className="pb-4 lg:pb-6">
                                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                                        <User className="w-6 h-6" style={{ color: '#C72030' }} />
                                    </div>
                                    <span className="uppercase tracking-wide">Contact Persons</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="overflow-x-auto">
                                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                                        <Table className="border-separate">
                                            <TableHeader>
                                                <TableRow className="hover:bg-gray-50" style={{ backgroundColor: '#e6e2d8' }}>
                                                    <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Name</TableHead>
                                                    <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Email</TableHead>
                                                    <TableHead className="font-semibold text-gray-900 py-3 px-4" style={{ borderColor: '#fff' }}>Phone</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {vendor?.contacts && vendor.contacts.length > 0 ? vendor.contacts.map((person, index) => (
                                                    <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                                                        <TableCell className="py-3 px-4 font-medium">{person.name || 'N/A'}</TableCell>
                                                        <TableCell className="py-3 px-4">{person.email || 'N/A'}</TableCell>
                                                        <TableCell className="py-3 px-4">{person.phone || 'N/A'}</TableCell>
                                                    </TableRow>
                                                )) : (
                                                    <TableRow>
                                                        <TableCell colSpan={3} className="text-center py-8 text-gray-500">No contact persons found.</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="bank" className="p-4 sm:p-6">
                        {/* Bank Information */}
                        <Card className="w-full">
                            <CardHeader className="pb-4 lg:pb-6">
                                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                                        <Landmark className="w-6 h-6" style={{ color: '#C72030' }} />
                                    </div>
                                    <span className="uppercase tracking-wide">Bank Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Account Name</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.account_name || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Bank & Branch Name</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.bank_branch_name || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Account Number</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.account_number || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">IFSC Code</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{vendor?.ifsc_code || 'N/A'}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="audits" className="p-4 sm:p-6">
                        {/* Audits Conducted */}
                        <Card className="w-full">
                            <CardHeader className="pb-4 lg:pb-6">
                                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                                        <ShieldCheck className="w-6 h-6" style={{ color: '#C72030' }} />
                                    </div>
                                    <span className="uppercase tracking-wide">Audits Conducted</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="overflow-x-auto">
                                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                                        <Table className="border-separate">
                                            <TableHeader>
                                                <TableRow className="hover:bg-gray-50" style={{ backgroundColor: '#e6e2d8' }}>
                                                    <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Report</TableHead>
                                                    <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>ID</TableHead>
                                                    <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Vendor Name</TableHead>
                                                    <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Audit Name</TableHead>
                                                    <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Date & Time</TableHead>
                                                    <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Conducted By</TableHead>
                                                    <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Total Score</TableHead>
                                                    <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Evaluation Score</TableHead>
                                                    <TableHead className="font-semibold text-gray-900 py-3 px-4" style={{ borderColor: '#fff' }}>%</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {vendor?.audit_scores?.length > 0 ? vendor.audit_scores.map((audit, index) => (
                                                    <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                                                        <TableCell className="py-3 px-4 font-medium">Report</TableCell>
                                                        <TableCell className="py-3 px-4">{audit.report_id}</TableCell>
                                                        <TableCell className="py-3 px-4">{audit.vendor_name}</TableCell>
                                                        <TableCell className="py-3 px-4">{audit.audit_name}</TableCell>
                                                        <TableCell className="py-3 px-4">{audit.date_time ? new Date(audit.date_time).toLocaleString() : 'N/A'}</TableCell>
                                                        <TableCell className="py-3 px-4">{audit.conducted_by}</TableCell>
                                                        <TableCell className="py-3 px-4">{audit.total_score}</TableCell>
                                                        <TableCell className="py-3 px-4">{audit.evaluation_score}</TableCell>
                                                        <TableCell className="py-3 px-4">{audit.percentage}</TableCell>
                                                    </TableRow>
                                                )) : (
                                                    <TableRow>
                                                        <TableCell colSpan={9} className="text-center py-8 text-gray-500">No audits conducted.</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="attachments" className="p-4 sm:p-6">
                        {/* Attachments */}
                        <Card className="w-full">
                            <CardHeader className="pb-4 lg:pb-6">
                                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                                        <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
                                    </div>
                                    <span className="uppercase tracking-wide">Attachments</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="overflow-x-auto">
                                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                                        <Table className="border-separate">
                                            <TableHeader>
                                                <TableRow className="hover:bg-gray-50" style={{ backgroundColor: '#e6e2d8' }}>
                                                    <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Name</TableHead>
                                                    <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Documents Submitted</TableHead>
                                                    <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Status</TableHead>
                                                    <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Upload Date</TableHead>
                                                    <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Comments</TableHead>
                                                    <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Attachments</TableHead>
                                                    <TableHead className="font-semibold text-gray-900 py-3 px-4" style={{ borderColor: '#fff' }}>Decision</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {allAttachments.length > 0 ? allAttachments.map((att, index) => (
                                                    <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                                                        <TableCell className="py-3 px-4 font-medium">{att.document_name || att.category}</TableCell>
                                                        <TableCell className="py-3 px-4">{att.document_submitted}</TableCell>
                                                        <TableCell className="py-3 px-4">{att.status}</TableCell>
                                                        <TableCell className="py-3 px-4">{att.upload_date ? new Date(att.upload_date).toLocaleDateString() : 'N/A'}</TableCell>
                                                        <TableCell className="py-3 px-4">{att.comments}</TableCell>
                                                        <TableCell className="py-3 px-4">
                                                            <a href={att.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                                View
                                                            </a>
                                                        </TableCell>
                                                        <TableCell className="py-3 px-4">Decision</TableCell>
                                                    </TableRow>
                                                )) : (
                                                    <TableRow>
                                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">No attachments found.</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="financial" className="p-4 sm:p-6">
                        {/* Financial Summary */}
                        <Card className="w-full">
                            <CardHeader className="pb-4 lg:pb-6">
                                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                                        <Landmark className="w-6 h-6" style={{ color: '#C72030' }} />
                                    </div>
                                    <span className="uppercase tracking-wide">Financial Summary</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">PO Total Amount</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">₹{vendor?.financial_summary?.po_total_amount || 0}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">PO Paid Amount</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">₹{vendor?.financial_summary?.po_paid_amount || 0}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">PO Outstanding</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">₹{vendor?.financial_summary?.po_outstanding_amount || 0}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">WO Total Amount</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">₹{vendor?.financial_summary?.wo_total_amount || 0}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">WO Paid Amount</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">₹{vendor?.financial_summary?.wo_paid_amount || 0}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">WO Outstanding</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">₹{vendor?.financial_summary?.wo_outstanding_amount || 0}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Bills Total Amount</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">₹{vendor?.financial_summary?.bills_total_amount || 0}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Bills Outstanding</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">₹{vendor?.financial_summary?.bills_outstanding_amount || 0}</span>
                                    </div>
                                    <div className="flex items-start col-span-2 p-4 bg-gray-50 rounded-lg border-l-4 border-[#C72030]">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                            <div className="flex flex-col">
                                                <span className="text-gray-500 text-xs uppercase tracking-wide">Total Amount</span>
                                                <span className="text-gray-900 font-bold text-lg">₹{vendor?.financial_summary?.total_amount_all || 0}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-gray-500 text-xs uppercase tracking-wide">Total Paid</span>
                                                <span className="text-green-600 font-bold text-lg">₹{vendor?.financial_summary?.total_paid_amount_all || 0}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-gray-500 text-xs uppercase tracking-wide">Total Outstanding</span>
                                                <span className="text-red-600 font-bold text-lg">₹{vendor?.financial_summary?.total_outstanding_amount_all || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="approval" className="p-4 sm:p-6">
                        {/* Approval Status */}
                        <Card className="w-full">
                            <CardHeader className="pb-4 lg:pb-6">
                                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                                        <ShieldCheck className="w-6 h-6" style={{ color: '#C72030' }} />
                                    </div>
                                    <span className="uppercase tracking-wide">Approval Status</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">Approval Required</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">{vendor?.approval_info?.applicable_approval_present ? 'Yes' : 'No'}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 min-w-[140px]">All Levels Approved</span>
                                            <span className="text-gray-500 mx-2">:</span>
                                            <span className="text-gray-900 font-medium">{vendor?.approval_info?.all_level_approved ? 'Yes' : 'No'}</span>
                                        </div>
                                    </div>
                                    
                                    {vendor?.approval_info?.approval_levels && vendor.approval_info.approval_levels.length > 0 && (
                                        <div className="overflow-x-auto">
                                            <div className="rounded-lg border border-gray-200 overflow-hidden">
                                                <Table className="border-separate">
                                                    <TableHeader>
                                                        <TableRow className="hover:bg-gray-50" style={{ backgroundColor: '#e6e2d8' }}>
                                                            <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Level</TableHead>
                                                            <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Order</TableHead>
                                                            <TableHead className="font-semibold text-gray-900 py-3 px-4" style={{ borderColor: '#fff' }}>Status</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {vendor.approval_info.approval_levels.map((level, index) => (
                                                            <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                                                                <TableCell className="py-3 px-4 font-medium">{level.name}</TableCell>
                                                                <TableCell className="py-3 px-4">{level.order}</TableCell>
                                                                <TableCell className="py-3 px-4">
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${level.approval_history.status_text === 'Pending' ? 'bg-yellow-100 text-yellow-800' : level.approval_history.status_text === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                        {level.approval_history.status_text}
                                                                    </span>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default DetailsVendorPage;
