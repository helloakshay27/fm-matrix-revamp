import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';

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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Personal Details */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Personal Details</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <span className="text-gray-500 text-sm">Name</span>
              <p className="text-gray-900 font-medium">{user.name}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Email Id</span>
              <p className="text-gray-900 font-medium">{user.email}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Mobile Number</span>
              <p className="text-gray-900 font-medium">{user.mobile}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">User Type</span>
              <p className="text-gray-900 font-medium">{user.user_type}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">User Role</span>
              <p className="text-gray-900 font-medium">{user.user_role}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Cluster</span>
              <p className="text-gray-900 font-medium">{user.cluster}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Work Location</span>
              <p className="text-gray-900 font-medium">{user.work_location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Training Details */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Training Details</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <span className="text-gray-500 text-sm">Training Name</span>
              <p className="text-gray-900 font-medium">{user.training_name}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Training Type</span>
              <p className="text-gray-900 font-medium">{user.training_type}</p>
            </div>
          </div>
          <div className="mt-6">
            <span className="text-gray-500 text-sm font-semibold">Attachments:</span>
            <div className="mt-2">
              {user.training_type === 'External' && user.training_certificate ? (
                <a
                  href={user.training_certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <FileText className="w-4 h-4" />
                  Training Certificate
                </a>
              ) : (
                <span className="text-gray-400">No certificate uploaded</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingDetailPage;
