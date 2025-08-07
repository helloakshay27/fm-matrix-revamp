import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, FileText, UserCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAppSelector } from '@/hooks/useAppDispatch';
export const MSafeUserDetail = () => {
  const {
    userId
  } = useParams();
  const navigate = useNavigate();
  const {
    data: fmUsersData
  } = useAppSelector(state => state.fmUsers);
  const fm_users = fmUsersData?.fm_users || [];
  const user = fm_users.find(u => u.id === Number(userId));
  if (!user) {
    return <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">User not found</p>
        </div>
      </div>;
  }
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
  const getTypeBadge = (type: string) => {
    if (!type) {
      return <Badge className="bg-gray-500 text-white hover:bg-gray-600">Unknown</Badge>;
    }
    switch (type.toLowerCase()) {
      case 'admin':
        return <Badge className="bg-blue-500 text-white hover:bg-blue-600">Admin</Badge>;
      case 'site':
        return <Badge className="bg-purple-500 text-white hover:bg-purple-600">Site</Badge>;
      case 'company':
        return <Badge className="bg-orange-500 text-white hover:bg-orange-600">Company</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white hover:bg-gray-600">{type}</Badge>;
    }
  };
  const getYesNoBadge = (value: boolean | string) => {
    const isYes = value === true || value === 'yes' || value === 'Yes';
    return <Badge className={isYes ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-500 text-white hover:bg-red-600"}>
      {isYes ? 'Yes' : 'No'}
    </Badge>;
  };
  return <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user.firstname} {user.lastname}
          </h1>
          <p className="text-gray-600">User Details</p>
        </div>
      </div>

      {/* Status Overview */}
      

      {/* Tabs */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="flex justify-start bg-gray-50 rounded-t-lg h-auto p-0 w-full">
          <TabsTrigger 
            value="personal" 
            className="bg-white data-[state=active]:bg-[#EDEAE3] px-8 py-3 data-[state=active]:text-[#C72030] text-gray-600 hover:text-gray-800 flex items-center gap-2 font-medium border-0 rounded-none first:rounded-tl-lg flex-1"
          >
            <UserCircle className="h-5 w-5" />
            Personal Information
          </TabsTrigger>
          <TabsTrigger 
            value="other" 
            className="bg-white data-[state=active]:bg-[#EDEAE3] px-8 py-3 data-[state=active]:text-[#C72030] text-gray-600 hover:text-gray-800 flex items-center gap-2 font-medium border-0 rounded-none flex-1"
          >
            <Settings className="h-5 w-5" />
            Other Information
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">First Name</label>
                <p className="text-gray-900 mt-1">{user.firstname || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Last Name</label>
                <p className="text-gray-900 mt-1">{user.lastname || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900 mt-1">{user.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                <p className="text-gray-900 mt-1">{user.mobile || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="text-gray-900 mt-1">{user.gender || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Employee ID</label>
                <p className="text-gray-900 mt-1">{user.employee_id || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Designation</label>
                <p className="text-gray-900 mt-1">{user.designation || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Face Recognition</label>
                <div className="mt-1">{getYesNoBadge(user.face_added)}</div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="other" className="mt-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Other Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Company Name</label>
                <p className="text-gray-900 mt-1">{user.company_name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Entity ID</label>
                <p className="text-gray-900 mt-1">{user.entity_id || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Unit ID</label>
                <p className="text-gray-900 mt-1">{user.unit_id || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Created By</label>
                <p className="text-gray-900 mt-1">{user.created_by_id || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Access Level</label>
                <p className="text-gray-900 mt-1">{user.lock_user_permission?.access_level?.toString() || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">User Type</label>
                <div className="mt-1">{getTypeBadge(user.user_type)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">{getStatusBadge(user.lock_user_permission_status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">App Downloaded</label>
                <div className="mt-1">{getYesNoBadge(user.app_downloaded)}</div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>;
};