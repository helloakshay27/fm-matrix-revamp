import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, MapPin, Upload } from 'lucide-react';

interface Country {
    id: number;
    name: string;
}

const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
];

interface OrgForm {
    name: string;
    description: string;
    country_id: string;
    address: string;
    address_line_two: string;
    country: string;
    city: string;
    state: string;
    pin_code: string;
    mobile: string;
    fax_number: string;
}

const defaultForm: OrgForm = {
    name: '',
    description: '',
    country_id: '',
    address: '',
    address_line_two: '',
    country: '',
    city: '',
    state: '',
    pin_code: '',
    mobile: '',
    fax_number: '',
};

export const OrganisationMaster: React.FC = () => {
    const [form, setForm] = useState<OrgForm>(defaultForm);
    const [orgId, setOrgId] = useState<number | null>(null);
    const [countries, setCountries] = useState<Country[]>([]);
    const [orgLogo, setOrgLogo] = useState<File | null>(null);
    const [poweredByLogo, setPoweredByLogo] = useState<File | null>(null);
    const [orgLogoPreview, setOrgLogoPreview] = useState<string | null>(null);
    const [poweredByPreview, setPoweredByPreview] = useState<string | null>(null);
    const [orgLogoName, setOrgLogoName] = useState<string>('No file chosen');
    const [poweredByLogoName, setPoweredByLogoName] = useState<string>('No file chosen');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const poweredByLogoRef = useRef<HTMLInputElement>(null);

    // Fetch countries and org data on mount
    useEffect(() => {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const lock_account_id = localStorage.getItem('lock_account_id');
        const organisation_id = localStorage.getItem('organisation_id');

        const fetchCountries = async () => {
            try {
                const res = await axios.get(
                    `https://${baseUrl}/pms/countries.json`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setCountries(res.data || []);
            } catch {
                // fallback: leave empty
            }
        };
        fetchCountries();

    }, []);

    // Fetch existing org on mount
    useEffect(() => {
        const fetchOrg = async () => {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const lock_account_id = localStorage.getItem('lock_account_id');
            // use organisation_id stored on login, fallback to org_id
            const organisation_id = localStorage.getItem('organisation_id') || localStorage.getItem('org_id');

            if (!organisation_id || !baseUrl || !token) {
                setFetching(false);
                return;
            }
            setFetching(true);
            try {
                const res = await axios.get(
                    `https://${baseUrl}/organizations/${organisation_id}.json?lock_account_id=${lock_account_id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                // API may return { organization: {...} } or the object directly
                const org = res.data?.organization || res.data;
                if (org) {
                    setOrgId(org.id);
                    localStorage.setItem('organisation_id', String(org.id));
                    const addr = org.address || {};
                    setForm({
                        name: org.name || '',
                        description: org.description || '',
                        country_id: org.country_id ? String(org.country_id) : '',
                        address: addr.address || '',
                        address_line_two: addr.address_line_two || '',
                        country: addr.country || '',
                        city: addr.city || '',
                        state: addr.state || '',
                        pin_code: addr.pin_code || '',
                        mobile: addr.mobile || '',
                        fax_number: addr.fax_number || '',
                    });
                    if (org.attachfile?.document_url) {
                        setOrgLogoPreview(org.attachfile.document_url);
                        setOrgLogoName(org.attachfile.document_file_name || 'Uploaded file');
                    }
                    if (org.powered_by_attachfile?.document_url) {
                        setPoweredByPreview(org.powered_by_attachfile.document_url);
                        setPoweredByLogoName(org.powered_by_attachfile.document_file_name || 'Uploaded file');
                    }
                }
            } catch (err) {
                toast.error('Failed to load organisation data');
            } finally {
                setFetching(false);
            }
        };
        fetchOrg();
    }, []);

    const handleChange = (field: keyof OrgForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleOrgLogoChange = (file: File | null) => {
        setOrgLogo(file);
        setOrgLogoPreview(file ? URL.createObjectURL(file) : null);
        setOrgLogoName(file ? file.name : 'No file chosen');
    };

    const handlePoweredByChange = (file: File | null) => {
        setPoweredByLogo(file);
        setPoweredByPreview(file ? URL.createObjectURL(file) : null);
        setPoweredByLogoName(file ? file.name : 'No file chosen');
    };

    const validate = (): boolean => {
        if (!form.name.trim()) {
            toast.error('Organisation name is required');
            return false;
        }
        if (form.mobile && !/^\d{10}$/.test(form.mobile)) {
            toast.error('Mobile number must be exactly 10 digits');
            return false;
        }
        if (form.pin_code && !/^\d{6}$/.test(form.pin_code)) {
            toast.error('Pin code must be exactly 6 digits');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const lock_account_id = localStorage.getItem('lock_account_id');
        const organisation_id = localStorage.getItem('organisation_id') || localStorage.getItem('org_id');

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('organization[name]', form.name);
            formData.append('organization[description]', form.description);
            formData.append('organization[country_id]', form.country_id);
            formData.append('organization[address_attributes][address]', form.address);
            formData.append('organization[address_attributes][address_line_two]', form.address_line_two);
            formData.append('organization[address_attributes][country]', form.country);
            formData.append('organization[address_attributes][city]', form.city);
            formData.append('organization[address_attributes][state]', form.state);
            formData.append('organization[address_attributes][pin_code]', form.pin_code);
            formData.append('organization[address_attributes][mobile]', form.mobile);
            formData.append('organization[address_attributes][fax_number]', form.fax_number);

            if (orgLogo) formData.append('organization[logo]', orgLogo);
            if (poweredByLogo) formData.append('organization[powered_by_logo]', poweredByLogo);

            const url = `https://${baseUrl}/organizations/${organisation_id || orgId}.json?lock_account_id=${lock_account_id}`;
            await axios.put(url, formData, { headers: { Authorization: `Bearer ${token}` } });

            toast.success('Organisation updated successfully');
        } catch {
            toast.error('Failed to update organisation');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center h-screen">
                <CircularProgress style={{ color: '#C72030' }} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="w-full space-y-6">
                <h1 className="text-2xl font-bold">Organisation Master</h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#C72030]">
                                <Building2 className="h-5 w-5" />
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextField
                                    label="Organisation Name *"
                                    placeholder="Enter organisation name"
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={form.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                />
                                <FormControl fullWidth size="small">
                                    <InputLabel shrink>Country</InputLabel>
                                    <Select
                                        label="Country"
                                        displayEmpty
                                        notched
                                        value={form.country_id}
                                        onChange={(e) => handleChange('country_id', e.target.value)}
                                        renderValue={(val) =>
                                            val
                                                ? countries.find((c) => String(c.id) === val)?.name || val
                                                : <span style={{ color: '#aaa' }}>Select country</span>
                                        }
                                    >
                                        <MenuItem value=""><em>Select country</em></MenuItem>
                                        {countries.map((c) => (
                                            <MenuItem key={c.id} value={String(c.id)}>{c.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>

                            <TextField
                                label="Description"
                                placeholder="Enter organisation description"
                                size="small"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={form.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    {/* Logo Upload */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#C72030]">
                                <Upload className="h-5 w-5" />
                                Logo Upload
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Organisation Logo */}
                                <div>
                                    <p className="text-sm font-medium mb-2">Organisation Logo</p>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <input
                                            id="orgLogoInput"
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleOrgLogoChange(e.target.files?.[0] || null)}
                                        />
                                        <label
                                            htmlFor="orgLogoInput"
                                            className="px-4 py-2 rounded-full text-white text-sm cursor-pointer inline-block"
                                            style={{ backgroundColor: '#C72030' }}
                                        >
                                            Choose File
                                        </label>
                                        <span className="text-sm text-muted-foreground">
                                            {orgLogoName}
                                        </span>
                                    </div>
                                    {orgLogoPreview && (
                                        <div className="mt-3 relative w-20 h-20 border rounded-md overflow-hidden">
                                            <img src={orgLogoPreview} alt="logo preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => { setOrgLogo(null); setOrgLogoPreview(null); }}
                                                className="absolute top-1 right-1 bg-white rounded-full px-1 text-xs shadow"
                                            >✕</button>
                                        </div>
                                    )}
                                </div>

                                {/* Powered By Logo */}
                                <div>
                                    <p className="text-sm font-medium mb-2">Powered By Logo</p>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={poweredByLogoRef}
                                            style={{ display: 'none' }}
                                            onChange={(e) => handlePoweredByChange(e.target.files?.[0] || null)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => poweredByLogoRef.current?.click()}
                                            className="px-4 py-2 rounded-full text-white text-sm"
                                            style={{ backgroundColor: '#C72030' }}
                                        >
                                            Choose Files
                                        </button>
                                        <span className="text-sm text-muted-foreground">
                                            {poweredByLogoName}
                                        </span>
                                    </div>
                                    {poweredByPreview && (
                                        <div className="mt-3 relative w-20 h-20 border rounded-md overflow-hidden">
                                            <img src={poweredByPreview} alt="powered by preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => { setPoweredByLogo(null); setPoweredByPreview(null); }}
                                                className="absolute top-1 right-1 bg-white rounded-full px-1 text-xs shadow"
                                            >✕</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#C72030]">
                                <MapPin className="h-5 w-5" />
                                Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextField
                                    label="Address Line 1"
                                    placeholder="Flat / House no, Building name"
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={form.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                />
                                <TextField
                                    label="Address Line 2"
                                    placeholder="Area, locality, street"
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={form.address_line_two}
                                    onChange={(e) => handleChange('address_line_two', e.target.value)}
                                />
                                <TextField
                                    label="City"
                                    placeholder="Enter city"
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={form.city}
                                    onChange={(e) => handleChange('city', e.target.value)}
                                />
                                <FormControl fullWidth size="small">
                                    <InputLabel shrink>State</InputLabel>
                                    <Select
                                        label="State"
                                        displayEmpty
                                        notched
                                        value={form.state}
                                        onChange={(e) => handleChange('state', e.target.value)}
                                        renderValue={(val) =>
                                            val || <span style={{ color: '#aaa' }}>Select state</span>
                                        }
                                    >
                                        <MenuItem value=""><em>Select state</em></MenuItem>
                                        {INDIAN_STATES.map((s) => (
                                            <MenuItem key={s} value={s}>{s}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Country"
                                    placeholder="Enter country"
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={form.country}
                                    onChange={(e) => handleChange('country', e.target.value)}
                                />
                                <TextField
                                    label="Pin Code"
                                    placeholder="Enter 6-digit pin code"
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ maxLength: 6 }}
                                    value={form.pin_code}
                                    onChange={(e) => {
                                        if (/^\d*$/.test(e.target.value)) handleChange('pin_code', e.target.value);
                                    }}
                                />
                                <TextField
                                    label="Mobile"
                                    placeholder="Enter 10-digit mobile number"
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ maxLength: 10 }}
                                    value={form.mobile}
                                    onChange={(e) => {
                                        if (/^\d*$/.test(e.target.value)) handleChange('mobile', e.target.value);
                                    }}
                                />
                                <TextField
                                    label="Fax Number"
                                    placeholder="Enter fax number (optional)"
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={form.fax_number}
                                    onChange={(e) => handleChange('fax_number', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-center gap-3 pb-6">
                        <Button
                            type="submit"
                            disabled={loading}
                            style={{ backgroundColor: '#C72030', color: 'white' }}
                        >
                            {loading ? <CircularProgress size={18} color="inherit" /> : 'Save'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setForm(defaultForm)}
                        >
                            Cancel
                        </Button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrganisationMaster;
