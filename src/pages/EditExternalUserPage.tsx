import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextField, Select, MenuItem, FormControl, InputLabel, Autocomplete, CircularProgress } from '@mui/material';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import axios from 'axios';

export const EditExternalUserPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Keep only required fields
  const initialUser = location.state?.user || {
    id: Number(userId),
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    gender: '',
    // renamed to report_to_id for payload requirement
    report_to_id: '',
    department_id: '',
    circle_id: '',
  company_cluster_id: '',
    work_location: '', // added explicit work_location field to sync with dropdown storing name
    role_id: ''
  };

  const [formData, setFormData] = useState<any>(initialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalUser, setOriginalUser] = useState<any>(null); // full fetched user for extra fields
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [circles, setCircles] = useState<any[]>([]);
  const [workLocations, setWorkLocations] = useState<any[]>([]);
  const [clusters, setClusters] = useState<any[]>([]);
  // line manager async search states
  const [lmQuery, setLmQuery] = useState('');
  const [lmOptions, setLmOptions] = useState<any[]>([]);
  const [lmLoading, setLmLoading] = useState(false);
  const [selectedLineManager, setSelectedLineManager] = useState<any>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Normalize gender coming from API (M/F/male/female) to lowercase 'male' | 'female'
  const normalizeGender = (g: string) => {
    if (!g) return '';
    const lower = g.toLowerCase();
    if (lower === 'm') return 'male';
    if (lower === 'f') return 'female';
    if (lower === 'male' || lower === 'female') return lower;
    return g; // fallback
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!userId) return;
    setSaving(true);
    try {
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  if (!baseUrl || !token) throw new Error('Missing base URL or token');
      const permission = originalUser?.lock_user_permission || {};
      const payload = {
        user: {
          firstname: formData.firstname || '',
          lastname: formData.lastname || '',
          email: formData.email || '',
          mobile: formData.mobile || '',
          gender: (formData.gender || '').toLowerCase(),
          // send the selected work location NAME (stored in formData.work_location)
          work_location: formData.work_location || null,
          role_id: formData.role_id || permission.lock_role_id || null,
          report_to_id: formData.report_to_id || selectedLineManager?.id || null,
          company_cluster_id: formData.company_cluster_id || null,

          lock_user_permissions_attributes: permission?.id ? [
            {
              id: permission.id,
              department_id: formData.department_id || null,
              lock_role_id: formData.role_id || null,
              circle_id: formData.circle_id || null,

            }
          ] : []
        }
      };
      const url = `https://${baseUrl}/pms/users/${userId}/update_vi_user`;
      await axios.put(url, payload, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('External user updated');
      navigate(`/maintenance/m-safe/external/user/${userId}`, { state: { user: { ...originalUser, ...formData } } });
    } catch (e: any) {
      console.error('Update external user error', e);
      const respData = e?.response?.data;
      let errors: string[] = [];
      if (respData) {
        if (Array.isArray(respData.errors)) {
          errors = respData.errors;
        } else if (respData.error) {
          errors = [respData.error];
        } else if (respData.errors && typeof respData.errors === 'object') {
          Object.entries(respData.errors).forEach(([k, v]) => {
            if (Array.isArray(v)) v.forEach(msg => errors.push(`${k} ${msg}`));
          });
        }
      }
      const emailErr = errors.find(er => /email/i.test(er) && /(taken|exists|already)/i.test(er));
      if (emailErr) setFieldErrors(prev => ({ ...prev, email: emailErr }));
      if (errors.length) {
        toast.error(errors[0]);
      } else {
        toast.error('Failed to update user');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate(`/maintenance/m-safe/external/user/${userId}`, { state: { user: location.state?.user || initialUser } });


  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      setLoading(true); setError(null);
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) { setError('Missing base URL or token'); setLoading(false); return; }
        const url = `https://${baseUrl}/pms/users/${userId}/user_show.json`;
        const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = resp.data?.user || resp.data;
        setFormData((prev: any) => ({
          ...prev,
          firstname: data.firstname || '',
          lastname: data.lastname || '',
          email: data.email || '',
          mobile: data.mobile || '',
          gender: normalizeGender(data.gender || ''),
          report_to_id: data.report_to?.id || data.report_to_id || '',
          department_id: data.lock_user_permission?.department_id || '',
          circle_id: data.lock_user_permission?.circle_id || data.circle_id || '',
          cluster_name: data.cluster_name || '',
          // if API returns an object, pick its name; else keep string
          work_location: (typeof data.work_location === 'object' && data.work_location !== null) ? (data.work_location.name || data.work_location.work_location_name || '') : (data.work_location || ''),
          role_id: data.lock_user_permission?.lock_role_id || data.lock_role_id || ''
        }));
        setOriginalUser(data);
        // Inject existing line manager into Autocomplete options so it displays even before any search
        const existingManager = data.report_to || (data.report_to_id ? { id: data.report_to_id, email: data.report_to_email, name: data.report_to_name } : null);
        if (existingManager && existingManager.id) {
          setSelectedLineManager(existingManager);
          setLmOptions(prev => prev.some(o=>o.id===existingManager.id) ? prev : [existingManager, ...prev]);
        }
      } catch (e: any) {
        console.error('Fetch external user (edit) error', e);
        setError('Failed to load user');
      } finally { setLoading(false); }
    };
    fetchUser();
  }, [userId]);

  console.log('formData', formData);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) return;
        const companyId = formData.company_id || 15; // fallback
        const url = `https://${baseUrl}/pms/users/get_departments.json?company_id=${companyId}`;
        const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        const list = resp.data?.departments || [];
        setDepartments(list);
      } catch (e) {
        console.error('Fetch departments error', e);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) return;
        const companyIdForRoles = formData.company_id; // use provided company 145 as default
        const url = `https://${baseUrl}/pms/users/get_lock_roles.json?company_id=${companyIdForRoles}`;
        const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        const list = resp.data?.lock_roles || [];
        setRoles(list);
      } catch (e) {
        console.error('Fetch roles error', e);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchCircles = async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) return;
        const companyId = formData.company_id || 15;
        const url = `https://${baseUrl}/pms/users/get_circles.json?company_id=${companyId}`;
        const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        setCircles(resp.data?.circles || []);
      } catch (e) { console.error('Fetch circles error', e); }
    };
    fetchCircles();
  }, []);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) return;
        const companyId = formData.company_id || 145; // given API uses 145
        const url = `https://${baseUrl}/pms/users/get_clusters.json?company_id=${companyId}`;
        const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        setClusters(resp.data?.clusters || []);
      } catch (e) { console.error('Fetch clusters error', e); }
    };
    fetchClusters();
  }, []);

  useEffect(() => {
    const fetchWorkLocations = async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) return;
        const companyId = formData.company_id || 15;
        const url = `https://${baseUrl}/pms/users/get_work_locations.json?company_id=${companyId}`;
        const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        setWorkLocations(resp.data?.work_locations || []);
      } catch (e) { console.error('Fetch work locations error', e); }
    };
    fetchWorkLocations();
  }, []);

  // Debounced Line Manager search
  useEffect(() => {
    if (lmQuery.length < 4) { setLmOptions([]); return; }
    let active = true;
    const handler = setTimeout(async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) return;
        setLmLoading(true);
        const companyId = formData.company_id || 15; // fallback if not provided
        // encode query param for email substring search
        const url = `https://${baseUrl}/pms/users/company_wise_users.json?company_id=${companyId}&q[email_cont]=${encodeURIComponent(lmQuery)}`;
        const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!active) return;
        const users = resp.data?.users || [];
        setLmOptions(users);
      } catch (e) {
        console.error('Line manager search error', e);
        if (active) setLmOptions([]);
      } finally {
        if (active) setLmLoading(false);
      }
    }, 400); // 400ms debounce
    return () => { active = false; clearTimeout(handler); };
  }, [lmQuery, formData.company_id]);

  console.log('formData', formData.company_id);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/maintenance/m-safe/external')} className="p-1 hover:bg-gray-100 mr-2"><ArrowLeft className="w-4 h-4" /></Button>
        </div>
        <div className="text-gray-500">Loading user...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/maintenance/m-safe/external')} className="p-1 hover:bg-gray-100 mr-2"><ArrowLeft className="w-4 h-4" /></Button>
        </div>
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Button variant="ghost" size="sm" onClick={handleCancel} className="p-1 hover:bg-gray-100 mr-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">EDIT EXTERNAL USER - ID: {userId}</h1>
      </div>

      {/* Card 1: Basic Details (combined with Contact & Personal) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-[#C72030] flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
            BASIC DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <TextField label="First Name" value={formData.firstname} onChange={e => handleChange('firstname', e.target.value)} size="small" fullWidth />
            <TextField label="Last Name" value={formData.lastname} onChange={e => handleChange('lastname', e.target.value)} size="small" fullWidth />
            <TextField label="Email" type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} size="small" fullWidth error={!!fieldErrors.email} helperText={fieldErrors.email || ''} />
            <TextField label="Mobile" type="number" value={formData.mobile} onChange={e => handleChange('mobile', e.target.value)} size="small" fullWidth />
            <FormControl fullWidth size="small">
              <InputLabel>Gender</InputLabel>
              <Select value={formData.gender} label="Gender" onChange={e => handleChange('gender', e.target.value)}>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
            {/* Line Manager Async Search */}
            <Autocomplete
              fullWidth
              size="small"
              loading={lmLoading}
              options={lmOptions}
              isOptionEqualToValue={(option:any, value:any) => option.id === value.id}
              getOptionLabel={(option: any) => option?.email || ''}
              value={selectedLineManager || (formData.report_to_id && lmOptions.find(o=>o.id===formData.report_to_id)) || null}
              onChange={(_, val: any) => {
                setSelectedLineManager(val || null);
                handleChange('report_to_id', val ? val.id : '');
                if (val) {
                  setLmOptions(prev => {
                    if (prev.some(p=>p.id===val.id)) return prev; return [val, ...prev];
                  });
                }
              }}
              onInputChange={(_, val, reason) => {
                if (reason === 'input') setLmQuery(val);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Line Manager (search by email)"
                  placeholder="Type at least 4 characters"
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
              renderOption={(props, option:any) => (
                <li {...props} key={option.id}>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{option.email}</span>
                    {option.name && <span className="text-xs text-gray-500">{option.name}</span>}
                  </div>
                </li>
              )}
              noOptionsText={lmQuery.length < 4 ? 'Type 4+ chars to search' : 'No results'}
            />
            <FormControl fullWidth size="small">
              <InputLabel>Department</InputLabel>
              <Select value={formData.department_id} label="Department" onChange={e => handleChange('department_id', e.target.value)}>
                <MenuItem value="">Select</MenuItem>
                {departments.map((d: any) => (
                  <MenuItem key={d.id} value={d.id}>{d.department_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Organizational */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-[#C72030] flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">2</span>
            ORGANIZATIONAL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <FormControl fullWidth size="small">
              <InputLabel>Circle</InputLabel>
              <Select value={formData.circle_id} label="Circle" onChange={e => handleChange('circle_id', e.target.value)}>
                <MenuItem value="">Select</MenuItem>
                {circles.map((c: any) => (
                  <MenuItem key={c.id} value={c.id}>{c.circle_name || c.name || `Circle ${c.id}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Cluster</InputLabel>
              <Select value={formData.cluster_name} label="Cluster" onChange={e => handleChange('company_cluster_id', e.target.value)}>
                <MenuItem value="">Select</MenuItem>
                {clusters.map((cl: any) => (
                  <MenuItem key={cl.company_cluster_id} value={cl.company_cluster_id}>{cl.cluster_name || `Cluster ${cl.company_cluster_id}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Work Location</InputLabel>
              <Select value={formData.work_location} label="Work Location" onChange={e => handleChange('work_location', e.target.value)}>
                <MenuItem value="">Select</MenuItem>
                {workLocations.map((w: any) => (
                  <MenuItem key={w.id} value={w.name}>{w.name || w.work_location_name || `Location ${w.id}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select value={formData.role_id} label="Role" onChange={e => handleChange('role_id', e.target.value)}>
                <MenuItem value="">Select</MenuItem>
                {roles.map((r: any) => (
                  <MenuItem key={r.id} value={r.id}>{r.name || r.display_name || `Role ${r.id}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 flex-wrap justify-center pt-4">
        <Button onClick={handleCancel} variant="outline" className="px-8 py-2" disabled={saving}>Cancel</Button>
        <Button onClick={handleSubmit} style={{ backgroundColor: '#C72030' }} className="text-white hover:bg-[#C72030]/90 px-8 py-2" disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};