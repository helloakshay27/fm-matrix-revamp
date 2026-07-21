import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// Autocomplete removed in favor of Select-based controls
import CircularProgress from '@mui/material/CircularProgress';
// Stack removed in favor of CSS grid using Box
import axios from 'axios';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MSafeFilterDialogProps {
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

export const ExternalFilterDialog = ({ isOpen, onClose, onApplyFilters }: MSafeFilterDialogProps) => {
  // form state
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [cluster, setCluster] = useState('');
  const [circle, setCircle] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');

  // lookup data
  const [clusters, setClusters] = useState<any[]>([]);
  const [circles, setCircles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);

  // line manager async search
  const [lmQuery, setLmQuery] = useState('');
  const [lmOptions, setLmOptions] = useState<any[]>([]);
  const [lmLoading, setLmLoading] = useState(false);
  const [selectedLineManager, setSelectedLineManager] = useState<any>(null);

  // fetch dropdown metadata
  useEffect(() => {
    const fetchLists = async () => {
      if (!isOpen) return;
      setLoadingLists(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const companyID = localStorage.getItem('selectedCompanyId');
        if (!baseUrl || !token || !companyID) { setLoadingLists(false); return; }
        const headers = { Authorization: `Bearer ${token}` };
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
        // Normalize clusters to ensure unique ids and labels
        const rawClusters = clusterResp.data?.clusters || [];
        const normalizedClusters = (Array.isArray(rawClusters) ? rawClusters : []).map((c: any) => {
          const id = c?.company_cluster_id ?? c?.id ?? c?.company_cluster?.id ?? c?.value ?? c?.key ?? '';
          const name = c?.cluster_name ?? c?.name ?? c?.label ?? '';
          return { id, name };
        }).filter((c: any) => c.id !== '' && c.id !== null && typeof c.id !== 'undefined');
        setClusters(normalizedClusters);
        setRoles(roleResp.data?.lock_roles || []);
      } catch (err) {
        console.error('Filter dropdown fetch error', err);
      } finally {
        setLoadingLists(false);
      }
    };
    fetchLists();
  }, [isOpen]);

  // line manager email search (debounced)
  useEffect(() => {
    if (!isOpen) return;
    if (lmQuery.length < 4) { setLmOptions([]); return; }
    let active = true;
    const t = setTimeout(async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const companyID = localStorage.getItem('selectedCompanyId');
        if (!baseUrl || !token || !companyID) return;
        setLmLoading(true);
        const url = `https://${baseUrl}/pms/users/company_wise_users.json?company_id=${companyID}&q[email_cont]=${encodeURIComponent(lmQuery)}`;
        const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!active) return;
        setLmOptions(resp.data?.users || []);
      } catch (err) {
        console.error('Line manager filter search error', err);
        if (active) setLmOptions([]);
      } finally {
        if (active) setLmLoading(false);
      }
    }, 400);
    return () => { active = false; clearTimeout(t); };
  }, [lmQuery, isOpen]);

  const handleSubmit = () => {
    const clusterName = cluster ? (clusters.find((cl: any) => String(cl.id) === String(cluster))?.name || '') : '';
    const circleName = circle ? (circles.find(c => String(c.id) === String(circle))?.circle_name || circles.find(c => String(c.id) === String(circle))?.name || '') : '';
    const departmentName = department ? (departments.find(d => String(d.id) === String(department))?.department_name || '') : '';
    const roleName = role ? (roles.find(r => String(r.id) === String(role))?.name || roles.find(r => String(r.id) === String(role))?.display_name || '') : '';
  // Use actual line manager email (not id or name) for filtering like MSafeDashboard
  const lineManagerEmail = selectedLineManager?.email || '';
    onApplyFilters({
      firstname,
      lastname,
      email,
      mobile,
      cluster: clusterName,
      cluster_id: cluster || '',
      circle: circleName,
      department: departmentName,
      role: roleName,
  report_to_id: lineManagerEmail
    });
    onClose();
  };

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
    // Propagate cleared filters so the external users table resets
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

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700, fontSize: 20, borderBottom: '1px solid #eee', pb: 1.5 }}>
        Filter
        <IconButton onClick={onClose} size="small">
          <X className="w-4 h-4" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ display: 'grid', gap: 2, mt: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
          <TextField label="First Name" size="small" value={firstname} onChange={e => setFirstname(e.target.value)} fullWidth InputLabelProps={{ shrink: Boolean(firstname) || undefined }} />
          <TextField label="Last Name" size="small" value={lastname} onChange={e => setLastname(e.target.value)} fullWidth InputLabelProps={{ shrink: Boolean(lastname) || undefined }} />
          <TextField label="Email" size="small" value={email} onChange={e => setEmail(e.target.value)} fullWidth InputLabelProps={{ shrink: Boolean(email) || undefined }} />
          <TextField label="Mobile Number" size="small" value={mobile} onChange={e => setMobile(e.target.value)} fullWidth InputLabelProps={{ shrink: Boolean(mobile) || undefined }} />
          <FormControl fullWidth size="small" disabled={loadingLists}>
            <InputLabel>Cluster</InputLabel>
            <Select
              label="Cluster"
              value={cluster}
              onChange={e => setCluster(e.target.value as string)}
              MenuProps={{ disablePortal: true, PaperProps: { sx: { zIndex: 2000 } } }}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {clusters.map((cl: any) => (
                <MenuItem key={String(cl.id)} value={String(cl.id)}>{cl.name || `Cluster ${cl.id}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" disabled={loadingLists}>
            <InputLabel>Circle</InputLabel>
            <Select
              label="Circle"
              value={circle}
              onChange={e => setCircle(e.target.value as string)}
              MenuProps={{ disablePortal: true, PaperProps: { sx: { zIndex: 2000 } } }}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {circles.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.circle_name || c.name || `Circle ${c.id}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" disabled={loadingLists}>
            <InputLabel>Department</InputLabel>
            <Select
              label="Department"
              value={department}
              onChange={e => setDepartment(e.target.value as string)}
              MenuProps={{ disablePortal: true, PaperProps: { sx: { zIndex: 2000 } } }}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {departments.map(d => (
                <MenuItem key={d.id} value={d.id}>{d.department_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" disabled={loadingLists}>
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              value={role}
              onChange={e => setRole(e.target.value as string)}
              MenuProps={{ disablePortal: true, PaperProps: { sx: { zIndex: 2000 } } }}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {roles.map(r => (
                <MenuItem key={r.id} value={r.id}>{r.name || r.display_name || `Role ${r.id}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Line Manager email search and selection */}
          <TextField
            fullWidth
            size="small"
            label="Line Manager (email search)"
            placeholder="Type 4+ chars"
            value={lmQuery}
            onChange={(e) => setLmQuery(e.target.value)}
            InputProps={{ endAdornment: lmLoading ? <CircularProgress color="inherit" size={16} /> : null }}
          />
          {lmOptions.length > 0 && (
            <FormControl fullWidth size="small">
              <InputLabel>Select Line Manager</InputLabel>
              <Select
                label="Select Line Manager"
                value={selectedLineManager?.id ? String(selectedLineManager.id) : ''}
                onChange={(e) => {
                  const id = String(e.target.value || '');
                  const found = lmOptions.find((u: any) => String(u.id) === id);
                  setSelectedLineManager(found || null);
                }}
                MenuProps={{ disablePortal: true, PaperProps: { sx: { zIndex: 2000 } } }}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {lmOptions.map((u: any) => (
                  <MenuItem key={u.id} value={String(u.id)}>
                    {u.email || u.name || `User ${u.id}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
        <Button variant="outline" onClick={handleReset} className="border-gray-300 text-gray-700 hover:bg-gray-50">Reset</Button>
        <Button onClick={handleSubmit} className="bg-red-500 hover:bg-red-600 text-white">Apply</Button>
      </DialogActions>
    </Dialog>
  );
};