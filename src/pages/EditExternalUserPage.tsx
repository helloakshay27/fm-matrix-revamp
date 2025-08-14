import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
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
    line_manager_id: '',
    department_id: '',
    circle_id: '',
    work_location_id: '',
    role_id: ''
  };

  const [formData, setFormData] = useState<any>(initialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalUser, setOriginalUser] = useState<any>(null); // full fetched user for extra fields
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);

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
          line_manager_id: formData.line_manager_id || null,
          work_location_id: formData.work_location_id || null,
          role_id: formData.role_id || permission.lock_role_id || null,
          lock_user_permissions_attributes: permission?.id ? [
            {
              id: permission.id,
              department_id: formData.department_id || null,
              lock_role_id: formData.role_id || null,
              circle_id: formData.circle_id || null
            }
          ] : []
        }
      };
      const url = `https://${baseUrl}/pms/users/${userId}/update_vi_user`;
      await axios.put(url, payload, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('External user updated');
      navigate(`/maintenance/m-safe/external/user/${userId}`, { state: { user: { ...originalUser, ...formData } } });
    } catch (e:any) {
      console.error('Update external user error', e);
      toast.error('Failed to update user');
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
        setFormData((prev:any) => ({
          ...prev,
          firstname: data.firstname || '',
          lastname: data.lastname || '',
          email: data.email || '',
          mobile: data.mobile || '',
          gender: normalizeGender(data.gender || ''),
          line_manager_id: data.report_to?.id || '',
          department_id: data.lock_user_permission?.department_id || '',
          circle_id: data.lock_user_permission?.circle_id || data.circle_id || '',
          work_location_id: data.work_location_id || data.work_location?.id || '',
          role_id: data.lock_user_permission?.lock_role_id || data.lock_role_id || ''
        }));
        setOriginalUser(data);
      } catch (e:any) {
        console.error('Fetch external user (edit) error', e);
        setError('Failed to load user');
      } finally { setLoading(false); }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) return;
        const url = `https://${baseUrl}/pms/departments.json`;
        const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        const list = resp.data?.departments || [];
        setDepartments(list);
      } catch (e) {
        console.error('Fetch departments error', e);
      }
    };
    fetchDepartments();
  }, []);

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
            <TextField label="Email" type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} size="small" fullWidth />
            <TextField label="Mobile" type="number" value={formData.mobile} onChange={e => handleChange('mobile', e.target.value)} size="small" fullWidth />
            <FormControl fullWidth size="small">
              <InputLabel>Gender</InputLabel>
              <Select value={formData.gender} label="Gender" onChange={e => handleChange('gender', e.target.value)}>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Line Manager</InputLabel>
              <Select value={formData.line_manager_id} label="Line Manager" onChange={e => handleChange('line_manager_id', e.target.value)}>
                <MenuItem value="">None</MenuItem>
                <MenuItem value={1}>Manager 1</MenuItem>
                <MenuItem value={2}>Manager 2</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Department</InputLabel>
              <Select value={formData.department_id} label="Department" onChange={e => handleChange('department_id', e.target.value)}>
                <MenuItem value="">Select</MenuItem>
                {departments.map((d:any) => (
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <FormControl fullWidth size="small">
              <InputLabel>Circle</InputLabel>
              <Select value={formData.circle_id} label="Circle" onChange={e => handleChange('circle_id', e.target.value)}>
                <MenuItem value="">Select</MenuItem>
                <MenuItem value={100}>Circle A</MenuItem>
                <MenuItem value={101}>Circle B</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Work Location</InputLabel>
              <Select value={formData.work_location_id} label="Work Location" onChange={e => handleChange('work_location_id', e.target.value)}>
                <MenuItem value="">Select</MenuItem>
                <MenuItem value={200}>Location 1</MenuItem>
                <MenuItem value={201}>Location 2</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select value={formData.role_id} label="Role" onChange={e => handleChange('role_id', e.target.value)}>
                <MenuItem value="">Select</MenuItem>
                <MenuItem value={300}>Technician</MenuItem>
                <MenuItem value={301}>Supervisor</MenuItem>
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