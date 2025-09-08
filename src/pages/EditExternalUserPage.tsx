import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress, FormHelperText } from '@mui/material';
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
    cluster_name: '',
    work_location: '', // added explicit work_location field to sync with dropdown storing name
    role_id: '',
    // newly added editable fields
    ext_company_name: '', // Company Name
    org_user_id: '',      // Employer Code
    birth_date: '',       // Birth Date (YYYY-MM-DD)
    joining_date: ''      // Joining Date (YYYY-MM-DD)
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
  // Local search input ref for focusing when the menu opens
  const lmSearchInputRef = useRef<HTMLInputElement | null>(null);
  const [lmMenuId] = useState(() => `lm-menu-${Math.random().toString(36).slice(2)}`);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Simple email format validator
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).trim());

  // Mobile helpers: digits only and 10-digit validator
  const normalizeDigits = (v: any) => String(v ?? '').replace(/\D/g, '');
  const isValidMobile = (v: any) => normalizeDigits(v).length === 10;

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
    // Live mobile sanitization + validation
    if (field === 'mobile') {
      const digits = normalizeDigits(value).slice(0, 10);
      setFormData((prev: any) => ({ ...prev, mobile: digits }));
      setFieldErrors(prev => ({
        ...prev,
        mobile: digits && digits.length !== 10 ? 'Enter a valid 10-digit mobile number' : ''
      }));
      return;
    }
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    // Field-specific validations (live)
    if (field === 'email') {
      const v = String(value || '');
      setFieldErrors(prev => ({
        ...prev,
        email: v && !isValidEmail(v) ? 'Enter a valid email address' : ''
      }));
      return;
    }
    // Clear existing field error on change for other fields
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Helper to treat various empties consistently
  const isEmpty = (v: any) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');

  // Build validation errors without side effects
  const getErrors = () => {
    const errors: Record<string, string> = {};
    const requiredFields: Array<[string, string]> = [
      ['firstname', 'First Name'],
      ['lastname', 'Last Name'],
      ['email', 'Email'],
      ['mobile', 'Mobile'],
      ['ext_company_name', 'Company Name'],
      ['org_user_id', 'Employer Code'],
      ['gender', 'Gender'],
      ['report_to_id', 'Line Manager'],
      ['department_id', 'Department'],
      ['circle_id', 'Circle'],
      ['company_cluster_id', 'Cluster'],
      ['work_location', 'Work Location'],
      ['role_id', 'Role'],
      ['birth_date', 'Birth Date'],
      ['joining_date', 'Joining Date'],
    ];

    requiredFields.forEach(([key, label]) => {
      const val = (formData as any)[key];
      if (isEmpty(val)) {
        errors[key] = `${label} is required`;
      }
    });

    // Email format
    if (!isEmpty(formData.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(formData.email))) {
      errors.email = 'Enter a valid email address';
    }
    // Mobile: require exactly 10 digits
    if (!isEmpty(formData.mobile) && !isValidMobile(formData.mobile)) {
      errors.mobile = errors.mobile || 'Enter a valid 10-digit mobile number';
    }
    // Date format YYYY-MM-DD (HTML date inputs generally ensure this, but validate anyway)
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    if (!isEmpty(formData.birth_date) && !dateRe.test(String(formData.birth_date))) {
      errors.birth_date = 'Birth Date must be YYYY-MM-DD';
    }
    if (!isEmpty(formData.joining_date) && !dateRe.test(String(formData.joining_date))) {
      errors.joining_date = 'Joining Date must be YYYY-MM-DD';
    }
    return errors;
  };

  // Disable Save when there are validation errors
  const saveBlocked = useMemo(() => Object.keys(getErrors()).length > 0, [formData]);

  const handleSubmit = async () => {
    const errors = getErrors();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      const missing = Object.values(errors)
        .filter(msg => /required$/i.test(msg))
        .map(msg => msg.replace(' is required', ''));
      if (missing.length) {
        toast.info(`Please fill in the following required fields: ${missing.join(', ')}`);
      } else {
        toast.info('Please fix the highlighted fields');
      }
      // Optional: scroll to top so the user sees errors immediately on long forms
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
      return;
    }
    // Determine a valid user id after validation so errors are still shown even if id is missing
    const idForUpdate = userId || formData?.id || originalUser?.id;
    if (!idForUpdate) {
      toast.error('Missing user id');
      return;
    }
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
          // newly added direct user fields
          ext_company_name: formData.ext_company_name || null,
          org_user_id: formData.org_user_id || null,
          birth_date: formData.birth_date || null,
          // keep a top-level joining_date for safety if API accepts it
          // joining_date: formData.joining_date || null,

          lock_user_permissions_attributes: permission?.id ? [
            {
              id: permission.id,
              department_id: formData.department_id || null,
              lock_role_id: formData.role_id || null,
              circle_id: formData.circle_id || null,
              // include joining_date inside permission object (source of truth in listings)
              joining_date: formData.joining_date || null,

            }
          ] : []
        }
      };
  const url = `https://${baseUrl}/pms/users/${idForUpdate}/update_vi_user`;
      await axios.put(url, payload, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('External user updated');
  navigate(`/maintenance/m-safe/external/user/${idForUpdate}`, { state: { user: { ...originalUser, ...formData } } });
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
          company_id: data.company_id || data.lock_user_permission?.company_id || prev.company_id || '',
          firstname: data.firstname || '',
          lastname: data.lastname || '',
          email: data.email || '',
          mobile: data.mobile || '',
          gender: normalizeGender(data.gender || ''),
          report_to_id: data.report_to?.id || data.report_to_id || '',
          department_id: data.lock_user_permission?.department_id || '',
          circle_id: data.lock_user_permission?.circle_id || data.circle_id || '',
          // keep names to show as fallback labels in selects
          department_name: data.lock_user_permission?.department_name || data.department_name || data.department?.department_name || '',
          circle_name: data.circle_name || data.lock_user_permission?.circle_name || data.circle?.circle_name || '',
          cluster_name: data.cluster_name || '',
          company_cluster_id: data.company_cluster_id || data.lock_user_permission?.company_cluster_id || '',
          // if API returns an object, pick its name; else keep string
          work_location: (typeof data.work_location === 'object' && data.work_location !== null) ? (data.work_location.name || data.work_location.work_location_name || '') : (data.work_location || ''),
          role_id: data.lock_user_permission?.lock_role_id || data.lock_role_id || '',
          role_name: data.lock_user_permission?.lock_role_name || data.role_name || data.role?.name || '',
          // new fields populate from either user or lock_user_permission where applicable
          ext_company_name: data.ext_company_name || '',
          org_user_id: data.org_user_id || data.lock_user_permission?.employee_id || '',
          birth_date: (data.birth_date ? String(data.birth_date).slice(0, 10) : ''),
          joining_date: (data.lock_user_permission?.joining_date || data.joining_date || '') ? String(data.lock_user_permission?.joining_date || data.joining_date).slice(0, 10) : ''
        }));
        setOriginalUser(data);
        // Inject existing line manager into Autocomplete options so it displays even before any search
        const existingManager = data.report_to || (data.report_to_id ? { id: data.report_to_id, email: data.report_to_email, name: data.report_to_name } : null);
        if (existingManager && existingManager.id) {
          setSelectedLineManager(existingManager);
          setLmOptions(prev => prev.some(o => o.id === existingManager.id) ? prev : [existingManager, ...prev]);
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

  // Ensure current department appears in dropdown even if API list lacks it
  useEffect(() => {
    const id = formData.department_id;
    if (!id || !departments || departments.length === 0) return;
    const exists = departments.some((d: any) => String(d.id) === String(id));
    if (!exists) {
      const label = formData.department_name || `Department ${id}`;
      setDepartments(prev => [{ id, department_name: label, __synthetic: true }, ...prev]);
    }
  }, [departments.length, formData.department_id, formData.department_name]);

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

  // Ensure current role appears in dropdown even if missing in options
  useEffect(() => {
    const id = formData.role_id;
    if (!id || !roles || roles.length === 0) return;
    const exists = roles.some((r: any) => String(r.id) === String(id));
    if (!exists) {
      const label = formData.role_name || `Role ${id}`;
      setRoles(prev => [{ id, name: label, __synthetic: true }, ...prev]);
    }
  }, [roles.length, formData.role_id, formData.role_name]);

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

  // Ensure current circle appears in dropdown even if missing in options
  useEffect(() => {
    const id = formData.circle_id;
    if (!id || !circles || circles.length === 0) return;
    const exists = circles.some((c: any) => String(c.id) === String(id));
    if (!exists) {
      const label = formData.circle_name || `Circle ${id}`;
      setCircles(prev => [{ id, circle_name: label, __synthetic: true }, ...prev]);
    }
  }, [circles.length, formData.circle_id, formData.circle_name]);

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

  // Ensure current cluster appears in dropdown even if missing in options
  useEffect(() => {
    const id = formData.company_cluster_id;
    if (!id || !clusters || clusters.length === 0) return;
    const exists = clusters.some((cl: any) => String(cl.id) === String(id));
    if (!exists) {
      const label = formData.cluster_name || `Cluster ${id}`;
      setClusters(prev => [{ id, cluster_name: label, __synthetic: true }, ...prev]);
    }
  }, [clusters.length, formData.company_cluster_id, formData.cluster_name]);

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

  // Ensure current work location name appears even if not in list
  useEffect(() => {
    const name = formData.work_location;
    if (!name || !workLocations) return;
    const exists = workLocations.some((w: any) => (w.name || w.work_location_name) === name);
    if (!exists) {
      const id = `synthetic-${name}`;
      setWorkLocations(prev => [{ id, name, __synthetic: true }, ...prev]);
    }
  }, [workLocations.length, formData.work_location]);

  // Clear LM options/loading when query is below threshold
  useEffect(() => {
    if (lmQuery.length < 3) {
      setLmOptions([]);
      setLmLoading(false);
    }
  }, [lmQuery]);

  // Debounced Line Manager search (also triggered via global enhancer events)
  useEffect(() => {
    if (lmQuery.length < 3) { return; }
    let active = true;
    const handler = setTimeout(async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) return;
        setLmLoading(true);
    // Prefer company from user/permission; fallback to 145 then 15
    const companyId = (originalUser?.company_id || originalUser?.lock_user_permission?.company_id || formData.company_id || 145 || 15);
        const url = `https://${baseUrl}/pms/users/company_wise_users.json?company_id=${companyId}&q[email_cont]=${encodeURIComponent(lmQuery)}`;
        const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!active) return;
        const users = resp.data?.users || [];
        setLmOptions(users);
      } catch (e) {
        console.error('Line manager search error', e);
      } finally {
        if (active) setLmLoading(false);
      }
    }, 350);
    return () => { active = false; clearTimeout(handler); };
  }, [lmQuery, formData.company_id, originalUser?.company_id]);

  // No global enhancer dependency: all LM search handled locally in this component
  // Bridge to global enhancer's search input: listen for input events in this menu only
  useEffect(() => {
    const onInput = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target || !(target instanceof HTMLInputElement)) return;
      if (!target.classList.contains('mui-search-input')) return;
      const paper = target.closest('.MuiMenu-paper, .MuiPaper-root') as HTMLElement | null;
      if (!paper || paper.id !== lmMenuId) return;
      setLmQuery(target.value || '');
    };
    document.addEventListener('input', onInput, true);
    return () => document.removeEventListener('input', onInput, true);
  }, [lmMenuId]);

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
            <TextField label={<>First Name<span style={{ color: '#C72030' }}>*</span></>} value={formData.firstname} onChange={e => handleChange('firstname', e.target.value)} size="small" fullWidth error={!!fieldErrors.firstname} helperText={fieldErrors.firstname || ''} />
            <TextField label={<>Last Name<span style={{ color: '#C72030' }}>*</span></>} value={formData.lastname} onChange={e => handleChange('lastname', e.target.value)} size="small" fullWidth error={!!fieldErrors.lastname} helperText={fieldErrors.lastname || ''} />
            <TextField
              label={<>
                Email<span style={{ color: '#C72030' }}>*</span>
              </>}
              type="email"
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              onBlur={e => handleChange('email', e.target.value)}
              size="small"
              fullWidth
              error={!!fieldErrors.email}
              helperText={fieldErrors.email || ''}
              inputProps={{ inputMode: 'email', autoComplete: 'email' }}
            />
            <TextField
              label={<>
                Mobile<span style={{ color: '#C72030' }}>*</span>
              </>}
              value={formData.mobile}
              onChange={e => handleChange('mobile', e.target.value)}
              onBlur={e => handleChange('mobile', e.target.value)}
              size="small"
              fullWidth
              error={!!fieldErrors.mobile}
              helperText={fieldErrors.mobile || ''}
              inputProps={{ inputMode: 'numeric', pattern: '\\d*', maxLength: 10 }}
            />
            <TextField label={<>Company Name<span style={{ color: '#C72030' }}>*</span></>} value={formData.ext_company_name} onChange={e => handleChange('ext_company_name', e.target.value)} size="small" fullWidth error={!!fieldErrors.ext_company_name} helperText={fieldErrors.ext_company_name || ''} />
            <TextField label={<>Employer Code<span style={{ color: '#C72030' }}>*</span></>} value={formData.org_user_id} onChange={e => handleChange('org_user_id', e.target.value)} size="small" fullWidth error={!!fieldErrors.org_user_id} helperText={fieldErrors.org_user_id || ''} />
            <FormControl fullWidth size="small" error={!!fieldErrors.gender}>
              <InputLabel>Gender<span style={{ color: '#C72030' }}>*</span></InputLabel>
              <Select value={formData.gender} label="Gender" onChange={e => handleChange('gender', e.target.value)}>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
              {fieldErrors.gender && <FormHelperText>{fieldErrors.gender}</FormHelperText>}
            </FormControl>
            {/* Line Manager Select with remote search via global enhancer */}
            <FormControl fullWidth size="small" error={!!fieldErrors.report_to_id}>
              <InputLabel>Line Manager<span style={{ color: '#C72030' }}>*</span></InputLabel>
              <Select
                value={formData.report_to_id || ''}
                label="Line Manager"
                onOpen={() => {
                  setLmQuery('');
                }}
                onChange={e => handleChange('report_to_id', e.target.value)}
                MenuProps={{
                  PaperProps: {
                    id: lmMenuId,
                    style: { maxHeight: 48 * 6.5, width: 360, paddingTop: 4, paddingBottom: 4 }
                  } as any,
                  MenuListProps: {
                    // prevent MUI from auto-focusing the first item so typing goes to our input
                    autoFocusItem: false,
                  } as any,
                }}
              >
                <MenuItem value="">Select</MenuItem>
                {lmQuery.length > 0 && lmQuery.length < 3 && (
                  <MenuItem disabled>Type at least 3 characters…</MenuItem>
                )}
                {lmLoading && <MenuItem disabled>Searching…</MenuItem>}
                {!lmLoading && lmQuery.length >= 3 && lmOptions.length === 0 && (
                  <MenuItem disabled>No results</MenuItem>
                )}
                {lmOptions.map((u: any) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.email || `User ${u.id}`}{u.name ? ` — ${u.name}` : ''}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.report_to_id && <FormHelperText>{fieldErrors.report_to_id}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth size="small" error={!!fieldErrors.department_id}>
              <InputLabel>Department<span style={{ color: '#C72030' }}>*</span></InputLabel>
              <Select value={formData.department_id} label="Department" onChange={e => handleChange('department_id', e.target.value)}>
                <MenuItem value="">Select</MenuItem>
                {departments.map((d: any) => (
                  <MenuItem key={d.id} value={d.id}>{d.department_name}</MenuItem>
                ))}
              </Select>
              {fieldErrors.department_id && <FormHelperText>{fieldErrors.department_id}</FormHelperText>}
            </FormControl>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Organizational */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-[#C72030] flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">2</span>
            ORGANIZATION
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <FormControl fullWidth size="small" error={!!fieldErrors.circle_id}>
              <InputLabel>Circle<span style={{ color: '#C72030' }}>*</span></InputLabel>
              <Select value={formData.circle_id} label="Circle" onChange={e => handleChange('circle_id', e.target.value)}>
                <MenuItem value="">Select</MenuItem>
                {circles.map((c: any) => (
                  <MenuItem key={c.id} value={c.id}>{c.circle_name || c.name || `Circle ${c.id}`}</MenuItem>
                ))}
              </Select>
              {fieldErrors.circle_id && <FormHelperText>{fieldErrors.circle_id}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth size="small" error={!!fieldErrors.company_cluster_id}>
              <InputLabel>Cluster<span style={{ color: '#C72030' }}>*</span></InputLabel>
              <Select
                value={formData.company_cluster_id}
                label="Cluster"
                onChange={e => {
                  const val = e.target.value;
                  const selected = clusters.find((cl: any) => cl.id?.toString() === val?.toString());
                  handleChange('company_cluster_id', val);
                  handleChange('cluster_name', selected?.cluster_name || '');
                }}
              >
                <MenuItem value="">Select</MenuItem>
                {clusters.map((cl: any) => (
                  <MenuItem key={cl.id} value={cl.id}>{cl.cluster_name || `Cluster ${cl.id}`}</MenuItem>
                ))}
              </Select>
              {fieldErrors.company_cluster_id && <FormHelperText>{fieldErrors.company_cluster_id}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth size="small" error={!!fieldErrors.work_location}>
              <InputLabel>Work Location<span style={{ color: '#C72030' }}>*</span></InputLabel>
              <Select value={formData.work_location} label="Work Location" onChange={e => handleChange('work_location', e.target.value)}>
                <MenuItem value="">Select</MenuItem>
                {workLocations.map((w: any) => (
                  <MenuItem key={w.id} value={w.name}>{w.name || w.work_location_name || `Location ${w.id}`}</MenuItem>
                ))}
              </Select>
              {fieldErrors.work_location && <FormHelperText>{fieldErrors.work_location}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth size="small" error={!!fieldErrors.role_id}>
              <InputLabel>Role<span style={{ color: '#C72030' }}>*</span></InputLabel>
              <Select value={formData.role_id} label="Role" onChange={e => handleChange('role_id', e.target.value)}>
                <MenuItem value="">Select</MenuItem>
                {roles.map((r: any) => (
                  <MenuItem key={r.id} value={r.id}>{r.name || r.display_name || `Role ${r.id}`}</MenuItem>
                ))}
              </Select>
              {fieldErrors.role_id && <FormHelperText>{fieldErrors.role_id}</FormHelperText>}
            </FormControl>
            <TextField label={<>Birth Date<span style={{ color: '#C72030' }}>*</span></>} type="date" value={formData.birth_date} onChange={e => handleChange('birth_date', e.target.value)} size="small" fullWidth InputLabelProps={{ shrink: true }} error={!!fieldErrors.birth_date} helperText={fieldErrors.birth_date || ''} />
            <TextField label={<>Joining Date<span style={{ color: '#C72030' }}>*</span></>} type="date" value={formData.joining_date} onChange={e => handleChange('joining_date', e.target.value)} size="small" fullWidth InputLabelProps={{ shrink: true }} error={!!fieldErrors.joining_date} helperText={fieldErrors.joining_date || ''} />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 flex-wrap justify-center pt-4">
  <Button onClick={handleCancel} variant="outline" className="px-8 py-2" disabled={saving}>Cancel</Button>
  <Button onClick={handleSubmit} style={{ backgroundColor: '#C72030' }} className="text-white hover:bg-[#C72030]/90 px-8 py-2" disabled={saving || saveBlocked}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};