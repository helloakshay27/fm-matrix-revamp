import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { X } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

interface FMUserFilterDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: {
        firstname: string;
        lastname: string;
        email: string;
        mobile: string;
        cluster?: string;
    cluster_id?: string | number;
        circle?: string;
        department?: string;
        role?: string;
        report_to_id?: string | number;
    }) => void;
}

// Re-usable helper to optionally shrink label
const shrink = (val: string) => ({ shrink: Boolean(val) || undefined });

export const FMUserFilterDialog = ({ isOpen, onClose, onApplyFilters }: FMUserFilterDialogProps) => {
    // Text fields
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');

    // Dropdown ids (store selected id)
    const [cluster, setCluster] = useState('');
    const [circle, setCircle] = useState('');
    const [department, setDepartment] = useState('');
    const [role, setRole] = useState('');

    // Loaded lists
    const [clusters, setClusters] = useState<any[]>([]);
    const [circles, setCircles] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [loadingLists, setLoadingLists] = useState(false);

    // Line manager async search
    const [lmQuery, setLmQuery] = useState('');
    const [lmOptions, setLmOptions] = useState<any[]>([]);
    const [lmLoading, setLmLoading] = useState(false);
    const [selectedLineManager, setSelectedLineManager] = useState<any>(null);

    // Fetch dropdown data when dialog opens
    useEffect(() => {
        const fetchLists = async () => {
            if (!isOpen) return;
            setLoadingLists(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl');
                const token = localStorage.getItem('token');
                if (!baseUrl || !token) { setLoadingLists(false); return; }
                const headers = { Authorization: `Bearer ${token}` };
                // Using same fallback company ids as external dialog for now
                const companyID = localStorage.getItem('selectedCompanyId');
                const deptUrl = `https://${baseUrl}/pms/users/get_departments.json?company_id=${companyID}`;
                const circleUrl = `https://${baseUrl}/pms/users/get_circles.json?company_id=${companyID}`;
                const clusterUrl = `https://${baseUrl}/pms/users/get_clusters.json?company_id=${companyID}`;
                const rolesUrl = `https://${baseUrl}/pms/users/get_lock_roles.json?company_id=${companyID}`;
                const [deptResp, circleResp, clusterResp, roleResp] = await Promise.all([
                    axios.get(deptUrl, { headers }),
                    axios.get(circleUrl, { headers }),
                    axios.get(clusterUrl, { headers }),
                    axios.get(rolesUrl, { headers })
                ]);
                setDepartments(deptResp.data?.departments || []);
                setCircles(circleResp.data?.circles || []);
                // Normalize clusters to ensure unique, defined ids and labels
                const rawClusters = clusterResp.data?.clusters || [];
                const normalizedClusters = (Array.isArray(rawClusters) ? rawClusters : []).map((c: any) => {
                    const id = c?.company_cluster_id ?? c?.id ?? c?.company_cluster?.id ?? c?.value ?? c?.key ?? '';
                    const name = c?.cluster_name ?? c?.name ?? c?.label ?? '';
                    return { id, name };
                }).filter((c: any) => c.id !== '' && c.id !== null && typeof c.id !== 'undefined');
                setClusters(normalizedClusters);
                setRoles(roleResp.data?.lock_roles || []);
            } catch (e) {
                console.error('FM filter dropdown fetch error', e);
            } finally { setLoadingLists(false); }
        };
        fetchLists();
    }, [isOpen]);

    // Debounced line manager email search
    useEffect(() => {
        if (!isOpen) return;
        if (lmQuery.length < 4) { setLmOptions([]); return; }
        let active = true;
        const handler = setTimeout(async () => {
            try {
                const baseUrl = localStorage.getItem('baseUrl');
                const token = localStorage.getItem('token');
                const companyID = localStorage.getItem('selectedCompanyId');
                if (!baseUrl || !token || !companyID) { return; }
                setLmLoading(true);
                const url = `https://${baseUrl}/pms/users/company_wise_users.json?company_id=${companyID}&q[email_cont]=${encodeURIComponent(lmQuery)}`;
                const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
                if (!active) return;
                setLmOptions(resp.data?.users || []);
            } catch (e) {
                if (active) setLmOptions([]);
                console.error('Line manager fm filter search error', e);
            } finally { if (active) setLmLoading(false); }
        }, 400);
        return () => { active = false; clearTimeout(handler); };
    }, [lmQuery, isOpen]);

    const handleReset = () => {
        setFirstname('');
        setLastname('');
        setEmail('');
        setMobile('');
        setCluster('');
        setCircle('');
        setDepartment('');
        setRole('');
        setSelectedLineManager(null);
        setLmQuery('');
        // Propagate cleared filters so parent resets table data
        onApplyFilters({
            firstname: '',
            lastname: '',
            email: '',
            mobile: '',
            cluster: '',
            cluster_id: '',
            circle: '',
            department: '',
            role: '',
            report_to_id: ''
        });
    };

    const handleSubmit = () => {
        // Resolve selected names for filters (API expects *_name_cont style fields using actual text values)
        let clusterName = '';
        if (cluster) {
            const found = clusters.find((cl: any) => String(cl.id) === String(cluster));
            clusterName = found ? (found.name || '') : '';
        }
        let circleName = '';
        if (circle) {
            const found = circles.find(c => String(c.id) === String(circle));
            circleName = found ? (found.circle_name || found.name || '') : '';
        }
        let departmentName = '';
        if (department) {
            const found = departments.find(d => String(d.id) === String(department));
            departmentName = found ? (found.department_name || '') : '';
        }
        let roleName = '';
        if (role) {
            const found = roles.find(r => String(r.id) === String(role));
            roleName = found ? (found.name || found.display_name || '') : '';
        }
        const filters = {
            firstname,
            lastname,
            email,
            mobile,
            cluster: clusterName,
            cluster_id: cluster || '',
            circle: circleName,
            department: departmentName,
            role: roleName,
            report_to_id: selectedLineManager?.id ? String(selectedLineManager.id) : ''
        };
        onApplyFilters(filters);
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700, fontSize: 20, borderBottom: '1px solid #eee', pb: 1.5 }}>
                Filter
                <IconButton onClick={onClose} size="small">
                    <X className="w-4 h-4" />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 3, pb: 2 }}>
                <Stack spacing={3} sx={{ mt: 2 }}>
                    <TextField label="First Name" variant="outlined" size="small" value={firstname} onChange={e => setFirstname(e.target.value)} fullWidth InputLabelProps={shrink(firstname)} />
                    <TextField label="Last Name" variant="outlined" size="small" value={lastname} onChange={e => setLastname(e.target.value)} fullWidth InputLabelProps={shrink(lastname)} />
                    <TextField label="Email" variant="outlined" size="small" value={email} onChange={e => setEmail(e.target.value)} fullWidth InputLabelProps={shrink(email)} />
                    <TextField label="Mobile Number" variant="outlined" size="small" value={mobile} onChange={e => setMobile(e.target.value)} fullWidth InputLabelProps={shrink(mobile)} />

                    {/* Cluster */}
                    <FormControl size="small" fullWidth>
                        <InputLabel id="filter-cluster-label">Cluster</InputLabel>
                        <Select
                            labelId="filter-cluster-label"
                            label="Cluster"
                            value={cluster}
                            onChange={(e) => setCluster(String(e.target.value || ''))}
                            disabled={loadingLists}
                            MenuProps={{ disablePortal: true, PaperProps: { sx: { zIndex: 2000 } } }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {clusters.map((c: any) => (
                                <MenuItem key={String(c.id)} value={String(c.id)}>
                                    {c.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Circle */}
                    <FormControl size="small" fullWidth>
                        <InputLabel id="filter-circle-label">Circle</InputLabel>
                        <Select
                            labelId="filter-circle-label"
                            label="Circle"
                            value={circle}
                            onChange={(e) => setCircle(String(e.target.value || ''))}
                            disabled={loadingLists}
                            MenuProps={{ disablePortal: true, PaperProps: { sx: { zIndex: 2000 } } }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {circles.map((c: any) => (
                                <MenuItem key={c.id} value={String(c.id)}>
                                    {c.circle_name || c.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Department */}
                    <FormControl size="small" fullWidth>
                        <InputLabel id="filter-dept-label">Department</InputLabel>
                        <Select
                            labelId="filter-dept-label"
                            label="Department"
                            value={department}
                            onChange={(e) => setDepartment(String(e.target.value || ''))}
                            disabled={loadingLists}
                            MenuProps={{ disablePortal: true, PaperProps: { sx: { zIndex: 2000 } } }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {departments.map((d: any) => (
                                <MenuItem key={d.id} value={String(d.id)}>
                                    {d.department_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Role */}
                    <FormControl size="small" fullWidth>
                        <InputLabel id="filter-role-label">Role</InputLabel>
                        <Select
                            labelId="filter-role-label"
                            label="Role"
                            value={role}
                            onChange={(e) => setRole(String(e.target.value || ''))}
                            disabled={loadingLists}
                            MenuProps={{ disablePortal: true, PaperProps: { sx: { zIndex: 2000 } } }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {roles.map((r: any) => (
                                <MenuItem key={r.id} value={String(r.id)}>
                                    {r.name || r.display_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Line Manager email search */}
                    <TextField
                        fullWidth
                        size="small"
                        label="Line Manager (email search)"
                        placeholder="Type 4+ chars"
                        value={lmQuery}
                        onChange={(e) => setLmQuery(e.target.value)}
                        InputProps={{
                            endAdornment: lmLoading ? <CircularProgress color="inherit" size={16} /> : null,
                        }}
                    />
                    {lmOptions.length > 0 && (
                        <FormControl size="small" fullWidth>
                            <InputLabel id="filter-lm-label">Select Line Manager</InputLabel>
                            <Select
                                labelId="filter-lm-label"
                                label="Select Line Manager"
                                value={selectedLineManager?.id ? String(selectedLineManager.id) : ''}
                                onChange={(e) => {
                                    const id = String(e.target.value || '');
                                    const found = lmOptions.find((u: any) => String(u.id) === id);
                                    setSelectedLineManager(found || null);
                                }}
                                MenuProps={{ disablePortal: true, PaperProps: { sx: { zIndex: 2000 } } }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {lmOptions.map((u: any) => (
                                    <MenuItem key={u.id} value={String(u.id)}>
                                        {u.email || u.name || `User ${u.id}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
                <Button variant="outline" onClick={handleReset} className="border-gray-300 text-gray-700 hover:bg-gray-50">Reset</Button>
                <Button onClick={handleSubmit} className="bg-red-500 hover:bg-red-600 text-white">Apply</Button>
            </DialogActions>
        </Dialog>
    );
};
