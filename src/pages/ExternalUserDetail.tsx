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
    if (!value) return '-';
    try {
      const d = new Date(value);
      if (isNaN(d.getTime())) return value;
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      const hh = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
    } catch { return value || '-'; }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge className="bg-gray-500 text-white hover:bg-gray-600">-</Badge>;
    switch (status.toLowerCase()) {
      case 'approved': return <Badge className="bg-green-500 text-white hover:bg-green-600">Approved</Badge>;
      case 'pending': return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Pending</Badge>;
      case 'rejected': return <Badge className="bg-red-500 text-white hover:bg-red-600">Rejected</Badge>;
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
        const url = `https://${baseUrl}/pms/users/${userId}/user_show.json`;
        const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = resp.data?.user || resp.data; // support either shape
        setUser(data);
      } catch (e:any) {
        console.error('Fetch external user detail error', e);
        setError('Failed to load user');
      } finally { setLoading(false); }
    };
    fetchUser();
  }, [userId]);

  if (loading) return (
    <div className="p-6"><Button variant="ghost" onClick={() => navigate('/maintenance/m-safe/external')}><ArrowLeft className="h-4 w-4 mr-2"/>Back</Button><div className="text-center py-8 text-gray-500">Loading user...</div></div>
  );
  if (error || !user) return (
    <div className="p-6"><Button variant="ghost" onClick={() => navigate('/maintenance/m-safe/external')}><ArrowLeft className="h-4 w-4 mr-2"/>Back</Button><div className="text-center py-8 text-gray-500">{error || 'User not found'}</div></div>
  );

  // Field derivations & fallbacks per spec
  const activeVal = user.lock_user_permission?.active; // numeric 1/0
  const employeeId =  user.lock_user_permission?.employee_id 

  return (
    <div className="flex justify-center w-full min-h-screen bg-[#F8F8F7]">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6 px-4 pt-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/maintenance/m-safe/external')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          {/* Re-added Edit button */}
          <Button
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
            onClick={() => navigate(`/maintenance/m-safe/external/user/${userId}/edit`, { state: { user } })}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mx-4 mb-8">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="flex justify-start flex-nowrap overflow-x-auto no-scrollbar bg-gray-50 rounded-t-lg text-sm">
              <TabsTrigger value="personal" className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap">PERSONAL INFORMATION</TabsTrigger>
              <TabsTrigger value="other" className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap">OTHER INFORMATION</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal" className="p-4 sm:p-6">
              <div className="bg-white rounded-lg border">
                <div className="flex p-4 items-center bg-[#F6F4EE]">
                  <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <UserCircle className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-[700]">PERSONAL INFORMATION</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 border border-[#D9D9D9] bg-[#F6F7F7] p-4 gap-6 items-start">
                  <div className="space-y-3">
                    <div className="flex text-sm"><span className="text-gray-600 w-40">First Name</span><span className="font-semibold ml-2">: {user.firstname || '-'}</span></div>
                    <div className="flex text-sm"><span className="text-gray-600 w-40">Last Name</span><span className="font-semibold ml-2">: {user.lastname || '-'}</span></div>
                    <div className="flex text-sm"><span className="text-gray-600 w-40">Employee ID</span><span className="font-semibold ml-2">: {employeeId || '-'}</span></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex text-sm"><span className="text-gray-600 w-40">Email</span><span className="font-semibold ml-2">: {user.email || '-'}</span></div>
                    <div className="flex text-sm"><span className="text-gray-600 w-40">Mobile</span><span className="font-semibold ml-2">: {user.mobile || '-'}</span></div>
                    <div className="flex text-sm"><span className="text-gray-600 w-40">Gender</span><span className="font-semibold ml-2">: {user.gender || '-'}</span></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex text-sm"><span className="text-gray-600 w-40">Designation</span><span className="font-semibold ml-2">: {user.lock_user_permission?.designation || '-'}</span></div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Other Information */}
            <TabsContent value="other" className="p-4 sm:p-6">
              <div className="bg-white rounded-lg border">
                <div className="flex p-4 items-center bg-[#F6F4EE]">
                  <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <Settings className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-[700]">OTHER INFORMATION</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 border border-[#D9D9D9] bg-[#F6F7F7] p-4 gap-6">
                 <div className="flex text-sm"><span className="text-gray-600 w-48">Active</span><span className="font-semibold ml-2">: {getYesNoBadge(activeVal)}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 w-48">Birth Date</span><span className="font-semibold ml-2">: {user.birth_date || '-'}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 w-48">Joining Date</span><span className="font-semibold ml-2">: {user.lock_user_permission?.joining_date || '-'}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 w-48">Status</span><span className="font-semibold ml-2">: {user.lock_user_permission?.status ? getStatusBadge(user.lock_user_permission?.status) : '-'}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 w-48">Cluster</span><span className="font-semibold ml-2">: {user.cluster_name || '-'}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 w-48">Department</span><span className="font-semibold ml-2">: {user.lock_user_permission?.department_name || '-'}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 w-48">Circle</span><span className="font-semibold ml-2">: {user.lock_user_permission?.circle_name || '-'}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 w-48">Work Location</span><span className="font-semibold ml-2">: {user.work_location || '-'}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 w-48">Company Name</span><span className="font-semibold ml-2">: {user.company_name || '-'}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 w-48">Role</span><span className="font-semibold ml-2">: {user.lock_user_permission?.role_name || '-'}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 w-48">Employee Type</span><span className="font-semibold ml-2">: {user.employee_type || '-'}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 w-48">Created At</span><span className="font-semibold ml-2">: {formatDateTime(user.created_at)}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 w-48">Line Manager Name</span><span className="font-semibold ml-2">{user.report_to?.name || '-'}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 w-48">Line Manager Email</span><span className="font-semibold ml-2">{user.report_to?.email || '-'}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 w-48">Line Manager Mobile</span><span className="font-semibold ml-2">{user.report_to?.mobile || '-'}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 w-48">OTP</span><span className="font-semibold ml-2">: NA</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 w-48">Registration Source</span><span className="font-semibold ml-2">{user.lock_user_permission?.registration_source || '-'}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 w-48">Created By Name</span><span className="font-semibold ml-2">: {user.created_by?.name || '-'}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 w-48">Created By Email</span><span className="font-semibold ml-2">: {user.created_by?.email || '-'}</span></div>
                  <div className="flex text-sm"><span className="text-gray-600 w-48">Created By Mobile</span><span className="font-semibold ml-2">: {user.created_by?.mobile || '-'}</span></div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};