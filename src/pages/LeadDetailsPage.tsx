
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EditLeadModal } from '@/components/EditLeadModal';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';

export const LeadDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shouldShow } = useDynamicPermissions();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sample lead data - in real app, this would be fetched based on ID
  const leadData = {
    id: '#1453',
    referCode: 'ff891baa',
    referTo: 'Deepak Gupta',
    referredBy: 'Deepak Gupta',
    project: 'GODREJ CITY',
    mobile: '7021403352',
    clientEmail: '',
    status: 'Hot',
    leadStage: 'NA',
    createdOn: '29/03/2025 3: 19 PM',
    notes: ''
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (editedData: any) => {
    console.log('Saving edited lead data:', editedData);
    setIsEditModalOpen(false);
  };

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4"></div>
          <p className="text-gray-700">Loading lead details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Detail</h1>
            {shouldShow("Lead", "update") && (
            <Button
              onClick={handleEditClick}
              className="!bg-[#DA7756] hover:!bg-[#C45F40] text-white px-4 py-2 rounded-sm"
            >
              Edit
            </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-x-16 gap-y-6 mb-8">
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">ID</h3>
                <p className="text-gray-900">{leadData.id}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Refer Code</h3>
                <p className="text-gray-900">{leadData.referCode}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Refer to</h3>
                <p className="text-gray-900">{leadData.referTo}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Status</h3>
                <p className="text-gray-900">{leadData.status}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Lead Stage</h3>
                <p className="text-gray-900">{leadData.leadStage}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Created on</h3>
                <p className="text-gray-900">{leadData.createdOn}</p>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Referred by</h3>
                <p className="text-gray-900">{leadData.referredBy}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Project</h3>
                <p className="text-gray-900">{leadData.project}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Mobile</h3>
                <p className="text-gray-900">{leadData.mobile}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Client Email</h3>
                <p className="text-gray-900">{leadData.clientEmail || '-'}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
            <Textarea
              value={leadData.notes}
              placeholder="No notes available"
              className="w-full min-h-[120px] border border-gray-300 bg-gray-50 resize-none"
              readOnly
            />
          </div>
          
          <div className="text-center text-xs text-gray-500 mt-8">
            <p>Powered by</p>
            <div className="flex items-center justify-center mt-1">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
                L
              </div>
              <span className="font-semibold">LOCATED</span>
            </div>
          </div>
        </div>
      </div>

      <EditLeadModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        leadData={leadData}
      />
    </div>
  );
};
