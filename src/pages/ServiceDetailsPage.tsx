import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Settings,
  FileText,
  QrCode,
  Box,
  Download,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AssociateServiceModal } from '@/components/AssociateServiceModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchServiceDetails } from '@/store/slices/serviceDetailsSlice';

interface ServiceDetailsData {
  id: number;
  service_name: string;
  service_code: string;
  site: string | null;
  building: string | null;
  wing: string | null;
  area: string | null;
  floor: string | null;
  room: string | null;
  created_at: string;
  created_by: string | null;
  documents?: Array<{ filename: string; url: string }>;
  qr_code_url?: string | null;
  associated_assets?: Array<{ name: string; tag: string }>;
}

export const ServiceDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { data: serviceData, loading, error } = useAppSelector((state) => state.serviceDetails);
  const [showAssociateModal, setShowAssociateModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchServiceDetails(id));
    }
  }, [dispatch, id]);

  // Helper function for formatting date
  const formatDateTime = (dateString: string | null): string => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      }).replace(',', '');
    } catch {
      return '—';
    }
  };

  // If loading, show loading state
  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading service details...</div>
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  // Extract data from API response
  const details: ServiceDetailsData | null = serviceData as ServiceDetailsData;

  if (!details) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">No service details found</div>
        </div>
      </div>
    );
  }

  const handleEditClick = () => navigate(`/maintenance/service/edit/${id}`);
  const handleAssociateServiceClick = () => setShowAssociateModal(true);

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/maintenance/service')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Service List
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm text-[#1a1a1a] opacity-70 mb-1">
              Service List &gt; Service Detail
            </p>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">
              {details.service_name || '—'} ({details.service_code || '—'})
            </h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline"
              onClick={handleEditClick}
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
            >
              Edit
            </Button>
            <Button 
              onClick={handleAssociateServiceClick}
              className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
            >
              <Settings className="w-4 h-4 mr-2" />
              Associate Service
            </Button>
          </div>
        </div>
      </div>

      {/* LOCATION DETAIL */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
              <Box className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold text-[#C72030]">LOCATION DETAIL</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex text-sm">
                <span className="text-gray-600 w-24">Site</span>
                <span>: {details.site || '—'}</span>
              </div>
              <div className="flex text-sm">
                <span className="text-gray-600 w-24">Wing</span>
                <span>: {details.wing || '—'}</span>
              </div>
              <div className="flex text-sm">
                <span className="text-gray-600 w-24">Area</span>
                <span>: {details.area || '—'}</span>
              </div>
              <div className="flex text-sm">
                <span className="text-gray-600 w-24">Created On</span>
                <span>: {formatDateTime(details.created_at)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex text-sm">
                <span className="text-gray-600 w-24">Building</span>
                <span>: {details.building || '—'}</span>
              </div>
              <div className="flex text-sm">
                <span className="text-gray-600 w-24">Floor</span>
                <span>: {details.floor || '—'}</span>
              </div>
              <div className="flex text-sm">
                <span className="text-gray-600 w-24">Room</span>
                <span>: {details.room || '—'}</span>
              </div>
              <div className="flex text-sm">
                <span className="text-gray-600 w-24">Created By</span>
                <span>: {details.created_by || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DOCUMENTS AND QR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Documents */}
        <div className="bg-white rounded-lg border">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-semibold text-[#C72030]">DOCUMENTS</h2>
            </div>
            <div className="space-y-2">
              {details.documents && details.documents.length > 0 ? (
                details.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm truncate">{doc.filename}</span>
                    <Button 
                      size="sm"
                      className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
                      onClick={() => window.open(doc.url, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-600">No documents</div>
              )}
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-lg border">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                <QrCode className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-semibold text-[#C72030]">QR CODE</h2>
            </div>
            <div className="text-center">
              {details.qr_code_url ? (
                <>
                  <div className="w-48 h-48 bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                    <img 
                      src={details.qr_code_url} 
                      alt="QR Code" 
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                  <Button 
                    onClick={() => window.open(details.qr_code_url, '_blank')}
                    className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-48 h-48 bg-black mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-sm">—</span>
                  </div>
                  <div className="text-sm text-gray-600">No QR code available</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Associated Assets */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
              <Box className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold text-[#C72030]">Associated Assets</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {details.associated_assets && details.associated_assets.length > 0 ? (
              details.associated_assets.map((asset, index) => (
                <Button key={index} className="bg-[#C72030] text-white hover:bg-[#C72030]/90">
                  {asset.name || asset.tag}
                </Button>
              ))
            ) : (
              <div className="text-sm text-gray-600">—</div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-[#1a1a1a] opacity-70">
        Powered by <span className="font-semibold">go</span>
        <span className="text-[#C72030]">Phygital</span>
        <span className="font-semibold">.work</span>
      </div>

      {/* Modal */}
      <AssociateServiceModal 
        isOpen={showAssociateModal}
        onClose={() => setShowAssociateModal(false)}
      />
    </div>
  );
};
