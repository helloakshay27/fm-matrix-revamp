import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { Button } from '@/components/ui/button';
import Stack from '@mui/material/Stack';
import { X } from 'lucide-react';
import axios from 'axios';


interface MSafeFilterDialogProps {
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

export const ExternalFilterDialog = ({ isOpen, onClose, onApplyFilters }: MSafeFilterDialogProps) => {
  // --- Handlers must be declared before JSX usage ---
  const handleSubmit = () => {
    // Find the selected names for all dropdowns
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
    let lineManagerName = '';
    if (selectedLineManager) {
      lineManagerName = selectedLineManager.name || selectedLineManager.email || '';
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
      report_to_id: lineManagerName
    };
    onApplyFilters(filters);
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
  };
  // --- Handlers must be declared before JSX usage ---
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [cluster, setCluster] = useState(''); // will store company_cluster_id
  const [circle, setCircle] = useState(''); // will store circle id
  const [department, setDepartment] = useState(''); // will store department id
  const [role, setRole] = useState(''); // will store role id

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

  // Fetch dropdown data when dialog opens
  useEffect(() => {
    const fetchLists = async () => {
      if (!isOpen) return; // only load when open
      setLoadingLists(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) { setLoadingLists(false); return; }
        const headers = { Authorization: `Bearer ${token}` };
        const companyIdDeptCircle = 15; // fallback like edit page
        const companyIdClustersRoles = 145; // fallback used earlier
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
        console.error('Filter dropdown fetch error', e);
      } finally { setLoadingLists(false); }
    };
    fetchLists();
  }, [isOpen]);


  // Debounced line manager search (email substring) similar to edit page
  useEffect(() => {
    if (!isOpen) return; // only active when dialog is open
    if (lmQuery.length < 4) { setLmOptions([]); return; }
    let active = true;
    const handler = setTimeout(async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) return;
        setLmLoading(true);
        const companyId = 15; // fallback consistent with other lookups
        const url = `https://${baseUrl}/pms/users/company_wise_users.json?company_id=${companyId}&q[email_cont]=${encodeURIComponent(lmQuery)}`;
        const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!active) return;
        setLmOptions(resp.data?.users || []);
      } catch (e) {
        console.error('Line manager filter search error', e);
        if (active) setLmOptions([]);
      } finally { if (active) setLmLoading(false); }
    }, 400);
    return () => { active = false; clearTimeout(handler); };
  }, [lmQuery, isOpen]);

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
          <TextField
            label="First Name"
            variant="outlined"
            size="small"
            value={firstname}
            onChange={e => setFirstname(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: Boolean(firstname) || undefined }}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            size="small"
            value={lastname}
            onChange={e => setLastname(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: Boolean(lastname) || undefined }}
          />
          <TextField
            label="Email"
            variant="outlined"
            size="small"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: Boolean(email) || undefined }}
          />
          <TextField
            label="Mobile Number"
            variant="outlined"
            size="small"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: Boolean(mobile) || undefined }}
          />
          <FormControl fullWidth size="small" disabled={loadingLists}>
            <InputLabel>Cluster</InputLabel>
            <Select label="Cluster" value={cluster} onChange={e => setCluster(e.target.value as string)}>
              <MenuItem value=""><em>All</em></MenuItem>
              {clusters.map(cl => (
                <MenuItem key={cl.company_cluster_id} value={cl.company_cluster_id}>{cl.cluster_name || `Cluster ${cl.company_cluster_id}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" disabled={loadingLists}>
            <InputLabel>Circle</InputLabel>
            <Select label="Circle" value={circle} onChange={e => setCircle(e.target.value as string)}>
              <MenuItem value=""><em>All</em></MenuItem>
              {circles.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.circle_name || c.name || `Circle ${c.id}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" disabled={loadingLists}>
            <InputLabel>Department</InputLabel>
            <Select label="Department" value={department} onChange={e => setDepartment(e.target.value as string)}>
              <MenuItem value=""><em>All</em></MenuItem>
              {departments.map(d => (
                <MenuItem key={d.id} value={d.id}>{d.department_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" disabled={loadingLists}>
            <InputLabel>Role</InputLabel>
            <Select label="Role" value={role} onChange={e => setRole(e.target.value as string)}>
              <MenuItem value=""><em>All</em></MenuItem>
              {roles.map(r => (
                <MenuItem key={r.id} value={r.id}>{r.name || r.display_name || `Role ${r.id}`}</MenuItem>
                //  <MenuItem key={r.id} value={r.name || r.display_name || `Role ${r.id}`}>{r.name || r.display_name || `Role ${r.id}`}</MenuItem>

              ))}
            </Select>
          </FormControl>
          <Autocomplete
            fullWidth
            size="small"
            options={lmOptions}
            loading={lmLoading}
            value={selectedLineManager}
            isOptionEqualToValue={(option:any, value:any) => option.id === value.id}
            getOptionLabel={(option:any) => option.email || ''}
            onChange={(_, val:any) => setSelectedLineManager(val || null)}
            onInputChange={(_, val, reason) => { if (reason === 'input') setLmQuery(val); }}
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
            renderOption={(props, option:any) => (
              <li {...props} key={option.id}>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{option.email}</span>
                  {option.name && <span className="text-xs text-gray-500">{option.name}</span>}
                </div>
              </li>
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
        <Button
          variant="outline"
          onClick={handleReset}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Reset
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );


  // Debounced line manager search (email substring) similar to edit page
  useEffect(() => {
    if (!isOpen) return; // only active when dialog is open
    if (lmQuery.length < 4) { setLmOptions([]); return; }
    let active = true;
    const handler = setTimeout(async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) return;
        setLmLoading(true);
        const companyId = 15; // fallback consistent with other lookups
        const url = `https://${baseUrl}/pms/users/company_wise_users.json?company_id=${companyId}&q[email_cont]=${encodeURIComponent(lmQuery)}`;
        const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!active) return;
        setLmOptions(resp.data?.users || []);
      } catch (e) {
        console.error('Line manager filter search error', e);
        if (active) setLmOptions([]);
      } finally { if (active) setLmLoading(false); }
    }, 400);
    return () => { active = false; clearTimeout(handler); };
  }, [lmQuery, isOpen]);

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
          <TextField
            label="First Name"
            variant="outlined"
            size="small"
            value={firstname}
            onChange={e => setFirstname(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: Boolean(firstname) || undefined }}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            size="small"
            value={lastname}
            onChange={e => setLastname(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: Boolean(lastname) || undefined }}
          />
          <TextField
            label="Email"
            variant="outlined"
            size="small"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: Boolean(email) || undefined }}
          />
          <TextField
            label="Mobile Number"
            variant="outlined"
            size="small"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: Boolean(mobile) || undefined }}
          />
          <FormControl fullWidth size="small" disabled={loadingLists}>
            <InputLabel>Cluster</InputLabel>
            <Select label="Cluster" value={cluster} onChange={e => setCluster(e.target.value as string)}>
              <MenuItem value=""><em>All</em></MenuItem>
              {clusters.map(cl => (
                <MenuItem key={cl.company_cluster_id} value={cl.company_cluster_id}>{cl.cluster_name || `Cluster ${cl.company_cluster_id}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" disabled={loadingLists}>
            <InputLabel>Circle</InputLabel>
            <Select label="Circle" value={circle} onChange={e => setCircle(e.target.value as string)}>
              <MenuItem value=""><em>All</em></MenuItem>
              {circles.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.circle_name || c.name || `Circle ${c.id}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" disabled={loadingLists}>
            <InputLabel>Department</InputLabel>
            <Select label="Department" value={department} onChange={e => setDepartment(e.target.value as string)}>
              <MenuItem value=""><em>All</em></MenuItem>
              {departments.map(d => (
                <MenuItem key={d.id} value={d.id}>{d.department_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" disabled={loadingLists}>
            <InputLabel>Role</InputLabel>
            <Select label="Role" value={role} onChange={e => setRole(e.target.value as string)}>
              <MenuItem value=""><em>All</em></MenuItem>
              {roles.map(r => (
                <MenuItem key={r.id} value={r.id}>{r.name || r.display_name || `Role ${r.id}`}</MenuItem>
                //  <MenuItem key={r.id} value={r.name || r.display_name || `Role ${r.id}`}>{r.name || r.display_name || `Role ${r.id}`}</MenuItem>

              ))}
            </Select>
          </FormControl>
          <Autocomplete
            fullWidth
            size="small"
            options={lmOptions}
            loading={lmLoading}
            value={selectedLineManager}
            isOptionEqualToValue={(option:any, value:any) => option.id === value.id}
            getOptionLabel={(option:any) => option.email || ''}
            onChange={(_, val:any) => setSelectedLineManager(val || null)}
            onInputChange={(_, val, reason) => { if (reason === 'input') setLmQuery(val); }}
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
            renderOption={(props, option:any) => (
              <li {...props} key={option.id}>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{option.email}</span>
                  {option.name && <span className="text-xs text-gray-500">{option.name}</span>}
                </div>
              </li>
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
        <Button
          variant="outline"
          onClick={handleReset}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Reset
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};