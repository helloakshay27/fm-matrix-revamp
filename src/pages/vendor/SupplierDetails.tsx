import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building, User, ArrowLeft, FileText, Paperclip } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SupplierDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');

    const [loading, setLoading] = useState(false);
    const [vendor, setVendor] = useState<any>({
        company_name: '',
        primary_email: '',
        primary_phone: '',
        secondary_phone: '',
        pan: '',
        gst: '',
        supplier_type: '',
        cin_number: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        address_line_1: '',
        address_line_2: '',
        service_description: '',
        signed_on_contract: '',
        service: '',
        financial_summary: {
            po_total_amount: 0,
            po_paid_amount: 0,
            po_pending_amount: 0,
            grn_total_amount: 0,
            grn_paid_amount: 0,
            grn_pending_amount: 0,
            wo_total_amount: 0,
            wo_paid_amount: 0,
            wo_pending_amount: 0,
            wo_invoice_total_amount: 0,
            wo_invoice_paid_amount: 0,
            wo_invoice_pending_amount: 0,
            other_bills_total_amount: 0,
            other_bills_paid_amount: 0,
            other_bills_pending_amount: 0,
            total_amount: 0,
            total_paid_amount: 0,
            total_pending_amount: 0
        }
    });

    useEffect(() => {
        if (!id || !baseUrl || !token) return;

        const fetchVendor = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://${baseUrl}/pms/suppliers/${id}/show_supplier.json?page=1`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error("Failed to fetch supplier details");
                const data = await response.json();
                
                // Assuming data is the supplier object or data.supplier
                const supplierData = data.supplier || data;
                
                setVendor({
                    company_name: supplierData.company_name || '',
                    primary_email: supplierData.email || '',
                    primary_phone: supplierData.mobile1 || '',
                    secondary_phone: supplierData.mobile2 || '',
                    pan: supplierData.pan_number || '',
                    gst: supplierData.gstin_number || supplierData.primary_gst_detail?.gstin || '',
                    supplier_type: supplierData.supplier_type || '',
                    cin_number: supplierData.cin_number || '',
                    country: supplierData.country || '',
                    state: supplierData.state || '',
                    city: supplierData.city || '',
                    pincode: supplierData.pincode || '',
                    address_line_1: supplierData.address || '',
                    address_line_2: supplierData.address2 || '',
                    service_description: supplierData.service_description || '',
                    signed_on_contract: supplierData.signed_on_contract || '',
                    service: supplierData.services?.map((s: any) => s.service_name).join(', ') || '',
                    financial_summary: {
                        po_total_amount: Number(supplierData.financial_summary?.po_total_amount || 0),
                        po_paid_amount: Number(supplierData.financial_summary?.po_paid_amount || 0),
                        po_pending_amount: Number(supplierData.financial_summary?.po_outstanding_amount || 0),
                        grn_total_amount: Number(supplierData.financial_summary?.grn_total_amount || 0),
                        grn_paid_amount: Number(supplierData.financial_summary?.grn_paid_amount || 0),
                        grn_pending_amount: Number(supplierData.financial_summary?.grn_outstanding_amount || 0),
                        wo_total_amount: Number(supplierData.financial_summary?.wo_total_amount || 0),
                        wo_paid_amount: Number(supplierData.financial_summary?.wo_paid_amount || 0),
                        wo_pending_amount: Number(supplierData.financial_summary?.wo_outstanding_amount || 0),
                        wo_invoice_total_amount: Number(supplierData.financial_summary?.wo_invoice_total_amount || 0),
                        wo_invoice_paid_amount: Number(supplierData.financial_summary?.wo_invoice_paid_amount || 0),
                        wo_invoice_pending_amount: Number(supplierData.financial_summary?.wo_invoice_outstanding_amount || 0),
                        other_bills_total_amount: Number(supplierData.financial_summary?.bills_total_amount || 0),
                        other_bills_paid_amount: Number(supplierData.financial_summary?.bills_paid_amount || 0),
                        other_bills_pending_amount: Number(supplierData.financial_summary?.bills_outstanding_amount || 0),
                        total_amount: Number(supplierData.financial_summary?.total_amount_all || 0),
                        total_paid_amount: Number(supplierData.financial_summary?.total_paid_amount_all || 0),
                        total_pending_amount: Number(supplierData.financial_summary?.total_outstanding_amount_all || 0)
                    }
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchVendor();
    }, [id, baseUrl, token]);

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-4 sm:p-6 min-h-screen bg-[#fafafa]">
            {/* Header / Breadcrumb */}
            <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2">
                    Vendor &gt; <span className="text-gray-900 font-medium">Vendor Details</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-xl sm:text-2xl font-bold uppercase text-[#1a1a1a]">
                        VENDOR DETAILS
                    </h1>
                </div>
            </div>

            <Tabs defaultValue="basic-info" className="w-full">
                <TabsList className="flex items-center justify-start gap-6 bg-transparent border-b border-gray-200 rounded-none p-0 h-auto w-full mb-6">
                    <TabsTrigger 
                        value="basic-info" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#D92818] data-[state=active]:text-[#D92818] data-[state=active]:bg-transparent px-2 py-3 font-semibold text-gray-500 hover:text-gray-700 data-[state=inactive]:shadow-none transition-none focus-visible:ring-0 focus-visible:outline-none"
                    >
                        Basic Information
                    </TabsTrigger>
                    <TabsTrigger 
                        value="financial-summary" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#D92818] data-[state=active]:text-[#D92818] data-[state=active]:bg-transparent px-2 py-3 font-semibold text-gray-500 hover:text-gray-700 data-[state=inactive]:shadow-none transition-none focus-visible:ring-0 focus-visible:outline-none"
                    >
                        Financial Summary
                    </TabsTrigger>
                    <TabsTrigger 
                        value="contact-persons" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#D92818] data-[state=active]:text-[#D92818] data-[state=active]:bg-transparent px-2 py-3 font-semibold text-gray-500 hover:text-gray-700 data-[state=inactive]:shadow-none transition-none focus-visible:ring-0 focus-visible:outline-none"
                    >
                        Contact Persons
                    </TabsTrigger>
                    <TabsTrigger 
                        value="attachments" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#D92818] data-[state=active]:text-[#D92818] data-[state=active]:bg-transparent px-2 py-3 font-semibold text-gray-500 hover:text-gray-700 data-[state=inactive]:shadow-none transition-none focus-visible:ring-0 focus-visible:outline-none"
                    >
                        Attachments
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="basic-info" className="mt-0">
                    {/* Basic Information Card */}
                    <Card className="w-full border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                        <CardHeader className="bg-white pb-4 border-b border-gray-100">
                            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#f0e8dc]">
                                    <Building className="w-5 h-5" style={{ color: '#eb5e28' }} />
                                </div>
                                <span className="uppercase tracking-wide" style={{ color: '#eb5e28' }}>Basic Information</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-sm">
                                <div className="flex items-start">
                                    <span className="text-gray-500 w-[180px] shrink-0">Company Name</span>
                                    <span className="text-gray-900 font-medium break-words w-full">: {vendor.company_name || ''}</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-gray-500 w-[180px] shrink-0">Primary Email</span>
                                    <span className="text-gray-900 font-medium break-words w-full">: {vendor.primary_email || ''}</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-gray-500 w-[180px] shrink-0">Primary Phone</span>
                                    <span className="text-gray-900 font-medium break-words w-full">: {vendor.primary_phone || ''}</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-gray-500 w-[180px] shrink-0">Secondary Phone</span>
                                    <span className="text-gray-900 font-medium break-words w-full">: {vendor.secondary_phone || ''}</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-gray-500 w-[180px] shrink-0">PAN</span>
                                    <span className="text-gray-900 font-medium break-words w-full">: {vendor.pan || ''}</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-gray-500 w-[180px] shrink-0">GST</span>
                                    <span className="text-gray-900 font-medium break-words w-full">: {vendor.gst || ''}</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-gray-500 w-[180px] shrink-0">Supplier Type</span>
                                    <span className="text-gray-900 font-medium break-words w-full">: {vendor.supplier_type || ''}</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-gray-500 w-[180px] shrink-0">CIN Number</span>
                                    <span className="text-gray-900 font-medium break-words w-full">: {vendor.cin_number || ''}</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-gray-500 w-[180px] shrink-0">Country</span>
                                    <span className="text-gray-900 font-medium break-words w-full">: {vendor.country || ''}</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-gray-500 w-[180px] shrink-0">State</span>
                                    <span className="text-gray-900 font-medium break-words w-full">: {vendor.state || ''}</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-gray-500 w-[180px] shrink-0">City</span>
                                    <span className="text-gray-900 font-medium break-words w-full">: {vendor.city || ''}</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-gray-500 w-[180px] shrink-0">Pincode</span>
                                    <span className="text-gray-900 font-medium break-words w-full">: {vendor.pincode || ''}</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-gray-500 w-[180px] shrink-0">Address Line1</span>
                                    <span className="text-gray-900 font-medium break-words w-full">: {vendor.address_line_1 || ''}</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-gray-500 w-[180px] shrink-0">Address Line2</span>
                                    <span className="text-gray-900 font-medium break-words w-full">: {vendor.address_line_2 || ''}</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-gray-500 w-[180px] shrink-0">Service Description</span>
                                    <span className="text-gray-900 font-medium break-words w-full">: {vendor.service_description || ''}</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-gray-500 w-[180px] shrink-0">Signed On Contract</span>
                                    <span className="text-gray-900 font-medium break-words w-full">: {vendor.signed_on_contract || ''}</span>
                                </div>
                                <div className="flex items-start col-span-1 md:col-span-2">
                                    <span className="text-gray-500 w-[180px] shrink-0">Service</span>
                                    <span className="text-gray-900 font-medium break-words w-full">: {vendor.service || ''}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="financial-summary" className="mt-0">
                    {/* Financial Summary Table */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#fcf5f5] hover:bg-[#fcf5f5]">
                                    <TableHead className="font-semibold text-center text-gray-700 py-4">Invoice Type</TableHead>
                                    <TableHead className="font-semibold text-center text-gray-700 py-4 border-l border-white">Total Amount</TableHead>
                                    <TableHead className="font-semibold text-center text-gray-700 py-4 border-l border-white">Paid Amount</TableHead>
                                    <TableHead className="font-semibold text-center text-gray-700 py-4 border-l border-white">Pending Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="text-center font-medium py-4">PO</TableCell>
                                    <TableCell className="text-center py-4">{vendor.financial_summary.po_total_amount.toFixed(1)}</TableCell>
                                    <TableCell className="text-center py-4">{vendor.financial_summary.po_paid_amount.toFixed(1)}</TableCell>
                                    <TableCell className="text-center py-4">{vendor.financial_summary.po_pending_amount.toFixed(1)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-center font-medium py-4">GRN</TableCell>
                                    <TableCell className="text-center py-4">{vendor.financial_summary.grn_total_amount}</TableCell>
                                    <TableCell className="text-center py-4">{vendor.financial_summary.grn_paid_amount}</TableCell>
                                    <TableCell className="text-center py-4">{vendor.financial_summary.grn_pending_amount}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-center font-medium py-4">WO</TableCell>
                                    <TableCell className="text-center py-4">{vendor.financial_summary.wo_total_amount}</TableCell>
                                    <TableCell className="text-center py-4">{vendor.financial_summary.wo_paid_amount}</TableCell>
                                    <TableCell className="text-center py-4">{vendor.financial_summary.wo_pending_amount}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-center font-medium py-4">WO Invoice</TableCell>
                                    <TableCell className="text-center py-4">{vendor.financial_summary.wo_invoice_total_amount}</TableCell>
                                    <TableCell className="text-center py-4">{vendor.financial_summary.wo_invoice_paid_amount}</TableCell>
                                    <TableCell className="text-center py-4">{vendor.financial_summary.wo_invoice_pending_amount}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-center font-medium py-4">Other Bills</TableCell>
                                    <TableCell className="text-center py-4">{vendor.financial_summary.other_bills_total_amount}</TableCell>
                                    <TableCell className="text-center py-4">{vendor.financial_summary.other_bills_paid_amount}</TableCell>
                                    <TableCell className="text-center py-4">{vendor.financial_summary.other_bills_pending_amount}</TableCell>
                                </TableRow>
                                <TableRow className="bg-gray-50">
                                    <TableCell className="text-center font-bold py-4">Total</TableCell>
                                    <TableCell className="text-center font-medium py-4">{vendor.financial_summary.total_amount.toFixed(1)}</TableCell>
                                    <TableCell className="text-center font-medium py-4">{vendor.financial_summary.total_paid_amount.toFixed(1)}</TableCell>
                                    <TableCell className="text-center font-medium py-4">{vendor.financial_summary.total_pending_amount.toFixed(1)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="contact-persons" className="mt-0">
                    {/* Contact Persons Card */}
                    <Card className="w-full border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                        <CardHeader className="bg-white pb-4 border-b border-gray-100">
                            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#f0e8dc]">
                                    <User className="w-5 h-5" style={{ color: '#eb5e28' }} />
                                </div>
                                <span className="uppercase tracking-wide" style={{ color: '#eb5e28' }}>Contact Persons</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 bg-white min-h-[100px]">
                            {/* Empty or Contact List will go here */}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="attachments" className="mt-0">
                    {/* Attachments Card */}
                    <Card className="w-full border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                        <CardHeader className="bg-white pb-4 border-b border-gray-100">
                            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#f0e8dc]">
                                    <Paperclip className="w-5 h-5" style={{ color: '#eb5e28' }} />
                                </div>
                                <span className="uppercase tracking-wide" style={{ color: '#eb5e28' }}>Attachments</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 bg-white min-h-[100px]">
                            {/* Empty or Attachments List will go here */}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SupplierDetails;
