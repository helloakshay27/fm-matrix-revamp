import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, Settings, Package, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from '@mui/material';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormData {
    vendor: string;
    dateOfReceiving: string;
}

interface PackageData {
    id: number;
    recipient: string;
    sender: string;
    mobile: string;
    awbNumber: string;
    company: string;
    companyAddressLine1: string;
    companyAddressLine2: string;
    state: string;
    city: string;
    pincode: string;
    type: string;
    attachments: File[];
}

export const NewInboundPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [formData, setFormData] = useState<FormData>({
        vendor: '',
        dateOfReceiving: '',
    });

    const [packages, setPackages] = useState<PackageData[]>([
        {
            id: 1,
            recipient: '',
            sender: '',
            mobile: '',
            awbNumber: '',
            company: '',
            companyAddressLine1: '',
            companyAddressLine2: '',
            state: '',
            city: '',
            pincode: '',
            type: '',
            attachments: []
        }
    ]);

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);
    const [vendorName, setVendorName] = useState('');
    const [trackUrl, setTrackUrl] = useState('');

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handlePackageInputChange = (packageId: number, field: keyof Omit<PackageData, 'id'>, value: string) => {
        setPackages(prev => prev.map(pkg =>
            pkg.id === packageId ? { ...pkg, [field]: value } : pkg
        ));
    };

    const handleFileUpload = (packageId: number, files: FileList | null) => {
        if (files) {
            setPackages(prev => prev.map(pkg =>
                pkg.id === packageId ? { ...pkg, attachments: Array.from(files) } : pkg
            ));
        }
    };

    const handleAddPackage = () => {
        const newPackage: PackageData = {
            id: Math.max(...packages.map(p => p.id)) + 1,
            recipient: '',
            sender: '',
            mobile: '',
            awbNumber: '',
            company: '',
            companyAddressLine1: '',
            companyAddressLine2: '',
            state: '',
            city: '',
            pincode: '',
            type: '',
            attachments: []
        };
        setPackages(prev => [...prev, newPackage]);
    };

    const handleRemovePackage = (packageId: number) => {
        if (packages.length > 1) {
            setPackages(prev => prev.filter(pkg => pkg.id !== packageId));
        } else {
            toast({
                title: 'Error',
                description: 'At least one package is required',
                variant: 'destructive',
            });
        }
    };

    const validateForm = () => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (!formData.vendor) newErrors.vendor = 'Vendor is required';
        if (!formData.dateOfReceiving) newErrors.dateOfReceiving = 'Date of Receiving is required';

        // Validate at least one package with required fields
        const hasValidPackage = packages.some(pkg =>
            pkg.recipient && pkg.sender && pkg.companyAddressLine1 && pkg.type
        );

        if (!hasValidPackage) {
            toast({
                title: 'Error',
                description: 'At least one package must have Recipient, Sender, Address Line 1, and Type filled',
                variant: 'destructive',
            });
            return false;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast({
                title: 'Error',
                description: 'Please fill all required fields',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // TODO: Implement API call to submit inbound data
            console.log('Submitting inbound data:', { ...formData, packages });

            toast({
                title: 'Success',
                description: 'Inbound created successfully',
            });

            // Navigate back or to inbound list
            navigate('/vas/mailroom/inbound');
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create inbound',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitVendor = () => {
        if (!vendorName.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter vendor name',
                variant: 'destructive',
            });
            return;
        }

        // TODO: Implement API call to add vendor
        console.log('Adding vendor:', { name: vendorName, trackUrl });

        toast({
            title: 'Success',
            description: 'Vendor added successfully',
        });

        // Close modal and reset fields
        setIsAddVendorModalOpen(false);
        setVendorName('');
        setTrackUrl('');
    };

    const fieldStyles = {
        height: '40px',
        backgroundColor: '#fff',
        borderRadius: '4px',
        '& .MuiOutlinedInput-root': {
            height: '40px',
            fontSize: '14px',
            '& fieldset': { borderColor: '#ddd' },
            '&:hover fieldset': { borderColor: '#C72030' },
            '&.Mui-focused fieldset': { borderColor: '#C72030' },
        },
        '& .MuiInputLabel-root': {
            fontSize: '14px',
            '&.Mui-focused': { color: '#C72030' },
        },
    };

    const states = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
        'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ];

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#FAF9F7' }}>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/inventory/inbound')}
                        className="mb-4 flex items-center gap-1 hover:text-gray-800"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Inbound List
                    </Button>
                    <h1
                        className="text-2xl font-bold text-[#1a1a1a] uppercase"
                        style={{ fontFamily: 'Work Sans, sans-serif' }}
                    >
                        NEW INBOUND
                    </h1>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Basic Details Section */}
                    <Card
                        className="mb-6 border-[#D9D9D9] bg-white shadow-sm"
                        style={{
                            borderRadius: '4px',
                            background: '#FFF',
                            boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)',
                        }}
                    >
                        <CardHeader className="bg-[#F6F4EE]">
                            <CardTitle className="text-lg text-black flex items-center">
                                <div
                                    className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-2"
                                    style={{ fontFamily: 'Work Sans, sans-serif' }}
                                >
                                    <Settings className="w-5 h-5" />
                                </div>
                                <span style={{ fontFamily: 'Work Sans, sans-serif', fontWeight: 600, color: '#C72030' }}>
                                    BASIC DETAILS
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Vendor */}
                                <div>
                                    <FormControl fullWidth variant="outlined" error={!!errors.vendor}>
                                        <InputLabel shrink>
                                            Vendor <span style={{ color: '#C72030' }}>*</span>
                                        </InputLabel>
                                        <MuiSelect
                                            label="Vendor"
                                            displayEmpty
                                            value={formData.vendor}
                                            onChange={e => handleInputChange('vendor', e.target.value)}
                                            sx={fieldStyles}
                                        >
                                            <MenuItem value="">
                                                <em>Select Vendor</em>
                                            </MenuItem>
                                            <MenuItem value="vendor1">Vendor 1</MenuItem>
                                            <MenuItem value="vendor2">Vendor 2</MenuItem>
                                            <MenuItem value="vendor3">Vendor 3</MenuItem>
                                        </MuiSelect>
                                        {errors.vendor && <FormHelperText>{errors.vendor}</FormHelperText>}
                                    </FormControl>
                                    <Button
                                        type="button"
                                        onClick={() => setIsAddVendorModalOpen(true)}
                                        className="mt-2"
                                        style={{
                                            backgroundColor: '#1976D2',
                                            color: '#FFF',
                                            fontSize: '12px',
                                            padding: '4px 12px',
                                            height: 'auto',
                                        }}
                                    >
                                        + Add Vendor
                                    </Button>
                                </div>

                                {/* Date of Receiving */}
                                <div>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label={
                                            <span>
                                                Date of Receiving <span style={{ color: '#C72030' }}>*</span>
                                            </span>
                                        }
                                        value={formData.dateOfReceiving}
                                        onChange={e => handleInputChange('dateOfReceiving', e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ style: { height: 40 } }}
                                        sx={{ '& .MuiInputBase-root': { height: 40 } }}
                                        error={!!errors.dateOfReceiving}
                                        helperText={errors.dateOfReceiving}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Package Details Sections */}
                    {packages.map((pkg, index) => (
                        <Card
                            key={pkg.id}
                            className="mb-6 border-[#D9D9D9] bg-white shadow-sm"
                            style={{
                                borderRadius: '4px',
                                background: '#FFF',
                                boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)',
                            }}
                        >
                            <CardHeader className="bg-[#F6F4EE]">
                                <CardTitle className="text-lg text-black flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div
                                            className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-2"
                                            style={{ fontFamily: 'Work Sans, sans-serif' }}
                                        >
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <span style={{ fontFamily: 'Work Sans, sans-serif', fontWeight: 600, color: '#C72030' }}>
                                            PACKAGE DETAILS {packages.length > 1 && `(${index + 1})`}
                                        </span>
                                    </div>
                                    {packages.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => handleRemovePackage(pkg.id)}
                                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* Recipient */}
                                    <div>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel shrink>
                                                Recipient <span style={{ color: '#C72030' }}>*</span>
                                            </InputLabel>
                                            <MuiSelect
                                                label="Recipient"
                                                displayEmpty
                                                value={pkg.recipient}
                                                onChange={e => handlePackageInputChange(pkg.id, 'recipient', e.target.value)}
                                                sx={fieldStyles}
                                            >
                                                <MenuItem value="">
                                                    <em>Select Recipient</em>
                                                </MenuItem>
                                                <MenuItem value="recipient1">Recipient 1</MenuItem>
                                                <MenuItem value="recipient2">Recipient 2</MenuItem>
                                            </MuiSelect>
                                        </FormControl>
                                    </div>

                                    {/* Sender */}
                                    <div>
                                        <TextField
                                            fullWidth
                                            label={
                                                <span>
                                                    Sender <span style={{ color: '#C72030' }}>*</span>
                                                </span>
                                            }
                                            placeholder="Enter Sender's Name"
                                            value={pkg.sender}
                                            onChange={e => handlePackageInputChange(pkg.id, 'sender', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{ sx: fieldStyles }}
                                        />
                                    </div>

                                    {/* Mobile */}
                                    <div>
                                        <TextField
                                            fullWidth
                                            label="Mobile"
                                            placeholder="Enter Sender's Mobile"
                                            value={pkg.mobile}
                                            onChange={e => handlePackageInputChange(pkg.id, 'mobile', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{ sx: fieldStyles }}
                                        />
                                    </div>

                                    {/* AWB Number */}
                                    <div>
                                        <TextField
                                            fullWidth
                                            label="AWB Number"
                                            placeholder="Enter AWB Number"
                                            value={pkg.awbNumber}
                                            onChange={e => handlePackageInputChange(pkg.id, 'awbNumber', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{ sx: fieldStyles }}
                                        />
                                    </div>

                                    {/* Company */}
                                    <div>
                                        <TextField
                                            fullWidth
                                            label="Company"
                                            placeholder="Enter Company's Name"
                                            value={pkg.company}
                                            onChange={e => handlePackageInputChange(pkg.id, 'company', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{ sx: fieldStyles }}
                                        />
                                    </div>

                                    {/* Company's Address Line 1 */}
                                    <div>
                                        <TextField
                                            fullWidth
                                            label={
                                                <span>
                                                    Company's Address Line 1 <span style={{ color: '#C72030' }}>*</span>
                                                </span>
                                            }
                                            placeholder="Enter Company's Address Line 1"
                                            value={pkg.companyAddressLine1}
                                            onChange={e => handlePackageInputChange(pkg.id, 'companyAddressLine1', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{ sx: fieldStyles }}
                                        />
                                    </div>

                                    {/* Company's Address Line 2 */}
                                    <div>
                                        <TextField
                                            fullWidth
                                            label="Company's Address Line 2"
                                            placeholder="Enter Company's Address Line 2"
                                            value={pkg.companyAddressLine2}
                                            onChange={e => handlePackageInputChange(pkg.id, 'companyAddressLine2', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{ sx: fieldStyles }}
                                        />
                                    </div>

                                    {/* State */}
                                    <div>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel shrink>State</InputLabel>
                                            <MuiSelect
                                                label="State"
                                                displayEmpty
                                                value={pkg.state}
                                                onChange={e => handlePackageInputChange(pkg.id, 'state', e.target.value)}
                                                sx={fieldStyles}
                                            >
                                                <MenuItem value="">
                                                    <em>Select State</em>
                                                </MenuItem>
                                                {states.map(state => (
                                                    <MenuItem key={state} value={state}>
                                                        {state}
                                                    </MenuItem>
                                                ))}
                                            </MuiSelect>
                                        </FormControl>
                                    </div>

                                    {/* City */}
                                    <div>
                                        <TextField
                                            fullWidth
                                            label="City"
                                            placeholder="Enter City"
                                            value={pkg.city}
                                            onChange={e => handlePackageInputChange(pkg.id, 'city', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{ sx: fieldStyles }}
                                        />
                                    </div>

                                    {/* Pincode */}
                                    <div>
                                        <TextField
                                            fullWidth
                                            label="Pincode"
                                            placeholder="Enter Pincode"
                                            value={pkg.pincode}
                                            onChange={e => handlePackageInputChange(pkg.id, 'pincode', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{ sx: fieldStyles }}
                                        />
                                    </div>

                                    {/* Type */}
                                    <div>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel shrink>
                                                Type <span style={{ color: '#C72030' }}>*</span>
                                            </InputLabel>
                                            <MuiSelect
                                                label="Type"
                                                displayEmpty
                                                value={pkg.type}
                                                onChange={e => handlePackageInputChange(pkg.id, 'type', e.target.value)}
                                                sx={fieldStyles}
                                            >
                                                <MenuItem value="">
                                                    <em>Select Type</em>
                                                </MenuItem>
                                                <MenuItem value="type1">Type 1</MenuItem>
                                                <MenuItem value="type2">Type 2</MenuItem>
                                                <MenuItem value="type3">Type 3</MenuItem>
                                            </MuiSelect>
                                        </FormControl>
                                    </div>

                                    {/* Attachments */}
                                    <div className="lg:col-span-4">
                                        <label className="block text-sm font-medium mb-2 text-[#1a1a1a]">
                                            Attachments <span style={{ color: '#C72030' }}>*</span>
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-white">
                                            <input
                                                type="file"
                                                multiple
                                                className="hidden"
                                                id={`attachments-upload-${pkg.id}`}
                                                onChange={e => handleFileUpload(pkg.id, e.target.files)}
                                            />
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    type="button"
                                                    onClick={() => document.getElementById(`attachments-upload-${pkg.id}`)?.click()}
                                                    className="!bg-[#C72030] !text-white text-sm"
                                                >
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Choose file
                                                </Button>
                                                <span className="text-sm text-gray-500">
                                                    {pkg.attachments.length > 0
                                                        ? `${pkg.attachments.length} file(s) selected`
                                                        : 'No file chosen'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Add Package Button */}
                    <div className="mb-6 flex justify-start">
                        <Button
                            type="button"
                            onClick={handleAddPackage}
                            className="bg-[#532D5F] hover:bg-[#532D5F]/90 text-white"
                        >
                            + Package
                        </Button>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 justify-center">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-2 font-medium"
                            style={{
                                backgroundColor: '#C72030',
                                color: '#FFF',
                                border: 'none',
                                borderRadius: '4px',
                            }}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </form>

                {/* Add Vendor Modal */}
                <Dialog open={isAddVendorModalOpen} onOpenChange={setIsAddVendorModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
                            <DialogTitle className="text-lg font-semibold">Add Vendor</DialogTitle>
                            <button
                                onClick={() => setIsAddVendorModalOpen(false)}
                                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </button>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="vendorName" className="text-sm font-medium">
                                    Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="vendorName"
                                    type="text"
                                    placeholder="Enter Name"
                                    value={vendorName}
                                    onChange={(e) => setVendorName(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="trackUrl" className="text-sm font-medium">
                                    Track Url
                                </Label>
                                <Input
                                    id="trackUrl"
                                    type="text"
                                    placeholder="Enter Track Url"
                                    value={trackUrl}
                                    onChange={(e) => setTrackUrl(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={handleSubmitVendor}
                                className="bg-[#532D5F] hover:bg-[#532D5F]/90 text-white"
                            >
                                Submit
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default NewInboundPage;
