import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
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
        const companyIdDeptCircle = 15;
        const companyIdClustersRoles = 145;
        const deptUrl = `https://${baseUrl}/pms/users/get_departments.json?company_id=${companyIdDeptCircle}`;
        const circleUrl = `https://${baseUrl}/pms/users/get_circles.json?company_id=${companyIdDeptCircle}`;
        const clusterUrl = `https://${baseUrl}/pms/users/get_clusters.json?company_id=${companyIdClustersRoles}`;
        const rolesUrl = `https://${baseUrl}/pms/users/get_lock_roles.json?company_id=${companyIdClustersRoles}`;
        const [deptResp, circleResp, clusterResp, roleResp] = await Promise.all([
          axios.get(deptUrl, { headers }),
          axios.get(circleUrl, { headers }),
          axios.get(clusterUrl, { headers }),
          axios.get(rolesUrl, { headers })
        ]);
        setDepartments(deptResp.data?.departments || []);
        setCircles(circleResp.data?.circles || []);
        setClusters(clusterResp.data?.clusters || []);
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
        if (!baseUrl || !token) return;
        setLmLoading(true);
        const companyId = 15; // fallback
        const url = `https://${baseUrl}/pms/users/company_wise_users.json?company_id=${companyId}&q[email_cont]=${encodeURIComponent(lmQuery)}`;
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
  };

  const handleSubmit = () => {
    // Resolve selected names for filters (API expects *_name_cont style fields using actual text values)
    let clusterName = '';
    if (cluster) {
      const found = clusters.find(cl => String(cl.company_cluster_id) === String(cluster));
      clusterName = found ? (found.cluster_name || '') : '';
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
          <Autocomplete
            size="small"
            options={clusters}
            value={clusters.find(c => String(c.company_cluster_id) === String(cluster)) || null}
            getOptionLabel={(opt:any) => opt.cluster_name || ''}
            onChange={(_, val:any) => setCluster(val ? String(val.company_cluster_id) : '')}
            loading={loadingLists}
            renderInput={(params) => <TextField {...params} label="Cluster" InputLabelProps={shrink(cluster)} />} />

          {/* Circle */}
            <Autocomplete
              size="small"
              options={circles}
              value={circles.find(c => String(c.id) === String(circle)) || null}
              getOptionLabel={(opt:any) => opt.circle_name || opt.name || ''}
              onChange={(_, val:any) => setCircle(val ? String(val.id) : '')}
              loading={loadingLists}
              renderInput={(params) => <TextField {...params} label="Circle" InputLabelProps={shrink(circle)} />} />

          {/* Department */}
          <Autocomplete
            size="small"
            options={departments}
            value={departments.find(d => String(d.id) === String(department)) || null}
            getOptionLabel={(opt:any) => opt.department_name || ''}
            onChange={(_, val:any) => setDepartment(val ? String(val.id) : '')}
            loading={loadingLists}
            renderInput={(params) => <TextField {...params} label="Department" InputLabelProps={shrink(department)} />} />

          {/* Role */}
          <Autocomplete
            size="small"
            options={roles}
            value={roles.find(r => String(r.id) === String(role)) || null}
            getOptionLabel={(opt:any) => opt.name || opt.display_name || ''}
            onChange={(_, val:any) => setRole(val ? String(val.id) : '')}
            loading={loadingLists}
            renderInput={(params) => <TextField {...params} label="Role" InputLabelProps={shrink(role)} />} />

          {/* Line Manager email search */}
          <Autocomplete
            fullWidth
            size="small"
            options={lmOptions}
            loading={lmLoading}
            value={selectedLineManager}
            isOptionEqualToValue={(option:any, value:any) => option.id === value.id}
            getOptionLabel={(option:any) => option.email || ''}
            onChange={(_, val:any) => setSelectedLineManager(val || null)}
            onInputChange={(_, val) => setLmQuery(val)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Line Manager (email search)"
                placeholder="Type 4+ chars"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {lmLoading ? <CircularProgress color="inherit" size={16} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
            noOptionsText={lmQuery.length < 4 ? 'Type 4+ chars to search' : 'No results'}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
        <Button variant="outline" onClick={handleReset} className="border-gray-300 text-gray-700 hover:bg-gray-50">Reset</Button>
        <Button onClick={handleSubmit} className="bg-red-500 hover:bg-red-600 text-white">Apply</Button>
      </DialogActions>
    </Dialog>
  );
};
