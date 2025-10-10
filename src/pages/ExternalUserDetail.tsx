import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCircle, Settings, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';

export const ExternalUserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helpers
  const formatDateTime = (value?: string) => {
    if (!value) return '';
    try {
      const d = new Date(value);
      if (isNaN(d.getTime())) return value;
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      const hh = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
    } catch { return value || ''; }
  };

  // Format as dd-mm-yyyy for date-only fields
  const formatDate = (value?: string) => {
    if (!value) return '';
    try {
      const str = String(value);
      const firstTen = str.slice(0, 10);
      // Prefer ISO-like yyyy-mm-dd from either a pure date or ISO timestamp
      if (/^\d{4}-\d{2}-\d{2}$/.test(firstTen)) {
        const [y, m, d] = firstTen.split('-');
        return `${d}-${m}-${y}`;
      }
      // Fallback: try native Date parsing
      const d = new Date(str);
      if (!isNaN(d.getTime())) {
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
      }
      // Convert from dd/mm/yyyy if present
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
        const [dd, mm, yyyy] = str.split('/');
        return `${dd}-${mm}-${yyyy}`;
      }
      return str;
    } catch {
      return value || '';
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge className="bg-gray-500 text-white hover:bg-gray-600"></Badge>;
    switch (status.toLowerCase()) {
      case 'approved': return <Badge className="bg-green-500 text-white hover:bg-green-600">Approved</Badge>;
      case 'pending': return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Pending</Badge>;
      case 'rejected': return <Badge className="bg-red-500 text-white hover:bg-red-600">Deactivated</Badge>;
      default: return <Badge className="bg-gray-500 text-white hover:bg-gray-600">{status}</Badge>;
    }
  };

  const getYesNoBadge = (val: any) => {
    const yes = val === 1 || val === true || val === '1' || val === 'yes' || val === 'Yes';
    return <Badge className={yes ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'}>{yes ? 'Yes' : 'No'}</Badge>;
  };

  // Fetch user detail
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) { setError('Missing user id'); return; }
      setLoading(true); setError(null);
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) { setError('Missing base URL or token'); setLoading(false); return; }
        const cleanBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
        const url = `${cleanBaseUrl}/pms/users/${userId}/user_show.json`;
        const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = resp.data?.user || resp.data; // support either shape
        setUser(data);
      } catch (e: any) {
        console.error('Fetch external user detail error', e);
        setError('Failed to load user');
      } finally { setLoading(false); }
    };
    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => navigate('/safety/m-safe/external')} className="flex items-center gap-1 hover:text-gray-800 text-base">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-10 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4" />
          <p className="text-gray-700">Loading user...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => navigate('/safety/m-safe/external')} className="flex items-center gap-1 hover:text-gray-800 text-base">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-10 text-center">
          <p className="text-gray-600">{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  // Field derivations & fallbacks per spec
  const activeVal = user.lock_user_permission?.active;
  const employeeId = user.lock_user_permission?.employee_id;

  return (
    <div className="p-4 sm:p-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <button
            onClick={() => navigate('/safety/m-safe/external')}
            className="flex items-center gap-1 hover:text-gray-800 mb-4 text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </button>
          <div className="mb-3">
            <h1 className="text-2xl font-bold text-[#1a1a1a] truncate">{`${user.firstname || ''} ${user.lastname || ''}`.trim() || 'User Details'}</h1>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 px-4 py-2"
            onClick={() => navigate(`/safety/m-safe/external/user/${userId}/edit`, { state: { user } })}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            onClick={() => navigate(`/safety/m-safe/external/user/${userId}/lmc-manager`)}
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
          >
            Manage LMC
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch">
            <TabsTrigger value="personal" className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0 text-sm">Personal Information</TabsTrigger>
            <TabsTrigger value="other" className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0 text-sm">Other Information</TabsTrigger>
          </TabsList>

          {/* PERSONAL INFORMATION */}
          <TabsContent value="personal" className="p-4 sm:p-6 text-[15px]">
            <div className="bg-white rounded-lg border text-[15px]">
              <div className="flex p-4 items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs mr-3">
                  <UserCircle className="w-5 h-5 text-[#C72030]" />
                </div>
                <h2 className="text-lg font-bold">PERSONAL INFORMATION</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 text-[15px] p-4 gap-6">
                <div className="space-y-3">
                  <div className="flex"><span className="text-gray-500 w-28">First Name</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.firstname || '—'}</span></div>
                  <div className="flex"><span className="text-gray-500 w-28">Last Name</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.lastname || '—'}</span></div>
                  <div className="flex"><span className="text-gray-500 w-28">Employee ID</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.org_user_id || '—'}</span></div>
                </div>
                <div className="space-y-3">
                  <div className="flex"><span className="text-gray-500 w-28">Email</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium break-all">{user.email || '—'}</span></div>
                  <div className="flex"><span className="text-gray-500 w-28">Mobile</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.mobile || '—'}</span></div>
                  <div className="flex"><span className="text-gray-500 w-28">Gender</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.gender || '—'}</span></div>
                </div>
                <div className="space-y-3">
                  <div className="flex"><span className="text-gray-500 w-28">Designation</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.lock_user_permission?.designation || '—'}</span></div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* OTHER INFORMATION */}
          <TabsContent value="other" className="p-4 sm:p-6 text-[15px]">
            <div className="bg-white rounded-lg border text-[15px]">
              <div className="flex p-4 items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs mr-3">
                  <Settings className="w-5 h-5 text-[#C72030]" />
                </div>
                <h2 className="text-lg font-bold">OTHER INFORMATION</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 text-[15px] p-4 gap-6">
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">Active</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{getYesNoBadge(activeVal)}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">Joining Date</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{formatDate(user.lock_user_permission?.joining_date)}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">Status</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.lock_user_permission?.status ? getStatusBadge(user.lock_user_permission?.status) : '—'}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">Cluster</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.cluster_name || '—'}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">Department</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.lock_user_permission?.department_name || '—'}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">Circle</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.lock_user_permission?.circle_name || '—'}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">Work Location</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.work_location || '—'}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">Company Name</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.ext_company_name || '—'}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">Role</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.lock_user_permission?.role_name || '—'}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">Employee Type</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.employee_type || '—'}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">Created At</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{formatDateTime(user.created_at)}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">Reporting Manager Name</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium break-words">{user.report_to?.name || '—'}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">Reporting Manager Email</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium break-all">{user.report_to?.email || '—'}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">Reporting Manager Mobile</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.report_to?.mobile || '—'}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">OTP</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.otp || '—'}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">Registration Source</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.lock_user_permission?.registration_source || '—'}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">Created By Name</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.created_by?.name || '—'}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">Created By Email</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium break-all">{user.created_by?.email || '—'}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">Created By Mobile</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.created_by?.mobile || '—'}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">LMC Manager Name </span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.lmc_manager?.name || '—'}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">LMC Manager Email </span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium break-all">{user.lmc_manager?.email || '—'}</span></div>
                <div className="flex text-sm"><span className="text-gray-500 min-w-[140px]">LMC Manager Mobile </span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.lmc_manager?.mobile || '—'}</span></div>

              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};