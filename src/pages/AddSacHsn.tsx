import React, { useState } from 'react';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';

const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
        padding: { xs: '8px', sm: '10px', md: '12px' },
    },
};

const AddSacHsn: React.FC = () => {
    const [form, setForm] = useState({
        type: '',
        category: '',
        code: '',
        cgst: '',
        sgst: '',
        igst: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [k: string]: string }>({});

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        // clear the field specific error when user edits
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const parseRate = (val: string) => {
        if (!val && val !== '0') return null;
        const cleaned = String(val).replace('%', '').trim();
        const num = Number(cleaned);
        if (Number.isFinite(num)) return num;
        return null;
    };

    const validateForm = () => {
        const nextErrors: { [k: string]: string } = {};
        if (!form.type) nextErrors.type = 'Type is required';
        if (!form.category || !String(form.category).trim()) nextErrors.category = 'Category is required';
        if (!form.code || !String(form.code).trim()) nextErrors.code = 'SAC/HSN code is required';

        const cgstNum = parseRate(form.cgst);
        if (cgstNum === null) nextErrors.cgst = 'Enter a valid CGST numeric rate';
        else if (cgstNum < 0 || cgstNum > 100) nextErrors.cgst = 'Rate must be between 0 and 100';

        const sgstNum = parseRate(form.sgst);
        if (sgstNum === null) nextErrors.sgst = 'Enter a valid SGST numeric rate';
        else if (sgstNum < 0 || sgstNum > 100) nextErrors.sgst = 'Rate must be between 0 and 100';

        if (form.igst) {
            const igstNum = parseRate(form.igst);
            if (igstNum === null) nextErrors.igst = 'Enter a valid IGST numeric rate';
            else if (igstNum < 0 || igstNum > 100) nextErrors.igst = 'Rate must be between 0 and 100';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleReset = () => {
        setForm({ type: '', category: '', code: '', cgst: '', sgst: '', igst: '' });
    };

    const navigate = useNavigate();

    const handleApply = async () => {
        // client-side validation
        if (!validateForm()) {
            // focus is left to user; show quick toast
            toast('Please fix the highlighted errors');
            return;
        }
        // Build payload according to backend params.require(:pms_hsn)
        const payload = {
            pms_hsn: {
                hsn_type: form.type,
                category: form.category,
                code: form.code,
                cgst_rate: form.cgst,
                sgst_rate: form.sgst,
                igst_rate: form.igst,
                active: true,
            },
        };

        try {
            setIsSubmitting(true);
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const url = `https://${baseUrl}/pms/hsns.json`;

            const response = await axios.post(url, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            toast("SAC/HSN Created Successfully");
            // navigate to list page
            navigate('/settings/inventory-management/sac-hsn-code');
        } catch (err: any) {
            console.error('Add SAC/HSN API error:', err);
            toast(err?.message || 'Failed to create SAC/HSN');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>
            </div>
            <div className="mb-6 flex items-center gap-4">

                <h1 className="text-2xl font-bold text-[#1a1a1a]">ADD SAC/HSN SETUP</h1>
            </div>

            <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                <CardHeader className="bg-[#F6F4EE] mb-4">
                    <CardTitle className="text-lg text-black">BASIC DETAILS</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }} error={!!errors.type}>
                            <InputLabel shrink>
                                Type
                                <span className="text-red-500">*</span>

                            </InputLabel>
                            <MuiSelect
                                label="Type"
                                value={form.type}
                                onChange={(e) => handleChange('type', e.target.value as string)}
                                displayEmpty
                                notched
                                disabled={isSubmitting}
                            >
                                <MenuItem value="">
                                    <em>Select Type</em>
                                </MenuItem>
                                <MenuItem value="1">Product</MenuItem>
                                <MenuItem value="2">Services</MenuItem>
                            </MuiSelect>
                            {errors.type && <div className="text-xs text-red-600 mt-1 ml-1">{errors.type}</div>}
                        </FormControl>



                        <TextField
                            label={<>Category<span style={{ color: '#C72030' }}>*</span></>}
                            placeholder="Enter Category"
                            value={form.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                            fullWidth
                            variant="outlined"
                            InputProps={{ sx: fieldStyles }}
                            disabled={isSubmitting}
                            error={!!errors.category}
                            helperText={errors.category}
                        />

                        <TextField
                            label={<>SAC/HSN Code<span style={{ color: '#C72030' }}>*</span></>}
                            placeholder="Enter SAC/HSN code"
                            value={form.code}
                            onChange={(e) => handleChange('code', e.target.value)}
                            fullWidth
                            variant="outlined"
                            InputProps={{ sx: fieldStyles }}
                            disabled={isSubmitting}
                            error={!!errors.code}
                            helperText={errors.code}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <TextField
                            label={<>CGST Rate<span style={{ color: '#C72030' }}>*</span></>}
                            placeholder="Enter CGST Rate"
                            value={form.cgst}
                            onChange={(e) => handleChange('cgst', e.target.value)}
                            fullWidth
                            variant="outlined"
                            InputProps={{ sx: fieldStyles }}
                            disabled={isSubmitting}
                            error={!!errors.cgst}
                            helperText={errors.cgst}
                        />

                        <TextField
                            label={<>SGST Rate<span style={{ color: '#C72030' }}>*</span></>}
                            placeholder="Enter SGST Rate"
                            value={form.sgst}
                            onChange={(e) => handleChange('sgst', e.target.value)}
                            fullWidth
                            variant="outlined"
                            InputProps={{ sx: fieldStyles }}
                            disabled={isSubmitting}
                            error={!!errors.sgst}
                            helperText={errors.sgst}
                        />

                        <TextField
                            label="IGST Rate"
                            placeholder="Enter IGST Rate"
                            value={form.igst}
                            onChange={(e) => handleChange('igst', e.target.value)}
                            fullWidth
                            variant="outlined"
                            InputProps={{ sx: fieldStyles }}
                            disabled={isSubmitting}
                            error={!!errors.igst}
                            helperText={errors.igst}
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <Button variant="outline" onClick={handleReset} className="px-6 py-2" disabled={isSubmitting}>Reset</Button>
                        <Button onClick={handleApply} style={{ backgroundColor: '#6C2150' }} className="text-white px-6 py-2" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Please wait...</>
                            ) : (
                                'Apply'
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddSacHsn;