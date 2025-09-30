import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, User, FileText, UserCircle, Settings, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup
} from '@mui/material';
import axios from 'axios';

export const MSafeUserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const navigationUser = (location.state as any)?.user;
  const [user, setUser] = useState<any>(navigationUser || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDateTime = (value?: string) => {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  };

  // Format as dd-mm-yyyy for date-only fields
  const formatDate = (value?: string) => {
    if (!value) return '';
    try {
      const str = String(value);
      const firstTen = str.slice(0, 10);
      if (/^\d{4}-\d{2}-\d{2}$/.test(firstTen)) {
        const [y, m, d] = firstTen.split('-');
        return `${d}-${m}-${y}`;
      }
      const d = new Date(str);
      if (!isNaN(d.getTime())) {
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
      }
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
        const [dd, mm, yyyy] = str.split('/');
        return `${dd}-${mm}-${yyyy}`;
      }
      return str;
    } catch {
      return value || '';
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const effectiveId = id || navigationUser?.id;
      if (!effectiveId) {
        setError('Missing user id');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) {
          setError('Missing base URL or token');
          setLoading(false);
          return;
        }
        const url = `https://${baseUrl}/pms/users/${effectiveId}/user_show.json`;
        console.log('Fetching user detail:', url);
        const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}`} });
        const data = response.data?.user || response.data; // handle either shape
        setUser(data);
      } catch (e: any) {
        console.error('Error fetching user detail', e);
        setError('Failed to load user');
      } finally {
        setLoading(false);
      }
    };
    // Always refetch to have latest
    fetchUser();
  }, [id, navigationUser?.id]);

  const getStatusBadge = (status: string) => {
    if (!status) {
      return <Badge className="bg-gray-500 text-white hover:bg-gray-600">Unknown</Badge>;
    }
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white hover:bg-red-600">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white hover:bg-gray-600">{status}</Badge>;
    }
  };

  const getYesNoBadge = (value: boolean | number | string | undefined) => {
    const isYes = value === true || value === 1 || value === 'yes' || value === 'Yes';
    return <Badge className={isYes ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'}>{isYes ? 'Yes' : 'No'}</Badge>;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/safety/m-safe')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="text-center py-8 text-gray-500">Loading user...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/safety/m-safe')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  const activeVal = user?.lock_user_permission?.active;

  return (
    <div className="flex justify-center w-full min-h-screen bg-[#F8F8F7]">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6 px-4 pt-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/safety/m-safe')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mx-4 mb-8">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="flex justify-start flex-nowrap overflow-x-auto no-scrollbar bg-gray-50 rounded-t-lg text-sm">
              <TabsTrigger value="personal" className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap">PERSONAL INFORMATION</TabsTrigger>
              <TabsTrigger value="other" className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap">OTHER INFORMATION</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="p-4 sm:p-6">
              <div className="bg-white rounded-lg border">
                <div className="flex p-4 items-center bg-[#F6F4EE]">
                  <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <UserCircle className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-[700]">PERSONAL INFORMATION</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 border border-[#D9D9D9] bg-[#F6F7F7] p-4 gap-6 items-start">
                  {/* Helper for row to ensure consistent alignment */}
                  <div className="space-y-3">
                    <div className="flex text-sm"><span className="text-gray-600 min-w-[110px]">First Name</span><span className="mx-1">:</span><span className="font-semibold">{user.firstname || ''}</span></div>
                    <div className="flex text-sm"><span className="text-gray-600 min-w-[110px]">Last Name</span><span className="mx-1">:</span><span className="font-semibold">{user.lastname || ''}</span></div>
                    <div className="flex text-sm"><span className="text-gray-600 min-w-[110px]">Employee ID</span><span className="mx-1">:</span><span className="font-semibold">{user.org_user_id || ''}</span></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex text-sm"><span className="text-gray-600 min-w-[110px]">Email</span><span className="mx-1">:</span><span className="font-semibold break-all">{user.email || ''}</span></div>
                    <div className="flex text-sm"><span className="text-gray-600 min-w-[110px]">Mobile</span><span className="mx-1">:</span><span className="font-semibold">{user.mobile || ''}</span></div>
                    <div className="flex text-sm"><span className="text-gray-600 min-w-[110px]">Gender</span><span className="mx-1">:</span><span className="font-semibold">{user.gender || ''}</span></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex text-sm"><span className="text-gray-600 min-w-[110px]">Designation</span><span className="mx-1">:</span><span className="font-semibold">{user.lock_user_permission?.designation || ''}</span></div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="other" className="p-4 sm:p-6">
              <div className="bg-white rounded-lg border">
                <div className="flex p-4 items-center bg-[#F6F4EE]">
                  <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <Settings className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-[700]">OTHER INFORMATION</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 border border-[#D9D9D9] bg-[#F6F7F7] p-4 gap-6">
                  <div className="flex text-sm"><span className="text-gray-600 min-w-[140px]">Active</span><span className="mx-1">:</span><span className="font-semibold">{getYesNoBadge(activeVal)}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 min-w-[140px]">Birth Date</span><span className="mx-1">:</span><span className="font-semibold">{formatDate(user.birth_date)}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 min-w-[140px]">Joining Date</span><span className="mx-1">:</span><span className="font-semibold">{formatDate(user.lock_user_permission?.joining_date)}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 min-w-[140px]">Status</span><span className="mx-1">:</span><span className="font-semibold">{user.lock_user_permission?.status ? getStatusBadge(user.lock_user_permission?.status) : ''}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 min-w-[140px]">Cluster</span><span className="mx-1">:</span><span className="font-semibold">{user.cluster_name || ''}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 min-w-[140px]">Department</span><span className="mx-1">:</span><span className="font-semibold">{user.lock_user_permission?.department_name || ''}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 min-w-[140px]">Circle</span><span className="mx-1">:</span><span className="font-semibold">{user.lock_user_permission?.circle_name || ''}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 min-w-[140px]">Work Location</span><span className="mx-1">:</span><span className="font-semibold">{user.work_location || ''}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 min-w-[140px]">Company Name</span><span className="mx-1">:</span><span className="font-semibold">{user.user_company_name || ''}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 min-w-[140px]">Role</span><span className="mx-1">:</span><span className="font-semibold">{user.lock_user_permission?.role_name || ''}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 min-w-[140px]">Employee Type</span><span className="mx-1">:</span><span className="font-semibold">{user.employee_type || ''}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 min-w-[140px]">Created At</span><span className="mx-1">:</span><span className="font-semibold">{formatDateTime(user.created_at)}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 min-w-[140px]">Line Manager Name</span><span className="mx-1">:</span><span className="font-semibold">{user.report_to?.name || ''}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 min-w-[140px]">Line Manager Email</span><span className="mx-1">:</span><span className="font-semibold break-all">{user.report_to?.email || ''}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 min-w-[140px]">Line Manager Mobile</span><span className="mx-1">:</span><span className="font-semibold">{user.report_to?.mobile || ''}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 min-w-[140px]">OTP</span><span className="mx-1">:</span><span className="font-semibold">{user.otp || ''}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 min-w-[140px]">Registration Source</span><span className="mx-1">:</span><span className="font-semibold">{user.lock_user_permission?.registration_source || ''}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 min-w-[140px]">Created By Name</span><span className="mx-1">:</span><span className="font-semibold">{user.created_by?.name || ''}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 min-w-[140px]">Created By Email</span><span className="mx-1">:</span><span className="font-semibold break-all">{user.created_by?.email || ''}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 min-w-[140px]">Created By Mobile</span><span className="mx-1">:</span><span className="font-semibold">{user.created_by?.mobile || ''}</span></div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}