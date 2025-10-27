import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { toast } from 'sonner';

interface CostApprovalPageProps {
  userId?: string;
  approvalId?: string;
  email?: string;
  organizationId?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const CostApprovalPage: React.FC<CostApprovalPageProps> = ({ 
  userId: propUserId, 
  approvalId: propApprovalId,
  email = '',
  organizationId = '',
  onSuccess,
  onError 
}) => {
  const { approvalId: urlApprovalId, userId: urlUserId } = useParams<{ 
    approvalId: string; 
    userId: string; 
  }>();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Use parameters from URL if available, otherwise use props, otherwise use defaults
  const approvalId = urlApprovalId || propApprovalId ;
  const userId = urlUserId || propUserId;

  const handleApprove = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        status: 'approved',
        user_id: userId,
        id: approvalId,
        comments: comment,
        skp_dr: 'true'
      });

      // Add optional parameters if they exist
      if (email) {
        queryParams.append('email', email);
      }
      if (organizationId) {
        queryParams.append('organization_id', organizationId);
      }

      const url = getFullUrl(`/cost_approval_histories/update_approval_history?${queryParams.toString()}`);
      const response = await fetch(url, {
        method: 'GET',
        ...getAuthenticatedFetchOptions()
      });

      if (!response.ok) {
        throw new Error('Failed to approve request');
      }

      const data = await response.json();
      console.log('Success:', data);
      toast.success('Request approved successfully!');
      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to approve request');
      onError?.(error instanceof Error ? error.message : 'Failed to process approval');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        status: 'rejected',
        user_id: userId,
        id: approvalId,
        comments: comment,
        skp_dr: 'true'
      });

      // Add optional parameters if they exist
      if (email) {
        queryParams.append('email', email);
      }
      if (organizationId) {
        queryParams.append('organization_id', organizationId);
      }

      const url = getFullUrl(`/cost_approval_histories/update_approval_history?${queryParams.toString()}`);
      const response = await fetch(url, {
        method: 'PUT',
        ...getAuthenticatedFetchOptions()
      });

      if (!response.ok) {
        throw new Error('Failed to reject request');
      }

      const data = await response.json();
      console.log('Success:', data);
      toast.success('Request rejected successfully!');
      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to reject request');
      onError?.(error instanceof Error ? error.message : 'Failed to process rejection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('https://lockated-public.s3.ap-south-1.amazonaws.com/attachfiles/documents/49257/original/Living-room.png')`,
      }}
    >
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Request Approval</h1>
      
      <div className="w-80">
        <div className="bg-teal-700 text-white font-medium py-2 px-4 rounded-t-md text-center">
          Add Comment
        </div>
        <textarea
          className="w-full h-24 p-2 border-none rounded-b-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder=""
        />
      </div>
      
      <div className="flex space-x-4 mt-6">
        <button 
          onClick={handleApprove}
          disabled={loading}
          className={`${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gray-300 hover:bg-gray-400'
          } text-gray-800 font-medium py-2 px-6 rounded-md flex items-center`}
        >
          {loading ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800 mr-2"></span>
              Processing...
            </>
          ) : (
            'Approve'
          )}
        </button>
        <button 
          onClick={handleReject}
          disabled={loading}
          className={`${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gray-300 hover:bg-gray-400'
          } text-gray-800 font-medium py-2 px-6 rounded-md`}
        >
          {loading ? 'Processing...' : 'Reject'}
        </button>
      </div>
    </div>
  );
};