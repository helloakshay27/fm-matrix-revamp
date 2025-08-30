import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vendorService } from '@/services/vendorService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TextField, Grid } from '@mui/material';
import { Building, FileText, Landmark, ShieldCheck, User } from 'lucide-react';

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
    company_name: string;
    email: string;
    mobile1: string;
    mobile2: string;
    secondary_emails: string | null;
    secondary_phone: string | null;
    pan_number: string;
    gstin_number: string;
    supplier_type: string[] | null;
    country: string;
    state: string;
    city: string;
    pincode: string;
    address: string;
    address2: string;
    service_description: string | null;
    signed_on_contract: string | null;
    services: { service_name: string }[];
    contacts: Contact[];
    bank_informations: BankInformation[]; // Assuming this might come from another source or for other vendors
    audit_scores: AuditScore[];
    attachments: Attachment[];
    tan_attachments: Attachment[];
    pan_attachments: Attachment[];
    gst_attachments: Attachment[];
    kyc_attachments: Attachment[];
    other_attachments: Attachment[];
    compliance_attachments: Attachment[];
    cancle_checque: Attachment[];
}


const DetailsVendorPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [allAttachments, setAllAttachments] = useState<Attachment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                        consolidatedAttachments.push(...attachments.map(att => ({...att, category: field.replace('_attachments', '') })));
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
        <div className="p-6 mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#1a1a1a]">Vendor Details</h1>
                <Button onClick={() => navigate(-1)} variant="outline">Back to List</Button>
            </div>

            <div className="space-y-8">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-[#C72030] flex items-center gap-2">
                            <Building className="w-5 h-5" />
                            BASIC INFORMATION
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Grid container spacing={4}>
                            {renderDetailField('Company Name', vendor.company_name)}
                            {renderDetailField('Primary Email', vendor.email)}
                            {renderDetailField('Primary Phone', vendor.mobile1)}
                            {renderDetailField('Secondary Phone', vendor.mobile2)}
                            {renderDetailField('Secondary Email', vendor.secondary_emails)}
                            {renderDetailField('PAN', vendor.pan_number)}
                            {renderDetailField('GST', vendor.gstin_number)}
                            {renderDetailField('Supplier Type', vendor.supplier_type?.join(', '))}
                            {renderDetailField('Country', vendor.country)}
                            {renderDetailField('State', vendor.state)}
                            {renderDetailField('City', vendor.city)}
                            {renderDetailField('Pincode', vendor.pincode)}
                            {renderDetailField('Address Line 1', vendor.address)}
                            {renderDetailField('Address Line 2', vendor.address2)}
                            {renderDetailField('Service Description', vendor.service_description)}
                            {renderDetailField('Service', vendor.services?.map(s => s.service_name).join(', '))}
                            {renderDetailField('Signed On Contract', vendor.signed_on_contract ? new Date(vendor.signed_on_contract).toLocaleDateString() : 'N/A')}
                        </Grid>
                    </CardContent>
                </Card>

                {/* Contact Persons */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-[#C72030] flex items-center gap-2">
                            <User className="w-5 h-5" />
                            CONTACT PERSONS
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vendor.contacts?.length > 0 ? vendor.contacts.map((person, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{person.name}</TableCell>
                                        <TableCell>{person.email}</TableCell>
                                        <TableCell>{person.phone}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center">No contact persons found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Bank Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-[#C72030] flex items-center gap-2">
                            <Landmark className="w-5 h-5" />
                            BANK INFORMATION
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Account Name</TableHead>
                                    <TableHead>Bank & Branch Name</TableHead>
                                    <TableHead>Account Number</TableHead>
                                    <TableHead>IFSC Code</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vendor.bank_informations?.length > 0 ? vendor.bank_informations.map((bank, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{bank.account_name}</TableCell>
                                        <TableCell>{bank.bank_name}</TableCell>
                                        <TableCell>{bank.account_number}</TableCell>
                                        <TableCell>{bank.ifsc_code}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">No bank information found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Audits Conducted */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-[#C72030] flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5" />
                            Audits Conducted
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Report</TableHead>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Vendor Name</TableHead>
                                    <TableHead>Audit Name</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Conducted By</TableHead>
                                    <TableHead>Total Score</TableHead>
                                    <TableHead>Evaluation Score</TableHead>
                                    <TableHead>%</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vendor.audit_scores?.length > 0 ? vendor.audit_scores.map((audit, index) => (
                                    <TableRow key={index}>
                                        <TableCell>Report</TableCell>
                                        <TableCell>{audit.report_id}</TableCell>
                                        <TableCell>{audit.vendor_name}</TableCell>
                                        <TableCell>{audit.audit_name}</TableCell>
                                        <TableCell>{audit.date_time ? new Date(audit.date_time).toLocaleString() : 'N/A'}</TableCell>
                                        <TableCell>{audit.conducted_by}</TableCell>
                                        <TableCell>{audit.total_score}</TableCell>
                                        <TableCell>{audit.evaluation_score}</TableCell>
                                        <TableCell>{audit.percentage}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center">No audits conducted.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Attachments */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-[#C72030] flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            ATTACHMENT
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Documents Submitted</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Upload Date</TableHead>
                                    <TableHead>Comments</TableHead>
                                    <TableHead>Attachments</TableHead>
                                    <TableHead>Decision</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allAttachments.length > 0 ? allAttachments.map((att, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{att.document_name || att.category}</TableCell>
                                        <TableCell>{att.document_submitted}</TableCell>
                                        <TableCell>{att.status}</TableCell>
                                        <TableCell>{att.upload_date ? new Date(att.upload_date).toLocaleDateString() : 'N/A'}</TableCell>
                                        <TableCell>{att.comments}</TableCell>
                                        <TableCell>
                                            <a href={att.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                View
                                            </a>
                                        </TableCell>
                                        <TableCell>Decision</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center">No attachments found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DetailsVendorPage;
