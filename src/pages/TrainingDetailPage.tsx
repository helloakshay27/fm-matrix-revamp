import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, User } from 'lucide-react';

const fallback = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  mobile: '9876543210',
  user_type: 'Employee',
  user_role: 'Staff',
  cluster: 'Cluster A',
  work_location: 'Head Office',
  training_name: 'Fire Safety',
  training_type: 'Internal',
  training_certificate: '',
};

const TrainingDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Data passed from TrainingDashboard via state
  const data = location.state?.row || {};
  // Use fallback for missing fields
  const user = { ...fallback, ...data };

  return (
    <div className="p-4 sm:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-gray-800 mb-4 text-base"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-2xl font-bold text-[#1a1a1a] truncate">TRAINING DETAILS</h1>
        </div>
      </div>

      {/* PERSONAL DETAILS */}
      <div className="bg-white rounded-lg border text-[15px] mb-6">
        <div className="flex p-4 items-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
            <User className="w-5 h-5 text-[#C72030]" />
          </div>
          <h2 className="text-lg font-bold">PERSONAL DETAILS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 text-[15px] p-4 gap-6">
          <div className="space-y-3">
            <div className="flex"><span className="text-gray-500 w-40">Name</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.name}</span></div>
            <div className="flex"><span className="text-gray-500 w-40">Email</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium break-all">{user.email}</span></div>
            <div className="flex"><span className="text-gray-500 w-40">Mobile</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.mobile}</span></div>
            <div className="flex"><span className="text-gray-500 w-40">User Type</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.user_type}</span></div>
          </div>
          <div className="space-y-3">
            <div className="flex"><span className="text-gray-500 w-40">User Role</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.user_role}</span></div>
            <div className="flex"><span className="text-gray-500 w-40">Cluster</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.cluster}</span></div>
            <div className="flex"><span className="text-gray-500 w-40">Work Location</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.work_location}</span></div>
          </div>
        </div>
      </div>

      {/* TRAINING DETAILS */}
      <div className="bg-white rounded-lg border text-[15px] mb-6">
        <div className="flex p-4 items-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
            <FileText className="w-5 h-5 text-[#C72030]" />
          </div>
            <h2 className="text-lg font-bold">TRAINING DETAILS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 text-[15px] p-4 gap-6">
          <div className="space-y-3">
            <div className="flex"><span className="text-gray-500 w-40">Training Name</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.training_name}</span></div>
          </div>
          <div className="space-y-3">
            <div className="flex"><span className="text-gray-500 w-40">Training Type</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{user.training_type}</span></div>
          </div>
        </div>
        <div className="p-4 pt-0">
          <div className="flex"><span className="text-gray-500 w-40">Certificate</span><span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">
              {user.training_type === 'External' && user.training_certificate ? (
                <a
                  href={user.training_certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C72030] hover:underline inline-flex items-center gap-1"
                >
                  <FileText className="w-4 h-4" /> View Certificate
                </a>
              ) : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingDetailPage;
